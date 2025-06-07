import reqJoinGroup from "../group/handleNewGroup/handleJoinReq.mjs";
import handleSendMsg from "./handleSendMsg.mjs";
import uploadDocumentToDrive from "../group/handle_savingStudyMaterial/DocumentUploadToDrive.mjs";
const { sendTextMsg, sendMediaMsg } = handleSendMsg;

export default async function handleRecieveMsg(msg) {
  const message = msg.messages[0];

  if (!message.message || message.key.fromMe) return;

  const sender = message.key.remoteJid;
  const text =
    message.message.conversation ||
    message.message.extendedTextMessage?.text ||
    "";
  const media =
    message.message.DocumentMessage ||
    message.message.ImageMessage ||
    message.message.VideoMessage ||
    (message.message.AudioMessage && !message.message.AudioMessage?.ptt);

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

  //if message sent is a media (a study material)
  if (media) {
    uploadDocumentToDrive(media, message, sender);
  }
}
