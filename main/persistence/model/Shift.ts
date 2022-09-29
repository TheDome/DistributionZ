import {
  Table,
  Model,
  Column,
  HasMany,
  HasOne,
  ForeignKey,
  DataType,
  BelongsToMany,
} from "sequelize-typescript";
import Employee from "./Employee";
import Participation from "./Participation";

@Table({ paranoid: true })
export default class Shift extends Model {
  @Column({ type: DataType.DATEONLY })
  declare date: string;

  @BelongsToMany(() => Employee, {
    through: () => Participation,
  })
  declare participants?: Employee[];

  @Column({ type: DataType.INTEGER, defaultValue: 1 })
  declare required: number;
}
