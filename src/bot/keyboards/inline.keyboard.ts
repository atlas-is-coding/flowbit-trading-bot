import { InlineKeyboard } from "grammy";

export const walletCreateOptionKeyboard = new InlineKeyboard()
                                .text("Импортировать кошелек", "import_wallet")
                                .text("Создать новый кошелек", "create_wallet");

export const startTradingKeyboard = new InlineKeyboard()
                                .text("Начать торговлю", "start_trading");
