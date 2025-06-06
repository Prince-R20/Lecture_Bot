import handleSendMsg from "../../dm/handleSendMsg.mjs";
import { getSock } from "../../sockInstance.mjs";
import { saveGroupData } from "./handleSaveToDatabase.mjs";

const { sendTextMsg } = handleSendMsg;

export default async function joinGroup(inviteCode, inviteCodeSender) {
  const sock = getSock();

  const botAdmin = "2347083119673@s.whatsapp.net";
  const response = await sock.groupAcceptInvite(inviteCode);

  if (!response) return;

  await sendTextMsg(
    botAdmin,
    "*Lecture Bot has successfully joined the group*"
  );

  await saveGroupData(response, inviteCodeSender);

  await sendTextMsg(
    inviteCodeSender,
    "Your request to add *Lecture Bot* to your group was approved!"
  );

  await sendTextMsg(
    inviteCodeSender,
    `*👋 Welcome to Lecture Bot Admin Guide* \nThanks for inviting 
    *Lecture Bot* to your group! This guide will help you understand your 
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
