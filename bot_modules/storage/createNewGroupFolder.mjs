import getDriveClient from "../client/drive.mjs";

export default async function createNewGroupFolder(groupName, group_jid) {
  try {
    const drive = await getDriveClient();

    const existing = await drive.files.list({
      q: `'1pJxl0Njf99hTbH0LG--q64MctcfCzBts' in parents and name contains '${group_jid}' and mimeType='application/vnd.google-apps.folder' and trashed = false`,
      fields: "files(id, name)",
    });

    if (existing.data.files.length > 0) {
      return {
        folderId: existing.data.files[0].id,
        name: existing.data.files[0].name,
        alreadyExist: true,
      };
    }

    const folderMetaData = {
      name: `${groupName} - ${group_jid}`,
      mimeType: "application/vnd.google-apps.folder",
      parents: ["1pJxl0Njf99hTbH0LG--q64MctcfCzBts"],
    };

    const res = await drive.files.create({
      resource: folderMetaData,
      fields: "id, name",
    });

    return {
      folderId: res.data.id,
      name: res.data.name,
      alreadyExist: false,
    };
  } catch (error) {
    console.error("❌ Error creating group folder:", error.message);
    throw error;
  }
}
