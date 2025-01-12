import { InlineKeyboard } from "grammy";

export const walletCreateOptionKeyboard = new InlineKeyboard()
                                .text("Импортировать кошелек", "import_wallet") // Done
                                .text("Создать новый кошелек", "create_wallet"); // Done

export const startTradingKeyboard = new InlineKeyboard()
                                .text("Начать торговлю", "start_trading"); // Done


export const tradingMenuKeyboard = new InlineKeyboard()
                                .text("Settings", "settings") // Done   
                                .text("Refresh", "refresh_trading_menu") // Done
                                .text("Close", "close_trading_menu"); // Done

export const settingsKeyboard = new InlineKeyboard()
                                .text("Language", "language_settings") // Done
                                .text("Close", "close_settings") // Done
                                .text("Back", "back_to_trading_menu").row(); // Done

export const languageKeyboard = new InlineKeyboard()
                                .text("English", "language_english") // Done
                                .text("Russian", "language_russian")
                                .text("Ukrainian", "language_ukrainian")
                                .text("Back", "back_to_settings").row();