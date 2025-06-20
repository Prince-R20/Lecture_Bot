import processMaterialRequest from "./processMaterialRequest.mjs";
import handleSendMsg from "../../message/handleSendMsg.mjs";
import getRequestMaterialInfo from "./getRequestMaterialInfo.mjs";
import getMaterialFromDrive from "./getMaterialFromDrive.mjs";

const { sendMediaMsg, sendTextMsg } = handleSendMsg;

export default async function deliverDocumentToGroup(
  group_jid,
  participant_jid,
  message
) {
  const { commandTrigger, actionKeyword, materialIdentifier } =
    processMaterialRequest(message, group_jid);

  if (commandTrigger == false) return;

  if (!materialIdentifier) {
    await sendTextMsg(participant_jid, {
      text: "❗ Invalid request: You must provide at least a course code or course title to request study material.",
    });
    return;
  }

  const materialInfo = await getRequestMaterialInfo(
    group_jid,
    actionKeyword,
    materialIdentifier
  );
  if (!materialInfo || materialInfo.length === 0) {
    await sendTextMsg(
      group_jid,
      "❗ No study material found for the provided course code or title.",
      [participant_jid]
    );
    return;
  }

  const { buffer, file_name, mimeType } = await getMaterialFromDrive(
    materialInfo
  );

  await sendMediaMsg(group_jid, {
    document: buffer,
    fileName: file_name,
    mimetype: mimeType,
  });
}
