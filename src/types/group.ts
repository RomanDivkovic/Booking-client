export interface Group {
  id: string;
  name: string;
  description: string | null;
  created_by: string;
  created_at: string;
  member_count?: number;
}

export interface GroupInvitation {
  id: string;
  group_id: string;
  invited_user_id: string;
  invited_by: string;
  status: "pending" | "accepted" | "declined";
  created_at: string;
  updated_at: string;
  group?: {
    name: string;
    description: string | null;
  };
  invited_by_user?: {
    full_name: string;
    email: string;
  };
}

export interface GroupMember {
  id: string;
  full_name: string;
  email: string;
  role: string;
}
