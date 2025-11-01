import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Table, Button, Form, Modal } from 'react-bootstrap';
import axios from 'axios';

function Timetable() {
  const [slots, setSlots] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingSlot, setEditingSlot] = useState(null);
  const [formData, setFormData] = useState({
    day_of_week: 'Monday',
    start_time: '09:00',
    end_time: '10:00',
    activity: '',
    notes: ''
  });

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const hours = Array.from({ length: 9 }, (_, i) => i + 9); // 9 AM to 5 PM

  useEffect(() => {
    loadSlots();
  }, []);

  const loadSlots = async () => {
    try {
      const response = await axios.get('http://localhost:4000/api/timetable');
      setSlots(response.data);
    } catch (error) {
      console.error('Error loading timetable:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingSlot) {
        await axios.put(`http://localhost:4000/api/timetable/${editingSlot.id}`, formData);
      } else {
        await axios.post('http://localhost:4000/api/timetable', formData);
      }
      loadSlots();
      setShowModal(false);
      resetForm();
    } catch (error) {
      console.error('Error saving slot:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this slot?')) {
      try {
        await axios.delete(`http://localhost:4000/api/timetable/${id}`);
        loadSlots();
      } catch (error) {
        console.error('Error deleting slot:', error);
      }
    }
  };

  const handleEdit = (slot) => {
    setEditingSlot(slot);
    setFormData({
      day_of_week: slot.day_of_week,
      start_time: slot.start_time,
      end_time: slot.end_time,
      activity: slot.activity,
      notes: slot.notes || ''
    });
    setShowModal(true);
  };

  const resetForm = () => {
    setEditingSlot(null);
    setFormData({
      day_of_week: 'Monday',
      start_time: '09:00',
      end_time: '10:00',
      activity: '',
      notes: ''
    });
  };

  const getSlotForCell = (day, hour) => {
    const time = `${hour.toString().padStart(2, '0')}:00`;
    return slots.find(slot => 
      slot.day_of_week === day && 
      slot.start_time <= time && 
      slot.end_time > time
    );
  };

  return (
    <Container fluid>
      <h2 className="my-4">Weekly Timetable</h2>
      
      <Button 
        variant="primary" 
        className="mb-3"
        onClick={() => {
          resetForm();
          setShowModal(true);
        }}
      >
        Add New Slot
      </Button>

      <div className="table-responsive">
        <Table bordered>
          <thead>
            <tr>
              <th>Time</th>
              {days.map(day => (
                <th key={day}>{day}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {hours.map(hour => (
              <tr key={hour}>
                <td>{`${hour}:00`}</td>
                {days.map(day => {
                  const slot = getSlotForCell(day, hour);
                  return (
                    <td 
                      key={day} 
                      className={slot ? 'bg-light' : ''}
                      style={{ cursor: slot ? 'pointer' : 'default' }}
                      onClick={() => slot && handleEdit(slot)}
                    >
                      {slot && (
                        <>
                          <div><strong>{slot.activity}</strong></div>
                          <small>{slot.notes}</small>
                        </>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </Table>
      </div>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{editingSlot ? 'Edit Slot' : 'Add New Slot'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Day</Form.Label>
              <Form.Select
                value={formData.day_of_week}
                onChange={e => setFormData({...formData, day_of_week: e.target.value})}
              >
                {days.map(day => (
                  <option key={day} value={day}>{day}</option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Start Time</Form.Label>
              <Form.Control
                type="time"
                value={formData.start_time}
                onChange={e => setFormData({...formData, start_time: e.target.value})}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>End Time</Form.Label>
              <Form.Control
                type="time"
                value={formData.end_time}
                onChange={e => setFormData({...formData, end_time: e.target.value})}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Activity</Form.Label>
              <Form.Control
                type="text"
                value={formData.activity}
                onChange={e => setFormData({...formData, activity: e.target.value})}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Notes</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={formData.notes}
                onChange={e => setFormData({...formData, notes: e.target.value})}
              />
            </Form.Group>

            <div className="d-flex justify-content-between">
              <Button variant="secondary" onClick={() => setShowModal(false)}>
                Cancel
              </Button>
              <Button variant="primary" type="submit">
                {editingSlot ? 'Update' : 'Add'} Slot
              </Button>
              {editingSlot && (
                <Button 
                  variant="danger"
                  onClick={() => {
                    handleDelete(editingSlot.id);
                    setShowModal(false);
                  }}
                >
                  Delete
                </Button>
              )}
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
}

export default Timetable;