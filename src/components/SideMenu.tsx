import React from 'react';
import type { FolderType } from '../types';

interface SideMenuProps {
  currentFolder: FolderType;
  onFolderChange: (folder: FolderType) => void;
  emailCounts: {
    inbox: number;
    sent: number;
    spam: number;
    trash: number;
  };
  showSpamFolder?: boolean;
}

// Memoize to prevent re-renders when parent re-renders but props haven't changed
export const SideMenu: React.FC<SideMenuProps> = React.memo(({ 
  currentFolder, 
  onFolderChange,
  emailCounts,
  showSpamFolder = true
}) => {
  const allMenuItems: Array<{ 
    folder: FolderType; 
    label: string; 
    icon: string;
    count: number;
  }> = [
    { folder: 'inbox', label: 'Inbox', icon: '📥', count: emailCounts.inbox },
    { folder: 'sent', label: 'Sent', icon: '📤', count: emailCounts.sent },
    { folder: 'spam', label: 'Spam', icon: '🚫', count: emailCounts.spam },
    // { folder: 'trash', label: 'Trash', icon: '🗑️', count: emailCounts.trash },
  ];

  // Filter out spam folder if partner doesn't support spam features
  const menuItems = showSpamFolder 
    ? allMenuItems 
    : allMenuItems.filter(item => item.folder !== 'spam');

  return (
    <aside className="side-menu">
      <nav className="side-menu-nav">
        <ul className="side-menu-list">
          {menuItems.map(({ folder, label, icon, count }) => (
            <li key={folder} className="side-menu-item">
              <button
                className={`side-menu-button ${currentFolder === folder ? 'active' : ''}`}
                onClick={() => onFolderChange(folder)}
              >
                <span className="side-menu-icon">{icon}</span>
                <span className="side-menu-label">{label}</span>
                {count > 0 && (
                  <span className="side-menu-count">{count}</span>
                )}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
});

SideMenu.displayName = 'SideMenu';

