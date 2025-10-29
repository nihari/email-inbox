import React from 'react';
import { SelectionType, useInboxOperations } from '../hooks/useInboxOperations';
import { useInbox } from '../context/InboxContext';


export const BulkActions: React.FC = () => {
  const { inboxState, setSelectAllActive } = useInbox();
  const { markAsRead, markAsUnread, markAsSpam, markAsNotSpam, deleteEmails, toggleAllEmailsSelection } = useInboxOperations();

  const isTrashFolder = inboxState.currentFolder === 'trash';
  const isSpamFolder = inboxState.currentFolder === 'spam';
  
  const showBulkActionsButtons = inboxState.partnerConfig?.features.bulkActionsToolbar ?? true;
  const showSpamFeatures = inboxState.partnerConfig?.features.markAsSpamButton ?? true;

  const handleBulkAction = (action: string) => {
    const selectedEmailIds = inboxState.selectedEmails;

    switch (action) {
      case 'read':
        markAsRead(selectedEmailIds);
        break;
      case 'unread':
        markAsUnread(selectedEmailIds);
        break;
      case 'spam':
        markAsSpam(selectedEmailIds);
        break;
      case 'notSpam':
        markAsNotSpam(selectedEmailIds);
        break;
      case 'delete':
        deleteEmails(selectedEmailIds);
        break;
      case 'selectAll':
        setSelectAllActive(true);
        toggleAllEmailsSelection(SelectionType.SELECT_ALL);
        break;
      case 'deselectAll':
        setSelectAllActive(false);
        toggleAllEmailsSelection(SelectionType.DESELECT_ALL);
        break;
      default:
        break;
    }
  };

  return (
    <div className="bulk-actions">
      <div className="email-checkbox" onClick={(e) => e.stopPropagation()}>
        <input
          type="checkbox"
          checked={inboxState.isSelectAllActive}
          onChange={() => handleBulkAction(inboxState.isSelectAllActive ? 'deselectAll' : 'selectAll')}
        />
      </div>
      
      {isSpamFolder && showSpamFeatures ? (
        <>
          <button onClick={() => handleBulkAction('notSpam')}>Mark as Not Spam</button>
          {showBulkActionsButtons && (
            <button onClick={() => handleBulkAction('delete')}>Delete</button>
          )}
        </>
      ) : !isTrashFolder ? (
        <>
          {showBulkActionsButtons && (
            <>
              <button onClick={() => handleBulkAction('read')}>Mark as Read</button>
              <button onClick={() => handleBulkAction('unread')}>Mark as Unread</button>
            </>
          )}
          {showSpamFeatures && (
            <button onClick={() => handleBulkAction('spam')}>Mark as Spam</button>
          )}
          {showBulkActionsButtons && (
            <button onClick={() => handleBulkAction('delete')}>Delete</button>
          )}
        </>
      ) : null}
      
    </div>
  );
};

