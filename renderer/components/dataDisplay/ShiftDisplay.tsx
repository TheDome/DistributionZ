import { useContext, useEffect, useState } from "react";
import {
  ButtonToolbar,
  Form,
  FormCheck,
  InputGroup,
  ListGroup,
} from "react-bootstrap";
import Shift from "../../../main/ipc/model/Shift";
import { APIContext } from "../api/Api";

export default function ShiftDisplay({
  date,
  clearCache,
}: {
  date: Date;
  clearCache: () => void;
}) {
  const [shift, setShift] = useState<Shift | null>(null);
  const [required, setRequired] = useState<number>(1);
  const [isShift, setIsShift] = useState(false);
  const api = useContext(APIContext);

  useEffect(() => {
    api.getShift(date).then((shift) => {
      setShift(shift);
      console.log(shift);
      setRequired(shift.required);
    });

    api.getIsShift(date).then((isShift) => {
      setIsShift(isShift);
    });
  }, [date]);

  useEffect(() => {
    if (isShift) {
      api.setEmployeesForShift(date, required);
    }
  }, [required]);

  if (shift === null) return <h1>Shifts</h1>;

  return (
    <div>
      <h1>
        Shift{" "}
        <ButtonToolbar>
          <InputGroup>
            <InputGroup.Checkbox
              checked={isShift}
              onClick={() => {
                api.setIsShift(date, !isShift).then(async (isShift) => {
                  setIsShift(isShift);
                  await api.setEmployeesForShift(date, required);

                  clearCache();
                });
              }}
            />
            <Form.Control
              type="number"
              placeholder="Required people"
              value={required}
              onChange={(e) => {
                if (e.target.value === "") {
                  return;
                }
                const val = parseInt(e.target.value);
                if (val < 1) {
                  return;
                }
                setRequired(val);
              }}
            />
          </InputGroup>
        </ButtonToolbar>
      </h1>

      <ListGroup>
        {shift.employees.map((employee) => (
          <ListGroup.Item>{employee.name}</ListGroup.Item>
        ))}
      </ListGroup>
    </div>
  );
}
