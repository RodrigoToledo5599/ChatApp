-- AlterTable
ALTER TABLE "Conversations" ADD COLUMN     "directKey" TEXT;

-- AlterTable
ALTER TABLE "Friendship" ADD COLUMN     "blockedById" TEXT;

-- AlterTable
-- os refresh tokens antigos deixam de valer: todos os usuários precisarão logar de novo
ALTER TABLE "Users" DROP COLUMN "refresh",
ALTER COLUMN "phone" DROP NOT NULL;

-- telefone vazio era usado como "sem telefone" e quebrava o @unique
UPDATE "Users" SET "phone" = NULL WHERE "phone" = '';

-- preenche a directKey das conversas diretas existentes (se houver duplicadas, só a mais antiga recebe a chave)
WITH keys AS (
    SELECT c."id",
           string_agg(uc."userId", ':' ORDER BY uc."userId") AS "key",
           c."createdAt"
    FROM "Conversations" c
    JOIN "UsersOnConversations" uc ON uc."conversationId" = c."id"
    WHERE c."isGroup" = false
    GROUP BY c."id", c."createdAt"
    HAVING count(*) = 2
),
ranked AS (
    SELECT "id", "key", row_number() OVER (PARTITION BY "key" ORDER BY "createdAt", "id") AS rn
    FROM keys
)
UPDATE "Conversations" c
SET "directKey" = ranked."key"
FROM ranked
WHERE ranked."id" = c."id" AND ranked.rn = 1;

-- CreateTable
CREATE TABLE "Sessions" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "refreshHash" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Sessions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Sessions_userId_idx" ON "Sessions"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Conversations_directKey_key" ON "Conversations"("directKey");

-- AddForeignKey
ALTER TABLE "Sessions" ADD CONSTRAINT "Sessions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
