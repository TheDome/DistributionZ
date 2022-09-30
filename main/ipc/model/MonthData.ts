export default class MonthData {
  month!: number;
  year!: number;

  /**
   * The entries for this month.
   * key is a string of format "YYYY-MM-DD"
   */
  entries!: Record<string, MonthDataEntry>;
}

interface MonthDataEntry {
  blocked: boolean;
  shift: boolean;
}
