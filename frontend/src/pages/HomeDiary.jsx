import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Modal, Form } from 'react-bootstrap';
import axios from 'axios';
import DiaryCard from '../components/DiaryCard';

const API_URL = 'http://localhost:4000/api';

const HomeDiary = () => {
  const [entries, setEntries] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    image: null
  });

  const fetchEntries = async () => {
    try {
      const response = await axios.get(`${API_URL}/diary`);
      setEntries(response.data);
    } catch (error) {
      console.error('Error fetching entries:', error);
    }
  };

  useEffect(() => {
    fetchEntries();
  }, []);

  const handleClose = () => {
    setShowModal(false);
    setFormData({ title: '', content: '', image: null });
  };

  const handleImageUpload = async (file) => {
    if (!file) return null;

    const formData = new FormData();
    formData.append('image', file);

    try {
      console.log('Uploading image...');
      const response = await axios.post(`${API_URL}/uploads/local`, formData, {
        headers: { 
          'Content-Type': 'multipart/form-data'
        },
        withCredentials: true
      });
      console.log('Upload response:', response.data);
      return response.data.path;
    } catch (error) {
      console.error('Error uploading image:', error);
      setError('Failed to upload image: ' + (error.response?.data?.error || error.message));
      return null;
    }
  };

  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      if (!formData.title || !formData.content) {
        setError('Title and content are required');
        setIsSubmitting(false);
        return;
      }

      let imagePath = null;
      if (formData.image) {
        try {
          imagePath = await handleImageUpload(formData.image);
        } catch (uploadError) {
          console.error('Image upload failed:', uploadError);
          setError('Failed to upload image. Please try again.');
          setIsSubmitting(false);
          return;
        }
      }

      const response = await axios.post(`${API_URL}/diary`, {
        title: formData.title,
        content: formData.content,
        image_path: imagePath
      });

      console.log('Entry created:', response.data);
      handleClose();
      fetchEntries();
    } catch (error) {
      console.error('Error creating entry:', error);
      setError(error.response?.data?.error || 'Failed to create entry. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this entry?')) {
      try {
        await axios.delete(`${API_URL}/diary/${id}`);
        fetchEntries();
      } catch (error) {
        console.error('Error deleting entry:', error);
      }
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>My Diary</h2>
        <Button onClick={() => setShowModal(true)}>Add Entry</Button>
      </div>

      <Row xs={1} md={2} lg={3} className="g-4">
        {entries.map(entry => (
          <Col key={entry.id}>
            <DiaryCard 
              entry={entry}
              onDelete={handleDelete}
              onEdit={() => {/* TODO: Implement edit */}}
            />
          </Col>
        ))}
      </Row>

      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>New Diary Entry</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            {error && (
              <div className="alert alert-danger" role="alert">
                {error}
              </div>
            )}
            <Form.Group className="mb-3">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                required
                disabled={isSubmitting}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Content</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={formData.content}
                onChange={(e) => setFormData({...formData, content: e.target.value})}
                required
                disabled={isSubmitting}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Image (Optional)</Form.Label>
              <Form.Control
                type="file"
                accept="image/jpeg,image/png"
                onChange={(e) => setFormData({...formData, image: e.target.files[0]})}
                disabled={isSubmitting}
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : 'Save Entry'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
};

export default HomeDiary;