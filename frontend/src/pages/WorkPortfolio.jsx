import React from 'react';
import { Container, Row, Col, Card, Badge } from 'react-bootstrap';
import { FaGithub, FaLinkedin, FaEnvelope, FaTwitter } from 'react-icons/fa';

const WorkPortfolio = () => {
  const skills = [
    { name: 'React', variant: 'primary' },
    { name: 'Node.js', variant: 'success' },
    { name: 'TypeScript', variant: 'info' },
    { name: 'Python', variant: 'warning' },
    { name: 'SQL', variant: 'danger' },
    { name: 'Docker', variant: 'primary' },
    { name: 'AWS', variant: 'warning' },
    { name: 'Git', variant: 'dark' }
  ];

  const projects = [
    {
      title: 'Personal Diary App',
      description: 'A full-stack application for managing personal diary entries, expenses, and anime list.',
      tech: ['React', 'Node.js', 'SQLite', 'React-Bootstrap'],
      link: 'https://github.com/yourusername/personal-diary'
    },
    {
      title: 'Task Management System',
      description: 'Drag-and-drop taskboard with real-time updates and progress tracking.',
      tech: ['React', 'Express', 'PostgreSQL', 'WebSocket'],
      link: 'https://github.com/yourusername/task-manager'
    },
    {
      title: 'E-commerce Platform',
      description: 'Modern e-commerce solution with cart management and payment integration.',
      tech: ['Next.js', 'Stripe', 'MongoDB', 'Tailwind CSS'],
      link: 'https://github.com/yourusername/ecommerce'
    }
  ];

  return (
    <Container className="py-5">
      {/* Header Section */}
      <Row className="mb-5 align-items-center">
        <Col md={4} className="text-center">
          <div 
            className="rounded-circle mx-auto mb-3"
            style={{
              width: '200px',
              height: '200px',
              backgroundColor: '#e9ecef',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.2rem',
              color: '#6c757d'
            }}
          >
            Photo Placeholder
          </div>
        </Col>
        <Col md={8}>
          <h1 className="mb-3">John Doe</h1>
          <h4 className="text-muted mb-4">Full Stack Developer</h4>
          <p className="lead">
            Passionate about building scalable web applications and solving complex problems.
            Experienced in modern JavaScript frameworks and cloud technologies.
          </p>
        </Col>
      </Row>

      {/* Skills Section */}
      <section className="mb-5">
        <h2 className="mb-4">Skills</h2>
        <div className="d-flex flex-wrap gap-2">
          {skills.map((skill, index) => (
            <Badge 
              key={index} 
              bg={skill.variant}
              className="p-2 fs-6"
            >
              {skill.name}
            </Badge>
          ))}
        </div>
      </section>

      {/* Projects Section */}
      <section className="mb-5">
        <h2 className="mb-4">Featured Projects</h2>
        <Row xs={1} md={2} lg={3} className="g-4">
          {projects.map((project, index) => (
            <Col key={index}>
              <Card className="h-100">
                <Card.Body>
                  <Card.Title>{project.title}</Card.Title>
                  <Card.Text>{project.description}</Card.Text>
                  <div className="mb-3">
                    {project.tech.map((tech, i) => (
                      <Badge 
                        key={i} 
                        bg="secondary"
                        className="me-2"
                      >
                        {tech}
                      </Badge>
                    ))}
                  </div>
                  <Card.Link href={project.link} target="_blank">
                    View Project
                  </Card.Link>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </section>

      {/* Contact Section */}
      <section className="mb-5">
        <h2 className="mb-4">Get in Touch</h2>
        <div className="d-flex gap-4 justify-content-center fs-2">
          <a href="https://github.com/yourusername" className="text-dark" target="_blank" rel="noopener noreferrer">
            <FaGithub />
          </a>
          <a href="https://linkedin.com/in/yourusername" className="text-primary" target="_blank" rel="noopener noreferrer">
            <FaLinkedin />
          </a>
          <a href="mailto:your.email@example.com" className="text-danger" target="_blank" rel="noopener noreferrer">
            <FaEnvelope />
          </a>
          <a href="https://twitter.com/yourusername" className="text-info" target="_blank" rel="noopener noreferrer">
            <FaTwitter />
          </a>
        </div>
      </section>
    </Container>
  );
};

export default WorkPortfolio;