-- AlterTable
ALTER TABLE "Settings" ADD COLUMN     "kavenegarApiKey" TEXT,
ADD COLUMN     "kavenegarSenderNumber" TEXT,
ADD COLUMN     "smsEnabled" BOOLEAN NOT NULL DEFAULT false;
