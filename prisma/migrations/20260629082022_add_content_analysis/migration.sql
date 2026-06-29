-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_evaluations" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "content" TEXT NOT NULL,
    "input_type" TEXT NOT NULL DEFAULT 'text',
    "image_data" TEXT,
    "content_type" TEXT,
    "target_audience" TEXT,
    "platform" TEXT,
    "goal" TEXT,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "overall_score" REAL,
    "session_id" TEXT NOT NULL,
    "error" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);
INSERT INTO "new_evaluations" ("content", "content_type", "created_at", "error", "goal", "id", "overall_score", "platform", "session_id", "status", "updated_at") SELECT "content", "content_type", "created_at", "error", "goal", "id", "overall_score", "platform", "session_id", "status", "updated_at" FROM "evaluations";
DROP TABLE "evaluations";
ALTER TABLE "new_evaluations" RENAME TO "evaluations";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
