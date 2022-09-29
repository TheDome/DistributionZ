import { ipcRenderer } from "electron";

import Employee from "@/ipc/model/Employee";
import MonthData from "@/ipc/model/MonthData";
import Shift from "@/ipc/model/Shift";

import { createContext } from "react";

export interface IApi {
  distribute(fromDate: Date, toDate: Date): Promise<Shift[]>;
  blockEmployee(date: Date, id: number): unknown;
  removeBlocked(date: Date, id: any): Promise<boolean>;
  getBlocked(date: Date): Promise<Employee[]>;
  createEmployee(newName: string): unknown;
  deleteEmployee(id: number): Promise<void>;
  getShift(date: Date): Promise<Shift>;
  getIsShift(date: Date): Promise<boolean>;
  setIsShift(date: Date, isShift: boolean): Promise<boolean>;
  setEmployeesForShift(date: Date, count: number): Promise<void>;
  listEmployees(): Promise<Employee[]>;
  getMonthData(month: number, year: number): Promise<MonthData>;
}

export const APIContext = createContext<IApi>(undefined as any);

export default class Api implements IApi {
  constructor(private ipCChannel: typeof ipcRenderer = ipcRenderer) {}

  public async getShift(date: Date): Promise<Shift> {
    return this.invokeRPC<Shift>("getShift", date);
  }

  private async invokeRPC<T>(method: string, ...args: any): Promise<T> {
    return this.ipCChannel.invoke(method, args);
  }

  public async listEmployees(): Promise<Employee[]> {
    const result = await this.invokeRPC<Employee[]>("listEmployees");
    return result;
  }

  public async getMonthData(month: number, year: number): Promise<MonthData> {
    const result = await this.invokeRPC<MonthData>("getMonthData", {
      month,
      year,
    });
    return result;
  }

  public async getIsShift(date: Date): Promise<boolean> {
    return this.invokeRPC<boolean>("getIsShift", date);
  }

  public async setIsShift(date: Date, isShift: boolean): Promise<boolean> {
    return this.invokeRPC<boolean>("setIsShift", date, isShift);
  }

  public async deleteEmployee(id: number): Promise<void> {
    await this.invokeRPC<void>("deleteEmployee", id);
  }

  public async createEmployee(newName: string): Promise<void> {
    await this.invokeRPC<void>("createEmployee", newName);
  }

  public async getBlocked(date: Date): Promise<Employee[]> {
    return this.invokeRPC<Employee[]>("getBlockedEmployees", date);
  }

  public async removeBlocked(date: Date, id: any): Promise<boolean> {
    return this.invokeRPC<boolean>("removeBlockedEmployee", date, id);
  }

  public async blockEmployee(date: Date, id: number): Promise<boolean> {
    return this.invokeRPC<boolean>("blockEmployee", date, id);
  }

  public async distribute(
    fromDate: Date,
    toDate: Date,
    distributor = "Random"
  ): Promise<Shift[]> {
    return this.invokeRPC<Shift[]>(
      "distributeEmployees",
      distributor,
      fromDate,
      toDate
    );
  }

  public async setEmployeesForShift(date: Date, count: number): Promise<void> {
    return this.invokeRPC<void>("setEmployeesForShift", date, count);
  }
}
