export interface PartnerTypesRegistry {
  partnerTypes: Array<{
    typeId: string;
    typeName: string;
    description: string;
  }>;
}

export interface ThemeConfig {
  themeId: string;
  themeName: string;
  colors: {
    primary: string;
    secondary: string;
    background: string;
    surface: string;
    text: string;
    textSecondary: string;
    border: string;
    accent: string;
    success: string;
    warning: string;
    error: string;
  };
  typography: {
    fontFamily: string;
    fontSize: {
      small: string;
      medium: string;
      large: string;
      xl: string;
    };
  };
  spacing: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
  branding: {
    logoColor: string;
    logoFontSize: string;
    logoFontWeight: string;
  };
}

export interface PartnerConfig {
  partnerId: string;
  partnerName: string;
  partnerType: string;
  themeId: string;
  features: {
    emailPreviewSnippet: boolean;
    markAsSpamButton: boolean;
    bulkActionsToolbar: boolean;
    searchFilter: boolean;
    replyFunctionality: boolean;
  };
}

export type FolderType = 'inbox' | 'sent' | 'spam' | 'trash';

export interface Email {
  id: string;
  sender: string;
  receiver?: string
  subject: string;
  snippet: string;
  body: string;
  date: string;
  isRead: boolean;
  isSpam: boolean;
  isSent: boolean;
  isSelected: boolean;
}

export interface InboxState {
  emails: Record<string, Email>;
  selectedEmails: string[];
  currentEmail: Email | null;
  searchQuery: string;
  currentPartner: string;
  partnerConfig: PartnerConfig | null;
  currentFolder: FolderType;
  isSelectAllActive: boolean;
  isDarkMode: boolean;
  emailIds: string[];
  filteredEmailIds: string[];
  bin: Record<string, Email>;
  binIds: string[];
}

export type EmailId = string;
export type EmailUpdate = Partial<Omit<Email, 'id'>>;

export interface EmailFilters {
  searchQuery?: string;
  isRead?: boolean;
  isSpam?: boolean;
  sender?: string;
  dateRange?: {
    start: string;
    end: string;
  };
}
