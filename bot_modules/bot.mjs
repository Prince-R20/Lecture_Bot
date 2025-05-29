import {
  makeWASocket,
  useMultiFileAuthState,
  DisconnectReason,
} from "@whiskeysockets/baileys";
import handleConnection from "./connection/handleConnection.mjs";
import syncAuth from "./connection/handleSyncAuthRemote.mjs";
import handleRecieveMsg from "./dm/handleRecieveMsg.mjs";
import { setSock } from "./sockInstance.mjs";

export default async function startBot() {
  await syncAuth.downloadAuth();

  const { state, saveCreds } = await useMultiFileAuthState("./auth");
  const sock = makeWASocket({
    auth: state,
    printQRInTerminal: true,
  });

  setSock(sock);

  let isConnected = false;
  let credsUpdated = false;

  sock.ev.on("creds.update", async () => {
    await saveCreds();
    credsUpdated = true;
    if (isConnected) {
      await syncAuth.uploadAuth();
    }
  });

  sock.ev.on("connection.update", (update) => {
    handleConnection(update, DisconnectReason);
    if (update.connection === "open") {
      isConnected = true;
      if (credsUpdated) {
        syncAuth.uploadAuth();
      }
    }
  });

  sock.ev.on("messages.upsert", async (msg) => {
    handleRecieveMsg(msg);
  });
}
