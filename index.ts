import bot from "./src/bot/bot";

async function startBot() {
  try {
    console.log("Запуск бота...");
    await bot.start();
  } catch (error) {
    console.error("Ошибка при запуске бота:", error);
    process.exit(1);
  }
}

startBot();