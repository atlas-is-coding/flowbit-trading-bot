import type { BotContext, MyConversation } from "../global";
import { UserRepository } from "../repository/repository";
import { createWalletFromPK, generateWallet } from "../utils/wallet.util";

export class StateManager {
  private userRepository: UserRepository;

  constructor(userRepository: UserRepository) {
    this.userRepository = userRepository;
    this.importWalletState = this.importWalletState.bind(this);
  }

  async importWalletState(conversation: MyConversation, ctx: BotContext) {
    await ctx.reply("Enter you private key");
    const { message } = await conversation.wait();
    
    const privateKeyRegex = /^[1-9A-HJ-NP-Za-km-z]{88}$/;
    if (!privateKeyRegex.test(message!.text!)) {
        await ctx.reply("❌ Invalid private key format. Please enter a valid Solana private key.");
        return;
    }

    const [publicKey, privateKey] = await createWalletFromPK(message!.text!);

    const msg = "Your Wallet Has Been Successfully Imported 🟢\n" +
        "\n" +
        "🔑 Save your Private Key:\n" +
        "Here is your private key. Please store it securely and do not share it with anyone. Once this message is deleted, you won't be able to retrieve your private key again.\n" +
        "\n" +
        "Private Key:\n" +
        "\n" +
        `${privateKey}\n` +
        "\n" +
        "🟣 Your Solana Wallet Addresses:\n" +
        `${publicKey}\n`;

    await this.userRepository.createUser(ctx.from!.id, ctx.from?.username);
    await this.userRepository.addWallet(ctx.from!.id, publicKey, privateKey);

    await ctx.reply(msg);
  }
}