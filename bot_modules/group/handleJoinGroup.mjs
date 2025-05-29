import handleSendMsg from "../dm/handleSendMsg.mjs";
const { sendTextMsg } = handleSendMsg;

export default async function joinGroup(sock, inviteCode, inviteCodeSender) {
  const botAdmin = "2347083119673@s.whatsapp.net";
  sock.groupAcceptInvite(inviteCode);

  await sendTextMsg(
    sock,
    botAdmin,
    "*Lecture Bot has successfully joined the group*"
  );

  await sendTextMsg(
    sock,
    inviteCodeSender,
    `*Lecture Bot has successfully joined your group.* \n
    Please wait while I prepare you a guide to get the best of my services.`
  );
}
