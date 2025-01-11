import type { Conversation, ConversationFlavor } from "@grammyjs/conversations";
import { Context } from "grammy";

type BotContext = Context & ConversationFlavor;
type MyConversation = Conversation<BotContext>;

export type { BotContext, MyConversation };