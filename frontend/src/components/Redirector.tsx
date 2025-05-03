import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

interface RedirectData {
  longUrl: string;
}

const Redirector: React.FC = () => {
  const { shortCode } = useParams<{ shortCode: string }>();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchUrlAndRedirect = async () => {
      if (!shortCode) {
        setError('No short code provided');
        setLoading(false);
        return;
      }

      try {
        // Construct the URL to the JSON file in the S3 bucket
        const jsonUrl = `${process.env.REACT_APP_BUCKET_URL}/urls/${shortCode}.json`;

        console.log(`Fetching URL for short code: ${shortCode}`);
        
        const response = await fetch(jsonUrl);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data: RedirectData = await response.json();
        
        if (data.longUrl) {
          console.log(`Redirecting to: ${data.longUrl}`);
          // Redirect to the long URL
          window.location.href = data.longUrl;
          return;
        }
        
        setError('Invalid URL data');
        setLoading(false);
      } catch (err) {
        console.error('Error fetching URL:', err);
        setError('Could not fetch the URL data. The short link might be invalid or expired.');
        setLoading(false);
      }
    };

    fetchUrlAndRedirect();
  }, [shortCode, navigate]);

  if (loading) {
    return (
      <div className="redirect-loader">
        <h3>Redirecting...</h3>
        <div className="loader"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="redirect-error">
        <h3>Redirect Error</h3>
        <p>{error}</p>
        <button onClick={() => navigate('/')}>Go to Homepage</button>
      </div>
    );
  }

  return null;
};

export default Redirector;