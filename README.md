# Learn It, Love It

A small learning platform where users create learning topics, add useful links to each topic, and vote for the topics and links they find most helpful. Content is reordered by votes, both on the server and live in the browser.

Built for the **¡CRUD, Códigos y Votos!** challenge (The Huddle, Penguin Academy CodePRO).

## Features

- Create, read, update and delete **topics**
- Create, read, update and delete **links** inside each topic
- **Vote** for topics and links; the counter updates and the list reorders without reloading the page
- Deleting a topic also deletes its links (`ON DELETE CASCADE`)
- Basic validation on both sides: required fields, max length and URL format in the forms; empty fields (400) and missing ids (404) on the server

## Tech stack

| Layer | Technology |
|---|---|
| Server | Node.js + Express |
| Views | EJS templates |
| Database | SQLite (`better-sqlite3`) |
| Client-side | Vanilla JavaScript (`fetch`) |
| Styles | Tailwind CSS (browser build) |

## Getting started

Requires **Node.js LTS** (22 or newer).

```bash
git clone https://github.com/mathiaslopezbrown/learn-it-love-it-express.git
cd learn-it-love-it-express
npm install
npm run dev
```

Open http://localhost:3000.

The database file (`db/learnit.db`) is created automatically on the first run, with two sample topics. To start over with a clean database, stop the server and delete that file.

| Script | What it does |
|---|---|
| `npm run dev` | Starts the server and restarts it on every file change |
| `npm start` | Starts the server |

## Project structure (MVC)

```
├── app.js                 # Express setup: views, static files, body parsing, routes
├── db/
│   ├── schema.sql         # Tables: topics and links
│   └── database.js        # SQLite connection, schema and sample data
├── models/                # Model: SQL queries only
│   ├── topicModel.js
│   └── linkModel.js
├── controllers/           # Controller: reads the request, calls the model, picks the response
│   ├── topicController.js
│   └── linkController.js
├── routes/                # Maps each URL + HTTP method to a controller function
│   ├── topicRoutes.js
│   └── linkRoutes.js
├── views/                 # View: EJS templates
│   ├── index.ejs          # Topic list
│   ├── topic.ejs          # One topic with its links
│   └── partials/head.ejs
└── public/js/main.js      # Client-side: vote, edit and delete with fetch()
```

- **Model**: the only place with SQL. Never sees `req` or `res`.
- **View**: turns the data into HTML. Never queries the database.
- **Controller**: connects both. Receives the request, asks the model for data, and answers with a view or JSON.

## Routes

| Method | Route | Description | Response |
|---|---|---|---|
| GET | `/` | List of topics, ordered by votes | HTML |
| GET | `/topics/:id` | One topic with its links, ordered by votes | HTML |
| POST | `/topics` | Create a topic (form) | Redirect |
| PUT | `/topics/:id` | Update a topic | JSON |
| DELETE | `/topics/:id` | Delete a topic and its links | 204 |
| POST | `/topics/:id/vote` | Vote for a topic | JSON |
| POST | `/topics/:id/links` | Create a link in a topic (form) | Redirect |
| PUT | `/links/:id` | Update a link | JSON |
| DELETE | `/links/:id` | Delete a link | 204 |
| POST | `/links/:id/vote` | Vote for a link | JSON |

Creating uses regular HTML forms followed by a redirect. Updating, deleting and voting use `fetch()` from `public/js/main.js`, because HTML forms can only send GET and POST.

## How voting works

1. The vote button sends `POST /topics/:id/vote` (or `/links/:id/vote`).
2. The model runs `UPDATE ... SET votes = votes + 1`. SQLite adds the vote in a single step, so two votes at the same time can't overwrite each other.
3. The server answers with the updated item as JSON.
4. The browser updates the counter and reorders the list with the same rule the server uses: most votes first, ties by creation order.

Reloading the page shows the same order, because every page query uses `ORDER BY votes DESC`.
