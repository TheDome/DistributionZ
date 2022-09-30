import { ipcMain } from "electron";
import Employee from "../../persistence/model/Employee";

export default async function register() {
  ipcMain.handle("listEmployees", async (event, args) => {
    const result = await Employee.findAll();

    return result.map((e) => ({
      name: e.name,
      id: e.id,
    }));
  });

  ipcMain.handle("createEmployee", async (event, [name]) => {
    const result = await Employee.create({
      name,
    });

    return result.id;
  });

  ipcMain.handle("deleteEmployee", async (event, [id]) => {
    await Employee.destroy({
      where: {
        id,
      },
    });

    return null;
  });
}
