CREATE TABLE IF NOT EXISTS "AuthSession" ("id" TEXT PRIMARY KEY,"userId" TEXT NOT NULL,"organizationId" TEXT NOT NULL,"tokenHash" TEXT NOT NULL,"expiresAt" TIMESTAMP(3) NOT NULL,"revokedAt" TIMESTAMP(3),"createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,"lastSeenAt" TIMESTAMP(3));
CREATE INDEX IF NOT EXISTS "AuthSession_userId_idx" ON "AuthSession"("userId");
CREATE INDEX IF NOT EXISTS "AuthSession_organizationId_idx" ON "AuthSession"("organizationId");
CREATE TABLE IF NOT EXISTS "SecurityEvent" ("id" TEXT PRIMARY KEY,"organizationId" TEXT,"userId" TEXT,"eventType" TEXT NOT NULL,"severity" TEXT NOT NULL,"requestId" TEXT,"ipHash" TEXT,"metadataJson" JSONB,"createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP);
CREATE INDEX IF NOT EXISTS "SecurityEvent_organizationId_createdAt_idx" ON "SecurityEvent"("organizationId","createdAt");
