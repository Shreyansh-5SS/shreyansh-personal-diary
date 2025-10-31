import React from 'react';
import { Container, Nav, Row, Col } from 'react-bootstrap';
import { Outlet, Link, useLocation } from 'react-router-dom';

const WorkLayout = () => {
  const location = useLocation();
  
  return (
    <Container fluid>
      <Row>
        {/* Sidebar */}
        <Col md={2} className="bg-light min-vh-100 p-3">
          <h4 className="mb-4">Work Space</h4>
          <Nav className="flex-column">
            <Nav.Link 
              as={Link} 
              to="/work/portfolio"
              active={location.pathname === '/work/portfolio'}
            >
              Portfolio
            </Nav.Link>
            <Nav.Link 
              as={Link} 
              to="/work/desk"
              active={location.pathname === '/work/desk'}
            >
              Task Board
            </Nav.Link>
          </Nav>
        </Col>

        {/* Main Content */}
        <Col md={10} className="p-3">
          <Outlet />
        </Col>
      </Row>
    </Container>
  );
};

export default WorkLayout;