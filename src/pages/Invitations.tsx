import React from "react";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useGroups } from "@/hooks/useGroups";
import { Mail, Check, X, Users, Calendar } from "lucide-react";
import { LoadingSpinner } from "@/components/SkeletonLoaders";

export default function Invitations() {
  const { invitations, loading, acceptInvitation, declineInvitation } =
    useGroups();
  const { toast } = useToast();
  const [processingInvitation, setProcessingInvitation] = useState<
    string | null
  >(null);

  const handleAcceptInvitation = async (invitationId: string) => {
    setProcessingInvitation(invitationId);
    try {
      const { error } = await acceptInvitation(invitationId);
      if (error) {
        toast({
          title: "Error accepting invitation",
          description: "Could not accept the invitation. Please try again.",
          variant: "destructive"
        });
      } else {
        toast({
          title: "Invitation accepted!",
          description: "You now have access to the group."
        });
      }
    } finally {
      setProcessingInvitation(null);
    }
  };

  const handleDeclineInvitation = async (invitationId: string) => {
    setProcessingInvitation(invitationId);
    try {
      const { error } = await declineInvitation(invitationId);
      if (error) {
        toast({
          title: "Error declining invitation",
          description: "Could not decline the invitation. Please try again.",
          variant: "destructive"
        });
      } else {
        toast({
          title: "Invitation declined",
          description: "The invitation has been declined."
        });
      }
    } finally {
      setProcessingInvitation(null);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center">
            <LoadingSpinner size="large" />
            <p className="mt-4 text-gray-600">Loading invitations...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <Mail className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Invitations</h1>
          <p className="text-xl text-gray-600">
            Manage your invitations to groups
          </p>
        </div>

        {/* Invitations List */}
        <div className="space-y-6">
          {invitations.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <Mail className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">
                  You have no pending invitations.
                </p>
              </CardContent>
            </Card>
          ) : (
            invitations.map((invitation) => (
              <Card
                key={invitation.id}
                className="hover:shadow-lg transition-shadow"
              >
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Users className="w-5 h-5 text-blue-600" />
                    <span>Invitation to {invitation.group?.name}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <p className="text-gray-600 mb-2">
                        {invitation.invited_by_user?.full_name ||
                          "Unknown user"}
                        has invited you to the group "{invitation.group?.name}
                        ".
                      </p>
                      {invitation.group?.description && (
                        <p className="text-sm text-gray-500">
                          {invitation.group.description}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4" />
                        <span>
                          Created{" "}
                          {new Date(invitation.created_at).toLocaleDateString(
                            "en-US"
                          )}
                        </span>
                      </div>
                    </div>

                    <div className="flex space-x-3">
                      <Button
                        onClick={() => handleAcceptInvitation(invitation.id)}
                        disabled={processingInvitation === invitation.id}
                        className="flex-1 bg-green-600 hover:bg-green-700"
                      >
                        {processingInvitation === invitation.id ? (
                          <div className="flex items-center space-x-2">
                            <LoadingSpinner size="small" />
                            <span>Accepting...</span>
                          </div>
                        ) : (
                          <>
                            <Check className="w-4 h-4 mr-2" />
                            Accept
                          </>
                        )}
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => handleDeclineInvitation(invitation.id)}
                        disabled={processingInvitation === invitation.id}
                        className="flex-1"
                      >
                        {processingInvitation === invitation.id ? (
                          <div className="flex items-center space-x-2">
                            <LoadingSpinner size="small" />
                            <span>Declining...</span>
                          </div>
                        ) : (
                          <>
                            <X className="w-4 h-4 mr-2" />
                            Decline
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
