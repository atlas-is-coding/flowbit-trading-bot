import type { Conversation, ConversationFlavor } from "@grammyjs/conversations";
import { Context, session, type SessionFlavor } from "grammy";
import { type I18nFlavor } from "@grammyjs/i18n";
import type { Message } from "grammy/types";

interface SessionData {
    messageToEdit: Message.TextMessage;
    locale: string;
    selectedWallet: string | null;
};

type BotContext = Context & ConversationFlavor & SessionFlavor<SessionData> & I18nFlavor;
type MyConversation = Conversation<BotContext>;

export type { BotContext, MyConversation };