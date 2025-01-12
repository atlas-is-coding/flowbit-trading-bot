import { Bot, session } from "grammy";
import { conversations, createConversation } from "@grammyjs/conversations";

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
  }

  private setupMiddlewares(): void {
    this.bot.use(session({ initial: () => ({ messageToEdit: -1 }) }));
    this.bot.use(conversations());
    this.bot.use(createConversation(this.stateManager.importWalletState, "importWalletState"));
  }

  private setupCommands(): void {
    this.bot.command("start", this.commandManager.handleStart.bind(this));
  }

  private setupCallbacks(): void {
    this.bot.callbackQuery("import_wallet", this.callbackManager.handleImportWallet.bind(this));
    this.bot.callbackQuery("create_wallet", this.callbackManager.handleCreateWallet.bind(this));
    this.bot.callbackQuery("start_trading", this.callbackManager.handleStartTrading.bind(this));
  }

  private setupMessageHandlers(): void {
    // this.bot.on("message:text", this.handleTextMessage.bind(this));
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
