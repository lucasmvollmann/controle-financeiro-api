-- DropForeignKey
ALTER TABLE "AccountMember" DROP CONSTRAINT "AccountMember_accountId_fkey";

-- AddForeignKey
ALTER TABLE "AccountMember" ADD CONSTRAINT "AccountMember_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE CASCADE ON UPDATE CASCADE;
