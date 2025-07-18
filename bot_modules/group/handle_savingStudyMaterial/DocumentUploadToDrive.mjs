import { downloadMediaMessage } from "@whiskeysockets/baileys";
import crypto from "node:crypto";
import { waitForUserReply } from "../../utils/handleWaitForReply.mjs";
import handleSendMsg from "../../message/handleSendMsg.mjs";
import saveFileToDrive from "../../storage/handleSaveFile.mjs";
import getFileInfo from "./processFileMetaData.mjs";
import verify_sender_group from "./verify_sender_group.mjs";
import checkFileExists from "./checkFileExist.mjs";

const { sendTextMsg, sendMediaMsg } = handleSendMsg;

const tempUpload = new Map();

export default async function uploadDocumentToDrive(media, message, sender) {
  const verified = await verify_sender_group(sender);

  const botGroupAdmin = verified[0];
  const group = verified[1];

  const buffer = await downloadMediaMessage(message, "buffer");
  const { mimetype, fileName } = media;
  const fileHash = getFileHash(buffer);

  const fileExists = await checkFileExists(fileHash);

  if (fileExists) {
    await sendTextMsg(
      sender,
      "❗ This file has already been uploaded and saved. Duplicate uploads are not allowed."
    );

    return;
  }

  tempUpload.set(sender, {
    buffer,
    fileHash,
    fileName,
    mimetype,
    group_folder_id: group.folder_id,
  });

  // Send prompt after recieveing the study material
  await sendTextMsg(
    sender,
    `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    *🏆 Lecture note recieved*
    \nPlease reply with the following details - *_each on a new line_*:
    \n1. 🆔 *Course Code:*
    \n2. 📝 *Course Title:*
    \n3. 🧾 *Description:* _(what does this note cover?)_
    \n4. 🔢 *Part:* _(Optional, if not applicable, type "-")_
    \n5. 🗓️ *Semester:* _(e.g.,First or Second)_
    \n6. 🎓 *Level:* _(e.g., 100, 200, etc,)_
    \n7. 🎓 *What type of material is this?*\n
    1 - Lecture Note\n2 - Past Question (PQ)_
    \n
    *🎨 Example*
    Sta213
    Design and Analysis of Experiments
    Note on Anova
    One
    First
    200
    1
    \n*Waiting for your response...📝*
`
  );

  waitForUserReply(sender, async function handleReply(error, reply) {
    if (error) {
      await sendTextMsg(
        sender,
        "No reply received from you. Please try again later."
      );
      return;
    }

    const fileInfo = await getFileInfo(reply, handleReply);

    const pending = tempUpload.get(sender);

    console.log(pending.mimetype);

    const metaData = {
      group_folder_id: pending.group_folder_id,
      fileBuffer: pending.buffer,
      fileName: pending.fileName,
      mimetype: pending.mimetype,
      course_code: fileInfo.course_code,
      course_title: fileInfo.course_title,
      description: fileInfo.description,
      part: fileInfo.part,
      level: fileInfo.level,
      semester: fileInfo.semester,
      file_hash: fileHash,
      group_jid: botGroupAdmin.group_jid,
      bot_admin_jid: sender,
      material_type: fileInfo.material_type,
    };

    try {
      const driveRes = await saveFileToDrive(metaData);

      if (driveRes && driveRes.id) {
        await sendTextMsg(
          sender,
          `✅ Your study material *${driveRes.name}* was successfully uploaded and saved to the drive!`
        );

        // Notify the group about the new material
        await sendMediaMsg(botGroupAdmin.group_jid, {
          document: buffer,
          fileName: metaData.fileName,
          mimetype: metaData.mimetype,
          caption: groupMaterialAnnouncement(driveRes),
        });
      } else {
        await sendTextMsg(
          sender,
          "⚠️ Sorry, something went wrong while saving your file. Please try again later."
        );
      }
    } catch (err) {
      await sendTextMsg(
        sender,
        "❌ An error occurred while saving your file. Please try again later."
      );
    } finally {
      tempUpload.delete(sender);
    }
  });
}

function getFileHash(buffer) {
  return crypto.createHash("sha256").update(buffer).digest("hex");
}

function groupMaterialAnnouncement(file) {
  return `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📚 *New Study Material Available!* \n

🎉 *${
    file.properties?.course_title || file.name
  }* has just been uploaded for this group! \n

🆔 *Course Code:* ${file.properties?.course_code || "N/A"}\n
📝 *Title:* ${file.properties?.course_title || "N/A"}\n
🧾 *Description:* ${file.description || "No description provided."}\n
${
  file.properties?.part !== "-"
    ? `〽 *Part:* ${file.properties?.part || "No description provided."}\n`
    : ""
}
🧾 *Semester:* ${file.properties?.semester || "-"}\n
🧾 *Level:* ${file.properties?.level || "-"}\n
🔗 *Ask the bot for this material by course code or title!*\n\n

✨ _Thanks to our admin for supporting your learning journey!_\n

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  `.trim();
}
