import reqJoinGroup from "../group/handleNewGroup/handleJoinReq.mjs";
import joinGroup from "../group/handleNewGroup/handleJoinGroup.mjs";
import handleSendMsg from "./handleSendMsg.mjs";
import { getSock } from "../sockInstance.mjs";
import { waitForReply } from "../handleWaitForReply.mjs";
const { sendTextMsg, sendMediaMsg } = handleSendMsg;

//Join new group variables
let waitingRequestApproval = false;
let inviteCode = "";
let inviteCodeSender = "";
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
    inviteCode = text.slice(text.lastIndexOf("/") + 1);
    inviteCodeSender = sender;
    await reqJoinGroup(inviteCode, sender);
    waitingRequestApproval = true;

    waitForReply(botAdmin, async (error, reply) => {
      if (error) {
        await sendTextMsg(
          sender,
          "No reply received from admin. Please try again later."
        );
        return;
      }

      if (reply.toLowerCase() === "yes") {
        await joinGroup(inviteCode, sender);
        await sendTextMsg(
          sender,
          "Your request to add *Lecture Bot* to your group was approved!"
        );
      } else {
        await sendTextMsg(
          sender,
          `Your request to add *Lecture Bot* to your group was declined.\nContact Admin (07083119673)`
        );
      }
    });
  }

  //If bot is waiting for approval to join a group
  // if (waitingRequestApproval && text.toLowerCase() === "yes") {
  //   joinGroup(inviteCode, inviteCodeSender);

  //   waitingRequestApproval = false;
  //   inviteCode = "";
  //   inviteCodeSender = "";
  // } else if (waitingRequestApproval && text.toLowerCase() === "no") {
  //   await sendTextMsg(
  //     "2347083119673@s.whatsapp.net",
  //     "You have declined the request to join the group."
  //   );

  //   await sendTextMsg(
  //     inviteCodeSender,
  //     `Your request to add *Lecture Bot* to your group was declined.\n
  //     Contact Admin (07083119673)`
  //   );
  //   waitingRequestApproval = false;
  //   inviteCode = "";
  //   inviteCodeSender = "";
  // }
}
