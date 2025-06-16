const allowedGroups = new Set();

export function allowGroupInvite(groupJid) {
  allowedGroups.add(groupJid);
  // Remove after 5 minutes for security
  setTimeout(() => allowedGroups.delete(groupJid), 10 * 60 * 1000);
}

export function isGroupInviteAllowed(groupJid) {
  return allowedGroups.has(groupJid);
}
