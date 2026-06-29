-- CreateTable
CREATE TABLE "evaluations" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "content" TEXT NOT NULL,
    "content_type" TEXT NOT NULL,
    "platform" TEXT,
    "goal" TEXT,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "overall_score" REAL,
    "session_id" TEXT NOT NULL,
    "error" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "personas" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "evaluation_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "background" TEXT NOT NULL,
    "perspective" TEXT NOT NULL,
    "tone" TEXT NOT NULL,
    "score" REAL,
    "reaction" TEXT,
    "strengths" TEXT,
    "improvements" TEXT,
    "suggestions" TEXT,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "error" TEXT,
    CONSTRAINT "personas_evaluation_id_fkey" FOREIGN KEY ("evaluation_id") REFERENCES "evaluations" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "senior_reports" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "evaluation_id" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "overall_score" REAL NOT NULL,
    "strengths" TEXT NOT NULL,
    "improvements" TEXT NOT NULL,
    "action_items" TEXT NOT NULL,
    "rewrite" TEXT,
    CONSTRAINT "senior_reports_evaluation_id_fkey" FOREIGN KEY ("evaluation_id") REFERENCES "evaluations" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "senior_reports_evaluation_id_key" ON "senior_reports"("evaluation_id");
