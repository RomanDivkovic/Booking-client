/**
 * Generate an invitation link for a group invitation
 */
export const generateInvitationLink = (
  groupId: string,
  invitationId: string
): string => {
  const baseUrl = window.location.origin;
  return `${baseUrl}/auth?invite=${invitationId}`;
};

/**
 * Copy invitation link to clipboard
 */
export const copyInvitationLink = async (
  groupId: string,
  invitationId: string
) => {
  const link = generateInvitationLink(groupId, invitationId);
  try {
    await navigator.clipboard.writeText(link);
    return { success: true, link };
  } catch {
    return { success: false, error: "Kunde inte kopiera länken" };
  }
};
