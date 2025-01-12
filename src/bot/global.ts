import type { Conversation, ConversationFlavor } from "@grammyjs/conversations";
import { Context, session, type SessionFlavor } from "grammy";

interface SessionData {
    messageToEdit: number;
};

type BotContext = Context & ConversationFlavor & SessionFlavor<SessionData>;
type MyConversation = Conversation<BotContext>;

export type { BotContext, MyConversation };