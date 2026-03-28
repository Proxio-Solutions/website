# Proxio Solutions — Website

Institutional website for **Proxio Solutions**, available at [proxiosolutions.com](https://proxiosolutions.com).

Built with React 19, TypeScript and Vite, with internationalization (i18n) support, client-side routing and static deployment via GitHub Pages.

---

## Table of Contents

- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Local Development](#local-development)
- [Available Scripts](#available-scripts)
- [Project Structure](#project-structure)
- [Deploy](#deploy)
- [Contributing](#contributing)

---

## Tech Stack

| Layer      | Technology              |
| ---------- | ----------------------- |
| Framework  | React 19                |
| Language   | TypeScript 5.9          |
| Build Tool | Vite 8                  |
| Styles     | Tailwind CSS 4          |
| Routing    | React Router DOM 7      |
| i18n       | i18next + react-i18next |
| Icons      | Lucide React            |
| Email      | EmailJS                 |
| Linting    | ESLint 9 + Prettier     |

---

## Prerequisites

- **Node.js** >= 20 ([download](https://nodejs.org))
- **npm** >= 10 (included with Node.js)
- Access to the required environment variables (see below)

---

## Installation

```bash
# 1. Clone the repository
git clone https://github.com/proxio-solutions/website.git
cd website

# 2. Install dependencies
npm install
```

---

## Environment Variables

Create a `.env` file in the project root based on `.env.example`:

```bash
cp .env.example .env
```

| Variable                   | Description             | Required |
| -------------------------- | ----------------------- | -------- |
| `VITE_EMAILJS_SERVICE_ID`  | EmailJS service ID      | Yes      |
| `VITE_EMAILJS_TEMPLATE_ID` | EmailJS template ID     | Yes      |
| `VITE_EMAILJS_PUBLIC_KEY`  | EmailJS public key      | Yes      |

> Variables prefixed with `VITE_` are exposed to the client. Never place secrets without this prefix in Vite environment variables.

---

## Local Development

```bash
npm run dev
```

The development server will be available at `http://localhost:5173` with Hot Module Replacement (HMR) enabled.

---

## Available Scripts

| Command           | Description                                        |
| ----------------- | -------------------------------------------------- |
| `npm run dev`     | Starts the development server                      |
| `npm run build`   | Compiles TypeScript and generates the production bundle |
| `npm run preview` | Serves the production bundle locally               |
| `npm run lint`    | Runs ESLint across all files                       |

---

## Project Structure

```
website/
├── public/             # Static files (favicon, og images, etc.)
├── src/
│   ├── assets/         # Images, fonts and other assets
│   ├── components/     # Reusable components (Navbar, Footer, SEO…)
│   ├── config/         # Global configuration
│   ├── hooks/          # Custom React hooks
│   ├── i18n/           # Translation files (PT, EN, …)
│   ├── pages/          # Application pages
│   │   ├── Home.tsx
│   │   ├── About.tsx
│   │   ├── Services.tsx
│   │   ├── Projects.tsx
│   │   ├── Contact.tsx
│   │   ├── CaseStudyUrbi.tsx
│   │   ├── PrivacyPolicy.tsx
│   │   └── NotFound.tsx
│   ├── services/       # External service integrations (EmailJS, etc.)
│   ├── App.tsx         # Root component and route configuration
│   ├── main.tsx        # Application entry point
│   └── index.css       # Global styles (Tailwind base)
├── .env.example        # Environment variables template
├── CNAME               # Custom domain (GitHub Pages)
├── eslint.config.js    # ESLint configuration
├── vite.config.ts      # Vite configuration
├── tsconfig.json       # Base TypeScript configuration
└── package.json
```

---

## Deploy

The site is automatically published via **GitHub Pages** from the `main` branch.

The production bundle is generated with:

```bash
npm run build
```

The generated files are placed in the `dist/` folder and served as a static site. The `CNAME` file defines the custom domain `proxiosolutions.com`.

---

## Contributing

1. Create a branch from `dev`: `git checkout -b feature/feature-name`
2. Commit your changes with clear and descriptive messages
3. Open a Pull Request for review before merging

---
