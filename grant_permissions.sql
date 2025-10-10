-- Grant execute permissions on RPC functions
GRANT EXECUTE ON FUNCTION public.get_group_events(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.accept_group_invitation(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.decline_group_invitation(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.delete_group(UUID) TO authenticated;