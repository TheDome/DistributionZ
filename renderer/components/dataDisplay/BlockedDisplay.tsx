import { useContext, useEffect, useState } from "react";
import { ListGroup, Table } from "react-bootstrap";
//@ts-ignore
import Search from "react-search";
import Employee from "@/ipc/model/Employee";
import { APIContext } from "../api/Api";

export default function BlockedDisplay({
  date,
  refreshCache,
}: {
  date: Date;
  refreshCache: () => void;
}) {
  const [item, setItem] = useState<number>();

  const [employees, setEmployees] = useState<{ id: number; value: string }[]>(
    []
  );

  const [blocked, setBlocked] = useState<Employee[]>([]);

  const api = useContext(APIContext);

  async function refreshBlocked() {
    let blocked = await api.getBlocked(date);
    setBlocked(blocked);
  }

  useEffect(() => {
    api.listEmployees().then((employees) => {
      console.log(employees);
      setEmployees(
        employees.map((employee) => ({ id: employee.id, value: employee.name }))
      );
    });
  }, []);

  useEffect(() => {
    refreshBlocked();
  }, [date]);

  return (
    <>
      <h1>Blocked</h1>

      <Table>
        <thead>
          <tr>
            <th>Employee</th>
            <th>Blocked</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <Search
                items={employees}
                placeholder={"name"}
                multiple={false}
                onItemsChanged={(itm: { id: number }[]) => {
                  if (itm[0]) setItem(itm[0].id);
                }}
              />
            </td>
            <td
              onClick={async () => {
                if (item) {
                  await api.blockEmployee(date, item);
                  refreshCache();
                  refreshBlocked();
                }
              }}
            >
              Add
            </td>
          </tr>
          {blocked.map((employee) => (
            <tr>
              <td>{employee.name}</td>
              <td
                onClick={() => {
                  api.removeBlocked(date, employee.id).then(() => {
                    setBlocked(blocked.filter((e) => e.id != employee.id));
                    refreshCache();
                  });
                }}
              >
                Remove
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  );
}
