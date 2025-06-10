import "./bot_modules/utils/httpServer.mjs";
import "dotenv/config";

import startBot from "./bot_modules/utils/bot.mjs";

// Handle uncaught exceptions
process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection:", reason);
});

startBot();
