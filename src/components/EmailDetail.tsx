import React, { useState } from 'react';
import type { Email, FolderType } from '../types';

interface EmailDetailProps {
  email: Email;
  folder: FolderType;
  onClose: () => void;
  onMarkAsRead: () => void;
  onMarkAsUnread: () => void;
  onMarkAsSpam: () => void;
  onSendReply?: (recipientEmail: string, subject: string, content: string) => void;
  showSpamButton?: boolean;
}

export const EmailDetail: React.FC<EmailDetailProps> = ({
  folder,
  email,
  onClose,
  onMarkAsRead,
  onMarkAsUnread,
  onMarkAsSpam,
  onSendReply,
  showSpamButton = true,
}) => {
  const [isReplying, setIsReplying] = useState(false);
  const [replyContent, setReplyContent] = useState('');

  const formatFullDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  const handleReplyClick = () => {
    setIsReplying(true);
  };

  const handleSendReply = () => {
    if (replyContent.trim() && onSendReply) {
      const replySubject = email.subject.startsWith('Re: ')
        ? email.subject
        : `Re: ${email.subject}`;

      onSendReply(email.sender, replySubject, replyContent);
    }

    console.log('Reply sent:', replyContent);
    setReplyContent('');
    setIsReplying(false);
  };

  const handleCancelReply = () => {
    setReplyContent('');
    setIsReplying(false);
  };

  return (
    <div className="email-detail">
      <div className="email-detail-header">
        <button onClick={onClose} className="close-button">← Back</button>
        <div className="email-actions">
          <button onClick={onMarkAsUnread}>Mark as Unread</button>
          {showSpamButton && folder == 'inbox' && (
            <button onClick={onMarkAsSpam}>Mark as Spam</button>
          )}
          {folder == 'inbox' ? <button onClick={handleReplyClick}>Reply</button> : null}
        </div>
      </div>
      <div className="email-detail-content">
        <div className="email-detail-subject">{email.subject}</div>
        <div className="email-detail-meta">
          {email.isSent ? <span className="email-detail-sender">To: {email?.receiver || 'Unknown'}</span> : <span className="email-detail-sender">From: {email.sender}</span>}
          <span className="email-detail-date">{formatFullDate(email.date)}</span>
        </div>
        <div className="email-detail-body">{email.body}</div>

        {isReplying && (
          <div className="reply-compose-box">
            <div className="reply-compose-header">
              <h3>Reply to: {email.sender}</h3>
            </div>
            <textarea
              className="reply-compose-textarea"
              placeholder="Type your reply here..."
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              rows={8}
            />
            <div className="reply-compose-actions">
              <button
                className="reply-send-button"
                onClick={handleSendReply}
              >
                Send
              </button>
              <button
                className="reply-cancel-button"
                onClick={handleCancelReply}
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

