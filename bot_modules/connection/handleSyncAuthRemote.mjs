import supabase from "../supabase/supabase.mjs";
import path from "node:path";
import { readFile } from "node:fs/promises";
import { writeFile, mkdir } from "node:fs";

const credsDir = path.resolve("auth");
const credsPath = path.join(credsDir, "creds.json");

async function uploadAuth() {
  try {
    const bufferFile = await readFile(credsPath);

    const { error } = await supabase.storage
      .from("devauth")
      .upload("creds", bufferFile, {
        contentType: "application/json",
        upsert: true,
      });

    if (error) {
      console.error("❌ Upload Auth error:", error);
      return;
    }

    console.log("✅ Auth uploaded successfully!");
  } catch (err) {
    console.log("❌Failed to upload auth", err);
  }
}

async function downloadAuth() {
  try {
    const { data, error } = await supabase.storage
      .from("devauth")
      .download("creds");

    if (error) {
      console.error("❌ Download Auth error:", error);
      return;
    }

    const arrayBuffer = await data.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    mkdir(credsDir, { recursive: true }, (dirErr) => {
      if (dirErr) {
        console.error("❌ Error creating Auth directory:", dirErr);
        return;
      }
      writeFile(credsPath, buffer, (err) => {
        if (err) {
          console.error("❌ Error writing Auth file:", err);
          return;
        } else {
          console.log("✅ Auth file written successfully!");
        }
      });
    });
  } catch (err) {
    console.log("❌ Failed to download auth", err);
  }
}

export default { uploadAuth, downloadAuth };
