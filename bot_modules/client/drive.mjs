// Google drive auth file
import { google } from "googleapis";

const SCOPES = ["https://www.googleapis.com/auth/drive"];

export default async function getDriveClient() {
  console.log(process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"));
  console.log("Hello \n world")
  const credentials = {
    client_email: process.env.GOOGLE_CLIENT_EMAIL,
    private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"), // Ensure newlines are correctly formatted
  };
  
  const auth = new google.auth.JWT(
    credentials.client_email,
    null,
    credentials.private_key,
    SCOPES
  );

  const drive = google.drive({ version: "v3", auth });

  return drive;
}
