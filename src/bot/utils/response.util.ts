import { UserRepository } from "../repository/repository";
import { convertSolToUsd, getBalanceByAddress } from "./wallet.util";

export async function getProfileResponse(
  userId: number,
  userRepository: UserRepository
): Promise<string> {
  const wallets = await userRepository.getUserWallets(userId);
  
  let walletsText = "";
  for (const wallet of wallets) {
    walletsText += `→ ${wallet.name}: ${wallet.address}\n`;
    const balance = await getBalanceByAddress(wallet.address);
    const usdBalance = await convertSolToUsd(balance);
    walletsText += `Balance: ${balance} SOL (${usdBalance} USD)\n`;
  }

  const msg = "Welcome to Galiaf Trading! 🌸\n" +
    "Let your trading journey blossom with us!\n\n" +
    "🌸 Your Solana Wallet Address:\n" +
    `${walletsText}\n` +
    `🕒 Last updated: ${new Date().toLocaleTimeString()}`;

  return msg;
}
