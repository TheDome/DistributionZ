import { useContext, useEffect, useState } from "react";
import {
  Button,
  ButtonGroup,
  ButtonToolbar,
  Container,
  Form,
  FormControl,
  InputGroup,
  Table,
} from "react-bootstrap";
import Api, { APIContext, IApi } from "../components/api/Api";

export default function Distribution() {
  const currentDateMinusOneMonth = new Date();
  currentDateMinusOneMonth.setMonth(currentDateMinusOneMonth.getMonth() - 1);

  const [fromDate, setFromDate] = useState(currentDateMinusOneMonth);
  const [toDate, setToDate] = useState(new Date());

  const [generatedData, setGeneratedData] =
    useState<Awaited<ReturnType<IApi["distribute"]>>>();

  const [distributors, setDistributors] =
    useState<Awaited<ReturnType<IApi["getDistributors"]>>>();

  const [selectedDistributor, setSelectedDistributor] = useState<string>();

  const api = useContext(APIContext);

  useEffect(() => {
    const dist = api.getDistributors();

    dist.then((d) => {
      console.assert(d.length > 0, "No distributors found");
      setDistributors(d);
      setSelectedDistributor(d[0]);
    });
  }, []);

  return (
    <Container className="mt-5">
      <h1>Distribution</h1>

      <p>In here you can mix and distribute all Employees across shifts.</p>

      <ButtonToolbar>
        <InputGroup>
          <InputGroup.Text>From</InputGroup.Text>
          <Form.Control
            type="number"
            placeholder="Year"
            value={fromDate.getUTCFullYear()}
            onChange={(e) => {
              if (e.target.value === "") {
                return;
              }

              let date = new Date(fromDate);
              date.setUTCFullYear(parseInt(e.target.value));
              setFromDate(date);
            }}
          />
          <Form.Control
            type="number"
            placeholder="Month"
            value={fromDate.getUTCMonth() + 1}
            contentEditable={false}
            onChange={(e) => {
              // Check for blank
              if (e.target.value === "") {
                return;
              }

              let date = new Date(fromDate);
              date.setUTCMonth(parseInt(e.target.value) - 1);
              setFromDate(date);
            }}
          />
        </InputGroup>{" "}
        <InputGroup>
          <InputGroup.Text>To</InputGroup.Text>
          <Form.Control
            type="number"
            placeholder="Year"
            value={toDate.getUTCFullYear()}
            onChange={(e) => {
              if (e.target.value === "") {
                return;
              }

              // To may not be before from
              if (parseInt(e.target.value) < fromDate.getUTCFullYear()) {
                return;
              }

              let date = new Date(toDate);
              // Avoid setting year to a smaller month
              if (
                parseInt(e.target.value) === fromDate.getUTCFullYear() &&
                toDate.getUTCMonth() < fromDate.getUTCMonth()
              ) {
                // set month
                date.setUTCMonth(fromDate.getUTCMonth());
              }

              date.setUTCFullYear(parseInt(e.target.value));
              setToDate(date);
            }}
          />
          <Form.Control
            type="number"
            placeholder="Month"
            value={toDate.getUTCMonth() + 1}
            contentEditable={false}
            onChange={(e) => {
              // Check for blank
              if (e.target.value === "") {
                return;
              }

              // To may not be before from
              if (
                parseInt(e.target.value) < fromDate.getUTCMonth() + 1 &&
                toDate.getUTCFullYear() === fromDate.getUTCFullYear()
              ) {
                return;
              }

              let date = new Date(toDate);
              date.setUTCMonth(parseInt(e.target.value) - 1);
              setToDate(date);
            }}
          />
        </InputGroup>
        <InputGroup>
          <Form.Select
            onChange={(e) => {
              if (e.target.value === "0") {
                setSelectedDistributor(undefined);
                return;
              }

              setSelectedDistributor(e.target.value);
            }}
          >
            {distributors?.map((distributor) => (
              <option key={distributor} value={distributor}>
                {distributor}
              </option>
            ))}
          </Form.Select>
        </InputGroup>
      </ButtonToolbar>
      <Button
        className="mt-3"
        onClick={async () => {
          const dist = await api.distribute(
            fromDate,
            toDate,
            selectedDistributor
          );

          setGeneratedData(dist);
        }}
      >
        Generate
      </Button>
      {generatedData && (
        <Table>
          <thead>
            <tr>
              <th>Day</th>
              <th>Employee</th>
            </tr>
          </thead>
          <tbody>
            {generatedData.map((item) => (
              <>
                <tr>
                  <td>{item.date}</td>
                  <td></td>
                </tr>
                {item.employees.map((employee) => (
                  <tr>
                    <td></td>
                    <td>{employee.name}</td>
                  </tr>
                ))}
              </>
            ))}
          </tbody>
        </Table>
      )}
    </Container>
  );
}
