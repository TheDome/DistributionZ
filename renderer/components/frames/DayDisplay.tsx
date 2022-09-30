import { useState } from "react";
import { Container, NavDropdown } from "react-bootstrap";
import BlockedDisplay from "../dataDisplay/BlockedDisplay";
import ShiftDisplay from "../dataDisplay/ShiftDisplay";

export default function DayDisplay({
  date,
  clearCache,
}: {
  date: Date;
  clearCache: () => void;
}) {
  return (
    <Container>
      <h4>Data for {date.toISOString()}</h4>
      <div className="mt-3" />
      <ShiftDisplay date={date} clearCache={clearCache} />
      <hr></hr>
      <BlockedDisplay date={date} refreshCache={clearCache} />
    </Container>
  );
}
