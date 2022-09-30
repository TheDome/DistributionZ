import { Op } from "sequelize";
import Blocked from "../../persistence/model/Blocked";
import Employee from "../../persistence/model/Employee";
import Shift from "../../persistence/model/Shift";
import ipcShift from "@/ipc/model/Shift";
import Distributor from "./Distributor";
import Participation from "../../persistence/model/Participation";
import { inspect } from "util";

/**
 * This distributor will perform a random distribution across all shifts.
 *
 * However if an employee is blocked on a specific date, he will not be assigned to a shift on that date.
 */
export default class RandomDistributor implements Distributor {
  get name(): string {
    return "RandomDistributor";
  }

  async distribute(fromDate: Date, toDate: Date): Promise<ipcShift[]> {
    console.debug("Distributing shifts from " + fromDate + " to " + toDate);

    // Only empty shifts
    const shifts = await Shift.findAll({
      where: {
        date: {
          [Op.between]: [fromDate.getTime(), toDate.getTime()],
        },
      },
      include: [Employee],
    });

    const employees = Employee.findAll();

    const blockages = Blocked.findAll({
      where: {
        date: {
          [Op.between]: [fromDate, toDate],
        },
      },
      include: [Employee],
    });

    const [shiftData, employeeData, blockageData] = await Promise.all([
      shifts,
      employees,
      blockages,
    ]);

    const filteredShiftData = shiftData.filter(
      (s) => s.participants === undefined || s.participants?.length === 0
    );

    console.debug(
      "Shifts: " +
        inspect(filteredShiftData.length, { depth: null }) +
        ", Employees: " +
        inspect(employeeData.length, { depth: null }) +
        ", Blockages: " +
        inspect(blockageData.length, { depth: null })
    );

    const shiftMap = new Map<string, Shift>();
    for (const shift of filteredShiftData) {
      shiftMap.set(shift.date, shift);
    }

    const employeeMap = new Map<number, Employee>();
    for (const employee of employeeData) {
      employeeMap.set(employee.id, employee);
    }

    const blockageMap = new Map<string, Blocked[]>();
    for (const blockage of blockageData) {
      const list = blockageMap.get(blockage.date) ?? [];
      list.push(blockage);
      blockageMap.set(blockage.date, list);
    }

    const result: ipcShift[] = [];
    const parts = [];

    for (const [date, shift] of shiftMap) {
      const blockages = blockageMap.get(date) ?? [];
      const availableEmployees = employeeData.filter(
        (employee) =>
          !blockages.some((blockage) => blockage.employee?.id === employee.id)
      );
      const draws = Math.min(shift.required, availableEmployees.length);

      const partsForShift = [];
      for (let i = 0; i < draws; i++) {
        const index = Math.floor(Math.random() * availableEmployees.length);
        const employee = availableEmployees[index];
        availableEmployees.splice(index, 1);

        const participation = Participation.build({
          shiftId: shift.id,
          employeeId: employee.id,
        });

        partsForShift.push({ p: participation.save(), e: employee });
      }

      parts.push({ shift: shift, parts: partsForShift });
    }

    const res = (await Promise.all(parts)).map((p) => ({
      date: p.shift.date,
      employees: p.parts
        .map((p) => p.e)
        .map((e) => ({ id: e.id, name: e.name })),
      required: p.shift.required,
    }));

    return res;
  }
}
