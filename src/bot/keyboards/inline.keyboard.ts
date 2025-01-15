import { InlineKeyboard } from "grammy";
import type { BotContext } from "../global";
import type { UserRepository } from "../repository/repository";

export const walletsSettingsKeyboard = async (ctx: BotContext, userRepository: UserRepository) => {
    const wallets = await userRepository.getUserWallets(ctx.from!.id);

    // Дожидаемся выполнения всех промисов
    const walletButtons = await Promise.all(wallets.map(async wallet => {
        const isDefaultWallet = await userRepository.isDefaultWallet(ctx.from!.id, wallet.address);

        return {
            text: `${isDefaultWallet ? "🟢" : "🔴"} ` + (wallet.name || wallet.address.slice(0, 8) + '...'),
            callback_data: `wallet_settings_${wallet.address}`
        }
    }));

    // Группируем кнопки по 3 в строке
    const walletRows = walletButtons.reduce((rows: any[], button, index) => {
        if (index % 3 === 0) {
            rows.push([button]);
        } else {
            rows[rows.length - 1].push(button);
        }
        return rows;
    }, []);

    return new InlineKeyboard(
        [
            ...walletRows,
            [
                { text: ctx.t("importWallet"), callback_data: "import_wallet_settings" },
                { text: ctx.t("createWallet"), callback_data: "create_wallet_settings" }
            ],
            [
                { text: ctx.t("back"), callback_data: "back_to_settings" }
            ],
            [
                { text: ctx.t("close"), callback_data: "close_wallets_settings" },
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
                { text: ctx.t("manualBuyer"), callback_data: "manual_buyer" },
            ],
            [
                { text: ctx.t("settings"), callback_data: "settings" },
                { text: ctx.t("refresh"), callback_data: "refresh_trading_menu" },
            ],
            [
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
                { text: ctx.t("back"), callback_data: "back_to_trading_menu" }
            ],
            [
                { text: ctx.t("close"), callback_data: "close_settings" },
            ]
        ]
    )
}

export const languageKeyboard = (ctx: BotContext) => {
    return new InlineKeyboard(
        [
            [
                { text: ctx.t("enLanguage"), callback_data: "set_language_en" },
                { text: ctx.t("ruLanguage"), callback_data: "set_language_ru" },
                
            ],
            [
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

export const walletPageKeyboard = async (ctx: BotContext, walletAddress: string, userRepository: UserRepository) => {
    const isDefaultWallet = await userRepository.isDefaultWallet(ctx.from!.id, walletAddress);

    return new InlineKeyboard(
        [
            [
                {text: `${isDefaultWallet ? "🟢" : "🔴"} ` + ctx.t("defaultWallet"), callback_data: `set_default_wallet_${walletAddress}`}
            ],
            [
                { text: ctx.t("renameWallet"), callback_data: `rename_wallet_${walletAddress}` },
                { text: ctx.t("deleteWallet"), callback_data: `del_wallet_${walletAddress}` },
            ],
            [
                { text: ctx.t("back"), callback_data: "back_to_wallets_settings" },
                { text: ctx.t("refresh"), callback_data: `refresh_wallet_page_${walletAddress}` }
            ],
            [
                { text: ctx.t("close"), callback_data: "close_keyboard" },
            ]
        ]
    )
}

export const deleteWalletConfirmationKeyboard = (ctx: BotContext, walletAddress: string) => {
    return new InlineKeyboard(
        [
            [{ text: ctx.t("deleteWalletConfirmationYes"), callback_data: `delete_wallet_yes_${walletAddress}` }],
            [{ text: ctx.t("deleteWalletConfirmationNo"), callback_data: "delete_wallet_no" }]
        ]
    )
}