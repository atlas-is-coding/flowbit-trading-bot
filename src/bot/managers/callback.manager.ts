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
    await ctx.editMessageText(ctx.t("enterPrivateKey"));
    await ctx.conversation.enter('importWalletState');
  }

  async handleCreateWallet(ctx: BotContext): Promise<void> {
    const [publicKey, privateKey] = await generateWallet();
    
    await this.userRepository.createUser(ctx.from!.id, ctx.from?.username);
    await this.userRepository.addWallet(ctx.from!.id, publicKey, privateKey);

    await ctx.editMessageText(ctx.t("walletCreated", { privateKey, publicKey }), {
      reply_markup: startTradingKeyboard(ctx)
    });
  }
  // ============================

  // ============================
  // ===== Trading Section =====
  // ============================ 
  async handleStartTrading(ctx: BotContext): Promise<void> {
    const message = await getProfileResponse(ctx.from!.id, this.userRepository, ctx);
    
    await ctx.reply(message, {
      reply_markup: tradingMenuKeyboard(ctx)
    });
  }
  async handleBackToTradingMenu(ctx: BotContext): Promise<void> {
    const message = await getProfileResponse(ctx.from!.id, this.userRepository, ctx);
    
    await ctx.editMessageText(message, {
      reply_markup: tradingMenuKeyboard(ctx)
    });
  }

  async handleRefreshTradingMenu(ctx: BotContext): Promise<void> {
    const message = await getProfileResponse(ctx.from!.id, this.userRepository, ctx);
    await ctx.editMessageText(message, {
      reply_markup: tradingMenuKeyboard(ctx)
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
    const lastUpdated = new Date().toLocaleTimeString();
    
    await ctx.editMessageText(ctx.t("settingsMessage", { lastUpdated }), {
      reply_markup: settingsKeyboard(ctx)
    });
  }
  async handleBackToSettings(ctx: BotContext): Promise<void> {
    const lastUpdated = new Date().toLocaleTimeString();
    
    await ctx.editMessageText(ctx.t("settingsMessage", { lastUpdated }), {
      reply_markup: settingsKeyboard(ctx)
    });
  }

  async handleLanguageSettings(ctx: BotContext): Promise<void> {
    const currentLanguage = ctx.from?.language_code!;
    
    await ctx.editMessageText(ctx.t("languageMessage", { currentLanguage }), {
      reply_markup: languageKeyboard(ctx)
    });
  }

  async handleCloseSettings(ctx: BotContext): Promise<void> {
    await ctx.deleteMessage();
  }
  // ============================
}