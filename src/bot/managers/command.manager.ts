import type { BotContext } from "../global";
import { tradingMenuKeyboard, walletsCreateKeyboard } from "../keyboards/inline.keyboard";
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
      await ctx.reply(ctx.t("errorWhileFetchingUserData"));
      return;
    }

    if (await this.userRepository.userExists(userId)) {
      const message = await getProfileResponse(userId, this.userRepository, ctx);
      await ctx.reply(message, {
        reply_markup: tradingMenuKeyboard(ctx)
      });
    } else {
        const sentMsg = await ctx.reply(ctx.t("greeting"), {
            reply_markup: walletsCreateKeyboard(ctx)
        });
        
        ctx.session.messageToEdit = sentMsg.message_id;
    }
  }
}