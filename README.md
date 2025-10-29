# Email Inbox UI - React + TypeScript

A simplified email inbox application built with React and TypeScript, featuring partner-level feature toggles and theme customization.

## Features

### Core Functionality
- 📧 **Inbox List**: Display emails with sender, subject, date, and preview snippet
- ☑️ **Checkbox Selection**: Select individual or multiple emails
- 📊 **Read/Unread States**: Visual distinction between read and unread emails
- 🔍 **Search & Filter**: Search emails by sender, subject
- 🗑️ **Bin/Trash**: Deleted emails are moved to bin instead of being permanently deleted
- 📝 **Email Detail View**: Click any email to view full content
- 💬 **Reply Button**: Opens reply interface (no-op as per requirements)
- 🎨 **Partner-Based Theming**: Different color themes for different partners

### Bulk Actions
- Mark as Read / Unread
- Mark as Spam / Not Spam
- Delete emails (moves to bin)

### Partner Configuration
- **Partner A**: Blue theme, email preview enabled, mark as spam disabled, bulk actions enabled
- **Partner B**: Green theme, email preview disabled, mark as spam enabled, bulk actions disabled
- Each partner has customizable feature toggles and themes
- Partner types are validated against a registry (enterprise, small-business, individual, etc.)

## Technical Architecture

### Project Structure
```
src/
├── components/          # React components
│   ├── InboxList.tsx
│   ├── SearchBar.tsx
│   ├── BulkActions.tsx
│   ├── EmailDetail.tsx
│   └── PartnerSwitcher.tsx
├── context/             # React Context API
│   └── InboxContext.tsx # Global state management
├── hooks/               # Custom hooks
│   └── useInboxOperations.ts
├── services/            # API services
│   └── emailService.ts  # Mock email data
├── utils/               # Utility functions
│   ├── inboxStateManager.ts  # State management utilities
│   ├── themeManager.ts       # Theme loading and application
│   └── partnerManager.ts     # Partner config and validation
├── types/               # TypeScript types
│   └── index.ts
└── config/              # Configuration files
    ├── partnerA.json
    ├── partnerB.json
    ├── partner-types.json     # Registry of valid partner types
    └── themes/
        ├── blue-theme.json
        ├── green-theme.json
        └── purple-theme.json
```

### Key Design Decisions

#### 1. Normalized State Structure
- **Problem**: Traditional array-based state leads to O(n) lookups
- **Solution**: Use `Record<string, Email>` for O(1) email access
- **Benefits**: Fast updates, efficient bulk operations, scalable to thousands of emails

#### 2. Global State Management
- **Approach**: React Context API for global inbox state
- **Benefits**: No prop drilling, centralized state, easy to access from any component
- **Implementation**: InboxContext provides state and operations to all components

#### 3. Bin for Deletions
- **Design**: Deleted emails are moved to `bin` instead of permanent deletion
- **Benefits**: Users can recover deleted emails, follows Gmail-like pattern
- **State Structure**: Separate `bin` and `binIds` arrays in InboxState

#### 4. Modular Configuration System
- **Separation**: Partner configs, themes, and partner types are completely independent
- **Benefit**: Easy to add new partners, themes, or modify configurations
- **Scalability**: Can add unlimited partners without touching theme files

#### 5. Unified Bulk Operations
- **Design**: Single function handles both single and multiple email operations
- **Signature**: `(emailIds: string | string[])` - accepts single ID or array
- **Benefit**: Less code duplication, consistent behavior

#### 6. Type-Safe Selection Management
- **Approach**: Constant object with union type for SelectionType
- **Pattern**: `SelectionType.SELECT_ALL` and `SelectionType.DESELECT_ALL`
- **Benefit**: Compile-time safety, autocomplete support

## How to Run

### Prerequisites
- Node.js 20+ (LTS recommended)
- npm or yarn

### Installation & Running

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

The application will be available at `http://localhost:5173`

## Configuration System

### Partner Configuration
Each partner has a configuration file (`partnerA.json`, `partnerB.json`) containing:
- `partnerId`: Unique identifier
- `partnerName`: Display name
- `partnerType`: Category (validated against partner-types.json)
- `themeId`: Reference to theme configuration
- `features`: Feature toggles
  - `emailPreviewSnippet`: Show/hide email preview text
  - `markAsSpamButton`: Enable/disable spam features and spam folder
  - `bulkActionsToolbar`: Enable/disable bulk action buttons (read/unread/delete)
  - `searchFilter`: Enable/disable search functionality
  - `replyFunctionality`: Enable/disable reply feature

### Theme Configuration
Themes are stored in `/src/config/themes/` and contain:
- Color palette (primary, secondary, background, text, etc.)
- Typography settings (font family, sizes)
- Spacing system (xs, sm, md, lg, xl)
- Branding elements (logo color, font size, weight)

### Adding New Partners
1. Create a new JSON file in `/src/config/` with unique `partnerId`
2. Choose a valid `partnerType` from `partner-types.json`
3. Reference an existing theme via `themeId`
4. Configure feature toggles in `features` object
5. The UI will automatically load and validate the new partner

### Adding New Themes
1. Create a new JSON file in `/src/config/themes/`
2. Define all required theme properties (colors, typography, spacing, branding)
3. Partners can immediately use the new theme via `themeId`

### Adding New Partner Types
1. Add entry to `/src/config/partner-types.json` with `typeId`, `typeName`, and `description`
2. Partner configs will be validated against this registry on load

## Usage Examples

### Accessing Global State
```typescript
import { useInbox } from './context/InboxContext';

function MyComponent() {
  const { inboxState, bulkUpdateEmails, setCurrentFolder } = useInbox();
  
  // Access current state
  const currentFolder = inboxState.currentFolder;
  const selectedCount = inboxState.selectedEmails.length;
  
  // Update emails
  bulkUpdateEmails(['email-1', 'email-2'], { isRead: true });
}
```

### Using Inbox Operations
```typescript
import { useInboxOperations } from './hooks/useInboxOperations';

function MyComponent() {
  const { markAsRead, deleteEmails } = useInboxOperations();
  
  // Mark single email as read
  markAsRead('email-123');
  
  // Mark multiple emails as read
  markAsRead(['email-1', 'email-2', 'email-3']);
  
  // Delete single or multiple emails
  deleteEmails(['email-1', 'email-2']);
}
```

## Trade-offs & Future Improvements

### Current Limitations
1. **No Real Backend**: All data is mocked in-memory
2. **Basic Theming**: Static CSS variables, no dynamic theme switching yet
3. **No Persistence**: State resets on page refresh
4. **Partner Switching**: UI implemented but not fully functional

### Recommended Improvements
1. **Backend Integration**: Connect to real email API
2. **Persistence**: Add localStorage or backend persistence
3. **Dynamic Theme Switching**: Implement runtime theme changes
4. **Advanced Search**: Add filters for date range, read status, etc.
5. **Email Composition**: Full compose/reply functionality
6. **WebSocket Updates**: Real-time email notifications
7. **Pagination**: Virtual scrolling for large email lists
8. **Email Attachments**: Support file attachments
9. **Rich Text Emails**: Support HTML email rendering
10. **Accessibility**: Add ARIA labels and keyboard navigation

## Testing

```bash
# Run linter
npm run lint

# Type checking
npm run type-check
```

## File Organization Rationale

- **components/**: Reusable UI components
- **context/**: Global state management
- **hooks/**: Custom React hooks for business logic
- **services/**: API and data services
- **utils/**: Pure utility functions
- **types/**: TypeScript type definitions
- **config/**: Static configuration files

## Design Patterns Used

1. **Context API**: Global state management
2. **Custom Hooks**: Reusable business logic
3. **Normalized State**: Optimized data structure
4. **Separation of Concerns**: UI, logic, and data separated
5. **Type Safety**: Comprehensive TypeScript typing
6. **Constants Enum Pattern**: Type-safe enums for selections

## License

MIT
