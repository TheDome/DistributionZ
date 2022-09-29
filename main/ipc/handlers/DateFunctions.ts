import { ipcMain } from "electron";
import { getMonthData } from "../../handler/Scheduling";
import sequelize from "sequelize";
import Blocked from "../../persistence/model/Blocked";
import MonthData from "../model/MonthData";

export default async function register() {
  ipcMain.handle("getMonthData", async (event, args) => {
    const month = args[0].month,
      year = args[0].year;

    const data = await getMonthData(month, year);

    return {
      month,
      year,
      entries: data,
    } as MonthData;
  });
}
