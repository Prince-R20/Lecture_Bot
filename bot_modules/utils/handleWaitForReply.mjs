import { getSock } from "./sockInstance.mjs";

const pendingReplies = new Map();

/**
 * Wait for a reply from a specific admin for a specific request.
 * @param {string} adminJid - The admin's JID.
 * @param {string} requestId - Unique request ID.
 * @param {function} callback - Function to call with (error, reply).
 * @param {number} timeout - Timeout in ms (default: 60000).
 */

export function waitForReply(adminJid, requestId, callback, timeout = 120000) {
  const sock = getSock();
  const key = `${adminJid}:${requestId}`;

  // If already waiting for this JID, reject the previous one
  if (pendingReplies.has(key)) {
    pendingReplies
      .get(key)
      .reject(new Error("Another wait is already pending for this user."));
  }

  let resolved = false;
  const timer = setTimeout(() => {
    sock.ev.off("messages.upsert", onMessage);
    pendingReplies.delete(key);
    if (!resolved) callback(new Error("Timeout: No reply received."), null);
  }, timeout);

  function onMessage(msg) {
    const message = msg.messages?.[0];
    if (
      message &&
      message.key &&
      message.key.remoteJid === adminJid &&
      !message.key.fromMe &&
      message.message?.conversation
    ) {
      // Expect reply format: "yes 123456" or "no 123456"
      const replyText = message.message.conversation.trim();
      const [decision, idFromReply] = replyText.split(/\s+/);

      if (idFromReply === requestId) {
        clearTimeout(timer);
        sock.ev.off("messages.upsert", onMessage);
        pendingReplies.delete(key);
        resolved = true;
        callback(null, decision.toLowerCase());
      }
    }
  }

  pendingReplies.set(key, { callback });
  sock.ev.on("messages.upsert", onMessage);
}
