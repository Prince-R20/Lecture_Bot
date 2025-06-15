import { saveAdminData } from "../handleNewGroup/handleSaveToDatabase.mjs";
import { verifyGroupActive } from "../handle_savingStudyMaterial/verify_sender_group.mjs";
import handleSendMsg from "../../message/handleSendMsg.mjs";
import { isAddAdminValid } from "./addAssistAdmin.mjs";

const { sendTextMsg } = handleSendMsg;

export default async function makeAssistAdmin(text, sender) {
  // Extract group_jid
  const group_jid = text.replace("ASSIST:", "").trim();

  const isGroupActive = await verifyGroupActive(group_jid);

  if (isGroupActive == false || isGroupActive.is_active == false) {
    await sendTextMsg(
      sender,
      `Lecture bot is not an active participant of the group you are 
      applying to be an admin for.`
    );
    return;
  }

  // Check if adding a new admin is valid
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

  // Add sender as admin for that group
  await saveAdminData(group_jid, sender);
}
