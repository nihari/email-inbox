import React, { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import type { InboxState, Email, FolderType, PartnerConfig } from '../types';
import { InboxStateManager } from '../utils/inboxStateManager';

interface InboxContextType {
  inboxState: InboxState;
  bulkUpdateEmails: (emailIds: string[], updates: Partial<Email>) => void;
  addEmail: (email: Email) => void;
  toggleEmailSelection: (emailId: string) => void;
  selectAllEmails: () => void;
  clearAllSelections: () => void;
  setSelectAllActive: (isActive: boolean) => void;
  deleteEmails: (emailIds: string[]) => void;
  setSearchQuery: (query: string) => void;
  setCurrentEmail: (email: Email | null) => void;
  setCurrentPartner: (partnerId: string) => void;
  setPartnerConfig: (config: PartnerConfig) => void;
  setCurrentFolder: (folder: FolderType) => void;
  reapplyFolderFilter: () => void;
  toggleDarkMode: () => void;
  getEmailsForDisplay: () => Email[];
  getSelectedEmails: () => Email[];
  getFolderCounts: () => {
    inbox: number;
    sent: number;
    spam: number;
    trash: number;
  };
}

const InboxContext = createContext<InboxContextType | undefined>(undefined);

export const useInbox = () => {
  const context = useContext(InboxContext);
  if (!context) {
    throw new Error('useInbox must be used within an InboxProvider');
  }
  return context;
};

interface InboxProviderProps {
  children: ReactNode;
  initialState: InboxState;
}

export const InboxProvider: React.FC<InboxProviderProps> = ({ children, initialState }) => {
  const [inboxState, setInboxState] = useState<InboxState>(initialState);

  const bulkUpdateEmails = useCallback((emailIds: string[], updates: Partial<Email>) => {
    setInboxState(prev => InboxStateManager.bulkUpdateEmails(prev, emailIds, updates));
  }, []);

  const addEmail = useCallback((email: Email) => {
    setInboxState(prev => {
      const stateWithNewEmail = {
        ...prev,
        emails: {
          ...prev.emails,
          [email.id]: email
        },
        emailIds: [...prev.emailIds, email.id],
      };
      return InboxStateManager.filterEmailsByFolder(stateWithNewEmail);
    });
  }, []);

  const toggleEmailSelection = useCallback((emailId: string) => {
    setInboxState(prev => InboxStateManager.toggleEmailSelection(prev, emailId));
  }, []);

  const selectAllEmails = useCallback(() => {
    setInboxState(prev => InboxStateManager.selectAllEmails(prev));
  }, []);

  const clearAllSelections = useCallback(() => {
    setInboxState(prev => ({
      ...InboxStateManager.clearAllSelections(prev),
      isSelectAllActive: false
    }));
  }, []);

  const setSelectAllActive = useCallback((isActive: boolean) => {
    setInboxState(prev => ({
      ...prev,
      isSelectAllActive: isActive
    }));
  }, []);

  const deleteEmails = useCallback((emailIds: string[]) => {
    setInboxState(prev => InboxStateManager.deleteEmails(prev, emailIds));
  }, []);

  const setSearchQuery = useCallback((query: string) => {
    setInboxState(prev => {
      const updatedState = {
        ...prev,
        searchQuery: query
      };
      const folderFiltered = InboxStateManager.filterEmailsByFolder(updatedState);
      return InboxStateManager.filterEmails(folderFiltered, { searchQuery: query });
    });
  }, []);

  const setCurrentEmail = useCallback((email: Email | null) => {
    setInboxState(prev => ({
      ...prev,
      currentEmail: email
    }));
  }, []);

  const setCurrentPartner = useCallback((partnerId: string) => {
    setInboxState(prev => ({
      ...prev,
      currentPartner: partnerId
    }));
  }, []);

  const setPartnerConfig = useCallback((config: PartnerConfig) => {
    setInboxState(prev => ({
      ...prev,
      partnerConfig: config
    }));
  }, []);

  const toggleDarkMode = useCallback(() => {
    setInboxState(prev => ({
      ...prev,
      isDarkMode: !prev.isDarkMode
    }));
  }, []);

  const setCurrentFolder = useCallback((folder: FolderType) => {
    setInboxState(prev => {
      const updatedState = {
        ...prev,
        currentFolder: folder
      };
      let filteredState = InboxStateManager.filterEmailsByFolder(updatedState);
      
      if (prev.searchQuery.trim()) {
        filteredState = InboxStateManager.filterEmails(filteredState, { searchQuery: prev.searchQuery });
      }
      
      if (prev.isSelectAllActive) {
        return InboxStateManager.selectAllEmails(filteredState);
      }
      
      return InboxStateManager.clearAllSelections(filteredState);
    });
  }, []);

  const reapplyFolderFilter = useCallback(() => {
    setInboxState(prev => {
      let filteredState = InboxStateManager.filterEmailsByFolder(prev);
      
      if (prev.searchQuery.trim()) {
        filteredState = InboxStateManager.filterEmails(filteredState, { searchQuery: prev.searchQuery });
      }
      
      return filteredState;
    });
  }, []);

  const getEmailsForDisplay = useCallback(() => {
    return InboxStateManager.getEmailsForDisplay(inboxState);
  }, [inboxState]);

  const getSelectedEmails = useCallback(() => {
    return InboxStateManager.getSelectedEmails(inboxState);
  }, [inboxState]);

  const getFolderCounts = useCallback(() => {
    return InboxStateManager.getFolderCounts(inboxState);
  }, [inboxState]);

  const value: InboxContextType = {
    inboxState,
    bulkUpdateEmails,
    addEmail,
    toggleEmailSelection,
    selectAllEmails,
    clearAllSelections,
    setSelectAllActive,
    deleteEmails,
    setSearchQuery,
    setCurrentEmail,
    setCurrentPartner,
    setPartnerConfig,
    setCurrentFolder,
    reapplyFolderFilter,
    toggleDarkMode,
    getEmailsForDisplay,
    getSelectedEmails,
    getFolderCounts,
  };

  return <InboxContext.Provider value={value}>{children}</InboxContext.Provider>;
};

