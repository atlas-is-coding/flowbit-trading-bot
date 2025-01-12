import type { BotContext } from "../global";
import { settingsKeyboard, languageKeyboard, startTradingKeyboard, tradingMenuKeyboard } from "../keyboards/inline.keyboard";
import { UserRepository } from "../repository/repository";
import { generateWallet } from "../utils/wallet.util";
import { getProfileResponse } from "../utils/response.util";

export class CallbackManager {
  private userRepository: UserRepository;
  
  constructor(userRepository: UserRepository) {
    this.userRepository = userRepository;
  }

  // ============================
  // ===== Welcome Section =====
  // ============================ 
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
  // ============================

  // ============================
  // ===== Trading Section =====
  // ============================ 
  async handleStartTrading(ctx: BotContext): Promise<void> {
    const message = await getProfileResponse(ctx.from!.id, this.userRepository);
    
    await ctx.reply(message, {
      reply_markup: tradingMenuKeyboard
    });
  }
  async handleBackToTradingMenu(ctx: BotContext): Promise<void> {
    const message = await getProfileResponse(ctx.from!.id, this.userRepository);
    
    await ctx.editMessageText(message, {
      reply_markup: tradingMenuKeyboard
    });
  }

  async handleRefreshTradingMenu(ctx: BotContext): Promise<void> {
    const message = await getProfileResponse(ctx.from!.id, this.userRepository);
    await ctx.editMessageText(message, {
      reply_markup: tradingMenuKeyboard
    });
  }

  async handleCloseTradingMenu(ctx: BotContext): Promise<void> {
    await ctx.deleteMessage();
  }
  // ============================

  // ============================
  // ===== Settings Section =====
  // ============================ 
  async handleSettings(ctx: BotContext): Promise<void> {
    const msg = "🌸 Bloom Settings\n\n" +
                "📖 Learn More! \n\n" +
                "🕒 Last updated: 15:44:58.058";
    
    await ctx.editMessageText(msg, {
      reply_markup: settingsKeyboard
    });
  }
  async handleBackToSettings(ctx: BotContext): Promise<void> {
    const msg = "🌸 Bloom Settings\n\n" +
                "📖 Learn More! \n\n" +
                "🕒 Last updated: 15:44:58.058";
    
    await ctx.editMessageText(msg, {
      reply_markup: settingsKeyboard
    });
  }

  async handleLanguageSettings(ctx: BotContext): Promise<void> {
    const msg = "🌸 Language Settings\n\n" +
                "Your current language is: English\n\n" +
                "Supported languages:";
    
    await ctx.editMessageText(msg, {
      reply_markup: languageKeyboard
    });
  }

  async handleCloseSettings(ctx: BotContext): Promise<void> {
    await ctx.deleteMessage();
  }
  // ============================
}