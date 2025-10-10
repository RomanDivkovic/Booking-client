import { useState, useEffect } from "react";
import { useGroupMembers } from "@/hooks/useGroupMembers";

export const useGroupMembersForEvent = (
  isOpen: boolean,
  eventGroupId: string | undefined
) => {
  const [groupMembers, setGroupMembers] = useState<
    Array<{ id: string; full_name: string; email: string }>
  >([]);
  const { getGroupMembers } = useGroupMembers();

  useEffect(() => {
    if (isOpen && eventGroupId) {
      const fetchMembers = async () => {
        const members = await getGroupMembers(eventGroupId);
        setGroupMembers(members);
      };
      fetchMembers();
    }
  }, [isOpen, eventGroupId, getGroupMembers]);

  return groupMembers;
};
