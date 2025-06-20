import handleSendMsg from "../../message/handleSendMsg.mjs";
import { getSock } from "../../utils/sockInstance.mjs";
import joinGroup from "./handleJoinGroup.mjs";
import { waitForAdminReply } from "../../utils/handleWaitForReply.mjs";
import supabase from "../../client/supabase.mjs";
import { allowGroupInvite } from "./allowedNewGroups.mjs";
const { sendTextMsg } = handleSendMsg;

export default async function reqJoinGroup(inviteCode, sender) {
  const sock = getSock();
  const requestId = Date.now().toString(); // Unique per request
  const botAdmin = "2347083119673@s.whatsapp.net";

  const { id, owner, subject, desc, size } = await sock.groupGetInviteInfo(
    inviteCode
  );

  const adminData = await isSenderAnAdmin(sender);

  if (adminData) {
    await sendTextMsg(
      sender,
      "❗ You are already an admin of another group. You cannot be admin of more than one group."
    );
    return;
  }

  // checking if bot already in group
  const inGroup = await isBotinGroup(sock, id);

  if (inGroup) {
    await sendTextMsg(
      sender,
      `_🤖 Lecture Bot is already active in this group!_ \n
      No need to add me again — I'm all set and ready to help. ✅📚`
    );

    return;
  }

  await sendTextMsg(
    sender,
    `I am resricted to join groups without my admin's permission.\n
    Please wait while I make a request to my to join your group .....\n
    🔃🔃🔃🔃🔃🔃🔃🔃🔃🔃🔃 \n
    \n⚠ You can contant the admin (07083119673) to accept the request)`
  );

  await sendTextMsg(
    botAdmin,
    `Hey Dev Prince, \n*REQUEST #${requestId} FOR PERMISSION TO JOIN A NEW GROUP*\n
    The group info is as follows; \nGroup Id: ${id} \nGroup Name: ${subject}
    \nGroup Description: ${desc} \nGroup Owner: ${owner} \nNo. of members: 
    ${size} \nShould I proceed to joining group?\n
    Reply with "yes ${requestId}" to approve or "no ${requestId}" to decline.`
  );

  waitForAdminReply(botAdmin, requestId, async (error, decision) => {
    if (error) {
      await sendTextMsg(
        sender,
        "No reply received from admin. Please try again later."
      );
      return;
    }

    if (decision.toLowerCase() === "yes") {
      allowGroupInvite(id);
      await joinGroup(inviteCode, sender);
    } else {
      await sendTextMsg(
        sender,
        `Your request to add *Lecture Bot* to your group was declined.\nContact Admin (07083119673)`
      );
    }
  });
}

async function isBotinGroup(sock, group_jid) {
  try {
    const { data } = await supabase
      .from("groups")
      .select("*")
      .eq("group_jid", group_jid)
      .single();

    if (data) {
      console.log(`✅ Group ${group_jid} already exists and is active in db. \n
        checking if the bot is in whatsapp group`);

      const metadata = await sock.groupMetadata(group_jid);

      return true;
    }
  } catch (error) {
    console.log(
      "Error checking if bot is in database or not active in group",
      error
    );

    return false;
  }
}

// check if sender is already an admin in any group function
async function isSenderAnAdmin(sender) {
  try {
    const { data, error } = await supabase
      .from("admins")
      .select("*")
      .eq("admin_jid", sender)
      .maybeSingle();

    return data;
  } catch (error) {
    console.error("Error checking if sender is an admin:", error);
    return false;
  }
}
