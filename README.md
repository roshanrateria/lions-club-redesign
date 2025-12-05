# Lions Club IEM - Community Platform

A comprehensive web application for the Lions Club of Kolkata IEM, featuring a public-facing community portal and a robust admin dashboard for managing content, donations, and social media publications.

## Features

### Public Portal
- **Home Page**: Showcases club activities, mission, and milestones.
- **Events & Posts**: Gallery and details of past and upcoming events.
- **Donations**: Secure donation processing with proof submission.

### Admin Dashboard
- **Secure Authentication**: Protected admin area.
- **Content Management**: Create, edit, and delete posts/events with image uploads.
- **Donation Management**: View and approve/reject donation submissions.
- **Social Media Integration**: Manage social media publication links and images.
- **Password Management**: Securely update admin credentials.

## Technology Stack

- **Frontend**: React, TypeScript, Vite, Tailwind CSS, Shadcn UI
- **Backend**: Node.js, Express
- **Database**: PostgreSQL (via Neon / Drizzle ORM)
- **Deployment**: Replit (Compatible)

## Setup & specific instructions

1.  **Install Dependencies**:
    ```bash
    npm install
    ```

2.  **Database Setup**:
    Ensure your database credentials are correctly set in the environment variables (or `.env` file).
    ```bash
    npm run db:push
    ```

3.  **Seed Database** (Optional, for initial admin user):
    ```bash
    npm run db:seed
    ```
    *Default Admin Credentials:* `admin` / `admin123`

4.  **Run Development Server**:
    ```bash
    npm run dev
    ```

## Project Structure

- `client/`: React frontend application.
- `server/`: Express backend server.
- `shared/`: Shared TypeScript schemas and types (Drizzle/Zod).
