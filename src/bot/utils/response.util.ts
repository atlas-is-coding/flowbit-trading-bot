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
    walletsText += `→ ${wallet.name}: <code>${wallet.address}</code>\n`;
    const balance = await getBalanceByAddress(wallet.address);
    const usdBalance = await convertSolToUsd(balance);
    walletsText += ctx.t("balance")+`: ${balance} SOL (${usdBalance} USD)\n`;
  }

  const lastUpdated = new Date().toLocaleTimeString();

  return ctx.t("profileMessage", { walletsText, lastUpdated });
}

export async function getWalletPageResponse(userRepository: UserRepository, ctx: BotContext): Promise<string> {
  const callbackData = ctx.callbackQuery!.data;
  const walletAddress = callbackData!.replace('wallet_settings_', '');
  
  const wallet = await userRepository.getWalletByAddress(ctx.from!.id, walletAddress);
  
  console.log(walletAddress);
  
  const balance = await getBalanceByAddress(walletAddress);
  const usdBalance = await convertSolToUsd(balance);


  return ctx.t("walletPage", { walletName: wallet!.name, walletAddress: wallet!.address, balance: balance, usdBalance: usdBalance, lastUpdated: new Date().toLocaleTimeString() });
}