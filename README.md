# Techies Academy - Responsive Educational Website

A modern, responsive educational web application built with React, TypeScript, Vite, and Tailwind CSS v4.

## Features

- **Course Catalog**: Filterable courses tailored for Class 4 through Class 10 across Design & AI and Web Development tracks.
- **Detailed Curriculum**: Module-by-module breakdown, weekly topics, and learning outcomes for each course.
- **Registration Center**: Multi-category registration form for academic courses, sports competitions, and cultural events.
- **Payment Portal**: 5-step guided enrollment checkout with coupon codes and multiple payment options (UPI, Net Banking, Card).
- **Authentication**: Dual-role sign-in system for students and academy administrators.
- **Student Portal**: Personal dashboard tracking course progress, attendance, and grades.
- **Admin Management Console**: Overview analytics with full CRUD management for student records.

## Tech Stack

- **Frontend**: React 19, TypeScript
- **Routing**: React Router v8
- **Styling**: Tailwind CSS v4, Google Fonts (Poppins & Inter)
- **Build Tool**: Vite 8

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or pnpm

### Installation

```bash
npm install
```

### Development Server

```bash
npm run dev
```

### Production Build

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

## Deployment on Render

This project is ready to be hosted as a **Static Site** on [Render](https://render.com).

### Option 1: Automatic Blueprint (Recommended)
1. Push this repository to GitHub / GitLab.
2. In Render, select **New +** -> **Blueprint**.
3. Connect your repository. Render will automatically read `render.yaml` and configure the build and rewrite settings.

### Option 2: Manual Setup
If creating a **Static Site** manually on Render:
- **Build Command**: `npm run build`
- **Publish Directory**: `dist`
- **Redirects / Rewrites Rule**:
  - **Source**: `/*`
  - **Destination**: `/index.html`
  - **Action**: `Rewrite` (ensures client-side routing works on page refresh)
