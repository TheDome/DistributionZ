import { homedir } from "os";
import { join } from "path";
import { SequelizeOptions, Sequelize } from "sequelize-typescript";
import Blocked from "./model/Blocked";
import Employee from "./model/Employee";
import Participation from "./model/Participation";
import Shift from "./model/Shift";

let config: SequelizeOptions;

const dir = join(homedir(), ".config", "shift-x", "db.sqlite");

if (process.env.NODE_ENV === "production") {
  config = {
    dialect: "sqlite",
    storage: dir,
    logging: false,
  };
} else {
  config = {
    dialect: "sqlite",
    storage: ":memory:",
    logging: console.log,
    logQueryParameters: true,
  };
}

console.debug("Sequelize config:", config);

const sequelize = new Sequelize(config);

sequelize.addModels([Employee, Participation, Shift, Blocked]);
console.log("Sequelize models:", sequelize.models);

export default sequelize;
