import React, { useState } from 'react';

interface PageProps {
  onNavigate: (page: string) => void;
}

const ContactUs: React.FC<PageProps> = ({ onNavigate }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    // Basic validation
    if (!name || !email || !message) {
      setError('Please fill in all fields.');
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    // Here you would typically send the form data to a backend endpoint
    // For example: fetch('/api/contact', { method: 'POST', body: JSON.stringify({ name, email, message }) })
    console.log('Form submitted:', { name, email, message });

    // Simulate submission success
    setSubmitted(true);
    setName('');
    setEmail('');
    setMessage('');
  };

  return (
    <div className="info-page contact-page">
      <h2>Contact Us</h2>
      
      {submitted ? (
        <div className="submission-success">
          <p>Thank you for your message! We'll get back to you as soon as possible.</p>
          <button className="back-button" onClick={() => onNavigate('home')}>Back to Home</button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="contact-form">
          <p>If you have any questions, feedback, or concerns, please don't hesitate to reach out using the form below.</p>
          
          {error && <p className="error-message">{error}</p>}

          <div className="form-group">
            <label htmlFor="name">Name:</label>
            <input 
              type="text" 
              id="name" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              required 
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input 
              type="email" 
              id="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="message">Message:</label>
            <textarea 
              id="message" 
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={5}
              required 
            />
          </div>
          
          <div className="form-actions">
            <button type="submit" className="submit-button">Send Message</button>
          </div>
        </form>
      )}
    </div>
  );
};

export default ContactUs;
