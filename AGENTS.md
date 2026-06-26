# Pizzeria instructions for Codex

## Project

This is a pizza delivery web application.

Repository: Zvereck20/pizzeria

## Stack

Client:

- React
- TypeScript
- Vite
- Redux Toolkit
- RTK Query
- SCSS

Admin:

- React
- TypeScript
- MUI

Server:

- Node.js
- Express
- MongoDB / Mongoose
- Joi
- Multer
- express-session
- connect-mongo

Infrastructure:

- Docker
- docker-compose
- MongoDB container

## General rules

- Do not install dependencies locally.
- Use Docker containers for dependency installation and running commands.
- Prefer interface over type in TypeScript.
- Keep code simple.
- Do not add new libraries unless explicitly requested.
- Explain important changes before making large edits.
- Prefer minimal diffs.

## Frontend rules

- Use regular SCSS.
- Do not use module.scss.
- Do not introduce CSS-in-JS.
- Use the existing shared RTK Query API.
- Add endpoints through injectEndpoints.
- Do not create a separate createApi for admin.
- Reusable UI should go into components.
- Entity API/types should stay in entities when appropriate.

## Backend rules

- Do not introduce controllers/services unless explicitly requested.
- Keep logic in routes or utils.
- Validate request bodies with Joi.
- Use Multer for file uploads.
- Protect admin routes with authMiddleware.
- Use session store for admin sessions.
- Do not store sessions in memory.

## Docker rules

- Use docker compose commands from the repository root.
- Use container commands for npm operations.
- Client runs on port 5173.
- Server runs on port 5000.
- MongoDB runs on port 27017.

## Debug workflow

Before changing code:

- Inspect the related files.
- Explain the likely cause.
- Propose a minimal fix.

After changing code:

- Show changed files.
- Run relevant build/check commands when possible.
- Summarize what was tested.
