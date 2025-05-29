async function sendTextMsg(sock, sender, text) {
  await sock.sendMessage(sender, {
    text,
  });
}

function sendMediaMsg() {}

export default { sendTextMsg, sendMediaMsg };
