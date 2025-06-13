import getDriveClient from "../client/drive.mjs";
import { Readable } from "stream";
import { createFileData } from "../database/createFileData.mjs";

/**
 * Save a file to Google Drive in the structure: group_folder/level/semester/file
 * @param {string} group_folder_id - The ID of the group folder in Drive
 * @param {Buffer} fileBuffer - The file data
 * @param {string} fileName - The file name
 * @param {string} mimeType - The file's MIME type
 * @param {string} course_code
 * @param {string} course_title
 * @param {string} description
 * @param {string} part
 * @param {string} level
 * @param {string} semester
 */

export default async function saveFileToDrive({
  group_folder_id,
  fileBuffer,
  fileName,
  mimetype,
  material_type = "Lecture Note",
  course_code = "",
  course_title = "",
  description = "",
  part = "",
  level = "",
  semester = "",
  file_hash,
  group_jid,
  bot_admin_jid,
}) {
  try {
    const drive = await getDriveClient();

    //ensure level file exist inside group folder
    const levelFolderId = await ensureFolderExist({
      drive,
      parentId: group_folder_id,
      name: `${level} level`,
    });

    //ensure semester file exist inside level folder
    const semesterFolderId = await ensureFolderExist({
      drive,
      parentId: levelFolderId,
      name: `${semester} semester`,
    });

    //file meta data and custom properties for efficient search
    const fileMetaData = {
      name: fileName,
      parents: [semesterFolderId],
      description: description || "",
      properties: {
        course_code,
        course_title,
        part,
        level,
        semester,
        material_type,
      },
    };

    const media = {
      mimetype,
      body: Readable.from(fileBuffer),
    };

    const res = await drive.files.create({
      requestBody: fileMetaData,
      media,
      fields: "id, name, parents, properties, description",
    });

    const fileData = [
      {
        file_hash,
        file_id: res.data.id,
        file_name: fileName,
        group_jid,
        level,
        semester,
        course_code,
        course_title,
        description,
        part: part || "",
        upload_by: bot_admin_jid,
        mimetype,
        material_type,
      },
    ];
    await createFileData(fileData);
    return {
      id: res.data.id,
      name: res.data.name,
      folder: semesterFolderId,
      properties: res.data.properties,
      description: res.data.description,
    };
  } catch (err) {
    console.error("Error saving file to drive", err);
    throw err;
  }
}

async function ensureFolderExist({ drive, parentId, name }) {
  try {
    const res = await drive.files.list({
      q: `'${parentId}' in parents and name = '${name}' and mimeType = 'application/vnd.google-apps.folder' and trashed = false`,
      fields: "files(id, name)",
    });

    if (res.data.files.length > 0) return res.data.files[0].id;

    const folderMetaData = {
      name,
      mimeType: "application/vnd.google-apps.folder",
      parents: [parentId],
    };

    const folder = await drive.files.create({
      requestBody: folderMetaData,
      fields: "id, name",
    });

    return folder.data.id;
  } catch (error) {
    console.error("Error ensuring folder exist", error);
    throw error;
  }
}
