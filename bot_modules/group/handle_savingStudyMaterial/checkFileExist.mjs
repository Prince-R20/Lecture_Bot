import supabase from "../../client/supabase.mjs";

export default async function checkFileExists(file_hash) {
  try {
    const { data, error } = await supabase
      .from("study_materials")
      .select("file_hash")
      .eq("file_hash", file_hash)
      .single();

    if (error) {
      console.error("Error checking file existence:", error);
      return false;
    }

    return data ? true : false;
  } catch (error) {
    console.error("Error checking file existence:", error);
    throw error;
  }
}
