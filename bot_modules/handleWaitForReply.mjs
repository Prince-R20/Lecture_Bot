import { getSock } from "./sockInstance.mjs";

const pendingReplies = new Map();

export function waitForReply(jid, callback, timeout = 60000) {
  const sock = getSock();
  // If already waiting for this JID, reject the previous one
  if (pendingReplies.has(jid)) {
    pendingReplies
      .get(jid)
      .reject(new Error("Another wait is already pending for this user."));
  }

  let resolved = false;
  const timer = setTimeout(() => {
    sock.ev.off("messages.upsert", onMessage);
    pendingReplies.delete(jid);
    if (!resolved) callback(new Error("Timeout: No reply received."), null);
  }, timeout);

  function onMessage(msg) {
    const message = msg.messages?.[0];
    if (
      message &&
      message.key &&
      message.key.remoteJid === jid &&
      !message.key.fromMe &&
      message.message?.conversation
    ) {
      clearTimeout(timer);
      sock.ev.off("messages.upsert", onMessage);
      pendingReplies.delete(jid);
      resolved = true;
      callback(null, message.message.conversation);
    }
  }

  pendingReplies.set(jid, { callback });
  sock.ev.on("messages.upsert", onMessage);
}
