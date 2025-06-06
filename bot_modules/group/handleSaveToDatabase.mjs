import {
  createAdminData,
  createGroupData,
} from "../database/createNewGroupData.mjs";
import { getSock } from "../sockInstance.mjs";

export async function saveGroupData(groupJid, botAdmin) {
  const sock = getSock();

  try {
    const { id, subject, desc, owner, size } = await sock.groupMetadata(
      groupJid
    );
    const groupData = [
      {
        group_jid: id,
        group_name: subject,
        subject: desc,
        owner_jid: owner,
        participants_count: size,
      },
    ];

    await createGroupData(groupData);
    saveAdminData(groupJid, botAdmin);
  } catch (err) {
    console.error("Error saving group data:", err);
  }
}

export async function saveAdminData(group_jid, botAdmin) {
  try {
    const adminData = [{ group_jid, admin_jid: botAdmin }];
    await createAdminData(adminData);
  } catch (err) {
    console.error("Error saving admin data:", err);
  }
}
