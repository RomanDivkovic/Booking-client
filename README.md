# FamCal

FamCal is a collaborative calendar app designed for families and households. Share events, assign tasks, and keep everyone in sync—on desktop and mobile, in real time.

## Features

- **Group-based calendar sharing**: Create or join a group to share events and tasks with your household or family.
- **Real-time updates**: All changes are instantly synced across all devices using Supabase.
- **Event & task management**: Add, edit, and delete events or tasks. Assign responsibilities to group members.
- **Invitations**: Invite others to your group by email.
- **Responsive design**: Works seamlessly on desktop, tablet, and mobile.
- **Modern UI**: Built with shadcn-ui and Tailwind CSS for a clean, accessible experience.
- **Authentication**: Secure login and group access.
- **Profile & stats**: View household stats and manage your profile.

## Tech Stack

- [React](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vitejs.dev/) (build tool)
- [Supabase](https://supabase.com/) (database, auth, real-time)
- [Tailwind CSS](https://tailwindcss.com/) (utility-first styling)
- [shadcn-ui](https://ui.shadcn.com/) (UI components)
- [React Query](https://tanstack.com/query/latest) (data fetching/caching)
- [Jest](https://jestjs.io/) (testing)
- [ESLint](https://eslint.org/) + [Prettier](https://prettier.io/) (code quality)

## Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- npm (v9+ recommended)

### Setup

```sh
# 1. Clone the repository
 git clone <YOUR_GIT_URL>
 cd <YOUR_PROJECT_NAME>

# 2. Install dependencies
 npm install

# 3. Set up environment variables
# Copy .env.example to .env and fill in your Supabase credentials
 cp .env.example .env

# 4. Start the development server
 npm run dev
```

The app will be available at [http://localhost:5173](http://localhost:5173) by default.

### Linting & Formatting
- Run `npm run lint` to check for code issues.
- Run `npm run lint:fix` to auto-fix lint errors.
- Run `npm run format` to format code with Prettier.

### Testing
- Run `npm test` to execute tests with Jest.

## Deployment

You can deploy FamCaly to any platform that supports Node.js. For production builds:

```sh
npm run build
npm run preview
```

If using Supabase, make sure your environment variables are set for production.

## Project Structure

- `src/` — Main source code
  - `components/` — UI and feature components
  - `pages/` — App pages (Calendar, Todos, Auth, etc.)
  - `hooks/` — Custom React hooks
  - `contexts/` — React context providers
  - `integrations/` — Supabase client and types
  - `lib/` — Utilities

## Support & Feedback

- For questions or help, see the [FAQ](/faq) or [About](/about) pages in the app.
- Contact: [support@famcaly.com](mailto:support@famcaly.com)

---

© 2025 FamCal. All rights reserved.
