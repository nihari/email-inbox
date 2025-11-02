import type { Email, InboxState } from '../types';

// Mock email data
const generateMockEmails = (): Email[] => {
  return [
    {
      id: 'email-1',
      sender: 'john.doe@example.com',
      subject: 'Welcome to our platform',
      snippet: 'Thank you for joining us. We are excited to have you on board...',
      body: 'Hi there,\n\nThank you for joining our platform. We are excited to have you on board and look forward to helping you succeed.\n\nBest regards,\nTeam',
      date: '2024-10-27T10:00:00Z',
      isRead: false,
      isSpam: false,
      isSent: false,
      isSelected: false,
    },
    {
      id: 'email-2',
      sender: 'sarah.smith@company.com',
      subject: 'Meeting scheduled for tomorrow',
      snippet: 'Just a reminder about our meeting scheduled for tomorrow at 2 PM...',
      body: 'Hi,\n\nJust a reminder about our meeting scheduled for tomorrow at 2 PM in the conference room.\n\nLooking forward to discussing the project updates.\n\nBest,\nSarah',
      date: '2024-10-26T15:30:00Z',
      isRead: true,
      isSpam: false,
      isSent: false,
      isSelected: false,
    },
    {
      id: 'email-3',
      sender: 'noreply@spamsite.com',
      subject: 'You won a million dollars!',
      snippet: 'Congratulations! You have won a million dollars. Click here to claim...',
      body: 'Congratulations!\n\nYou have been selected as the winner of our grand prize. Click here to claim your million dollars now!\n\nLimited time offer!',
      date: '2024-10-27T09:15:00Z',
      isRead: false,
      isSpam: true,
      isSent: false,
      isSelected: false,
    },
    {
      id: 'email-4',
      sender: 'alex.williams@design.com',
      subject: 'Design mockups ready for review',
      snippet: 'I have prepared the design mockups for the new feature. Please review...',
      body: 'Hi,\n\nI have prepared the design mockups for the new feature. Please review them and share your feedback.\n\nYou can access them here: [link]\n\nLooking forward to your thoughts.\n\nThanks,\nAlex',
      date: '2024-10-25T14:20:00Z',
      isRead: true,
      isSpam: false,
      isSent: false,
      isSelected: false,
    },
    {
      id: 'email-5',
      sender: 'notification@system.com',
      subject: 'System maintenance scheduled',
      snippet: 'We will perform system maintenance on Sunday night from 12 AM to 4 AM...',
      body: 'Dear User,\n\nWe will perform system maintenance on Sunday night from 12 AM to 4 AM. During this time, the system will be unavailable.\n\nPlease save your work before then.\n\nThank you for your understanding.\n\nSystem Team',
      date: '2024-10-24T11:00:00Z',
      isRead: true,
      isSpam: false,
      isSent: false,
      isSelected: false,
    },
    {
      id: 'email-6',
      sender: 'maria.garcia@support.com',
      subject: 'Re: Your support ticket #1234',
      snippet: 'We have reviewed your ticket and have a solution for you...',
      body: 'Hi,\n\nThank you for contacting support. We have reviewed your ticket #1234 and have a solution for you.\n\nPlease try the following steps:\n1. Clear your browser cache\n2. Log out and log back in\n\nIf the issue persists, please let us know.\n\nBest regards,\nMaria\nSupport Team',
      date: '2024-10-23T16:45:00Z',
      isRead: false,
      isSpam: false,
      isSent: false,
      isSelected: false,
    },
    {
      id: 'email-7',
      sender: 'winner@lottery.com',
      subject: 'Claim your prize now!',
      snippet: 'You have won the lottery! Click here to claim your prize immediately...',
      body: 'Congratulations!\n\nYou have won the lottery! Click here to claim your prize immediately before it expires.\n\nDon\'t miss this opportunity!',
      date: '2024-10-27T08:00:00Z',
      isRead: false,
      isSpam: true,
      isSent: false,
      isSelected: false,
    },
    {
      id: 'email-8',
      sender: 'mark.johnson@tech.com',
      subject: 'New product launch',
      snippet: 'We are excited to announce the launch of our new product...',
      body: 'Hi Team,\n\nWe are excited to announce the launch of our new product. It comes with amazing features and will revolutionize the industry.\n\nJoin us for the launch event next week.\n\nBest regards,\nMark\nProduct Team',
      date: '2024-10-22T13:30:00Z',
      isRead: true,
      isSpam: false,
      isSent: false,
      isSelected: false,
    },
    {
      id: 'email-9',
      sender: 'lisa.anderson@hr.com',
      subject: 'Employee survey results',
      snippet: 'Thank you for participating in our employee survey. Here are the results...',
      body: 'Dear Employee,\n\nThank you for participating in our employee survey. Here are the results and insights gathered.\n\nWe appreciate your feedback and will use it to make improvements.\n\nBest regards,\nLisa\nHR Team',
      date: '2024-10-21T10:15:00Z',
      isRead: true,
      isSpam: false,
      isSent: false,
      isSelected: false,
    },
    {
      id: 'email-10',
      sender: 'info@newsletter.com',
      subject: 'Weekly newsletter - Week 42',
      snippet: 'This week\'s highlights: new features, tips, and updates...',
      body: 'Hi Subscriber,\n\nThis week\'s highlights:\n- New features released\n- Tips and tricks section\n- Important updates\n- Community highlights\n\nRead more: [link]\n\nStay tuned for more!\nNewsletter Team',
      date: '2024-10-20T09:00:00Z',
      isRead: false,
      isSpam: false,
      isSent: false,
      isSelected: false,
    },
    // Sent emails
    {
      id: 'email-sent-1',
      sender: 'me@mycompany.com',
      receiver: 'lisa.anderson@hr.com',
      subject: 'Re: Project proposal',
      snippet: 'Thank you for the proposal. I have reviewed it and have some feedback...',
      body: 'Hi,\n\nThank you for the proposal. I have reviewed it and have some feedback that I think will make it even better.\n\nLet\'s schedule a call to discuss.\n\nBest regards',
      date: '2024-10-26T11:00:00Z',
      isRead: true,
      isSpam: false,
      isSent: true,
      isSelected: false,
    },
    {
      id: 'email-sent-2',
      sender: 'me@mycompany.com',
      receiver: 'mark.johnson@tech.com',
      subject: 'Follow-up on meeting',
      snippet: 'Following up on our meeting yesterday. Here are the action items...',
      body: 'Hi Team,\n\nFollowing up on our meeting yesterday. Here are the action items:\n\n1. Complete design review\n2. Update documentation\n3. Schedule next meeting\n\nLet me know if you have questions.\n\nThanks',
      date: '2024-10-25T16:30:00Z',
      isRead: true,
      isSpam: false,
      isSent: true,
      isSelected: false,
    },
  ];
};

// Convert array to normalized state format
export const createInitialInboxState = (): InboxState => {
  const emails = generateMockEmails();
  const emailIds = emails.map(email => email.id);
  const emailsRecord = emails.reduce((acc, email) => {
    acc[email.id] = email;
    return acc;
  }, {} as Record<string, Email>);

  return {
    emails: emailsRecord,
    selectedEmails: [],
    currentEmail: null,
    searchQuery: '',
    currentPartner: 'partnerA',
    partnerConfig: null,
    currentFolder: 'inbox',
    isSelectAllActive: false,
    isDarkMode: false, // Default to light mode
    emailIds: emailIds,
    filteredEmailIds: emailIds.filter(id => {
      const email = emailsRecord[id];
      return !email.isSpam && !email.isSent; // Default to inbox
    }),
  };
};

// Simulate API call delay
export const fetchEmails = async (): Promise<InboxState> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(createInitialInboxState());
    }, 500);
  });
};

