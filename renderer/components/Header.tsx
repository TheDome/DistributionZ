import Link from "next/link";
import { Container, Nav, Navbar } from "react-bootstrap";

export default function Header() {
  return (
    <Navbar bg="light" expand="lg">
      <Container>
        <Link href={"/"} passHref>
          <Navbar.Brand>DistributionZ</Navbar.Brand>
        </Link>
        <Navbar.Toggle aria-controls="navbar" />
        <Navbar.Collapse id="navbar">
          <Nav>
            <Link href={"/"} passHref>
              <Nav.Link>Home</Nav.Link>
            </Link>
            <Link href={"/employees"} passHref>
              <Nav.Link>Employees</Nav.Link>
            </Link>
            <Link href={"/distribution"} passHref>
              <Nav.Link>Distributor</Nav.Link>
            </Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
