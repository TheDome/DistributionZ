import { app, ipcMain } from "electron";
import serve from "electron-serve";
import { setupDev } from "./dev";
import { createWindow } from "./helpers";
import { registerIPC } from "./ipc";
import db from "./persistence";

import { autoUpdater } from "electron-updater";

const isProd: boolean = process.env.NODE_ENV === "production";

if (isProd) {
  serve({ directory: "app" });
} else {
  app.setPath("userData", `${app.getPath("userData")} (development)`);
}

(async () => {
  await Promise.all([app.whenReady(), db.sync({ force: !isProd })]).then(
    () => {},
    console.error
  );

  await setupDev(isProd);

  autoUpdater.setFeedURL({
    provider: "github",
    owner: "thedome",
    repo: "distributionz",
  });
  
  autoUpdater.checkForUpdatesAndNotify();

  await registerIPC();

  const mainWindow = createWindow("main", {
    width: 1100,
    height: 600,
  });

  if (isProd) {
    await mainWindow.loadURL("app://./index.html");
  } else {
    const port = process.argv[2];
    await mainWindow.loadURL(`http://localhost:${port}/`);
    mainWindow.webContents.openDevTools();
  }
})();

app.on("window-all-closed", () => {
  app.quit();
});
