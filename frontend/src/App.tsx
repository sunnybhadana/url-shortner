import React, { useState, useEffect, useRef, useCallback } from 'react';
import './App.css';
import SEO from './components/SEO';
import AboutUs from './components/AboutUs';
import ContactUs from './components/ContactUs';
import TermsOfService from './components/TermsOfService';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCopy, faCheck } from '@fortawesome/free-solid-svg-icons';

declare global {
  interface Window {
    grecaptcha: any;
    onRecaptchaLoad: () => void;
  }
}

const App: React.FC = () => {
  const [longUrl, setLongUrl] = useState('');
  const [shortUrl, setShortUrl] = useState('');
  const [showCookieBanner, setShowCookieBanner] = useState(false);
  const [activePage, setActivePage] = useState('home');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copied, setCopied] = useState(false);
  const recaptchaRef = useRef<HTMLDivElement>(null);
  const RECAPTCHA_SITE_KEY = process.env.REACT_APP_RECAPTCHA_SITE_KEY; 
  const DOMAIN_NAME = process.env.REACT_APP_DOMAIN; // Replace with your actual domain
  const API_DOMAIN = process.env.REACT_APP_API_DOMAIN; // Replace with your actual API domain

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    function tryRenderRecaptcha() {
      if (
        window.grecaptcha &&
        typeof window.grecaptcha.render === 'function' &&
        recaptchaRef.current &&
        !recaptchaRef.current.hasChildNodes()
      ) {
        window.grecaptcha.render(recaptchaRef.current, {
          sitekey: RECAPTCHA_SITE_KEY,
        });
        if (interval) clearInterval(interval);
      }
    }

    // If grecaptcha is already loaded, render immediately
    if (window.grecaptcha && typeof window.grecaptcha.render === 'function') {
      tryRenderRecaptcha();
    } else {
      // Otherwise, poll every 300ms until it's available
      interval = setInterval(tryRenderRecaptcha, 300);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, []);

  // Rest of your useEffect for cookies and navigation
  useEffect(() => {
    // Check if user has already accepted cookies
    const cookiesAccepted = localStorage.getItem('cookiesAccepted');
    if (!cookiesAccepted) {
      setShowCookieBanner(true);
    }
    
    // Check URL hash for page navigation
    const hash = window.location.hash.replace('#', '');
    if (hash === 'privacy') {
      setActivePage('privacy');
    } else if (hash === 'disclaimer') {
      setActivePage('disclaimer');
    }

    // Listen for hash changes
    const handleHashChange = () => {
      const newHash = window.location.hash.replace('#', '');
      if (newHash === 'privacy') {
        setActivePage('privacy');
      } else if (newHash === 'disclaimer') {
        setActivePage('disclaimer');
      } else if (newHash === '' || newHash === 'home') {
        setActivePage('home');
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Update the URL when navigating between pages
  const navigate = (page: string) => {
    setActivePage(page);
    if (page === 'home') {
      window.location.hash = '';
    } else {
      window.location.hash = page;
    }
  };

  const handleShortenUrl = async () => {
    if (!longUrl || !longUrl.startsWith('http')) {
      alert('Please enter a valid URL starting with http or https.');
      return;
    }

    // Check if grecaptcha is loaded and available
    if (!window.grecaptcha || typeof window.grecaptcha.getResponse !== 'function') {
      alert('reCAPTCHA is still loading. Please wait a moment and try again.');
      return;
    }

    // Get reCAPTCHA response
    const recaptchaResponse = window.grecaptcha.getResponse();
    if (!recaptchaResponse) {
      alert('Please check the box "I\'m not a robot" to verify you are human.');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(
        `${API_DOMAIN}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Origin': `${DOMAIN_NAME}`,
          },
          body: JSON.stringify({ 
            url: longUrl,
            recaptchaToken: recaptchaResponse
          }),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to shorten URL');
      }

      const data = await response.json();
      setShortUrl(data.shortUrl || '');
      // Clear the input field after successful shortening
      setLongUrl('');
      
      // Reset reCAPTCHA
      window.grecaptcha.reset();
    } catch (error) {
      console.error('Error shortening URL:', error);
      alert('An error occurred while shortening the URL. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLongUrl(e.target.value);
  };

  const acceptCookies = () => {
    localStorage.setItem('cookiesAccepted', 'true');
    setShowCookieBanner(false);
  };

  const handleCopy = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000); // Reset copied state after 2 seconds
  };

  const renderContent = () => {
    switch (activePage) {
      case 'privacy':
        return <PrivacyPolicy />;
      case 'disclaimer':
        return <Disclaimer />;
      case 'about':
        return <AboutUs onNavigate={() => {}}/>;
      case 'contact':
        return <ContactUs onNavigate={() => {}}/>;
      case 'terms':
        return <TermsOfService onNavigate={() => {}}/>;
      default:
        return (
          <div className="card">
            <h1>URL Shortener</h1>
            <p>Enter a long URL to shorten it:</p>
            <input
              type="text"
              placeholder="Enter the URL to shorten"
              value={longUrl}
              onChange={handleInputChange}
              className="url-input"
            />
            <div className="recaptcha-container">
              <div 
                className="g-recaptcha" 
                data-sitekey={RECAPTCHA_SITE_KEY}
                ref={recaptchaRef}
              ></div>
            </div>
            <button 
              onClick={handleShortenUrl} 
              className="shorten-button"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Processing...' : 'Shorten'}
            </button>
            {shortUrl && (
              <div className="result-container">
                <p>Shortened URL:</p>
                <div className="result-display">
                  <a 
                    href={shortUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="short-url-link"
                  >
                    {shortUrl}
                  </a>
                  <button 
                    className={`copy-button ${copied ? 'copied' : ''}`}
                    onClick={() => handleCopy(shortUrl)}
                    disabled={!shortUrl}
                    title="Copy URL"
                  >
                    <FontAwesomeIcon icon={copied ? faCheck : faCopy} />
                  </button>
                </div>
              </div>
            )}
          </div>
        );
    }
  };

  const getSeoMetadata = () => {
    switch (activePage) {
      case 'privacy':
        return {
          title: `Privacy Policy | ${process.env.REACT_APP_NAME} - URL Shortener`,
          description: `Privacy policy for ${process.env.REACT_APP_NAME} URL shortener service. Learn how we collect, use, and protect your data when you use our URL shortening service.`,
          canonical: `${process.env.REACT_APP_DOMAIN}/#privacy`,
          pagePath: `/#privacy`,
        };
      case 'disclaimer':
        return {
          title: `Disclaimer | ${process.env.REACT_APP_NAME} - URL Shortener`,
          description: `Legal disclaimer for ${process.env.REACT_APP_NAME} URL shortener service. Understanding the terms of use and limitations of our free URL shortening service.`,
          canonical: `${process.env.REACT_APP_DOMAIN}/#disclaimer`,
          pagePath: `/#disclaimer`,
        };
      case 'about':
        return {
          title: `About Us | ${process.env.REACT_APP_NAME} - URL Shortener`,
          description: `Learn about ${process.env.REACT_APP_NAME}, the creators of this free URL shortener service. Our mission, vision, and commitment to providing a reliable URL shortening solution.`,
          canonical: `${process.env.REACT_APP_DOMAIN}/#about`,
          pagePath: '/#about',
        };
      case 'contact':
        return {
          title: `Contact Us | ${process.env.REACT_APP_NAME} - URL Shortener`,
          description: `Get in touch with ${process.env.REACT_APP_NAME}. We welcome your feedback, questions, and suggestions regarding our URL shortener service.`,
          canonical: `${process.env.REACT_APP_DOMAIN}/#contact`,
          pagePath: `/#contact`,
        };
      default:
        return {
          title: `${process.env.REACT_APP_NAME} | Free URL Shortener`,
          description: `Create short, memorable links with ${process.env.REACT_APP_NAME} free URL shortener. Perfect for social media sharing, marketing campaigns, and simplifying long URLs.`,
          canonical: `${process.env.REACT_APP_DOMAIN}/`,
          pagePath: '/',
        };
    }
  };

  const seoProps = getSeoMetadata();

  return (
    <div className="app-container">
      <SEO {...seoProps} />
      {renderContent()}
      
      {showCookieBanner && (
        <div className="cookie-banner">
          <p>We use cookies to improve your experience on our website.</p>
          <button onClick={acceptCookies} className="accept-cookies">Accept</button>
        </div>
      )}
      
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-logo">{process.env.REACT_APP_NAME}</div>
          <div className="footer-links">
            <button className="footer-link" onClick={() => navigate('home')}>Home</button>
            <button className="footer-link" onClick={() => navigate('privacy')}>Privacy Policy</button>
            <button className="footer-link" onClick={() => navigate('disclaimer')}>Disclaimer</button>
            <button className='footer-link' onClick={() => navigate('about')}>About Us</button>
            <button className='footer-link' onClick={() => navigate('contact')}>Contact Us</button>
            <button className='footer-link' onClick={() => navigate('terms')}>Terms of Service</button>

          </div>
          <div className="footer-copyright">
            © {new Date().getFullYear()} {process.env.REACT_APP_NAME}. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

const PrivacyPolicy: React.FC = () => {
  return (
    <div className="info-page">
      <h1>Privacy Policy</h1>
      <p>Last updated: April 27, 2025</p>
      
      <h2>1. Information We Collect</h2>
      <p>When you use our URL shortener service, we collect the following information:</p>
      <ul>
        <li>The original URL you wish to shorten</li>
        <li>Basic access logs including IP addresses</li>
        <li>Browser cookies for functional purposes</li>
      </ul>
      
      <h2>2. How We Use Your Information</h2>
      <p>We use the collected information to:</p>
      <ul>
        <li>Provide and maintain our URL shortening service</li>
        <li>Monitor and analyze usage patterns</li>
        <li>Improve the functionality of our service</li>
      </ul>
      
      <h2>3. Cookies</h2>
      <p>We use cookies to remember your preferences and provide essential features. You can control cookies through your browser settings.</p>
      
      <h2>4. Data Security</h2>
      <p>We implement appropriate security measures to protect your information from unauthorized access or disclosure.</p>
      
      <h2>5. Contact Us</h2>
      <p>If you have any questions about this Privacy Policy, please contact us at privacy@urlshortener.com</p>
    </div>
  );
};

const Disclaimer: React.FC = () => {
  return (
    <div className="info-page">
      <h1>Disclaimer</h1>
      <p>Last updated: April 27, 2025</p>
      
      <h2>1. Service Usage</h2>
      <p>Our URL shortener service is provided "as is" and "as available" without any warranties of any kind.</p>
      
      <h2>2. Content Responsibility</h2>
      <p>We do not control or monitor the content of the URLs that users shorten. We are not responsible for the content of the destination websites.</p>
      
      <h2>3. Service Availability</h2>
      <p>We do not guarantee that our service will be available at all times or that it will be error-free.</p>
      
      <h2>4. Prohibited Usage</h2>
      <p>You may not use our service to shorten URLs that lead to:</p>
      <ul>
        <li>Illegal content or activities</li>
        <li>Malware, viruses, or harmful software</li>
        <li>Phishing or scam websites</li>
        <li>Content that violates third-party rights</li>
      </ul>
      
      <h2>5. Limitation of Liability</h2>
      <p>We shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of our service.</p>
    </div>
  );
};

export default App;
