import React from 'react';

interface PageProps {
  onNavigate: (page: string) => void;
}

const TermsOfService: React.FC<PageProps> = ({ onNavigate }) => {
  return (
    <div className="info-page">
      <h2>Terms of Service</h2>
      <p><em>Last Updated: {new Date().toLocaleDateString()}</em></p>

      <h3>1. Acceptance of Terms</h3>
      <p>By accessing and using the {process.env.REACT_APP_NAME} URL Shortener service ("Service"), you accept and agree to be bound by the terms and provision of this agreement. In addition, when using this particular service, you shall be subject to any posted guidelines or rules applicable to such service. Any participation in this service will constitute acceptance of this agreement.</p>

      <h3>2. Service Description</h3>
      <p>The Service allows users to shorten Uniform Resource Locators (URLs). You understand and agree that the Service is provided "AS-IS" and that {process.env.REACT_APP_NAME} assumes no responsibility for the timeliness, deletion, mis-delivery or failure to store any user communications or personalization settings.</p>

      <h3>3. User Conduct</h3>
      <p>You agree not to use the Service to:</p>
      <ul>
        <li>Shorten URLs linking to content that is unlawful, harmful, threatening, abusive, harassing, defamatory, vulgar, obscene, libelous, invasive of another's privacy, hateful, or racially, ethnically or otherwise objectionable;</li>
        <li>Shorten URLs linking to spam, phishing sites, malware, or any content that violates applicable laws or regulations;</li>
        <li>Impersonate any person or entity, or falsely state or otherwise misrepresent your affiliation with a person or entity;</li>
        <li>Interfere with or disrupt the Service or servers or networks connected to the Service.</li>
      </ul>
      <p>We reserve the right to remove any shortened URL or suspend access to the Service for users who violate these terms.</p>

      <h3>4. Disclaimer of Warranties</h3>
      <p>You expressly understand and agree that your use of the Service is at your sole risk. The service is provided on an "as is" and "as available" basis. {process.env.REACT_APP_NAME} expressly disclaims all warranties of any kind, whether express or implied, including, but not limited to the implied warranties of merchantability, fitness for a particular purpose and non-infringement.</p>

      <h3>5. Limitation of Liability</h3>
      <p>You expressly understand and agree that {process.env.REACT_APP_NAME} shall not be liable for any direct, indirect, incidental, special, consequential or exemplary damages, including but not limited to, damages for loss of profits, goodwill, use, data or other intangible losses resulting from the use or the inability to use the service.</p>

      <h3>6. Modifications to Service and Terms</h3>
      <p>{process.env.REACT_APP_NAME} reserves the right at any time and from time to time to modify or discontinue, temporarily or permanently, the Service (or any part thereof) with or without notice. We also reserve the right to change these Terms of Service at any time. You agree that {process.env.REACT_APP_NAME} shall not be liable to you or to any third party for any modification, suspension or discontinuance of the Service.</p>

      <h3>7. Governing Law</h3>
      <p>This Agreement shall be governed by the laws of [Your Jurisdiction, e.g., the State of California] without regard to its conflict of law provisions.</p>
    </div>
  );
};

export default TermsOfService;
