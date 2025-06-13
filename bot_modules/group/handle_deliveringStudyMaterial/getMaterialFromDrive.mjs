import handleSendMsg from "../../message/handleSendMsg.mjs";
import getDriveClient from "../../client/drive.mjs";

const { sendTextMsg } = handleSendMsg;

export default async function getMaterialFromDrive(
  materialInfo,
  participant_jid,
  group_jid
) {
  // If only one match, download and return
  if (materialInfo.length == 1) {
    const fileInfo = materialInfo[0];
    const buffer = await downloadFromDrive(fileInfo.file_id);

    return {
      buffer,
      file_name: fileInfo.file_name,
      mimeType: fileInfo.mimeType,
    };
  }

  // If multiple, ask user to choose
  let optionsMsg =
    "Multiple materials found. Please reply with the number of your choice:\n\n";
  materialInfo.forEach((file, idx) => {
    optionsMsg += `${idx + 1}. ${file.course_code} - ${file.course_title} ${
      file.part != "-" ? `, part ${file.part}` : ""
    }
    })\n`;
  });

  await handleSendMsg(group_jid, optionsMsg, [participant_jid]);

  // Wait for user reply
  const choice = await new Promise((resolve) => {
    waitForUserReply(participant_jid, (err, reply) => {
      if (err) return resolve(null);
      const num = parseInt(reply.trim());
      if (isNaN(num) || num < 1 || num > materialInfo.length)
        return resolve(null);
      resolve(num - 1);
    });
  });

  if (choice === null) {
    await sendTextMsg(
      participant_jid,
      "❗ Invalid selection or no reply received."
    );
    return null;
  }

  const selectedFile = materialInfo[choice];
  const buffer = await downloadFromDrive(selectedFile.file_id);

  return {
    buffer,
    file_name: selectedFile.file_name,
    mimeType: selectedFile.mimeType,
  };
}

async function downloadFromDrive(file_id) {
  const drive = await getDriveClient();

  try {
    const res = await drive.files.get(
      { fileId: file_id, alt: "media" },
      { responseType: "arraybuffer" }
    );
    return Buffer.from(res.data);
  } catch (error) {
    console.error("Error downloading file from Drive:", error);
    throw error;
  }
}
