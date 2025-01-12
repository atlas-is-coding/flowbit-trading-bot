import type { BotContext } from "../global";
import { startTradingKeyboard } from "../keyboards/inline.keyboard";
import { UserRepository } from "../repository/repository";
import { generateWallet } from "../utils/wallet.util";
import { getProfileResponse } from "../utils/response.util";

export class CallbackManager {
  private userRepository: UserRepository;

  constructor(userRepository: UserRepository) {
    this.userRepository = userRepository;
  }

  async handleImportWallet(ctx: BotContext) {
    await ctx.editMessageText("Enter you private key:");
    await ctx.conversation.enter('importWalletState');
  }

  async handleCreateWallet(ctx: BotContext): Promise<void> {
    const [publicKey, privateKey] = await generateWallet();
    
    const msg = "🟢 Your Wallet Has Been Successfully Created \n\n" +
                "🔑 Save your Private Key: \n" +
                "Here is your private key. Please store it securely and do not share it with anyone. Once this message is deleted, you won't be able to retrieve your private key again. \n\n" +
                "Private Key: \n" +
                `${privateKey} \n\n` +
                "🟣 Your Solana Wallet Addresses: \n" +
                `${publicKey} \n\n` +
                "To start trading, please deposit SOL to your address. \n" +
                "Only deposit SOL through SOL network.";

    await this.userRepository.createUser(ctx.from!.id, ctx.from?.username);
    await this.userRepository.addWallet(ctx.from!.id, publicKey, privateKey);

    await ctx.editMessageText(msg, {
      reply_markup: startTradingKeyboard
    });
  }

  async handleStartTrading(ctx: BotContext): Promise<void> {
    const message = await getProfileResponse(ctx.from!.id, this.userRepository);
    
    await ctx.reply(message);
  }
}
