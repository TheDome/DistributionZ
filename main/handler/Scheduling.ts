import MonthData from "@/ipc/model/MonthData";
import Blocked from "../persistence/model/Blocked";

import sequelize from "sequelize";
import Shift from "../persistence/model/Shift";
import Employee from "../persistence/model/Employee";
import Participation from "../persistence/model/Participation";

export async function getMonthData(
  month: number,
  year: number
): Promise<MonthData["entries"]> {
  const query = {
    where: {
      date: {
        [sequelize.Op.between]: [
          new Date(year, month, 1).getTime(),
          new Date(year, month + 1, 0).getTime(),
        ],
      },
    },
  };

  const blocked = Blocked.findAll(query);

  const shifts = Shift.findAll(query);

  const [blockedData, shiftData] = await Promise.all([blocked, shifts]);

  const blockedMap = new Map<string, boolean>();
  for (const entry of blockedData) {
    blockedMap.set(entry.date, true);
  }

  const shiftMap = new Map<string, boolean>();
  for (const entry of shiftData) {
    shiftMap.set(entry.date, true);
  }

  const result: MonthData["entries"] = {};
  for (let i = 1; i <= new Date(Date.UTC(year, month, 0)).getUTCDate(); i++) {
    const date = new Date(Date.UTC(year, month, i));

    const key = date.toISOString().split("T")[0];
    result[key] = {
      blocked: blockedMap.get(key) ?? false,
      shift: shiftMap.get(key) ?? false,
    };
  }

  return result;
}

/**
 *
 * @param date The date as UTC date
 */
export async function getShiftData(
  date: Date
): Promise<{ employees: Employee[]; required: number }> {
  let shift = await Shift.findOne({
    where: {
      date: date.getTime(),
    },
    include: [{ model: Employee }],
  });

  return {
    employees: shift?.participants ?? [],
    required: shift?.required ?? 1,
  };
}

export async function getIsShift(date: Date): Promise<boolean> {
  let shift = await Shift.findOne({
    where: {
      date: date.getTime(),
    },
  });

  return shift !== null;
}

/**
 * This method will destroy a shift, if there are no participants in it. Otherwise it will not do anything.
 * @param date The date as UTC date
 * @param isShift Whether on this day should be a shift
 * @returns Whether there is a shift on this day
 */
export async function setIsShift(
  date: Date,
  isShift: boolean
): Promise<boolean> {
  const shift = await Shift.findOne({
    where: {
      date: date.getTime(),
    },
    include: [{ model: Employee }],
  });

  if (isShift) {
    if (shift === null) {
      await Shift.create({
        date: date.getTime(),
      });
    }
    return true;
  }

  if (shift && shift?.participants?.length === 0) {
    await shift.destroy();
    return false;
  } else {
    throw new Error(
      "There are participants in this shift. You cannot delete it."
    );
  }
}

export async function getBlockedEmployees(date: Date): Promise<Employee[]> {
  let blocks = await Blocked.findAll({
    where: {
      date: date.getTime(),
    },
    include: [{ model: Employee }],
  });

  return blocks?.map((b) => b.employee as Employee) ?? [];
}

export async function removeBlockedEmployee(
  date: Date,
  employee: number
): Promise<boolean> {
  let block = await Blocked.findOne({
    where: {
      date: date.getTime(),
      employeeId: employee,
    },
  });

  if (block) {
    await block.destroy();
    return true;
  }

  return false;
}

export async function setBlockedEmployee(
  date: Date,
  employee: number
): Promise<boolean> {
  // If employee is in shift for this day, he cannot be blocked
  let shift = await Shift.findOne({
    where: {
      date: date.getTime(),
    },
    include: [{ model: Employee }],
  });

  if (shift?.participants?.some((p) => p.id === employee)) {
    return false;
  }

  let block = await Blocked.findOne({
    where: {
      date: date.getTime(),
      employeeId: employee,
    },
  });

  if (block) {
    return true;
  }

  await Blocked.create({
    date: date.getTime(),
    employeeId: employee,
  });

  return true;
}

export async function changeEmployeeShiftCount(
  date: Date,
  count: number
): Promise<boolean> {
  let shift = await Shift.findOne({
    where: {
      date: date.getTime(),
    },
    include: [{ model: Employee }],
  });

  if (shift === null) {
    throw new Error("There is no shift on this day.");
  }

  shift.required = count;

  await shift.save();

  return true;
}
