import handleSendMsg from "../dm/handleSendMsg.mjs";
const { sendTextMsg } = handleSendMsg;

export default async function reqJoinGroup(sock, inviteCode, sender) {
  const botAdmin = "2347083119673@s.whatsapp.net";

  const { id, owner, subject, desc, size } = await sock.groupGetInviteInfo(
    inviteCode
  );

  await sendTextMsg(
    sock,
    sender,
    `I am resricted to join groups without my admin's permission.\n
    Please wait while I make a request to my to join your group .....\n
    🔃🔃🔃🔃🔃🔃🔃🔃🔃🔃🔃 \n
    \n⚠ You can contant the admin (07083119673) to accept the request)`
  );

  await sendTextMsg(
    sock,
    botAdmin,
    `Hey Dev Prince, \n*REQUEST FOR PERMISSION TO JOIN A NEW GROUP*\n
    The group info is as follows; \nGroup Id: ${id} \nGroup Name: ${subject}
    \nGroup Description: ${desc} \nGroup Owner: ${owner} \nNo. of members: 
    ${size} \nShould I proceed to joining group?`
  );
}
