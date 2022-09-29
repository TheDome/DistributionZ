import { app, ipcMain } from "electron";
import serve from "electron-serve";
import { createWindow } from "./helpers";
import { registerIPC } from "./ipc";
import db from "./persistence";
import Blocked from "./persistence/model/Blocked";
import Employee from "./persistence/model/Employee";
import Participation from "./persistence/model/Participation";
import Shift from "./persistence/model/Shift";

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

  if (!isProd) {
    await Promise.all([
      Employee.create({ name: "John Worms " }),
      Employee.create({ name: "Jane Doe " }),
    ])
      .then(([john, jane]) => {
        return Promise.all([
          Blocked.create({
            date: new Date().getTime(),
            employeeId: john.id,
          }),
          Shift.create({ date: new Date().getTime() }),
          jane,
        ]);
      })
      .then(([blocked, shift, employee]) => {
        return Participation.create({
          employeeId: employee.id,
          shiftId: shift.id,
        });
      })
      .catch(console.error);
  }

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
