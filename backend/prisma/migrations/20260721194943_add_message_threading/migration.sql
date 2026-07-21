-- AlterTable
ALTER TABLE "ContactMessage" ADD COLUMN     "isAdmin" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "parentId" TEXT;

-- AddForeignKey
ALTER TABLE "ContactMessage" ADD CONSTRAINT "ContactMessage_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "ContactMessage"("id") ON DELETE SET NULL ON UPDATE CASCADE;
