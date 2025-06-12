import supabase from "../../client/supabase.mjs";

export default async function getRequestMaterial(
  group_jid,
  actionKeyword,
  materialIdentifier
) {
  try {
    const { data, error } = await supabase
      .from("study_materials")
      .select("*")
      .eq("group_jid", group_jid);

    return requestedFile;
  } catch (error) {
    console.log("Error getting material:", error);
    throw error;
  }
}
