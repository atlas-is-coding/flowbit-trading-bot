-- Update existing wallets with default names
UPDATE "Wallet"
SET "name" = 'wallet_' || "id"
WHERE "name" IS NULL OR "name" = ''; 