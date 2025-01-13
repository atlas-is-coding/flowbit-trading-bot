import { InlineKeyboard } from "grammy";
import type { BotContext } from "../global";

export const walletsSettingsKeyboard = (ctx: BotContext) => {
    return new InlineKeyboard(
        [
            [
                { text: ctx.t("importWallet"), callback_data: "import_wallet_settings" },
                { text: ctx.t("createWallet"), callback_data: "create_wallet_settings" }
            ],
            [
                { text: ctx.t("close"), callback_data: "close_wallets_settings" },
                { text: ctx.t("back"), callback_data: "back_to_settings" }
            ]
        ]
    )
}

export const walletsCreateKeyboard = (ctx: BotContext) => {
    return new InlineKeyboard(
        [
            [
                { text: ctx.t("importWallet"), callback_data: "import_wallet" },
                { text: ctx.t("createWallet"), callback_data: "create_wallet" }
            ]
        ]
    )
}

export const startTradingKeyboard = (ctx: BotContext) => {
    return new InlineKeyboard(
        [
            [
                { text: ctx.t("startTrading"), callback_data: "start_trading" }
            ]
        ]
    )
}

export const tradingMenuKeyboard = (ctx: BotContext) => {
    return new InlineKeyboard(
        [
            [
                { text: ctx.t("settings"), callback_data: "settings" },
                { text: ctx.t("refresh"), callback_data: "refresh_trading_menu" },
                { text: ctx.t("close"), callback_data: "close_trading_menu" }
            ]
        ]
    )
}

export const settingsKeyboard = (ctx: BotContext) => {
    return new InlineKeyboard(
        [
            [
                { text: ctx.t("wallets"), callback_data: "wallets_settings" },
                { text: ctx.t("language"), callback_data: "language_settings" }
            ],
            [
                { text: ctx.t("close"), callback_data: "close_settings" },
                { text: ctx.t("back"), callback_data: "back_to_trading_menu" }
            ]
        ]
    )
}

export const languageKeyboard = (ctx: BotContext) => {
    return new InlineKeyboard(
        [
            [
                { text: "English", callback_data: "language_english" },
                { text: "Russian", callback_data: "language_russian" },
                { text: "Ukranian", callback_data: "language_ukrainian" },
                { text: ctx.t("back"), callback_data: "back_to_settings" }
            ]
        ]
    )
}

export const closeKeyboard = (ctx: BotContext) => {
    return new InlineKeyboard(
        [
            [{ text: ctx.t("close"), callback_data: "close_keyboard" }]
        ]
    )
}