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

## Testing

```bash
# Run linter
npm run lint

# Type checking
npm run type-check
```

## Design Patterns Used

1. **Context API**: Global state management
2. **Custom Hooks**: Reusable business logic
3. **Normalized State**: Optimized data structure
4. **Separation of Concerns**: UI, logic, and data separated
5. **Type Safety**: Comprehensive TypeScript typing
6. **Constants Enum Pattern**: Type-safe enums for selections
