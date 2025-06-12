import handleSendMsg from "../../message/handleSendMsg.mjs";
import { getSock } from "../../utils/sockInstance.mjs";
import { saveGroupData } from "./handleSaveToDatabase.mjs";
import getOtherGroupInfo from "./handleOtherGroupInfo.mjs";
import sendStarterMsg from "./handleStarterMsg.mjs";

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

  const { current_level, current_semester } = await getOtherGroupInfo(
    inviteCodeSender
  );

  await saveGroupData(
    response,
    inviteCodeSender,
    current_level,
    current_semester
  );

  await sendStarterMsg(inviteCodeSender, response);
}
