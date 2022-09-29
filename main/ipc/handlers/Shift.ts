import { ipcMain } from "electron";
import {
  changeEmployeeShiftCount,
  getBlockedEmployees,
  getIsShift,
  getShiftData,
  removeBlockedEmployee,
  setBlockedEmployee,
  setIsShift,
} from "../../handler/Scheduling";
import Shift from "../model/Shift";

export default function register() {
  ipcMain.handle("getShift", async (event, [date]: [string]) => {
    let utcDate = new Date(date);

    let data = await getShiftData(utcDate);

    return {
      date,
      employees: data.employees.map((e) => ({
        name: e.name,
        id: e.id,
      })),
      required: data.required,
    } as Shift;
  });

  ipcMain.handle("getIsShift", async (event, [date]: [string]) => {
    let utcDate = new Date(date);

    let data = await getIsShift(utcDate);

    return data;
  });

  ipcMain.handle(
    "setIsShift",
    async (event, [date, isShift]: [string, boolean]) => {
      let utcDate = new Date(date);

      try {
        let data = await setIsShift(utcDate, isShift);
      } catch (e) {
        console.debug(e);
        return true;
      }
      return isShift;
    }
  );

  ipcMain.handle("getBlockedEmployees", async (event, [date]: [string]) => {
    let utcDate = new Date(date);
    let data = await getBlockedEmployees(utcDate);

    return data.map((e) => ({
      name: e.name,
      id: e.id,
    }));
  });

  ipcMain.handle(
    "removeBlockedEmployee",
    async (event, [date, id]: [string, number]) => {
      return removeBlockedEmployee(new Date(date), id);
    }
  );

  ipcMain.handle(
    "blockEmployee",
    async (event, [date, id]: [string, number]) => {
      return setBlockedEmployee(new Date(date), id);
    }
  );

  ipcMain.handle(
    "setEmployeesForShift",
    async (event, [date, count]: [string, number]) => {
      await changeEmployeeShiftCount(new Date(date), count);
    }
  );
}
