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
        title: "Fel vid inbjudan",
        description:
          typeof result.error === "string"
            ? result.error
            : "Kunde inte bjuda in användaren. Försök igen.",
        variant: "destructive"
      });
    } else {
      const message = result.userExists
        ? `Inbjudan skickad till ${email}!`
        : `Inbjudan skapad för ${email}. De kommer att få tillgång när de registrerar sig.`;

      toast({
        title: "Inbjudan skickad!",
        description: message
      });

      // Generate invitation link for sharing
      if (result.invitationId) {
        const link = `${window.location.origin}/auth?invite=${result.invitationId}`;
        setInvitationLink(link);
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
        title: "Länk kopierad!",
        description: "Inbjudningslänken har kopierats till urklipp."
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error(error);
      toast({
        title: "Kunde inte kopiera länken",
        description: "Försök kopiera länken manuellt.",
        variant: "destructive"
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Bjud in till {groupName}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="email">E-postadress</Label>
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
              Användaren kommer att få tillgång till gruppen när de registrerar
              sig.
            </p>
          </div>

          <div className="flex justify-end space-x-3">
            <Button type="button" variant="outline" onClick={onClose}>
              Avbryt
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Bjuder in..." : "Bjud in"}
            </Button>
          </div>
        </form>

        {invitationLink && (
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">
              Dela inbjudningslänk
            </h4>
            <p className="text-sm text-blue-700 mb-3">
              Du kan också dela denna länk direkt med personen:
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
