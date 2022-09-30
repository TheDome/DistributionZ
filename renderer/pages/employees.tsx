import { ipcMain } from "electron";
import { ipcRenderer } from "electron";
import { useContext, useEffect, useState } from "react";
import { Table } from "react-bootstrap";
import { useCol } from "react-bootstrap/esm/Col";
import Employee from "@/ipc/model/Employee";
import { APIContext } from "../components/api/Api";

export default function EmployeesPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);

  const [newName, setNewName] = useState("");

  const api = useContext(APIContext);

  async function updateEmployees() {
    await api.listEmployees().then((employees) => {
      setEmployees(employees);
    });
  }

  useEffect(() => {
    updateEmployees();
  }, []);

  async function addEmployee() {
    await api.createEmployee(newName);
    setNewName("");

    await updateEmployees();
  }

  async function deleteEmployee(id: number) {
    await api.deleteEmployee(id);
    await updateEmployees();
  }

  return (
    <>
      <h1>Employees</h1>
      <Table>
        <thead>
          <tr>
            <th>Id</th>
            <th>Name</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr key={"add"}>
            <td></td>
            <td>
              <input
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
              ></input>
            </td>
            <td onClick={addEmployee}>Add</td>
          </tr>
          {employees.map((employee) => (
            <tr key={employee.id}>
              <td>{employee.id}</td>
              <td>{employee.name}</td>
              <td onClick={() => deleteEmployee(employee.id)}>Del</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  );
}
