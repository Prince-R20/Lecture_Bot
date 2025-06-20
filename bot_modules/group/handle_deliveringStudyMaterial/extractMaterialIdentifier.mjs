import supabase from "../../client/supabase.mjs";

export default async function extractMaterialIdentifiers(text, group_jid) {
  const { current_level, current_semester } = await getCurrentSemester_Level(
    group_jid
  );
  // 1. Course code: 3 letters + optional space + 3 digits (e.g., STA213 or STA 213)
  const courseCodeMatch = text.match(/\b([a-z]{3})\s?(\d{3})\b/i);
  const course_code = courseCodeMatch
    ? (courseCodeMatch[1] + courseCodeMatch[2]).toUpperCase()
    : undefined;

  // 2. Level: 100level, 100 level, 100l, 200l, etc.
  const levelMatch = text.match(/\b(\d{3})\s?(level|l)\b/i);
  const level = levelMatch ? levelMatch[1] : current_level;

  // 3. Semester: first semester, 1st semester, second semester, 2nd semester, etc.
  const semesterMatch = text.match(
    /\b((first|1st|second|2nd|third|3rd))\s*semester\b/i
  );
  const semester = semesterMatch ? semesterMatch[1] : current_semester;

  // 4. Part: part 1, part one, part 2, etc.
  const partMatch = text.match(/\bpart\s*(\d+|one|two|three)\b/i);
  const part = partMatch ? partMatch[1] : "-";

  // 5. Course title: Try to extract a phrase after the action keyword and before any known keyword
  // Remove bot prefix and action keywords
  let course_title;
  const cleaned = text
    .replace(/\b([a-z]{3})\s?\d{3}\b/i, "")
    .replace(/\b(\d{3})\s?(level|l)\b/i, "")
    .replace(/\b((first|1st|second|2nd|third|3rd))\s*semester\b/i, "")
    .replace(/\bpart\s*(\d+|one|two|three)\b/i, "")
    .replace(/\s+/g, " ")
    .trim();

  course_title = cleaned.length > 0 ? cleaned : undefined;

  // If both course_code and course_title are missing, return null (not enough info)
  if (!course_code && !course_title) return null;

  return {
    course_code,
    course_title,
    level,
    semester,
    part,
  };
}

async function getCurrentSemester_Level(group_jid) {
  try {
    const { data, error } = await supabase
      .from("groups")
      .select("current_level, current_semester")
      .eq("group_jid", group_jid);

    if (error) return undefined;

    return data ? data : undefined;
  } catch (error) {
    console.log("Error getting the current semester/level:", error);
    throw error;
  }
}
