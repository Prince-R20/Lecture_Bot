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

  // Send the starter message to the invite code sender
  await sendTextMsg(
    sender,
    `*👋 Welcome to Lecture Bot Admin Guide* \n This guide will help you understand your 
    responsibilities as a *Group Admin*, and how to get the best out of the 
    bot in serving your students. \n━━━━━━━━━━━━━━━━━━━━\n\n
    *⚙️ Bot Admin & Assistant Role* 
    \n- You (the inviter) are now the *Bot Admin* for this group.
    \n- Each group can have *only one admin and one assistant*.
    \n- To add an assistant, simply send: 👉 *Add assistant to group*
    \n- ⚠️ *You can't remove or change the assistant for now, and the assistant can't remove themselves.*
    \n━━━━━━━━━━━━━━━━━━━━\n\n
    *📝 Uploading Lecture Notes*
    \nTo help students find the right materials easily, please follow these instructions when uploading a note:
    \n1. 🆔 *Course Code* – e.g., MTH 211
    \n2. 📝 *Course Title* – e.g., Mathematical Methods I
    \n3. 🧾 *Description* – Briefly describe what the note covers
    \n4. 🔢 *Part (Optional)* – If the note has multiple parts (e.g., I, II, III)
    \n5. 🎓 *Level* – e.g., 200 Level
    \n6. 🗓️ *Semester* – First or Second
    \n\n📌 *Note:*
    \n- Upload *only one file at a time.*
    \n- You *can’t edit or delete* a note after uploading for now, so double-check the information before submission.
    \n━━━━━━━━━━━━━━━━━━━━\n\n
    *👥 What the Assistant Can Do*
    \n- Assistants can upload lecture notes just like the admin.
    \n- They must follow the same structure as outlined above.
    \n━━━━━━━━━━━━━━━━━━━━\n\n
    *📤 How to Upload*
    \nWhen you send a PDF to the bot, it will guide you step-by-step to input the required details. Just follow the prompts, and your note will be stored and made searchable for students in your group.
    \n━━━━━━━━━━━━━━━━━━━━\n\n
    *🚀 Ready to Begin?*
    \nYou're all set! Use the command *Upload note* to start the upload process.
    Let's help your students get the best out of their learning journey! 🎓✨
`
  );
}
