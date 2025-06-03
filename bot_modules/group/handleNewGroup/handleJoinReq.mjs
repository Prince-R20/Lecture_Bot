import handleSendMsg from "../../dm/handleSendMsg.mjs";
import { getSock } from "../../sockInstance.mjs";
import joinGroup from "./handleJoinGroup.mjs";
import { waitForReply } from "../../handleWaitForReply.mjs";
const { sendTextMsg } = handleSendMsg;

export default async function reqJoinGroup(inviteCode, sender) {
  const sock = getSock();
  const requestId = Date.now().toString(); // Unique per request
  const botAdmin = "2347083119673@s.whatsapp.net";

  const { id, owner, subject, desc, size } = await sock.groupGetInviteInfo(
    inviteCode
  );

  await sendTextMsg(
    sender,
    `I am resricted to join groups without my admin's permission.\n
    Please wait while I make a request to my to join your group .....\n
    🔃🔃🔃🔃🔃🔃🔃🔃🔃🔃🔃 \n
    \n⚠ You can contant the admin (07083119673) to accept the request)`
  );

  await sendTextMsg(
    botAdmin,
    `Hey Dev Prince, \n*REQUEST #${requestId} FOR PERMISSION TO JOIN A NEW GROUP*\n
    The group info is as follows; \nGroup Id: ${id} \nGroup Name: ${subject}
    \nGroup Description: ${desc} \nGroup Owner: ${owner} \nNo. of members: 
    ${size} \nShould I proceed to joining group?\n
    Reply with "yes ${requestId}" to approve or "no ${requestId}" to decline.`
  );

  waitForReply(botAdmin, requestId, async (error, decision) => {
    if (error) {
      await sendTextMsg(
        sender,
        "No reply received from admin. Please try again later."
      );
      return;
    }

    if (decision.toLowerCase() === "yes") {
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
