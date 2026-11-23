# AI Interview Planner

An AI-powered web app that turns a job description and your profile into a personalized interview strategy: a match score, likely technical and behavioral questions with answer guidance, skill gaps, a day-by-day preparation roadmap, and an ATS-friendly resume tailored to the role.

[![Architecture diagram](https://gitdiagram.com/darshan-beep/ai-interview-planner/diagram.png)](https://gitdiagram.com/darshan-beep/ai-interview-planner?utm_source=readme&utm_medium=picture)

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [API Reference](#api-reference)
- [How It Works](#how-it-works)
- [Roadmap](#roadmap)
- [Contributing](#contributing)
- [License](#license)
- [Author](#author)

---

## Features

- **Personalized interview plan.** Paste a job description, then upload your resume (PDF) or write a short self-description.
- **Match score.** A 0 to 100 score showing how well your profile fits the role.
- **Technical and behavioral questions.** Each question includes the interviewer's intent and how to approach your answer.
- **Skill gap analysis.** Missing skills are tagged by severity (low, medium, high).
- **Preparation roadmap.** A day-wise plan with a focus area and concrete tasks for each day.
- **Tailored resume generation.** Download an ATS-optimized, job-specific resume as a PDF.
- **Secure authentication.** Register and log in with JWT cookies, bcrypt-hashed passwords, and token blacklisting on logout.
- **Report history.** Revisit all your previously generated interview plans.

## Tech Stack

| Layer | Technologies |
| --- | --- |
| Frontend | React 19, Vite, React Router, Axios, Sass (SCSS) |
| Backend | Node.js, Express 5 |
| Database | MongoDB with Mongoose |
| AI | Google Gemini (`@google/genai`) with structured JSON output validated by Zod |
| Auth | JSON Web Tokens, bcryptjs, cookie-parser |
| File handling | Multer (in-memory uploads), pdf-parse |
| PDF generation | Puppeteer |

## Project Structure

```
ai-interview-planner/
├── backend/
│   ├── server.js                  # Entry point
│   └── src/
│       ├── app.js                 # Express app, CORS, routes
│       ├── config/db.js           # MongoDB connection
│       ├── controller/            # Auth and interview controllers
│       ├── middleware/            # JWT auth, file upload (3 MB limit)
│       ├── models/                # User, InterviewReport, Blacklist
│       ├── routes/                # /api/auth and /api/interview
│       └── services/ai.services.js  # Gemini calls and PDF generation
└── frontend/
    └── src/
        ├── App.jsx
        ├── app.routes.jsx         # Routing with protected routes
        └── features/
            ├── auth/              # Login, register, auth context and hooks
            └── interview/         # Home, report view, context, API service
```

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) 18 or later
- A [MongoDB](https://www.mongodb.com/) database (local or Atlas)
- A [Google Gemini API key](https://aistudio.google.com/app/apikey)
- Google Chrome or Chromium installed (used by Puppeteer to generate PDFs)

### 1. Clone the repository

```bash
git clone https://github.com/darshan-beep/ai-interview-planner.git
cd ai-interview-planner
```

### 2. Set up the backend

```bash
cd backend
npm install
```

Create a `.env` file in `backend/` (see [Environment Variables](#environment-variables)), then start the server:

```bash
npm run dev
```

The API runs on `http://localhost:3000`.

### 3. Set up the frontend

```bash
cd frontend
npm install
npm run dev
```

The app runs on `http://localhost:5173`.

## Environment Variables

Create `backend/.env` with the following:

```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_long_random_secret
GOOGLE_GENAI_API_KEY=your_gemini_api_key
```

> Never commit your `.env` file. Make sure it is listed in `.gitignore`.

## API Reference

All interview routes require authentication (JWT stored in an HTTP cookie).

### Auth: `/api/auth`

| Method | Endpoint | Description |
| --- | --- | --- |
| POST | `/register` | Create a new account |
| POST | `/login` | Log in and receive an auth cookie |
| GET | `/logout` | Log out and blacklist the current token |
| GET | `/get-me` | Get the currently logged-in user |

### Interview: `/api/interview`

| Method | Endpoint | Description |
| --- | --- | --- |
| POST | `/` | Generate a report (multipart form: `resume` PDF, `selfdescription`, `jobdescription`) |
| GET | `/` | List all of your reports (summary view) |
| GET | `/report/:interviewId` | Get one full report |
| POST | `/resume/pdf/:interviewId` | Generate and download a tailored resume PDF |

## How It Works

1. You submit a job description plus your resume (PDF) and/or a self-description.
2. The backend extracts text from the PDF and sends everything to Gemini with a strict Zod-defined JSON schema.
3. The structured response (score, questions, skill gaps, roadmap) is saved to MongoDB and linked to your account.
4. The frontend renders the report with sections for technical questions, behavioral questions, and the roadmap.
5. On request, a second prompt generates a tailored HTML resume, which Puppeteer renders to a downloadable PDF.

## Roadmap

- [ ] DOCX resume parsing
- [ ] Mock interview mode with answer feedback
- [ ] Delete and rename saved reports
- [ ] Production deployment guide (Docker, hosting)
- [ ] Automated tests and CI

## Contributing

Contributions are welcome.

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m "Add your feature"`
4. Push to the branch: `git push origin feature/your-feature`
5. Open a pull request

## License

Distributed under the MIT License.

## Author

**Darshan**
GitHub: [@darshan-beep](https://github.com/darshan-beep)
