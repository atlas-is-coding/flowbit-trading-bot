import type { BotContext } from "../global";
import { tradingMenuKeyboard, walletCreateOptionKeyboard } from "../keyboards/inline.keyboard";
import { UserRepository } from "../repository/repository";
import { getProfileResponse } from "../utils/response.util";

export class CommandManager {
  private userRepository: UserRepository;

  constructor(userRepository: UserRepository) {
    this.userRepository = userRepository;
  }

  async handleStart(ctx: BotContext): Promise<void> {
    const userId = ctx.from?.id;
    ctx.deleteMessage();
    
    if (!userId) {
      await ctx.reply("Произошла ошибка при получении данных пользователя");
      return;
    }

    if (await this.userRepository.userExists(userId)) {
      const message = await getProfileResponse(userId, this.userRepository);
      await ctx.reply(message, {
        reply_markup: tradingMenuKeyboard
      });
    } else {
        const welcomeMessage = "🌸 Welcome to Galiaf!" +
        "Your trading journey will be successful with us!\n" +
        "🔑 First of all, you need to create or import wallet";

        const sentMsg = await ctx.reply(welcomeMessage, {
            reply_markup: walletCreateOptionKeyboard
        });
        
        ctx.session.messageToEdit = sentMsg.message_id;
    }
  }
}