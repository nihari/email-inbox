import React from 'react';
import type { Email } from '../types';

interface InboxListProps {
  emails: Email[];
  onEmailClick: (email: Email) => void;
  onToggleSelection: (emailId: string) => void;
  searchQuery?: string;
  showPreview?: boolean;
}

export const InboxList: React.FC<InboxListProps> = ({ emails, onEmailClick, onToggleSelection, searchQuery = '', showPreview = true }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = diff / (1000 * 60 * 60);

    if (hours < 24) {
      return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
    } else if (hours < 24 * 7) {
      return date.toLocaleDateString('en-US', { weekday: 'short' });
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  };

  const highlightText = (text: string, query: string) => {
    if (!query.trim()) {
      return <span>{text}</span>;
    }

    const parts = text.split(new RegExp(`(${query})`, 'gi'));
    return (
      <span>
        {parts.map((part, index) =>
          part.toLowerCase() === query.toLowerCase() ? (
            <mark key={index} className="search-highlight">{part}</mark>
          ) : (
            <span key={index}>{part}</span>
          )
        )}
      </span>
    );
  };

  return (
    <div className="inbox-list">
      {emails.length === 0 ? (
        <div className="empty-state">
          <p>No emails to display</p>
        </div>
      ) : (
        emails.map((email) => (
          <div
            key={email.id}
            className={`email-row ${!email.isRead ? 'unread' : ''}`}
            onClick={() => onEmailClick(email)}
          >
            <div className="email-checkbox" onClick={(e) => e.stopPropagation()}>
              <input
                type="checkbox"
                checked={email.isSelected}
                onChange={() => onToggleSelection(email.id)}
              />
            </div>
            <div className="email-content">
              <div className="email-header">
                {email.isSent ? <span className="email-sender">{highlightText(email?.receiver || '', searchQuery)}</span> : <span className="email-sender">{highlightText(email.sender, searchQuery)}</span>}

                <span className="email-date">{formatDate(email.date)}</span>
              </div>
              <div className="email-subject">{highlightText(email.subject, searchQuery)}</div>
              {showPreview && (
                <div className="email-snippet">{highlightText(email.snippet, searchQuery)}</div>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

