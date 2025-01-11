import { Bot, session } from "grammy";
import dotenv from "dotenv";
import { UserRepository } from "./repository/repository";
import { PrismaClient } from "@prisma/client";
import type { BotContext } from "./global";
import { CallbackManager } from "./managers/callback.manager";
import { walletCreateOptionKeyboard } from "./keyboards/inline.keyboard";
import { conversations, createConversation } from "@grammyjs/conversations";
import { StateManager } from "./managers/state.manager";

dotenv.config();

class TGBot {
  private bot: Bot<BotContext>;
  private userRepository: UserRepository;
  private callbackManager: CallbackManager;
  private stateManager: StateManager;

  constructor() {
    if (!process.env.BOT_TOKEN) {
      throw new Error("BOT_TOKEN не установлен в переменных окружения");
    }

    this.userRepository = new UserRepository(new PrismaClient());
    
    this.callbackManager = new CallbackManager(this.userRepository);
    this.stateManager = new StateManager(this.userRepository);
    
    this.bot = new Bot<BotContext>(process.env.BOT_TOKEN);
    
    this.setupMiddlewares();
    this.setupCommands();
    this.setupCallbacks();
    this.setupMessageHandlers();
  }

  private setupMiddlewares(): void {
    this.bot.use(session({ initial: () => ({}) }));
    this.bot.use(conversations());
    this.bot.use(createConversation(this.stateManager.importWalletState, "importWalletState"));
  }

  private setupCommands(): void {
    this.bot.command("start", this.handleStart.bind(this));
  }

  private setupCallbacks(): void {
    this.bot.callbackQuery("import_wallet", this.callbackManager.handleImportWallet.bind(this));
    this.bot.callbackQuery("create_wallet", this.callbackManager.handleCreateWallet.bind(this));
  }

  private setupMessageHandlers(): void {
    // this.bot.on("message:text", this.handleTextMessage.bind(this));
  }

  private async handleStart(ctx: BotContext): Promise<void> {
    const userId = ctx.from?.id;
    
    if (!userId) {
      await ctx.reply("Произошла ошибка при получении данных пользователя");
      return;
    }

    if (await this.userRepository.userExists(userId)) {
      await ctx.reply("Ваш профиль");
    } else {
        const welcomeMessage = "🌸 Welcome to Galiaf!" +
        "Your trading journey will be successful with us!\n" +
        "🔑 First of all, you need to create or import wallet";
        await ctx.reply(welcomeMessage, {
            reply_markup: walletCreateOptionKeyboard
        });
    }
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
