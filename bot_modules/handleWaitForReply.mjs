import { getSock } from "./sockInstance.mjs";

export default async function waitForReply(jid) {
  const sock = getSock();

  return new Promise((resolve, reject) => {
    const onMessage = (msg) => {
      const message = msg.messages?.[0];
      if (
        message &&
        message.key &&
        message.key.remoteJid === jid &&
        !message.key.fromMe &&
        message.message?.conversation
      ) {
        sock.ev.off("messages.upsert", onMessage); // Stop listening
        resolve(message.message.conversation);
      }
    };

    sock.ev.on("messages.upsert", onMessage);

    // Timeout in case user doesn't reply
    const timer = setTimeout(() => {
      sock.ev.off("messages.upsert", onMessage);
      reject(new Error("Timeout: No reply received."));
    }, 60000);
  });
}
