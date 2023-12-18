import React, { useState } from 'react';
import './Help.css';

function Help() {
  const [feedback, setFeedback] = useState('');
  const [openAccordion, setOpenAccordion] = useState(null);
  const [showTooltip, setShowTooltip] = useState(false);
  
  const toggleAccordion = (index) => {
    if (openAccordion === index) {
      setOpenAccordion(null);
    } else {
      setOpenAccordion(index);
    }
  };

  const handleFeedbackChange = (e) => {
    setFeedback(e.target.value);
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    // Send the feedback to your server or perform any other necessary action here.
    // You can also clear the feedback input field after submission if needed.
    setFeedback('');
  }

  return (
    <div className="Help">
      <h1>Smart Energy Monitoring System </h1>
      <p>
        Welcome to the Smart Energy Monitoring System Help Page. Here, you'll find information and instructions on how to use our system effectively.
      </p>
      <h2>Getting Started</h2>
      <p>
        Setting Up
        <ul>
          <li>Sign up or log in to your account.</li>
          <li>Connect your energy monitoring devices.</li>
          <li>Explore your energy usage data in real-time.</li>
        </ul>
      </p>
      <h2>After Setting Up the Hardware Unit</h2>
      <p>
        Follow these steps:
      </p>
      <ol>
        <li>Install the hardware unit in your home.</li>
        <li>Open the website and log in or sign up for an account.</li>
        <li>Click on "Add Room" to configure a new room for monitoring.</li>
        <li>In the "Add Room" page, manually pair the sensor by entering the sensor ID.</li>
        <li>Provide a room name to identify the monitored area.</li>
        <li>Set your desired monthly targets for energy consumption in that room (you can change them later).</li>
        <li>Save your room configuration to start monitoring energy usage.</li>
      </ol>
      <h2>Frequently Asked Questions (F&Qs)</h2>
      <div className="faq-section">
        {faqs.map((faq, index) => (
          <div className="faq" key={index}>
            <strong onClick={() => toggleAccordion(index)}>
              {faq.question}
            </strong>
            {openAccordion === index && (
              <p>{faq.answer}</p>
            )}
          </div>
        ))}
      </div>
      <h2>Feedback</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="feedback">Your Feedback:</label>
        <textarea
          id="feedback"
          name="feedback"
          value={feedback}
          onChange={handleFeedbackChange}
          rows="4"
        ></textarea>
        <button type="submit">Submit Feedback</button>
      </form>
    </div>
  );
}
const faqs = [
  {
    question: 'How can I view my daily/weekly energy consumption?',
    answer: 'To view your daily or weekly energy consumption, log in to your account, navigate to the "Usage Overview" section of the dashboard, and click on the "Daily" or "Weekly" tab. You will see a graphical representation of your energy consumption for the selected period.',
  },
  {
    question: 'How can I set up alerts for high energy usage?',
    answer: 'You can set up alerts for high energy usage by going to the "Alerts & Notifications" section in your account settings. From there, you can configure alert thresholds and receive notifications when your energy consumption exceeds those thresholds.',
  },
  {
    question: 'What should I do if I experience technical issues?',
    answer: 'If you experience technical issues, please contact our support team at support@smartenergy.com. They will assist you in resolving any technical problems or answering any questions you may have.',
  },
  
];
export default Help;