import handleSendMsg from "../../dm/handleSendMsg.mjs";
import { getSock } from "../../sockInstance.mjs";
import { saveGroupData } from "./handleSaveToDatabase.mjs";

const { sendTextMsg } = handleSendMsg;

export default async function joinGroup(inviteCode, inviteCodeSender) {
  const sock = getSock();

  const botAdmin = "2347083119673@s.whatsapp.net";
  const response = await sock.groupAcceptInvite(inviteCode);

  if (!response) return;

  await sendTextMsg(
    botAdmin,
    "*Lecture Bot has successfully joined the group*"
  );

  saveGroupData(response, inviteCodeSender);
}
