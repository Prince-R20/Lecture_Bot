import reqJoinGroup from "../group/handleNewGroup/handleJoinReq.mjs";
import handleSendMsg from "./handleSendMsg.mjs";
import uploadDocumentToDrive from "../group/handle_savingStudyMaterial/DocumentUploadToDrive.mjs";
import deliverDocumentToGroup from "../group/handle_deliveringStudyMaterial/deliverDocumentToGroup.mjs";
import addAssistantAdmin from "../group/handleAdmin/addAssistAdmin.mjs";
import makeAssistAdmin from "../group/handleAdmin/makeAssistAdmin.mjs";
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
    message.message.documentMessage ||
    message.message.imageMessage ||
    message.message.videoMessage ||
    (message.message.audioMessage && !message.message.audioMessage?.ptt);

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
  if (
    typeof sender === "string" &&
    sender.endsWith("@s.whatsapp.net") &&
    media
  ) {
    await uploadDocumentToDrive(media, message, sender);
  }

  //if message is from a group (possibly a request from a participant)
  if (sender.endsWith("@g.us") && !media) {
    const participant = message.key.participant;
    await deliverDocumentToGroup(sender, participant, text);
  }

  // If a current group admin want to add an assistant admin
  if (
    sender.endsWith("@s.whatsapp.net") &&
    text.toLowerCase().trim() === "add assistant to group"
  ) {
    await addAssistantAdmin(sender);
  } else if (sender.endsWith("@s.whatsapp.net") && text.startsWith("ASSIST:")) {
    await makeAssistAdmin(text, sender);
  }
}
