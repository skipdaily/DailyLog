# Construction Daily Log Application

A web application for tracking and managing construction daily logs. Built with Next.js, Tailwind CSS, Supabase, and ChatGPT integration.

## Features

- Create and manage daily construction logs
- Track subcontractors and crews
- Document work performed, delays, meetings, and action items
- Export logs to PDF
- AI assistant for analyzing log data and answering questions
- User-friendly dashboard interface

## Tech Stack

- **Frontend**: Next.js, React, TypeScript, Tailwind CSS
- **Backend**: Supabase (Database, Authentication)
- **AI Integration**: OpenAI ChatGPT
- **Deployment**: Vercel

## Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Set up environment variables in `.env.local`
4. Run development server: `npm run dev`

## Environment Variables

Create a `.env.local` file with the following variables:

```
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
OPENAI_API_KEY=your-openai-api-key
```

## Deployment

This project is set up to be deployed on Vercel with Supabase for the database.
