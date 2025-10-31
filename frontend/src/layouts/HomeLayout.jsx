import React from 'react';
import { Container, Nav, Row, Col } from 'react-bootstrap';
import { Outlet, Link, useLocation } from 'react-router-dom';

const HomeLayout = () => {
  const location = useLocation();
  
  return (
    <Container fluid>
      <Row>
        {/* Sidebar */}
        <Col md={2} className="bg-light min-vh-100 p-3">
          <h4 className="mb-4">Personal Space</h4>
          <Nav className="flex-column">
            <Nav.Link 
              as={Link} 
              to="/home/diary"
              active={location.pathname === '/home/diary'}
            >
              Diary
            </Nav.Link>
            <Nav.Link 
              as={Link} 
              to="/home/anime"
              active={location.pathname === '/home/anime'}
            >
              Anime List
            </Nav.Link>
            <Nav.Link 
              as={Link} 
              to="/home/expenses"
              active={location.pathname === '/home/expenses'}
            >
              Expenses
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

export default HomeLayout;