import { useCallback } from 'react';
import { useInbox } from '../context/InboxContext';

export const SelectionType = {
  SELECT_ALL: 'selectAll',
  DESELECT_ALL: 'deselectAll',
} as const;

export type SelectionType = typeof SelectionType[keyof typeof SelectionType];

// Custom hook for inbox operations
export const useInboxOperations = () => {
  const {
    inboxState,
    bulkUpdateEmails,
    toggleEmailSelection,
    selectAllEmails,
    clearAllSelections,
    setCurrentEmail,
    deleteEmails: deleteFromInbox,
    reapplyFolderFilter,
  } = useInbox();

  // Toggle selection for all emails
  const toggleAllEmailsSelection = useCallback((type: SelectionType) => {
    if (type === SelectionType.SELECT_ALL) {
      selectAllEmails();
    } else {
      clearAllSelections();
    }
  }, [selectAllEmails, clearAllSelections]);

  const markAsRead = useCallback((emailIds: string | string[]) => {
    const ids = Array.isArray(emailIds) ? emailIds : [emailIds];
    bulkUpdateEmails(ids, { isRead: true });
  }, [bulkUpdateEmails]);

  const markAsUnread = useCallback((emailIds: string | string[]) => {
    const ids = Array.isArray(emailIds) ? emailIds : [emailIds];
    bulkUpdateEmails(ids, { isRead: false });
  }, [bulkUpdateEmails]);

  const markAsSpam = useCallback((emailIds: string | string[]) => {
    const ids = Array.isArray(emailIds) ? emailIds : [emailIds];
    bulkUpdateEmails(ids, { isSpam: true });
    // update filteredIds fro curret folder to add/remove spam
    reapplyFolderFilter();
  }, [bulkUpdateEmails, reapplyFolderFilter]);

  const markAsNotSpam = useCallback((emailIds: string | string[]) => {
    const ids = Array.isArray(emailIds) ? emailIds : [emailIds];
    bulkUpdateEmails(ids, { isSpam: false });
    // update filteredIds for curret folder to remove mails from spam folder
    reapplyFolderFilter();
  }, [bulkUpdateEmails, reapplyFolderFilter]);

  const deleteEmails = useCallback((emailIds: string | string[]) => {
    const ids = Array.isArray(emailIds) ? emailIds : [emailIds];
    deleteFromInbox(ids);
  }, [deleteFromInbox]);

  return {
    inboxState,
    markAsRead, // Works with single or array of IDs
    markAsUnread, // Works with single or array of IDs
    markAsSpam, // Works with single or array of IDs
    markAsNotSpam, // Works with single or array of IDs
    deleteEmails, // Works with single or array of IDs
    toggleEmailSelection,
    toggleAllEmailsSelection,
    setCurrentEmail,
  };
};

