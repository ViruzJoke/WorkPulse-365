# Changelog - WorkPulse 365

All notable changes to this project will be documented in this file.
## [1.3.0] - 2026-01-15 (Afternoon Update)

### Added
- **Dashboard Analytics Upgrade**:
    - **Yearly Overview**: New Bar Chart showing Total vs. Completed tasks by month.
    - **Smart Filtering**: Added Monthly Filter to slice data by specific months or "All Time".
    - **Category Breakdown**: Detailed status table showing Open/Done counts per category.
    - **Priority Visualization**: Dynamic Pie Chart updating based on selected month.
- **Automation Center**:
    - **"Run Daily Briefing" Button**: Trigger Google Apps Script / Line Notify directly from the Dashboard.
    - **Web App Integration**: Support for triggering server-side scripts via Web App URL (bypassing CORS issues).
- **Settings & Configuration**:
    - **Dedicated Settings Page**: Configure Automation URLs and Personal Preferences (Default Priority/Category).
    - **Persistent Config**: Settings are saved to `localStorage` for convenience.
    - **Smart Defaults**: Quick Log now pre-fills with your preferred Priority and Category.
- **Developer Experience**:
    - **Stand-alone Automation Script**: Consolidated `AUTOMATION_CODE.js` (Single file) with embedded Firestore library to eliminate dependencies.
    - **Deployment Guide**: Updated docs for Web App deployment and Button integration.

### Fixed
- **App Crash**: Resolved "White Screen" crash caused by `Firestore is already declared` in Google Apps Script.
- **Profile UI**: Cleaned up Profile page by moving technical settings to the new Settings view.

### Added
- **Smart SLAs**: Added dynamic countdown timer (Business Days only) in Timeline to track deadlines based on priority.
- **Smart Categorization**: Implemented 2-level classification (Category > Application) for structured data entry.
- **Offline Persistence**: Enabled IndexDB caching so the app loads instantly and works offline.
- **Enhanced Editing**: Enabled separate "Edit Info" and "Add Update" modes. Added "Facing" & "App" channels, making channel selection mandatory.
- **History Management**: Added ability to delete specific update history entries.
- **Initial Load Optimization**: Limited initial firestore query to 10 items (with "Load All" button) to save quota.
- **Timeline Tabs**: Split timeline into "Ongoing" and "Complete" tabs.
- **Task Completion**: Added ability to mark tasks as "Done" with visual dimming.

### Fixed
- **Tag Saving**: Fixed bug where changing tags without adding a note didn't save.
- **White Screen**: Fixed crash when loading old logs with obsolete categories.

## [1.1.0] - 2026-01-12

### Added
- **Line OA Integration**: Full integration with Line Official Account using Vercel Serverless Function (`api/send-line.js`) to send beautiful Flex Messages.
- **Responsive Design**: Upgraded UI to fully support Desktop (Sidebar + Grid Layout) while keeping Mobile-optimized bottom navigation.
- **Google Authentication**: Replaced Anonymous login with secure Google Sign-In, enabling persistent profiles and syncing across devices.
- **Vercel Deployment Support**: Configured `package.json` and API routes for seamless Vercel deployment.

### Changed
- **Navigation**: Removed "Profile" tab to simplify UI.
- **Architecture**: Switched to `index.html` as the main entry point (copied from portable version).

### [1.0.0] - Earlier Updates
### Added
- **Timeline Filtering & Sorting**:
  - Added filter chips to view logs by Application (MyDHL+, API, etc.).
  - Added sorting toggle: 'Last Updated' vs 'Date Created'.
  - Dynamic grouping based on sort order (e.g., specific dates for 'Updated', months for 'Created').
- **Quick Log Enhancements**:
  - Added `Application` dropdown (API, MyDHL+, DEC, etc.).
  - Added `Target Finish` month picker.
  - Added `Customer` optional text field.
  - Changed `Category` to a dropdown in the initial view.
- **Log Updating Features**:
  - Enable updating `Last Update Date` with a convenient "Today" button.
  - Added `Update Channel` selection (Chat, Phone, Email) with visual indicators (colored dots) on the log card.
- **Project Structure**: Initialized React + Vite project structure manually.
- **Portable Version**: Created `portable_app.html` single-file application for environments without Node.js/NPM access.
- **Design System**: Implemented DHL Branding (Yellow #FFCC00, Red #D40511) using Tailwind CSS.
- **Core Features**:
  - **Header**: Sticky header with DHL styling.
  - **Quick Log**: Collapsible input form for fast logging with categories (Solution, Integration, Support, etc.).
  - **Timeline**: Chronological list of logs grouped by month.
  - **Dashboard**: Visual analytics using `recharts` (Bar chart for monthly volume, Pie chart for category mix).
  - **Navigation**: Mobile-first bottom navigation bar.
- **Database Integration**:
  - configured `src/firebase.js` and inline auth/firestore logic.
  - Implemented `signInAnonymously` for immediate access.
  - Real-time data syncing using Firestore `onSnapshot`.
- **Edit Functionality**: Added ability to edit existing logs (Title, Impact) with inline edit mode in `Timeline` and `App` logic.

### Configured
- **Firebase**: Updated configuration with active project keys for production use.

### Fixed
- **Environment**: Handled missing `npm`/`node` environment by generating a standalone HTML version.
