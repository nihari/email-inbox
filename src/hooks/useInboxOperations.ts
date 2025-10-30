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
  const toggleAllEmailsSelection = (type: SelectionType) => {
    if (type === SelectionType.SELECT_ALL) {
      selectAllEmails();
    } else {
      clearAllSelections();
    }
  };

  const markAsRead = (emailIds: string | string[]) => {
    const ids = Array.isArray(emailIds) ? emailIds : [emailIds];
    bulkUpdateEmails(ids, { isRead: true });
  };

  const markAsUnread = (emailIds: string | string[]) => {
    const ids = Array.isArray(emailIds) ? emailIds : [emailIds];
    bulkUpdateEmails(ids, { isRead: false });
  };

  const markAsSpam = (emailIds: string | string[]) => {
    const ids = Array.isArray(emailIds) ? emailIds : [emailIds];
    bulkUpdateEmails(ids, { isSpam: true });
    reapplyFolderFilter();
  };

  const markAsNotSpam = (emailIds: string | string[]) => {
    const ids = Array.isArray(emailIds) ? emailIds : [emailIds];
    bulkUpdateEmails(ids, { isSpam: false });
    reapplyFolderFilter();
  };

  const deleteEmails = (emailIds: string | string[]) => {
    const ids = Array.isArray(emailIds) ? emailIds : [emailIds];
    deleteFromInbox(ids);
  };

  return {
    inboxState,
    markAsRead,
    markAsUnread,
    markAsSpam,
    markAsNotSpam,
    deleteEmails,
    toggleEmailSelection,
    toggleAllEmailsSelection,
    setCurrentEmail,
  };
};

