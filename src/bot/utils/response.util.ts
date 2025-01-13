import type { BotContext } from "../global";
import { UserRepository } from "../repository/repository";
import { convertSolToUsd, getBalanceByAddress } from "./wallet.util";

export async function getProfileResponse(
  userId: number,
  userRepository: UserRepository,
  ctx: BotContext
): Promise<string> {
  const wallets = await userRepository.getUserWallets(userId);
  
  let walletsText = "";
  for (const wallet of wallets) {
    walletsText += `→ ${wallet.name}: ${wallet.address}\n`;
    const balance = await getBalanceByAddress(wallet.address);
    const usdBalance = await convertSolToUsd(balance);
    walletsText += ctx.t("balance")+`: ${balance} SOL (${usdBalance} USD)\n`;
  }

  const lastUpdated = new Date().toLocaleTimeString();

  return ctx.t("profileMessage", { walletsText, lastUpdated });
}
