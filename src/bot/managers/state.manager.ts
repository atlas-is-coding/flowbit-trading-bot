import type { BotContext, MyConversation } from "../global";
import { closeKeyboard, startTradingKeyboard } from "../keyboards/inline.keyboard";
import { UserRepository } from "../repository/repository";
import { createWalletFromPK } from "../utils/wallet.util";

export class StateManager {
  private userRepository: UserRepository;

  constructor(userRepository: UserRepository) {
    this.userRepository = userRepository;
    this.importWalletState = this.importWalletState.bind(this);
    this.importWalletStateFromSettings = this.importWalletStateFromSettings.bind(this);
  }

  async importWalletState(conversation: MyConversation, ctx: BotContext) {
    const userResponse = await conversation.wait();
    
    const privateKeyRegex = /^[1-9A-HJ-NP-Za-km-z]{88}$/;
    if (!privateKeyRegex.test(userResponse.message!.text!)) {
        await ctx.reply(ctx.t("invalidPrivateKey"));
        return;
    }

    const [publicKey, privateKey] = await createWalletFromPK(userResponse.message!.text!);

    await userResponse.deleteMessage();

    const isExists = await this.userRepository.isWalletExists(ctx.from!.id, publicKey);
    if (isExists) {
        await ctx.reply(ctx.t("walletAlreadyExists"), {
            reply_markup: closeKeyboard(ctx)
        });
        return;
    }

    await this.userRepository.createUser(ctx.from!.id, ctx.from?.username);
    await this.userRepository.addWallet(ctx.from!.id, publicKey, privateKey);
    
    await ctx.editMessageText(ctx.t("walletImported", { privateKey, publicKey }), {
      reply_markup: startTradingKeyboard(ctx)
    });

    return;
  }

  async importWalletStateFromSettings(conversation: MyConversation, ctx: BotContext) {
    const userResponse = await conversation.wait();
    
    const privateKeyRegex = /^[1-9A-HJ-NP-Za-km-z]{88}$/;
    if (!privateKeyRegex.test(userResponse.message!.text!)) {
        await ctx.reply(ctx.t("invalidPrivateKey"));
        return;
    }

    const [publicKey, privateKey] = await createWalletFromPK(userResponse.message!.text!);

    await userResponse.deleteMessage();

    const isExists = await this.userRepository.isWalletExists(ctx.from!.id, publicKey);
    if (isExists) {
        await ctx.reply(ctx.t("walletAlreadyExists"), {
            reply_markup: closeKeyboard(ctx)
        });
        return;
    }

    await this.userRepository.addWallet(ctx.from!.id, publicKey, privateKey);
    
    await ctx.reply(ctx.t("importWalletSettings", { privateKey, publicKey, lastUpdated: new Date().toLocaleTimeString() }), {
      reply_markup: closeKeyboard(ctx)
    });

    return;
  } 
}
