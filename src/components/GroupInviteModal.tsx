import React from "react";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Mail, Copy, Check } from "lucide-react";

interface GroupInviteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInvite: (email: string) => Promise<{
    error?: unknown;
    userExists?: boolean;
    invitationId?: string;
  }>;
  groupName: string;
}

export const GroupInviteModal = ({
  isOpen,
  onClose,
  onInvite,
  groupName
}: GroupInviteModalProps) => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [invitationLink, setInvitationLink] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);

    const result = await onInvite(email);

    if (result.error) {
      toast({
        title: "Error inviting user",
        description:
          typeof result.error === "string"
            ? result.error
            : "Could not invite the user. Please try again.",
        variant: "destructive"
      });
    } else {
      const message = result.userExists
        ? `Invitation sent to ${email}!`
        : `Invitation created for ${email}. They will get access when they register.`;

      toast({
        title: "Invitation sent!",
        description: message
      });

      // Generate invitation link for sharing
      if (result.invitationId) {
        const link = `${window.location.origin}/auth?invite=${result.invitationId}`;
        setInvitationLink(link);
        // Skicka e-post om användaren inte finns
        if (!result.userExists) {
          try {
            const res = await fetch("/api/send-invite-email", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                to: email,
                inviteLink: link,
                groupName
              })
            });
            if (res.ok) {
              toast({
                title: "E-mail sent!",
                description: `An invitation has been sent to ${email}.`
              });
            } else {
              toast({
                title: "Could not send e-mail",
                description: "Copy the link and send it manually.",
                variant: "destructive"
              });
            }
          } catch {
            toast({
              title: "Could not send e-mail",
              description: "Copy the link and send it manually.",
              variant: "destructive"
            });
          }
        }
      }

      setEmail("");
    }

    setLoading(false);
  };

  const handleCopyLink = async () => {
    if (!invitationLink) return;

    try {
      await navigator.clipboard.writeText(invitationLink);
      setCopied(true);
      toast({
        title: "Link copied!",
        description: "Invitation link copied to clipboard."
      });
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast({
        title: "Could not copy the link",
        description: "Try copying the link manually.",
        variant: "destructive"
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Invite to {groupName}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="email">Email address</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                id="email"
                type="email"
                placeholder="exempel@email.com"
                className="pl-10"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <p className="text-sm text-gray-600 mt-1">
              The user will get access to the group when they register.
            </p>
          </div>

          <div className="flex justify-end space-x-3">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Inviting..." : "Invite"}
            </Button>
          </div>
        </form>

        {invitationLink && (
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">
              Share invitation link
            </h4>
            <p className="text-sm text-blue-700 mb-3">
              You can also share this link directly with the person:
            </p>
            <div className="flex items-center space-x-2">
              <Input
                value={invitationLink}
                readOnly
                className="flex-1 text-sm"
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleCopyLink}
                className="flex-shrink-0"
              >
                {copied ? (
                  <Check className="w-4 h-4 text-green-600" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
