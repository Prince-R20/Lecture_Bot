import reqJoinGroup from "../group/handleJoinReq.mjs";
import joinGroup from "../group/handleJoinGroup.mjs";
import handleSendMsg from "./handleSendMsg.mjs";
const { sendTextMsg, sendMediaMsg } = handleSendMsg;

//Join new group variables
let waitingRequestApproval = false;
let inviteCode = "";
let inviteCodeSender = "";

export default async function handleRecieveMsg(sock, msg) {
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
      sock,
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
    inviteCode = text.slice(text.lastIndexOf("/") + 1);
    inviteCodeSender = sender;
    reqJoinGroup(sock, inviteCode, sender);
    waitingRequestApproval = true;
  }

  //If bot is waiting for approval to join a group
  if (waitingRequestApproval && text.toLowerCase() === "yes") {
    joinGroup(sock, inviteCode, inviteCodeSender);

    waitingRequestApproval = false;
    inviteCode = "";
    inviteCodeSender = "";
  } else if (waitingRequestApproval && text.toLowerCase() === "no") {
    await sendTextMsg(
      sock,
      inviteCodeSender,
      "You have declined the request to join the group."
    );
    waitingRequestApproval = false;
    inviteCode = "";
    inviteCodeSender = "";
  }
}
