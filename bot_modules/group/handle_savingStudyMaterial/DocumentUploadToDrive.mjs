import supabase from "../../client/supabase.mjs";
import { downloadMediaMessage } from "@whiskeysockets/baileys";
import crypto from "node:crypto";

const tempUpload = new Map();

export default async function uploadDocumentToDrive(media, message, sender) {
  const botGroupAdmin = await verifySenderIsAdmin(sender);
  if (botGroupAdmin == false) {
    await send;
    return;
  }

  const group = await verifyGroupActive(botGroupAdmin.group_jid);
  if (group == false) return;

  const buffer = downloadMediaMessage(message, "buffer");
  const { mimetype, fileName } = media;
  const fileHash = getFileHash(buffer);

  tempUpload.set(sender, { buffer, fileHash, fileName, mimetype });
}

async function verifySenderIsAdmin(senderJid) {
  try {
    const { data, error } = await supabase
      .from("admins")
      .select("id, admin_jid, group_jid")
      .eq("admin_jid", senderJid)
      .single();

    if (error) {
      console.err("Error fetching data:", error);
    } else if (!data) {
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
      .select("is_active")
      .eq("group_jid", group_jid)
      .single();

    if (error) {
      console.err("Error fetching data:", error);
    } else if (!data) {
      return false;
    } else {
      return data;
    }
  } catch (error) {
    console.error("Error verifying group is active:", err);
  }
}

async function getFileHash(buffer) {
  return crypto.createHash("sha256").update(buffer).digest("hex");
}
