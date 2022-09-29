import {
  Table,
  Column,
  HasMany,
  Model,
  DataType,
  PrimaryKey,
  AutoIncrement,
  BelongsToMany,
} from "sequelize-typescript";
import Blocked from "./Blocked";
import Participation from "./Participation";
import Shift from "./Shift";

@Table({ paranoid: true })
export default class Employee extends Model {
  @Column({ type: DataType.STRING })
  public declare name: string;

  @BelongsToMany(() => Shift, {
    through: () => Participation,
  })
  declare readonly shifts?: Shift[];

  @HasMany(() => Blocked, { foreignKey: "employeeId", onDelete: "CASCADE" })
  declare readonly blockedAt?: Blocked[];
}
