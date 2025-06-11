import { getSock } from "../utils/sockInstance.mjs";

async function sendTextMsg(sender, text) {
  const sock = getSock();
  await sock.sendMessage(sender, {
    text,
  });
}

function sendMediaMsg() {}

export default { sendTextMsg, sendMediaMsg };
