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
import { Mail } from "lucide-react";

interface GroupInviteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInvite: (email: string) => Promise<{ error?: unknown }>;
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
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);

    const { error } = await onInvite(email);

    if (error) {
      toast({
        title: "Fel vid inbjudan",
        description:
          typeof error === "string"
            ? error
            : "Kunde inte bjuda in användaren. Försök igen.",
        variant: "destructive"
      });
    } else {
      toast({
        title: "Inbjudan skickad!",
        description: `${groupName} har lagts till i gruppen "${groupName}".`
      });
      onClose();
    }

    setLoading(false);
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
              Användaren måste redan ha ett konto i systemet.
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
      </DialogContent>
    </Dialog>
  );
};
