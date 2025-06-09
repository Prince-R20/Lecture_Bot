import qrcode from "qrcode-terminal";
import startBot from "../utils/bot.mjs";
import syncAuth from "./handleSyncAuthRemote.mjs";

export default function handleConnection(update, DisconnectReason) {
  const { qr, connection, lastDisconnect } = update;

  if (qr) {
    qrcode.generate(qr, { small: true });
  }

  switch (connection) {
    case "close":
      const shouldReconnect =
        lastDisconnect?.error?.output?.statusCode !==
        DisconnectReason.loggedOut;
      console.log(
        "Connection closed due to",
        lastDisconnect?.error,
        "Reconnecting...",
        shouldReconnect
      );
      if (shouldReconnect) startBot();
      break;

    case "open":
      console.log("✅ Connected to WhatsApp!");
      syncAuth.uploadAuth();
      break;
  }
}
