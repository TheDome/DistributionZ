import Blocked from "../persistence/model/Blocked";
import Employee from "../persistence/model/Employee";
import Participation from "../persistence/model/Participation";
import Shift from "../persistence/model/Shift";

export async function setupDev(isProd: boolean) {
  if (!isProd) {
    await setup();
  }
}

async function setup() {
  await Promise.all([
    Employee.create({ name: "John Worms " }),
    Employee.create({ name: "Jane Doe " }),
  ])
    .then(([john, jane]) => {
      return Promise.all([
        Blocked.create({
          date: new Date().getTime(),
          employeeId: john.id,
        }),
        Shift.create({ date: new Date().getTime() }),
        jane,
      ]);
    })
    .then(([blocked, shift, employee]) => {
      return Participation.create({
        employeeId: employee.id,
        shiftId: shift.id,
      });
    })
    .catch(console.error);
}
