import supabase from "../../client/supabase.mjs";
import handleSendMsg from "../../message/handleSendMsg.mjs";

const { sendTextMsg } = handleSendMsg;

export default async function verify_sender_group(sender) {
  const botGroupAdmin = await verifySenderIsAdmin(sender);
  if (botGroupAdmin == false) {
    await sendTextMsg(sender, "You are not authorized to send me any message.");
    return;
  }

  const group = await verifyGroupActive(botGroupAdmin.group_jid);
  if (group == false) {
    await sendTextMsg(sender, "I'm not active on your group.");
    return;
  }

  return [botGroupAdmin, group];
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
        "You are not authorize to send me any message."
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

export async function verifyGroupActive(group_jid) {
  try {
    const { data, error } = await supabase
      .from("groups")
      .select("is_active, folder_id")
      .eq("group_jid", group_jid)
      .single();

    if (error) {
      console.error("Error fetching data:", error);
      return false;
    } else if (!data) {
      return false;
    } else {
      return data;
    }
  } catch (error) {
    console.error("Error verifying group is active:", err);
  }
}
