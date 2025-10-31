import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Modal, Form } from 'react-bootstrap';
import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';
import axios from 'axios';

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend
);

const API_URL = 'http://localhost:4000/api';

// Generate random color
const getRandomColor = () => {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

const Expenses = () => {
  const [expenses, setExpenses] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    amount: '',
    category: '',
    description: '',
    date: new Date().toISOString().split('T')[0]
  });

  const fetchExpenses = async () => {
    try {
      const response = await axios.get(`${API_URL}/expenses`);
      setExpenses(response.data);
    } catch (error) {
      console.error('Error fetching expenses:', error);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/expenses`, {
        ...formData,
        amount: parseFloat(formData.amount)
      });
      setShowModal(false);
      setFormData({
        amount: '',
        category: '',
        description: '',
        date: new Date().toISOString().split('T')[0]
      });
      fetchExpenses();
    } catch (error) {
      console.error('Error adding expense:', error);
    }
  };

  // Prepare data for pie chart
  const categoryTotals = expenses.reduce((acc, curr) => {
    acc[curr.category] = (acc[curr.category] || 0) + parseFloat(curr.amount);
    return acc;
  }, {});

  const chartData = {
    labels: Object.keys(categoryTotals),
    datasets: [
      {
        data: Object.values(categoryTotals),
        backgroundColor: Object.keys(categoryTotals).map(() => getRandomColor()),
        borderWidth: 1
      }
    ]
  };

  const chartOptions = {
    plugins: {
      legend: {
        position: 'right'
      }
    }
  };

  return (
    <Container className="py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>My Expenses</h1>
        <Button onClick={() => setShowModal(true)}>Add Expense</Button>
      </div>

      <Row className="mb-4">
        <Col md={8}>
          <Card>
            <Card.Body>
              <Card.Title>Expense Distribution</Card.Title>
              <div style={{ height: '400px' }}>
                <Pie data={chartData} options={chartOptions} />
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card>
            <Card.Body>
              <Card.Title>Summary</Card.Title>
              <ul className="list-unstyled">
                {Object.entries(categoryTotals).map(([category, total]) => (
                  <li key={category} className="mb-2">
                    <strong>{category}:</strong> ${total.toFixed(2)}
                  </li>
                ))}
              </ul>
              <hr />
              <strong>Total: ${Object.values(categoryTotals).reduce((a, b) => a + b, 0).toFixed(2)}</strong>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Card>
        <Card.Body>
          <Card.Title>Recent Transactions</Card.Title>
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Category</th>
                  <th>Description</th>
                  <th>Amount</th>
                </tr>
              </thead>
              <tbody>
                {expenses.map(expense => (
                  <tr key={expense.id}>
                    <td>{new Date(expense.date).toLocaleDateString()}</td>
                    <td>{expense.category}</td>
                    <td>{expense.description}</td>
                    <td>${parseFloat(expense.amount).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card.Body>
      </Card>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add New Expense</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Amount ($)</Form.Label>
              <Form.Control
                type="number"
                step="0.01"
                value={formData.amount}
                onChange={(e) => setFormData({...formData, amount: e.target.value})}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Category</Form.Label>
              <Form.Control
                type="text"
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                type="text"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Date</Form.Label>
              <Form.Control
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({...formData, date: e.target.value})}
                required
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Add Expense
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </Container>
  );
};

export default Expenses;