-- CreateEnum
CREATE TYPE "IssueSeverity" AS ENUM ('minor', 'major', 'critical');

-- CreateEnum
CREATE TYPE "IssueStatus" AS ENUM ('open', 'in_progress', 'resolved');

-- CreateTable
CREATE TABLE "Issue" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "site" TEXT,
    "severity" "IssueSeverity" NOT NULL,
    "status" "IssueStatus" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Issue_pkey" PRIMARY KEY ("id")
);
