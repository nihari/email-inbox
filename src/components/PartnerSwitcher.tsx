import React from 'react';

interface PartnerSwitcherProps {
  currentPartner: string;
  onPartnerChange: (partner: string) => void;
}

export const PartnerSwitcher: React.FC<PartnerSwitcherProps> = ({ currentPartner, onPartnerChange }) => {
  const partners = [
    { id: 'partnerA', name: 'Partner A' },
    { id: 'partnerB', name: 'Partner B' },
  ];

  return (
    <div className="partner-switcher">
      <label htmlFor="partner-select">Partner: </label>
      <select
        id="partner-select"
        value={currentPartner}
        onChange={(e) => onPartnerChange(e.target.value)}
      >
        {partners.map((partner) => (
          <option key={partner.id} value={partner.id}>
            {partner.name}
          </option>
        ))}
      </select>
    </div>
  );
};

