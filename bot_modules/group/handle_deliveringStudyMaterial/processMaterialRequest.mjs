import extractMaterialIdentifiers from "./extractMaterialIdentifier.mjs";
/**
 * Extracts command trigger, action keyword (material type), and material identifiers from user message.
 * Returns: { commandTrigger, actionKeyword, materialIdentifier }
 */

export default function processMaterialRequest(message, group_jid) {
  const text = message.trim().toLowerCase();
  let remainingText;

  //Extract command keywords: "@bot send", "bot drop", "bot please send", etc.
  const commandRegex = /^(@?bot)\s*(please\s*)?(send|drop)\b/i;
  const commandMatch = commandRegex.test(text);

  if (!commandMatch) {
    return {
      commandTrigger: false,
      actionKeyword: null,
      materialIdentifier: null,
    };
  }

  remainingText = text.replace(commandRegex, "").trim();

  // Extract action keyword (notes, material, pdf, pq, past questions, etc.)
  const actionRegex = /\b(notes?|materials?|pdfs?|pq|past questions?)\b/i;
  const actionMatch = remainingText.match(actionRegex);

  let actionKeyword;
  if (actionMatch) {
    const keyword = actionMatch[0].toLowerCase();
    switch (keyword) {
      case "pq" || "past question" || "past questions":
        actionKeyword = "pq";
        break;
      default:
        actionKeyword = "lecture_note";
        break;
    }
  } else {
    actionKeyword = "lecture_note";
  }

  remainingText = remainingText.replace(actionRegex, "");

  // Extract material identifiers (order-independent)
  const materialIdentifier = extractMaterialIdentifiers(
    remainingText,
    group_jid
  );

  return {
    commandTrigger: true,
    actionKeyword,
    materialIdentifier,
  };
}
