import React from 'react';

interface PageProps {
  onNavigate: (page: string) => void;
}

const PrivacyPolicy: React.FC<PageProps> = ({ onNavigate }) => {
  return (
    <div className="info-page">
      <h2>Privacy Policy</h2>
      <p><em>Last Updated: {new Date().toLocaleDateString()}</em></p>
      
      <h3>Introduction</h3>
      <p>Welcome to {process.env.REACT_APP_NAME} URL Shortener. We are committed to protecting your personal information and your right to privacy. If you have any questions or concerns about this privacy notice, or our practices with regards to your personal information, please contact us.</p>
      
      <h3>Information We Collect</h3>
      <p>We collect personal information that you voluntarily provide to us when you use our services. The personal information that we collect depends on the context of your interactions with us and the Services, the choices you make and the products and features you use.</p>
      <p>The personal information we collect may include the following:</p>
      <ul>
        <li>URLs you submit for shortening.</li>
        <li>Information automatically collected (e.g., IP address, browser type, device information, usage data through cookies or similar technologies).</li>
      </ul>

      <h3>How We Use Your Information</h3>
      <p>We use personal information collected via our Services for a variety of business purposes described below. We process your personal information for these purposes in reliance on our legitimate business interests, in order to enter into or perform a contract with you, with your consent, and/or for compliance with our legal obligations. We indicate the specific processing grounds we rely on next to each purpose listed below.</p>
      <ul>
        <li>To provide, operate, and maintain our Services.</li>
        <li>To improve, personalize, and expand our Services.</li>
        <li>To understand and analyze how you use our Services.</li>
        <li>To develop new products, services, features, and functionality.</li>
        <li>To communicate with you, either directly or through one of our partners, including for customer service, to provide you with updates and other information relating to the Service, and for marketing and promotional purposes.</li>
        <li>To process your transactions.</li>
        <li>To find and prevent fraud.</li>
        <li>For compliance purposes, including enforcing our Terms of Service, or other legal rights, or as may be required by applicable laws and regulations or requested by any judicial process or governmental agency.</li>
      </ul>

      <h3>Cookies and Tracking Technologies</h3>
      <p>We use cookies and similar tracking technologies (like web beacons and pixels) to access or store information. Specific information about how we use such technologies and how you can refuse certain cookies is set out in our Cookie Policy [Link to Cookie Policy if you have one, otherwise remove or adapt]. We use essential cookies for the functioning of the site and analytics cookies (e.g., Google Analytics) to understand usage patterns. You can manage your cookie preferences via our cookie banner or your browser settings.</p>

      <h3>Sharing Your Information</h3>
      <p>We do not sell your personal information. We may share information in the following situations:</p>
      <ul>
        <li>With service providers who perform services for us (e.g., hosting, analytics).</li>
        <li>If required by law or to respond to legal process.</li>
        <li>To protect the rights, property, or safety of ourselves, our users, or others.</li>
      </ul>

      <h3>Data Security</h3>
      <p>We use administrative, technical, and physical security measures to help protect your personal information. While we have taken reasonable steps to secure the personal information you provide to us, please be aware that despite our efforts, no security measures are perfect or impenetrable, and no method of data transmission can be guaranteed against any interception or other type of misuse.</p>

      <h3>Your Privacy Rights</h3>
      <p>Depending on your location, you may have certain rights regarding your personal information, such as the right to access, correct, or delete your data. Please contact us to exercise these rights.</p>

      <h3>Changes to This Policy</h3>
      <p>We may update this privacy policy from time to time. The updated version will be indicated by an updated "Last Updated" date and the updated version will be effective as soon as it is accessible. We encourage you to review this privacy policy frequently to be informed of how we are protecting your information.</p>

      <h3>Contact Us</h3>
      <p>If you have questions or comments about this policy, you may contact us via the Contact Us page.</p>
    </div>
  );
};

export default PrivacyPolicy;
