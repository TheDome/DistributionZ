import Shift from "../../ipc/model/Shift";

export default interface Distributor {
  get name(): string;

  distribute(fromDate: Date, toDate: Date): Promise<Shift[]>;
}
