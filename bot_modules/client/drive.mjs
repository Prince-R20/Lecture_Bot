// Google drive auth file
import { google } from "googleapis";

// const SCOPES = ["https://www.googleapis.com/auth/drive"];

export default async function getDriveClient() {
  const credentials = {
    client_email: process.env.GOOGLE_CLIENT_EMAIL,
    private_key: process.env.GOOGLE_PRIVATE_KEY, // Ensure newlines are correctly formatted
  };

  // const auth = new google.auth.JWT(
  //   credentials.client_email,
  //   null,
  //   credentials.private_key,
  //   SCOPES
  // );

  const auth = new google.auth.GoogleAuth({
    keyFile: "/etc/secrets/lecture-bot-storage-81258824462a.json",
    scopes: ["https://www.googleapis.com/auth/drive"],
  });

  const drive = google.drive({ version: "v3", auth });

  return drive;
}
