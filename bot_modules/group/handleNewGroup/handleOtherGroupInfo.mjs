import { waitForUserReply } from "../../utils/handleWaitForReply.mjs";
import handleSendMsg from "../../message/handleSendMsg.mjs";

const { sendTextMsg } = handleSendMsg;

export default async function getOtherGroupInfo(inviteCodeSender) {
  // Level: must be 100, 200, 300, etc.
  const levelPrompt = `Let's get to know the group.\n\n🎓 What is the *current level* for this group? (e.g., 100, 200, 300)`;
  const levelValidate = (reply) => /^\d{3}$/.test(reply.trim());
  const current_level = await promptUntilValid(
    inviteCodeSender,
    levelPrompt,
    levelValidate
  );

  // Semester: must be "First", "Second", "1st", "2nd", etc.
  const semesterPrompt = `🗓️ What is the *current semester* for this group? (e.g., First, Second)`;
  const semesterValidate = (reply) =>
    /(first|second|1st|2nd)/i.test(reply.trim());
  const current_semester = await promptUntilValid(
    inviteCodeSender,
    semesterPrompt,
    semesterValidate
  );

  return { current_level, current_semester };
}

async function promptUntilValid(inviteCodeSender, promptMsg, validateFn) {
  await sendTextMsg(inviteCodeSender, promptMsg);
  return new Promise((resolve) => {
    waitForUserReply(
      inviteCodeSender,
      async function handleReply(error, reply) {
        if (error || !validateFn(reply)) {
          await sendTextMsg(
            inviteCodeSender,
            "❗ Please provide a valid response."
          );
          // Reprompt recursively
          const result = await promptUntilValid(
            inviteCodeSender,
            promptMsg,
            validateFn
          );
          return resolve(result);
        }
        resolve(reply.trim());
      }
    );
  });
}
