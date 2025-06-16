import supabase from "../../client/supabase.mjs";
import handleSendMsg from "../../message/handleSendMsg.mjs";

const { sendTextMsg } = handleSendMsg;

export default async function markGroupInactive(groupJid) {
  try {
    // Update the group status to inactive in the database
    const { data, error } = await supabase
      .from("groups")
      .update({ is_active: false })
      .eq("group_jid", groupJid);

    if (error) {
      console.error("Error updating group status:", error);
      return false;
    }

    console.log(`Group ${groupJid} marked as inactive.`);

    // Alert the admins that the group is now inactive
    const { data: adminData, error: adminError } = await supabase
      .from("admins")
      .select("admin_jid")
      .eq("group_jid", groupJid);

    if (adminError) {
      console.error("Error informing admin of group status:", error);
      return false;
    }

    for (const admin of adminData) {
      await sendTextMsg(
        admin.admin_jid,
        `The group you are managing has been marked as inactive. Please take necessary actions.`
      );
    }

    return true;
  } catch (error) {
    console.error("Error in makeGroupInactive:", err);
    return false;
  }
}
