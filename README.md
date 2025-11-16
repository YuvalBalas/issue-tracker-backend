# Issue Tracker Backend Service

## Tech Stack

- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **TypeScript** - Type safety
- **Prisma ORM** - Database modeling and querying
- **PostgreSQL** - Database

## Getting Started

### Prerequisites

- Node.js v20+
- npm
- Database Client (PostgreSQL - pgadmin / dbeaver)

### Installation

```bash
# Clone repository
git clone https://github.com/YuvalBalas/issue-tracker-backend.git
cd project-name

# Install dependencies
npm install
```

### Enviornment Variables

- copy the .env.example to .env file and update with the relevant DB Connection String

### Initialize DB DDL

```bash
npx prisma migrate dev --name init
npx prisma generate
```

### Run Express Server http://localhost:3000/

```bash
# run:
npm run dev

# debug (vs code): run the debug configuration "Debug TypeScript Node Express"
```

### Run Create Batch Issues Script

```bash
# run:
npx tsx src/create-batch-issues.ts

# if you want to change the issues data - edit or replace the file "src/issues.csv"

# debug (vs code): run the debug configuration "Debug Current File"
```

### Files & Directories

- .vscode/ -> the .launch.json includes the debug configuration
- prisma/ -> includes the ORM data models, db configuration, and the DDL revisions
- src/ -> the code files includes the server logic (index.ts) and CSV script (create-batch-issues.ts)
- .env.example -> imcludes the enviornment variables you need to copy to .env and update accordingly

### API

- GET /api/issues
- POST /api/issues body: {issue}
- PATCH /api/issues/{id} body: {key: value}
- DELETE /api/issues/{id}
- POST /api/issues/batch body: {issue[]}
