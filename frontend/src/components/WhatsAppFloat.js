import React, { useState } from 'react';
import { FaWhatsapp, FaTimes } from 'react-icons/fa';
import './WhatsAppFloat.css';

const WhatsAppFloat = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  const whatsappNumbers = [
    {
      country: 'Israel',
      flag: '🇮🇱',
      number: '+972 55 5170540',
      link: 'https://wa.me/972555170540'
    }
  ];

  const handleToggle = () => {
    setIsExpanded(!isExpanded);
  };

  const handleWhatsAppClick = (link) => {
    window.open(link, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="whatsapp-float-container">
      {isExpanded && (
        <div className="whatsapp-options">
          {whatsappNumbers.map((contact, index) => (
            <div
              key={index}
              className="whatsapp-option"
              onClick={() => handleWhatsAppClick(contact.link)}
            >
              <div className="whatsapp-flag">{contact.flag}</div>
              <div className="whatsapp-details">
                <div className="whatsapp-country">{contact.country}</div>
                <div className="whatsapp-number">{contact.number}</div>
              </div>
              <FaWhatsapp className="whatsapp-icon-small" />
            </div>
          ))}
        </div>
      )}

      <button
        className={`whatsapp-float-button ${isExpanded ? 'expanded' : ''}`}
        onClick={handleToggle}
        aria-label="WhatsApp Contact"
      >
        {isExpanded ? (
          <FaTimes className="whatsapp-icon" />
        ) : (
          <FaWhatsapp className="whatsapp-icon" />
        )}
      </button>
    </div>
  );
};

export default WhatsAppFloat;
