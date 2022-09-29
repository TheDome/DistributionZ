import {
  Table,
  Column,
  HasMany,
  Model,
  HasOne,
  ForeignKey,
  BelongsTo,
} from "sequelize-typescript";
import Employee from "./Employee";
import Shift from "./Shift";

@Table({ paranoid: true })
export default class Participation extends Model {
  @ForeignKey(() => Employee)
  employeeId?: number;

  @ForeignKey(() => Shift)
  shiftId?: number;
}
