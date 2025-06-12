export default function processMaterialRequest(message) {
  const text = message.trim().toLowerCase();

  // Accepts: "@bot send", "bot drop", "bot please send", etc.
  const commandTriggerRegex = /^(@?bot)\s*(please\s*)?(send|drop)\b/;
  const commandTrigger = text.match(commandTriggerRegex);
  if (!commandTrigger) {
    return {
      commandTrigger: false,
      actionKeyword: null,
      materialIdentifier: null,
    };
  }

  // Extract action keyword (notes, material, pdf, pq, past questions, etc.)
  const actionKeywordRegex = /\b(notes?|materials?|pdfs?|pq|past questions?)\b/;
  const actionMatch = text.match(actionKeywordRegex);
  const actionKeyword = actionMatch ? actionMatch[0] : "pdf";

  const materialIdentifier = extractMaterialIdentifiers(text);

  return {
    commandTrigger: true,
    actionKeyword,
    materialIdentifier,
  };
}

function extractMaterialIdentifiers(text) {
  // 1. Course code: 3 letters + optional space + 3 digits (e.g., STA213 or STA 213)
  const courseCodeMatch = text.match(/\b([a-z]{3})\s?(\d{3})\b/i);
  const course_code = courseCodeMatch
    ? (courseCodeMatch[1] + courseCodeMatch[2]).toUpperCase()
    : undefined;

  // 2. Level: 100level, 100 level, 100l, 200l, etc.
  const levelMatch = text.match(/\b(\d{3})\s?(level|l)\b/i);
  const level = levelMatch ? levelMatch[1] : undefined;

  // 3. Semester: first semester, 1st semester, second semester, 2nd semester, etc.
  const semesterMatch = text.match(
    /\b((first|1st|second|2nd|third|3rd))\s*semester\b/i
  );
  const semester = semesterMatch ? semesterMatch[1] : undefined;

  // 4. Part: part 1, part one, part 2, etc.
  const partMatch = text.match(/\bpart\s*(\d+|one|two|three)\b/i);
  const part = partMatch ? partMatch[1] : undefined;

  // 5. Course title: Try to extract a phrase after the action keyword and before any known keyword
  // Remove bot prefix and action keywords
  let course_title;
  const cleaned = text
    .replace(/^(@?bot)\s*(please\s*)?(send|drop)\b/i, "")
    .replace(/\b(notes?|materials?|pdfs?|pq|past questions?)\b/i, "")
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
