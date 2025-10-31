import React from 'react';
import { Card, Button } from 'react-bootstrap';

const DiaryCard = ({ entry, onEdit, onDelete }) => {
  return (
    <Card className="mb-3">
      {entry.image_path && (
        <Card.Img 
          variant="top" 
          src={`http://localhost:4000${entry.image_path}`}
          style={{ height: '200px', objectFit: 'cover' }}
          onError={(e) => {
            console.error('Image load error:', e);
            e.target.style.display = 'none';
          }}
        />
      )}
      <Card.Body>
        <Card.Title>{entry.title}</Card.Title>
        <Card.Text>{entry.content}</Card.Text>
        <div className="d-flex justify-content-end gap-2">
          <Button variant="outline-primary" size="sm" onClick={() => onEdit(entry)}>
            Edit
          </Button>
          <Button variant="outline-danger" size="sm" onClick={() => onDelete(entry.id)}>
            Delete
          </Button>
        </div>
      </Card.Body>
      <Card.Footer className="text-muted">
        {new Date(entry.created_at).toLocaleDateString()}
      </Card.Footer>
    </Card>
  );
};

export default DiaryCard;