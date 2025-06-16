import {
  makeWASocket,
  useMultiFileAuthState,
  DisconnectReason,
} from "@whiskeysockets/baileys";
import handleConnection from "../connection/handleConnection.mjs";
import syncAuth from "../connection/handleSyncAuthRemote.mjs";
import handleRecieveMsg from "../message/handleRecieveMsg.mjs";
import markGroupInactive from "../group/group_updates/handleGroup!active.mjs";
import { setSock } from "./sockInstance.mjs";

export default async function startBot() {
  await syncAuth.downloadAuth();

  const { state, saveCreds } = await useMultiFileAuthState("./auth");
  const sock = makeWASocket({
    auth: state,
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
    try {
      await handleRecieveMsg(msg);
    } catch (err) {
      console.error("Error in handleRecieveMsg:", err);
    }
  });

  // Event listener for group updates (when group is deleted or participants are removed)
  sock.ev.on("groups.update", async (updates) => {
    for (const update of updates) {
      if (
        update.id &&
        update.participants &&
        update.participants.length === 0
      ) {
        await markGroupInactive(update.id);
      }
    }
  });

  // If the bot is removed from the group
  sock.ev.on("group-participants.update", async (update) => {
    console.log();
    if (
      update.id &&
      update.participants &&
      update.participants.includes(`${sock.user.lid}`.split(":")[0] + "@lid") &&
      update.action === "remove"
    ) {
      await markGroupInactive(update.id);
    }
  });
}
