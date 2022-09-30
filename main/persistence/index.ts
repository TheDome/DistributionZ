import { existsSync, mkdirSync } from "fs";
import { homedir } from "os";
import { join } from "path";
import { SequelizeOptions, Sequelize } from "sequelize-typescript";
import Blocked from "./model/Blocked";
import Employee from "./model/Employee";
import Participation from "./model/Participation";
import Shift from "./model/Shift";

let config: SequelizeOptions;

const dir = join(homedir(), ".config", "distributionz");

if (process.env.NODE_ENV === "production") {
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }

  config = {
    dialect: "sqlite",
    storage: join(dir, "distributionz.sqlite"),
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

const sequelize = new Sequelize(config);

sequelize.addModels([Employee, Participation, Shift, Blocked]);

export default sequelize;
