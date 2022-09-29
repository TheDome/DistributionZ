import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  HasOne,
  Model,
  Table,
} from "sequelize-typescript";
import Employee from "./Employee";

@Table
export default class Blocked extends Model {
  @Column({ type: DataType.DATEONLY })
  declare date: string;

  @Column({ type: DataType.STRING })
  declare reason: string;

  @BelongsTo(() => Employee, { foreignKey: "employeeId" })
  declare readonly employee?: Employee;
}
