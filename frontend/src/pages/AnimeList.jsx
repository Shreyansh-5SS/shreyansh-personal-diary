import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Modal, Form } from 'react-bootstrap';
import axios from 'axios';

const API_URL = 'http://localhost:4000/api';

const AnimeList = () => {
  const [animes, setAnimes] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    genre: '',
    rating: 5
  });

  const fetchAnimes = async () => {
    try {
      const response = await axios.get(`${API_URL}/anime`);
      setAnimes(response.data);
    } catch (error) {
      console.error('Error fetching animes:', error);
    }
  };

  useEffect(() => {
    fetchAnimes();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/anime`, formData);
      setShowModal(false);
      setFormData({ title: '', genre: '', rating: 5 });
      fetchAnimes();
    } catch (error) {
      console.error('Error adding anime:', error);
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>My Anime List</h2>
        <Button onClick={() => setShowModal(true)}>Add Anime</Button>
      </div>

      <Row xs={1} md={2} lg={3} className="g-4">
        {animes.map(anime => (
          <Col key={anime.id}>
            <Card>
              <Card.Body>
                <Card.Title>{anime.title}</Card.Title>
                <Card.Text>
                  Genre: {anime.genre}<br />
                  Rating: {'⭐'.repeat(anime.rating)}<br />
                  Status: {anime.status}
                </Card.Text>
                {anime.episodes_watched !== null && (
                  <Card.Text>
                    Progress: {anime.episodes_watched} / {anime.total_episodes || '?'}
                  </Card.Text>
                )}
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add New Anime</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Genre</Form.Label>
              <Form.Control
                type="text"
                value={formData.genre}
                onChange={(e) => setFormData({...formData, genre: e.target.value})}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Rating (1-5)</Form.Label>
              <Form.Control
                type="number"
                min="1"
                max="5"
                value={formData.rating}
                onChange={(e) => setFormData({...formData, rating: parseInt(e.target.value)})}
                required
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Add Anime
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
};

export default AnimeList;