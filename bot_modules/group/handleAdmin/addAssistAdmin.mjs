import verify_sender_group from "../handle_savingStudyMaterial/verify_sender_group.mjs";
import handleSendMsg from "../../message/handleSendMsg.mjs";
import supabase from "../../client/supabase.mjs";

const { sendTextMsg } = handleSendMsg;

export default async function addAssistantAdmin(sender) {
  const verified = await verify_sender_group(sender);
  const group_jid = verified[0].group_jid;

  const addValid = await isAddAdminValid(group_jid);

  if (addValid == undefined) {
    await sendTextMsg(
      sender,
      "An error occured checking if you are allow to add an admin"
    );
    return;
  } else if (addValid == false) {
    await sendTextMsg(
      sender,
      `There are already two admin managing the bot in your group.
      You are not allowed to add any more. If you have to add or change contact the admin: 07083119673`
    );
    return;
  }

  await sendTextMsg(
    sender,
    `Forward the below message to the person you would like to be your assistant. 
    They must forward it to the bot to complete the process.`
  );

  await sendTextMsg(sender, `ASSIST: ${group_jid}`);
}

export async function isAddAdminValid(group_jid) {
  try {
    const { data, error } = await supabase
      .from("admins")
      .select("*")
      .eq("group_jid", group_jid);

    if (error) return undefined;
    else if (data.length == 2) return false;
    else return true;
  } catch (error) {
    console.log("Error checking if admin is complete for the group:", error);
    throw error;
  }
}
