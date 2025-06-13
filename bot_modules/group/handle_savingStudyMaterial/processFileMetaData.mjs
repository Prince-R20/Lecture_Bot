export default async function getFileInfo(reply, handleReply) {
  try {
    const fileInfo = parseFileMetaData(reply);

    return fileInfo;
  } catch (err) {
    await sendTextMsg(
      sender,
      "❌ " +
        err.message +
        "\n\nPlease reply again with all 6 required fields, each on a new line."
    );

    // Reprompt by calling waitForUserReply again with the same handler
    waitForUserReply(sender, handleReply);
    return;
  }
}

function parseFileMetaData(reply = "") {
  const lines = reply
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0);

  if (lines.length < 7) {
    throw new Error(
      "Incomplete details. Please provide all 6 requires fields."
    );
  }

  const [
    course_code,
    course_title,
    description,
    part,
    semester,
    level,
    material_type_no,
  ] = lines;

  const material_type = (material_type_no === "2") ? "pq" : "lecture_note";

  return {
    course_code,
    course_title,
    description,
    part,
    semester,
    level,
    material_type,
  };
}
