import { Container, Nav, Navbar } from "react-bootstrap";

export default function Header() {
  return (
    <Navbar bg="light" expand="lg">
      <Container>
        <Navbar.Brand href="/">ShiftX</Navbar.Brand>
        <Navbar.Toggle aria-controls="navbar" />
        <Navbar.Collapse id="navbar">
          <Nav>
            <Nav.Link href="/">Home</Nav.Link>
            <Nav.Link href="/employees">Employees</Nav.Link>
            <Nav.Link href="/distribution">Distributor</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
