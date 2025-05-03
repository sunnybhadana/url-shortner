import React from 'react';

interface PageProps {
  onNavigate: (page: string) => void;
}

const AboutUs: React.FC<PageProps> = ({ onNavigate }) => {
  return (
    <div className="info-page">
      <h2>About Us</h2>
      <p>Welcome to {process.env.REACT_APP_DOMAIN} URL Shortener!</p>
      <p>Our mission is to provide a simple, fast, and reliable way to shorten long URLs, making them easier to share and manage.</p>
      <p>This service was created by {process.env.REACT_APP_NAME} as a helpful tool for the online community. We believe in the power of concise communication and aim to make web links more accessible.</p>
      <p>We are constantly working to improve the service and add new features. If you have any feedback or suggestions, please feel free to reach out via our Contact Us page.</p>
      <p>Thank you for using {process.env.REACT_APP_NAME} URL Shortener!</p>
    </div>
  );
};

export default AboutUs;
