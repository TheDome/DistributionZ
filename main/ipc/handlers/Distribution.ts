import { ipcMain } from "electron";
import { listDistributors } from "../../handler/distributors";

export default async function register() {
  const distributors = listDistributors();

  ipcMain.handle(
    "distributeEmployees",
    async (event, [distributor, fromDate, toDate]) => {
      const d = distributors.find((d) => d.name === distributor);

      if (d === undefined) {
        throw new Error("Distributor not found");
      }

      return await d.distribute(fromDate, toDate);
    }
  );
}
