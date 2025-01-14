import type { BotContext } from "../global";
import { settingsKeyboard, languageKeyboard, startTradingKeyboard, tradingMenuKeyboard, walletsSettingsKeyboard, closeKeyboard, walletPageKeyboard, deleteWalletConfirmationKeyboard } from "../keyboards/inline.keyboard";
import { UserRepository } from "../repository/repository";
import { convertSolToUsd, generateWallet, getBalanceByAddress } from "../utils/wallet.util";
import { getProfileResponse, getWalletPageResponse } from "../utils/response.util";

export class CallbackManager {
  private userRepository: UserRepository;
  
  constructor(userRepository: UserRepository) {
    this.userRepository = userRepository;
  }

  async handleCloseKeyboard(ctx: BotContext): Promise<void> {
    await ctx.deleteMessage();
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
    await ctx.editMessageText(ctx.t("settingsMessage", { lastUpdated: new Date().toLocaleTimeString() }), {
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
    const currentLanguage = await this.userRepository.getUserLocale(ctx.from!.id);
    
    await ctx.editMessageText(ctx.t("languageMessage", { currentLanguage }), {
      reply_markup: languageKeyboard(ctx)
    });
  }

  async handleCloseSettings(ctx: BotContext): Promise<void> {
    await ctx.deleteMessage();
  }

  async handleWalletsSettings(ctx: BotContext): Promise<void> {
    await ctx.editMessageText(ctx.t("walletsSettings", { lastUpdated: new Date().toLocaleTimeString() }), {
      reply_markup: await walletsSettingsKeyboard(ctx, this.userRepository)
    });
  }
  async handleCloseWalletsSettings(ctx: BotContext): Promise<void> {
    await ctx.deleteMessage();
  }

  async handleImportWalletSettings(ctx: BotContext): Promise<void> {
    await ctx.reply(ctx.t("enterPrivateKey"));
    await ctx.conversation.enter('importWalletStateFromSettings');
  }

  async handleCreateWalletSettings(ctx: BotContext): Promise<void> {
    const [publicKey, privateKey] = await generateWallet();

    // Проверяем, существует ли уже такой кошелек у пользователя
    const isExists = await this.userRepository.isWalletExists(ctx.from!.id, publicKey);
    if (isExists) {
        await ctx.reply(ctx.t("walletAlreadyExists"), {
            reply_markup: closeKeyboard(ctx)
        });
        return;
    }

    await this.userRepository.addWallet(ctx.from!.id, publicKey, privateKey);

    await ctx.reply(ctx.t("createWalletSettings", { privateKey, publicKey, lastUpdated: new Date().toLocaleTimeString() }), {
      reply_markup: closeKeyboard(ctx)
    });
  }
  // ============================

  // ============================
  // ===== Wallet Settings =====
  // ============================ 
  async handleWalletSettings(ctx: BotContext): Promise<void> {
    const callbackData = ctx.callbackQuery!.data;
    const walletAddress = callbackData!.replace('wallet_settings_', '');
    
    const wallet = await this.userRepository.getWalletByAddress(ctx.from!.id, walletAddress);
    
    const balance = await getBalanceByAddress(wallet!.address);
    const usdBalance = await convertSolToUsd(balance);
    

    await ctx.editMessageText(
        ctx.t("walletPage", { 
            walletName: wallet!.name, 
            walletAddress: wallet!.address, 
            balance: balance, 
            usdBalance: usdBalance, 
            lastUpdated: new Date().toLocaleTimeString() 
        }), 
        {
            reply_markup: walletPageKeyboard(ctx, walletAddress)
        }
    );
  }

  async handleBackToWalletsSettings(ctx: BotContext): Promise<void> {
    await ctx.editMessageText(ctx.t("walletsSettings", { lastUpdated: new Date().toLocaleTimeString() }), {
      reply_markup: await walletsSettingsKeyboard(ctx, this.userRepository)
    });
  }

  async handleRefreshWalletPage(ctx: BotContext): Promise<void> {
    const callbackData = ctx.callbackQuery!.data;
    const walletAddress = callbackData!.replace('refresh_wallet_page_', '');
    
    const wallet = await this.userRepository.getWalletByAddress(ctx.from!.id, walletAddress);
    const balance = await getBalanceByAddress(wallet!.address);
    const usdBalance = await convertSolToUsd(balance);

    await ctx.editMessageText(
        ctx.t("walletPage", { 
            walletName: wallet!.name, 
            walletAddress: wallet!.address, 
            balance: balance, 
            usdBalance: usdBalance, 
            lastUpdated: new Date().toLocaleTimeString() 
        }), 
        {
            reply_markup: walletPageKeyboard(ctx, walletAddress)
        }
    );
  }

  async handleRenameWallet(ctx: BotContext): Promise<void> {
    const callbackData = ctx.callbackQuery!.data;
    const walletAddress = callbackData!.replace('rename_wallet_', '');
    
    // Сохраняем адрес кошелька для использования в state
    ctx.session.selectedWallet = walletAddress;
    
    await ctx.reply(ctx.t("enterNewWalletName"));

    await ctx.conversation.enter('renameWalletState');
  }

  async handleDeleteWalletConfirmation(ctx: BotContext): Promise<void> {
    const callbackData = ctx.callbackQuery!.data;
    const walletAddress = callbackData!.replace('del_wallet_', '');
    
    await ctx.reply(ctx.t("deleteWalletConfirmation"), {
      reply_markup: deleteWalletConfirmationKeyboard(ctx, walletAddress)
    });
  }

  async handleDeleteWalletConfirmationYes(ctx: BotContext): Promise<void> {
    const callbackData = ctx.callbackQuery!.data;
    const walletAddress = callbackData!.replace('delete_wallet_yes_', '');
    
    await this.userRepository.removeWallet(ctx.from!.id, walletAddress);
    await ctx.editMessageText(ctx.t("walletDeleted"));
  }

  async handleDeleteWalletConfirmationNo(ctx: BotContext): Promise<void> {
    await ctx.deleteMessage();
  }
  // ============================

  async handleSetLanguage(ctx: BotContext): Promise<void> {
    const callbackData = ctx.callbackQuery!.data;
    const language = callbackData!.replace('set_language_', '');
   
    await this.userRepository.updateUserLocale(ctx.from!.id, language);
    await ctx.i18n.setLocale(language);
    await ctx.i18n.renegotiateLocale();

    await ctx.answerCallbackQuery(ctx.t("languageUpdated"));
  }
}
