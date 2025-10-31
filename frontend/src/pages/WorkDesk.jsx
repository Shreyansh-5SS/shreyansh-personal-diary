import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form, Badge } from 'react-bootstrap';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import axios from 'axios';

const API_URL = 'http://localhost:4000/api';

const taskStatuses = ['TODO', 'IN_PROGRESS', 'DONE'];

const TaskCard = ({ task, index }) => {
  const priorityColors = {
    1: 'success',
    2: 'warning',
    3: 'danger'
  };

  return (
    <Draggable draggableId={task.id.toString()} index={index}>
      {(provided) => (
        <Card
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className="mb-2"
        >
          <Card.Body>
            <Card.Title className="d-flex justify-content-between align-items-start">
              <div>{task.title}</div>
              <Badge bg={priorityColors[task.priority] || 'secondary'}>
                P{task.priority}
              </Badge>
            </Card.Title>
            <Card.Text>{task.description}</Card.Text>
            {task.due_date && (
              <div className="text-muted">
                Due: {new Date(task.due_date).toLocaleDateString()}
              </div>
            )}
          </Card.Body>
        </Card>
      )}
    </Draggable>
  );
};

const WorkDesk = () => {
  const [tasks, setTasks] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    priority: 1,
    due_date: '',
    status: 'TODO'
  });

  const fetchTasks = async () => {
    try {
      const response = await axios.get(`${API_URL}/tasks`);
      setTasks(response.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/tasks`, newTask);
      setNewTask({
        title: '',
        description: '',
        priority: 1,
        due_date: '',
        status: 'TODO'
      });
      setShowForm(false);
      fetchTasks();
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };

  const handleDragEnd = async (result) => {
    if (!result.destination) return;

    const { source, destination, draggableId } = result;
    if (source.droppableId === destination.droppableId) return;

    try {
      await axios.put(`${API_URL}/tasks/${draggableId}`, {
        status: destination.droppableId
      });
      fetchTasks();
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  return (
    <Container fluid className="py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Task Board</h2>
        <Button onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : 'Add Task'}
        </Button>
      </div>

      {showForm && (
        <Card className="mb-4">
          <Card.Body>
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>Title</Form.Label>
                <Form.Control
                  type="text"
                  value={newTask.title}
                  onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={newTask.description}
                  onChange={(e) => setNewTask({...newTask, description: e.target.value})}
                />
              </Form.Group>
              <Row className="mb-3">
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Priority</Form.Label>
                    <Form.Select
                      value={newTask.priority}
                      onChange={(e) => setNewTask({...newTask, priority: Number(e.target.value)})}
                    >
                      <option value={1}>Low</option>
                      <option value={2}>Medium</option>
                      <option value={3}>High</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Due Date</Form.Label>
                    <Form.Control
                      type="date"
                      value={newTask.due_date}
                      onChange={(e) => setNewTask({...newTask, due_date: e.target.value})}
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Button type="submit">Create Task</Button>
            </Form>
          </Card.Body>
        </Card>
      )}

      <DragDropContext onDragEnd={handleDragEnd}>
        <Row>
          {taskStatuses.map(status => (
            <Col key={status} md={4}>
              <Card className="mb-3">
                <Card.Header>{status.replace('_', ' ')}</Card.Header>
                <Card.Body style={{ minHeight: '500px' }}>
                  <Droppable droppableId={status}>
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                      >
                        {tasks
                          .filter(task => task.status === status)
                          .map((task, index) => (
                            <TaskCard
                              key={task.id}
                              task={task}
                              index={index}
                            />
                          ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </DragDropContext>
    </Container>
  );
};

export default WorkDesk;