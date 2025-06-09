import supabase from "../../client/supabase.mjs";
import { downloadMediaMessage } from "@whiskeysockets/baileys";
import crypto from "node:crypto";
import { waitForUserReply } from "../../utils/handleWaitForReply.mjs";
import handleSendMsg from "../../dm/handleSendMsg.mjs";
import saveFileToDrive from "../../storage/handleSaveFile.mjs";

const { sendTextMsg } = handleSendMsg;

const tempUpload = new Map();

export default async function uploadDocumentToDrive(media, message, sender) {
  const botGroupAdmin = await verifySenderIsAdmin(sender);
  if (botGroupAdmin == false) {
    await sendTextMsg(sender, "You are not authorized to send me any media.");
    return;
  }

  const group = await verifyGroupActive(botGroupAdmin.group_jid);
  if (group == false) return;

  const buffer = await downloadMediaMessage(message, "buffer");
  const { mimetype, fileName } = media;
  const fileHash = getFileHash(buffer);

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
    \n
    *🎨 Example*
    Sta213
    Design and Analysis of Experiments
    Note on Anova
    One
    First
    200
    \n*Waiting for your response...📝*
`
  );

  waitForUserReply(sender, async (error, reply) => {
    if (error) {
      await sendTextMsg(
        sender,
        "No reply received from you. Please try again later."
      );
      return;
    }

    const fileInfo = parseFileMetaData(reply);
    const pending = tempUpload.get(sender);

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
    };

    try {
      const driveRes = await saveFileToDrive(metaData);

      if (driveRes && driveRes.id) {
        await sendTextMsg(
          sender,
          `✅ Your study material *${driveRes.name}* was successfully uploaded and saved to the drive!`
        );

        // Notify the group about the new material
        await sendTextMsg(
          groupJid, // The group's JID
          groupMaterialAnnouncement(driveRes)
        );
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

async function verifySenderIsAdmin(senderJid) {
  try {
    const { data, error } = await supabase
      .from("admins")
      .select("admin_id, admin_jid, group_jid")
      .eq("admin_jid", senderJid)
      .single();

    if (error) {
      console.error("Error fetching data:", error);
      return false;
    } else if (!data) {
      await sendTextMsg(
        senderJid,
        "You are not authorize to send me any media."
      );
      return false;
    } else {
      return data;
    }
  } catch (err) {
    console.error("Error verifying sender is admin:", err);
    throw err;
  }
}

async function verifyGroupActive(group_jid) {
  try {
    const { data, error } = await supabase
      .from("groups")
      .select("is_active, folder_id")
      .eq("group_jid", group_jid)
      .single();

    if (error) {
      console.error("Error fetching data:", error);
    } else if (!data) {
      return false;
    } else {
      return data;
    }
  } catch (error) {
    console.error("Error verifying group is active:", err);
  }
}

function getFileHash(buffer) {
  return crypto.createHash("sha256").update(buffer).digest("hex");
}

function parseFileMetaData(reply = "") {
  const lines = reply
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0);

  if (lines.length < 6) {
    throw new Error(
      "Incomplete details. Please provide all 6 requires fields."
    );
  }

  const [course_code, course_title, description, part, semester, level] = lines;

  return { course_code, course_title, description, part, semester, level };
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
🔗 *Ask the bot for this material by course code or title!*\n\n

✨ _Thanks to our admin for supporting your learning journey!_\n

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  `.trim();
}
