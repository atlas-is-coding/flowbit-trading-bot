import { Bot, session } from "grammy";
import { conversations, createConversation } from "@grammyjs/conversations";
import { I18n } from "@grammyjs/i18n";

import dotenv from "dotenv";
import { UserRepository } from "./repository/repository";
import { PrismaClient } from "@prisma/client";

import type { BotContext } from "./global";

import { CallbackManager } from "./managers/callback.manager";
import { StateManager } from "./managers/state.manager";
import { CommandManager } from "./managers/command.manager";

dotenv.config();

class TGBot {
  private bot: Bot<BotContext>;
  private userRepository: UserRepository;
  
  private callbackManager: CallbackManager;
  private stateManager: StateManager;
  private commandManager: CommandManager;

  constructor() {
    if (!process.env.BOT_TOKEN) {
      throw new Error("BOT_TOKEN не установлен в переменных окружения");
    }

    this.userRepository = new UserRepository(new PrismaClient());
    
    this.commandManager = new CommandManager(this.userRepository);
    this.callbackManager = new CallbackManager(this.userRepository);
    this.stateManager = new StateManager(this.userRepository);
    
    this.bot = new Bot<BotContext>(process.env.BOT_TOKEN);
    
    this.setupMiddlewares();
    this.setupCommands();
    this.setupCallbacks();
    this.setupMessageHandlers();
    this.setupErrorHandler();
  }

  private setupMiddlewares(): void {
    const i18n = new I18n<BotContext>({
      defaultLocale: "en",
      directory: "locales",
      useSession: true,
    });
    
    this.bot.use(session({ 
      initial: () => ({ 
        messageToEdit: -1, 
        locale: "en" 
      }) 
    }));
    
    this.bot.use(i18n);
    
    this.bot.use(conversations());
    this.bot.use(createConversation(this.stateManager.importWalletState, "importWalletState"));
    this.bot.use(createConversation(this.stateManager.importWalletStateFromSettings, "importWalletStateFromSettings"));
  }

  private setupCommands(): void {
    this.bot.command("start", this.commandManager.handleStart.bind(this));
  }

  private setupCallbacks(): void {
    this.bot.callbackQuery("import_wallet", this.callbackManager.handleImportWallet.bind(this));
    this.bot.callbackQuery("create_wallet", this.callbackManager.handleCreateWallet.bind(this));

    this.bot.callbackQuery("import_wallet_settings", this.callbackManager.handleImportWalletSettings.bind(this));
    this.bot.callbackQuery("create_wallet_settings", this.callbackManager.handleCreateWalletSettings.bind(this));

    this.bot.callbackQuery("wallets_settings", this.callbackManager.handleWalletsSettings.bind(this));
   
    this.bot.callbackQuery("start_trading", this.callbackManager.handleStartTrading.bind(this));
    this.bot.callbackQuery("settings", this.callbackManager.handleSettings.bind(this));
    this.bot.callbackQuery("refresh_trading_menu", this.callbackManager.handleRefreshTradingMenu.bind(this));
    this.bot.callbackQuery("close_trading_menu", this.callbackManager.handleCloseTradingMenu.bind(this));

    this.bot.callbackQuery("back_to_trading_menu", this.callbackManager.handleBackToTradingMenu.bind(this));
    this.bot.callbackQuery("language_settings", this.callbackManager.handleLanguageSettings.bind(this));
    this.bot.callbackQuery("close_settings", this.callbackManager.handleCloseSettings.bind(this));
    this.bot.callbackQuery("back_to_settings", this.callbackManager.handleBackToSettings.bind(this));

    this.bot.callbackQuery("close_keyboard", this.callbackManager.handleCloseKeyboard.bind(this));
  }

  private setupMessageHandlers(): void {
    // this.bot.on("message:text", this.handleTextMessage.bind(this));
  }

  private setupErrorHandler(): void {
    this.bot.catch((err) => {
      console.error("Error in bot:", err);
    });
  }

  public async start(): Promise<void> {
    try {
      console.log("Бот запущен...");
      await this.bot.start();
    } catch (error) {
      console.error("Ошибка при запуске бота:", error);
      throw error;
    }
  }
}

export default new TGBot();
