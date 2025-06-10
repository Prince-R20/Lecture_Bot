import supabase from "../client/supabase.mjs";

//create a new file record
export async function createFileData(fileData) {
  try {
    const { data, error } = await supabase
      .from("study_materials")
      .insert(fileData);

    if (error) throw error;

    return data;
  } catch (error) {
    console.log("Error creating new file data:", error);
    throw error;
  }
}
