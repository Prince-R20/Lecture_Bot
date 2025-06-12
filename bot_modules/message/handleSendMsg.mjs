import { getSock } from "../utils/sockInstance.mjs";

async function sendTextMsg(sender, text, mentions = []) {
  const sock = getSock();
  await sock.sendMessage(sender, {
    text,
    mentions,
  });
}

async function sendMediaMsg(group_jid, message) {
  const sock = getSock();
  await sock.sendMessage(group_jid, message);
}

export default { sendTextMsg, sendMediaMsg };
