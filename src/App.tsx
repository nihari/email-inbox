import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { InboxProvider, useInbox } from './context/InboxContext';
import { InboxList } from './components/InboxList';
import { SearchBar } from './components/SearchBar';
import { BulkActions } from './components/BulkActions';
import { EmailDetail } from './components/EmailDetail';
import { PartnerSwitcher } from './components/PartnerSwitcher';
import { SideMenu } from './components/SideMenu';
import { fetchEmails } from './services/emailService';
import { useInboxOperations } from './hooks/useInboxOperations';
import { loadTheme, applyTheme } from './utils/themeManager';
import { loadPartnerConfig } from './utils/partnerManager';
import type { FolderType, Email } from './types';
import './App.css';

const InboxApp: React.FC = () => {
  const {
    inboxState,
    setSearchQuery,
    toggleEmailSelection,
    setCurrentEmail,
    getEmailsForDisplay,
    getFolderCounts,
    setCurrentPartner,
    setPartnerConfig,
    setCurrentFolder,
    addEmail,
    toggleDarkMode
  } = useInbox();
  const {
    markAsRead,
    markAsUnread,
    markAsSpam,
  } = useInboxOperations();

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (inboxState.isDarkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, [inboxState.isDarkMode]);

  useEffect(() => {
    const loadEmails = async () => {
      setIsLoading(true);
      await fetchEmails();
      setIsLoading(false);
    };
    loadEmails();
  }, []);

  useEffect(() => {
    const loadPartnerAndTheme = async () => {
      try {
        const partnerConfig = await loadPartnerConfig(inboxState.currentPartner);
        setPartnerConfig(partnerConfig);

        const theme = await loadTheme(partnerConfig.themeId);
        applyTheme(theme);
      } catch (error) {
        console.error('Failed to load partner config or theme:', error);
      }
    };

    loadPartnerAndTheme();
  }, [inboxState.currentPartner]);

  // Memoize callbacks passed to child components to prevent unnecessary re-renders
  const handleEmailClick = useCallback((email: any) => {
    setCurrentEmail(email);
    markAsRead(email.id);
  }, [setCurrentEmail, markAsRead]);

  const handleMarkAsRead = useCallback(() => {
    if (inboxState.currentEmail) {
      markAsRead(inboxState.currentEmail.id);
    }
  }, [inboxState.currentEmail, markAsRead]);

  const handleMarkAsUnread = useCallback(() => {
    if (inboxState.currentEmail) {
      markAsUnread(inboxState.currentEmail.id);
    }
  }, [inboxState.currentEmail, markAsUnread]);

  const handleMarkAsSpam = useCallback(() => {
    if (inboxState.currentEmail) {
      markAsSpam(inboxState.currentEmail.id);
      setCurrentEmail(null);
    }
  }, [inboxState.currentEmail, markAsSpam, setCurrentEmail]);

  const handleCloseDetail = useCallback(() => {
    setCurrentEmail(null);
  }, [setCurrentEmail]);

  const handlePartnerChange = useCallback((partnerId: string) => {
    setCurrentPartner(partnerId);
  }, [setCurrentPartner]);

  const handleFolderChange = useCallback((folder: FolderType) => {
    setCurrentFolder(folder);
    setCurrentEmail(null);
  }, [setCurrentFolder, setCurrentEmail]);

  const handleSendReply = (recipientEmail: string, subject: string, content: string) => {
    const sentEmail: Email = {
      id: `email-sent-${Date.now()}`,
      sender: 'me@mycompany.com',
      receiver: recipientEmail,
      subject: subject,
      snippet: content.substring(0, 100) + (content.length > 100 ? '...' : ''),
      body: content,
      date: new Date().toISOString(),
      isRead: true,
      isSpam: false,
      isSent: true,
      isSelected: false,
    };

    addEmail(sentEmail);

    setCurrentEmail(null);
  };

  // Memoize folder counts - only recalculate when state changes
  const folderCounts = useMemo(() => getFolderCounts(), [inboxState]);

  // Memoize filtered emails - only recalculate when state changes
  const emails = useMemo(() => getEmailsForDisplay(), [inboxState]);

  if (isLoading) {
    return <div className="loading">Loading emails...</div>;
  }

  if (inboxState.currentEmail) {
    return (
      <div className="app-container">
        <div className="app-header">
          <h1>Email Inbox</h1>
          <div className="app-header-actions">
            <button
              className="dark-mode-toggle"
              onClick={toggleDarkMode}
              title={inboxState.isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {inboxState.isDarkMode ? '☀️' : '🌙'}
            </button>
            <PartnerSwitcher
              currentPartner={inboxState.currentPartner}
              onPartnerChange={handlePartnerChange}
            />
          </div>
        </div>
        <div className="app-layout">
          <SideMenu
            currentFolder={inboxState.currentFolder}
            onFolderChange={handleFolderChange}
            emailCounts={folderCounts}
            showSpamFolder={inboxState.partnerConfig?.features.markAsSpamButton ?? true}
          />
          <div className="app-main">
            <EmailDetail
              folder={inboxState.currentFolder}
              email={inboxState.currentEmail}
              onClose={handleCloseDetail}
              onMarkAsRead={handleMarkAsRead}
              onMarkAsUnread={handleMarkAsUnread}
              onMarkAsSpam={handleMarkAsSpam}
              onSendReply={handleSendReply}
              showSpamButton={inboxState.partnerConfig?.features.markAsSpamButton ?? true}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container">
      <div className="app-header">
        <h1>Email Inbox</h1>
        <div className="app-header-actions">
          <button
            className="dark-mode-toggle"
            onClick={toggleDarkMode}
            title={inboxState.isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {inboxState.isDarkMode ? '☀️' : '🌙'}
          </button>
          <PartnerSwitcher
            currentPartner={inboxState.currentPartner}
            onPartnerChange={handlePartnerChange}
          />
        </div>
      </div>
      <div className="app-layout">
        <SideMenu
          currentFolder={inboxState.currentFolder}
          onFolderChange={handleFolderChange}
          emailCounts={folderCounts}
          showSpamFolder={inboxState.partnerConfig?.features.markAsSpamButton ?? true}
        />
        <div className="app-main">
          <SearchBar
            searchQuery={inboxState.searchQuery}
            onSearchChange={setSearchQuery}
          />
          {inboxState.currentFolder !== 'trash' && <BulkActions />}
          <InboxList
            emails={emails}
            onEmailClick={handleEmailClick}
            onToggleSelection={toggleEmailSelection}
            searchQuery={inboxState.searchQuery}
            showPreview={inboxState.partnerConfig?.features.emailPreviewSnippet ?? true}
          />
        </div>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const [initialState, setInitialState] = useState<any>(null);

  useEffect(() => {
    const loadInitialState = async () => {
      const state = await fetchEmails();
      setInitialState(state);
    };
    loadInitialState();
  }, []);

  if (!initialState) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <InboxProvider initialState={initialState}>
      <InboxApp />
    </InboxProvider>
  );
};

export default App;
