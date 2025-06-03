import reqJoinGroup from "../group/handleNewGroup/handleJoinReq.mjs";
import handleSendMsg from "./handleSendMsg.mjs";
import { getSock } from "../sockInstance.mjs";
const { sendTextMsg, sendMediaMsg } = handleSendMsg;

//Join new group variables
const botAdmin = "2347083119673@s.whatsapp.net";

export default async function handleRecieveMsg(msg) {
  const sock = getSock();

  const message = msg.messages[0];
  if (!message.message || message.key.fromMe) return;

  const sender = message.key.remoteJid;
  const text =
    message.message.conversation ||
    message.message.extendedTextMessage?.text ||
    "";

  console.log(`📨 ${sender}: ${text}`);

  if (text.toLowerCase() === "hello") {
    await sendTextMsg(
      sender,
      "Hey! 👋 Welcome to *LectureBot* 📚\n\nSend something like *Send MAT101* to receive a note. \n\n```Powered by Dev Prince```"
    );
    return;
  }

  //If there is an invite code sent to the bot
  if (
    text.includes(
      "Follow this link to join my WhatsApp group" &&
        "https://chat.whatsapp.com/"
    )
  ) {
    const inviteCode = text.slice(text.lastIndexOf("/") + 1);

    await reqJoinGroup(inviteCode, sender);
  }
}
