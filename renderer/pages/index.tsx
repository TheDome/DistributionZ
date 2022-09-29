import React from "react";
import Calendar from "../components/frames/Calendar";

import "react-calendar/dist/Calendar.css";
import { Col, Container, Row } from "react-bootstrap";
import CalendarContent from "../components/CalendarContent";
import DayDisplay from "../components/frames/DayDisplay";

function Index() {
  const today = new Date();
  const [date, setDate] = React.useState(
    new Date(Date.UTC(today.getFullYear(), today.getMonth(), today.getDate()))
  );

  const [clearCache, setClearCache] = React.useState(new Date());

  return (
    <Container className="mt-5 p-0 mr-0 ml-0">
      <Row>
        <Col>
          <DayDisplay
            date={date}
            clearCache={() => {
              console.log("clearing cache");
              setClearCache(new Date());
            }}
          />
        </Col>
        <Col>
          <Calendar
            onChangeDate={(date) => {
              setDate(
                new Date(
                  Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
                )
              );
            }}
            cacheKey={clearCache}
          />
        </Col>
      </Row>
    </Container>
  );
}

export default Index;
