import registerDate from "./handlers/DateFunctions";
import registerEmployee from "./handlers/Employee";
import registerDist from "./handlers/Distribution";
import registerShifts from "./handlers/Shift";

const handlers = [registerDist, registerEmployee, registerDate, registerShifts];

export async function registerIPC() {
  console.log("registering ipc handlers");
  return Promise.all(handlers.map((h) => h()));
}
