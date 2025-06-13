import handleSendMsg from "../../message/handleSendMsg.mjs";
import { getSock } from "../../utils/sockInstance.mjs";
const { sendTextMsg } = handleSendMsg;

export default async function sendStarterMsg(inviteCodeSender, groupJid) {
  const sock = getSock();
  const groupMeta = await sock.groupMetadata(groupJid);
  const allJids = groupMeta.participants.map((p) => p.id);

  const starterMsg = `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n
👋 *Welcome to the Group!* ${
    groupMeta.subject ? `*${groupMeta.subject}*` : ""
  }\n\n
I'm *Lecture Bot* 🤖, here to help you access and share study materials with ease!
\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📚 *How to Request Study Materials*
\nYou can request lecture notes, past questions, or other materials by sending a message in this group using any of these formats:\n\n

\n- *bot send STA213 notes*
\n- *bot send Design and Analysis of Experiments pdf*
\n- *bot send 100 level first semester materials*
\n- *bot send MTH211 past questions*
\n- *bot send 200 level second semester STA222 pq*

\n\nYou can use:
\nYou can use:
\n- *Course Code* (e.g., STA213)
\n- *Course Title* (e.g., Design and Analysis of Experiments)
\n- *Level* (e.g., 100 level, 200 level)
\n- *Semester* (e.g., First semester, Second semester)
\n- *Material Type* (e.g., notes, pdf, pq, past questions)
\n- *Part* (e.g., part 1, part two)

\n*Tip:* You can combine any of these in your request for more accurate results!

\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
\n🔎 *Examples of Valid Requests:*
\n- bot send MTH211 notes
\n- bot send Mathematical Methods I pdf
\n- bot send 300 level first semester materials
\n- bot send past questions for PHY101
\n- bot send STA213 part 1 notes
\n- bot send Mathematical Methods I part two pdf

\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
\n❓ *Need Help?*
\nJust type *bot help* in the group and I'll guide you!

\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
\n✨ Let's make learning easier together. If you have any questions, ask your group admin or type *bot help* at any time!

\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`.trim();

  // Tell invite code sender that the request was approved
  await sendTextMsg(
    inviteCodeSender,
    `*Lecture Bot* has successfully joined your group! 🎉\n\n
      You can now start uploading lecture notes and assisting your students.`
  );

  // Send the starter message to the invite code sender
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

  // Send the message with mentions (participants will be notified)
  await sendTextMsg(groupJid, starterMsg, allJids);
}
