import type { Email, InboxState, EmailId, EmailUpdate, EmailFilters } from '../types';

// Inbox state management utilities
export class InboxStateManager {
  static bulkUpdateEmails(
    state: InboxState, 
    emailIds: EmailId[], 
    updates: EmailUpdate
  ): InboxState {
    const updatedEmails = { ...state.emails };
    
    emailIds.forEach(emailId => {
      if (updatedEmails[emailId]) {
        updatedEmails[emailId] = { ...updatedEmails[emailId], ...updates };
      }
    });

    return {
      ...state,
      emails: updatedEmails
    };
  }

  static deleteEmails(state: InboxState, emailIds: EmailId[]): InboxState {
    const updatedEmails = { ...state.emails };
    const remainingEmailIds: string[] = [];

    // Permanently delete emails from the emails object
    emailIds.forEach(emailId => {
      delete updatedEmails[emailId];
    });

    // Update emailIds array to remove deleted email IDs
    state.emailIds.forEach(id => {
      if (!emailIds.includes(id)) {
        remainingEmailIds.push(id);
      }
    });

    const updatedSelected = state.selectedEmails.filter(id => !emailIds.includes(id));
    const updatedFiltered = state.filteredEmailIds.filter(id => !emailIds.includes(id));

    return {
      ...state,
      emails: updatedEmails,
      emailIds: remainingEmailIds,
      filteredEmailIds: updatedFiltered,
      selectedEmails: updatedSelected,
      currentEmail: state.currentEmail && emailIds.includes(state.currentEmail.id) ? null : state.currentEmail,
      isSelectAllActive: updatedFiltered.length === 0 ? false : state.isSelectAllActive,
    };
  }

  static toggleEmailSelection(state: InboxState, emailId: EmailId): InboxState {
    const email = state.emails[emailId];
    if (!email) return state;
    
    //O(1)
    const isCurrentlySelected = email.isSelected;
    
    const selectedEmails = isCurrentlySelected
      ? state.selectedEmails.filter(id => id !== emailId) // Deselect: remove from array
      : [...state.selectedEmails, emailId]; // Select: add to array

    return {
      ...state,
      selectedEmails,
      emails: {
        ...state.emails,
        [emailId]: { ...email, isSelected: !isCurrentlySelected }
      }
    };
  }

  static selectAllEmails(state: InboxState): InboxState {
    const emailIds = state.filteredEmailIds.length > 0 ? state.filteredEmailIds : state.emailIds;
    const updatedEmails = { ...state.emails };
    
    emailIds.forEach(emailId => {
      updatedEmails[emailId] = { ...updatedEmails[emailId], isSelected: true };
    });

    return {
      ...state,
      selectedEmails: emailIds,
      emails: updatedEmails
    };
  }

  static clearAllSelections(state: InboxState): InboxState {
    const updatedEmails = { ...state.emails };
    
    Object.keys(updatedEmails).forEach(emailId => {
      if (updatedEmails[emailId].isSelected) {
        updatedEmails[emailId] = { ...updatedEmails[emailId], isSelected: false };
      }
    });

    return {
      ...state,
      selectedEmails: [],
      emails: updatedEmails
    };
  }

  // Filter emails based on search query - O(n) operation
  // on top of folder-filtered emails
  static filterEmails(state: InboxState, filters: EmailFilters): InboxState {
    const baseEmailIds = state.filteredEmailIds.length > 0 ? state.filteredEmailIds : state.emailIds;
    
    const filteredIds = baseEmailIds.filter(emailId => {
      const email = state.emails[emailId];
      
      if (!email) return false;
      
      if (filters.searchQuery && filters.searchQuery.trim()) {
        const query = filters.searchQuery.toLowerCase();
        const senderMatch = email.sender.toLowerCase().includes(query);
        const subjectMatch = email.subject.toLowerCase().includes(query);
        
        if (!senderMatch && !subjectMatch) {
          return false;
        }
      }

      if (filters.isRead !== undefined && email.isRead !== filters.isRead) {
        return false;
      }

      // Spam status filter
      if (filters.isSpam !== undefined && email.isSpam !== filters.isSpam) {
        return false;
      }

      // Sender filter
      if (filters.sender && !email.sender.toLowerCase().includes(filters.sender.toLowerCase())) {
        return false;
      }

      return true;
    });

    return {
      ...state,
      filteredEmailIds: filteredIds
    };
  }

  static getEmailsForDisplay(state: InboxState): Email[] {
    return state.filteredEmailIds.map(emailId => state.emails[emailId]).filter(Boolean);
  }

  static getSelectedEmails(state: InboxState): Email[] {
    return state.selectedEmails.map(emailId => state.emails[emailId]).filter(Boolean);
  }

  static filterEmailsByFolder(state: InboxState): InboxState {
    const { currentFolder, emailIds, emails } = state;
    
    let filteredIds: string[];
    
    switch (currentFolder) {
      case 'inbox':
        filteredIds = emailIds.filter(id => {
          const email = emails[id];
          return email && !email.isSpam && !email.isSent;
        });
        break;
      
      case 'sent':
        filteredIds = emailIds.filter(id => {
          const email = emails[id];
          return email && email.isSent;
        });
        break;
      
      case 'spam':
        filteredIds = emailIds.filter(id => {
          const email = emails[id];
          return email && email.isSpam;
        });
        break;
      
      case 'trash':
        // Trash folder is now empty since emails are permanently deleted
        filteredIds = [];
        break;
      
      default:
        filteredIds = emailIds;
    }
    
    return {
      ...state,
      filteredEmailIds: filteredIds
    };
  }

  // Get folder counts - O(n) operation
  static getFolderCounts(state: InboxState): {
    inbox: number;
    sent: number;
    spam: number;
    trash: number;
  } {
    const emails = Object.values(state.emails);
    
    return {
      inbox: emails.filter(email => !email.isSpam && !email.isSent).length,
      sent: emails.filter(email => email.isSent).length,
      spam: emails.filter(email => email.isSpam).length,
      trash: 0 // Trash is always empty since emails are permanently deleted
    };
  }
}
