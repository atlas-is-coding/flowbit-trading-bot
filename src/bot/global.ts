import type { Conversation, ConversationFlavor } from "@grammyjs/conversations";
import { Context, type SessionFlavor } from "grammy";
import { type I18nFlavor } from "@grammyjs/i18n";

interface SessionData {
    locale: string;
    selectedWallet: string | null;
};

type BotContext = Context & ConversationFlavor & SessionFlavor<SessionData> & I18nFlavor;
type MyConversation = Conversation<BotContext>;

export type { BotContext, MyConversation };