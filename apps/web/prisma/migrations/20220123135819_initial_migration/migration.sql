-- CreateTable
CREATE TABLE "paste" (
    "id" TEXT NOT NULL,
    "user_id" TEXT,
    "content" TEXT NOT NULL,
    "url" TEXT,
    "views" INTEGER NOT NULL DEFAULT 1,
    "last_viewed_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "paste_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user" (
    "id" TEXT NOT NULL,
    "display_name" TEXT NOT NULL,
    "email" TEXT,
    "password" TEXT,
    "google_id" TEXT,
    "github_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "paste_user_id_key" ON "paste"("user_id");

-- CreateIndex
CREATE INDEX "paste_user_id_idx" ON "paste"("user_id");

-- CreateIndex
CREATE INDEX "user_email_idx" ON "user"("email");

-- AddForeignKey
ALTER TABLE "paste" ADD CONSTRAINT "paste_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
