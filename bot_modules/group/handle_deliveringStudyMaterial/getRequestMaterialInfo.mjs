import supabase from "../../client/supabase.mjs";

export default async function getRequestMaterialInfo(
  group_jid,
  actionKeyword,
  materialIdentifier
) {
  try {
    let query = supabase
      .from("study_materials")
      .select("*")
      .eq("group_jid", group_jid)
      .eq("material_type", actionKeyword);

    // Add filters from materialIdentifier if present
    if (materialIdentifier.course_code)
      query = query.ilike("course_code", `%${materialIdentifier.course_code}%`);
    if (materialIdentifier.course_title)
      query = query.ilike(
        "course_title",
        `%${materialIdentifier.course_title}%`
      );
    if (materialIdentifier.part)
      query = query.ilike("part", `%${materialIdentifier.part}%`);
    if (materialIdentifier.level)
      query = query.ilike("level", `%${materialIdentifier.level}%`);
    if (materialIdentifier.semester)
      query = query.ilike("semester", `%${materialIdentifier.semester}%`);

    // Get the most relevant file (first match)
    const { data, error } = await query;

    if (error) {
      console.log("Error getting material:", error);
      return [];
    }
    return data || [];
  } catch (error) {
    console.log("Error getting material:", error);
    throw error;
  }
}
