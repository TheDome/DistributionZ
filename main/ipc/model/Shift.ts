import Employee from "./Employee";

export default class Shift {
  /**
   * The date of the shift.
   */
  date!: string;

  employees!: Employee[];

  required: number = 1;
}
