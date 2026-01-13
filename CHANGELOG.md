# Changelog - WorkPulse 365

All notable changes to this project will be documented in this file.

## [1.1.0] - 2026-01-12

### Added
- **Line OA Integration**: Full integration with Line Official Account using Vercel Serverless Function (`api/send-line.js`) to send beautiful Flex Messages.
- **Responsive Design**: Upgraded UI to fully support Desktop (Sidebar + Grid Layout) while keeping Mobile-optimized bottom navigation.
- **Google Authentication**: Replaced Anonymous login with secure Google Sign-In, enabling persistent profiles and syncing across devices.
- **Task Completion Status**: Added checkmark button to toggle "Done" status. Completed tasks are highlighted green and dim.
- **Timeline Tabs**: Split timeline into "Ongoing" and "Complete" tabs for better organization.
- **Home Dashboard Logic**: Automatically hides "Done" tasks from the "Upcoming & Critical" view.
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
