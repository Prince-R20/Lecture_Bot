import processMaterialRequest from "./processMaterialRequest.mjs";
import handleSendMsg from "../../message/handleSendMsg.mjs";
import getRequestMaterial from "./getRequestMaterial.mjs";

const { sendMediaMsg, sendTextMsg } = handleSendMsg;

export default async function deliverDocumentToGroup(
  group_jid,
  participant_jid,
  message
) {
  const { commandTrigger, actionKeyword, materialIdentifier } =
    processMaterialRequest(message);

  if (commandTrigger == false) return;

  if (!materialIdentifier) {
    await sendTextMsg(participant_jid, {
      text: "❗ Invalid request: You must provide at least a course code or course title to request study material.",
    });
    return;
  }

  const material = getRequestMaterial(
    group_jid,
    actionKeyword,
    materialIdentifier
  );

  await sendMediaMsg(sender, {
    document: buffer,
    fileName: match.original_file_name || "file.pdf",
    mimetype: "application/pdf",
  });
}
