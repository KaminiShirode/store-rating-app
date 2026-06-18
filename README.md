# Store Rating Platform

A web app where people can rate stores from 1 to 5. It has three kinds of users — admins, normal users, and store owners — and what you can do depends on who you are. Everyone logs in through the same page, but the screen you land on changes based on your role.

I built this as a full-stack project: an Express API backed by PostgreSQL, and a React front end that talks to it.

## What each role can do

**Admins** run the place. They can add stores and users (including other admins), see overall stats — how many users, stores, and ratings exist — and browse the full list of users and stores with filtering and sorting. Clicking a user shows their details, and if that user owns a store, you also see the store's rating.

**Normal users** are the people leaving ratings. They sign up themselves, browse and search all the stores, and give each one a score from 1 to 5. They can change a rating later if they change their mind, and update their password whenever they want.

**Store owners** get a focused view: who has rated their store and what their average rating works out to.

## Tech choices

- **Express** for the API — lightweight and easy to follow.
- **PostgreSQL with Prisma** for data. The schema has three tables (users, stores, ratings), and a rating is tied to one user and one store, with a constraint that stops the same person rating the same store twice — they update their existing rating instead.
- **React (Vite)** on the front end, with React Router for navigation and Axios for API calls.
- **JWT** for auth. Passwords are hashed with bcrypt and never stored in plain text.

## How it's organized

The backend follows a routes -> controllers -> services pattern, so each layer has one job: routes map URLs, controllers handle the request and response, and services hold the actual logic and database queries. The front end is split into pages (one area per role), reusable components, and a context that keeps track of who's logged in.

```
store-rating-app/
├── backend/
│   ├── prisma/        # schema, migrations, seed script
│   └── src/
│       ├── config/        # Prisma client
│       ├── controllers/   # request handlers
│       ├── middleware/    # auth + role checks
│       ├── routes/        # API routes
│       ├── services/      # business logic
│       └── utils/         # validation, hashing, tokens
└── frontend/
    └── src/
        ├── api/           # axios setup
        ├── components/    # shared UI
        ├── context/       # auth state
        ├── pages/         # screens by role
        └── utils/         # form validation
```

## Getting it running

You'll need Node.js and PostgreSQL installed and running.

**1. Make the database:**

```sql
CREATE DATABASE store_rating;
```

**2. Set up the backend:**

```bash
cd backend
npm install
```

Add a `.env` file in the backend folder with your database connection and a secret for signing tokens:

```
DATABASE_URL="postgresql://YOUR_USERNAME@localhost:5432/store_rating"
JWT_SECRET="any-long-random-string"
```

Then create the tables and seed the first admin:

```bash
npx prisma migrate dev
node prisma/seed.js
npm run dev
```

The API will be running on http://localhost:5000.

**3. Set up the front end** (in a second terminal):

```bash
cd frontend
npm install
```

Add a `.env` file in the frontend folder:

```
VITE_API_URL=http://localhost:5000/api
```

```bash
npm run dev
```

Open http://localhost:5173 and you're in.

## Logging in

The seed script creates an admin to start with:

- **Email:** admin@example.com
- **Password:** Admin@123

From there the admin can create everyone else. New normal users can also sign themselves up from the login page.

## What I thought about while building this

The trickiest part was the rating upsert — a user can only have one rating per store, but submitting again should update it, not fail. Prisma's upsert with a unique constraint on `[userId, storeId]` handles this cleanly without any extra logic.

I also kept validation in both places deliberately — the frontend gives instant feedback, but the backend is the only one that can actually be trusted.

## A note on validation

The form rules come from the project requirements and are checked on both the front end (so you get instant feedback) and the back end (which is the part that actually enforces them):

- Name: 20–60 characters
- Email: standard format
- Password: 8–16 characters, with at least one uppercase letter and one special character
- Address: up to 400 characters

The 20-character minimum for names is from the requirements. Honestly, "John Smith" is only 10 characters and would fail this check. In a real app I'd use 3–50 instead, but I kept it as specified.