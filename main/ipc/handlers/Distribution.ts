import { ipcMain } from "electron";
import { listDistributors } from "../../handler/distributors";
import Distributor from "../model/Distributor";

export default async function register() {
  const distributors = listDistributors();

  ipcMain.handle(
    "distributeEmployees",
    async (event, [distributor, fromDate, toDate]) => {
      const d = distributors.find((d) => d.name === distributor);

      console.log(
        "distributor",
        distributors.map((d) => d.name),
        distributor
      );

      if (d === undefined) {
        throw new Error("Distributor "+ d + " not found");
      }

      return await d.distribute(fromDate, toDate);
    }
  );

  ipcMain.handle("listDistributors", async () => {
    return distributors.map((d) => new Distributor(d.name));
  });
}
