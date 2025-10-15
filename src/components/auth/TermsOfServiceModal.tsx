import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

interface TermsOfServiceModalProps {
  children: React.ReactNode;
}

export const TermsOfServiceModal: React.FC<TermsOfServiceModalProps> = ({
  children
}) => {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">
            Terms of Service
          </DialogTitle>
        </DialogHeader>
        <ScrollArea className="max-h-[60vh] pr-4">
          <div className="space-y-6 text-sm leading-relaxed">
            <section>
              <h3 className="text-lg font-semibold mb-3">
                1. Acceptance of Terms
              </h3>
              <p className="text-gray-700">
                By accessing and using FamCaly ("the Service"), you accept and
                agree to be bound by the terms and provision of this agreement.
                If you do not agree to abide by the above, please do not use
                this service.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-3">
                2. Description of Service
              </h3>
              <p className="text-gray-700">
                FamCaly is a family calendar application that allows users to
                create groups, share events, and manage family schedules
                collaboratively. The service includes event creation, group
                management, and real-time updates.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-3">3. User Accounts</h3>
              <div className="space-y-2">
                <p className="text-gray-700">
                  <strong>3.1 Account Creation:</strong> You must provide
                  accurate and complete information when creating your account.
                  You are responsible for maintaining the confidentiality of
                  your account credentials.
                </p>
                <p className="text-gray-700">
                  <strong>3.2 Account Responsibility:</strong> You are
                  responsible for all activities that occur under your account.
                  You must immediately notify us of any unauthorized use of your
                  account.
                </p>
                <p className="text-gray-700">
                  <strong>3.3 Age Requirements:</strong> You must be at least 13
                  years old to use this service. By using FamCaly, you represent
                  that you meet this age requirement.
                </p>
              </div>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-3">
                4. Privacy and Data Protection
              </h3>
              <div className="space-y-2">
                <p className="text-gray-700">
                  <strong>4.1 Data Collection:</strong> We collect information
                  you provide directly, usage data, and information from
                  third-party services you connect to FamCaly.
                </p>
                <p className="text-gray-700">
                  <strong>4.2 Data Usage:</strong> Your data is used to provide
                  and improve our services, communicate with you, and ensure
                  platform security.
                </p>
                <p className="text-gray-700">
                  <strong>4.3 Data Sharing:</strong> We do not sell your
                  personal data. We may share data with service providers, for
                  legal compliance, or with your explicit consent.
                </p>
                <p className="text-gray-700">
                  <strong>4.4 Data Security:</strong> We implement appropriate
                  security measures to protect your data, though no method of
                  transmission over the internet is 100% secure.
                </p>
              </div>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-3">
                5. User Content and Conduct
              </h3>
              <div className="space-y-2">
                <p className="text-gray-700">
                  <strong>5.1 Content Ownership:</strong> You retain ownership
                  of content you create. By posting content, you grant us a
                  license to use it for service provision.
                </p>
                <p className="text-gray-700">
                  <strong>5.2 Prohibited Conduct:</strong> You agree not to use
                  the service for illegal activities, harassment, spam, or
                  violating others' rights.
                </p>
                <p className="text-gray-700">
                  <strong>5.3 Content Moderation:</strong> We reserve the right
                  to remove content that violates these terms or is harmful to
                  our community.
                </p>
              </div>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-3">
                6. Group Management
              </h3>
              <div className="space-y-2">
                <p className="text-gray-700">
                  <strong>6.1 Group Creation:</strong> You may create groups and
                  invite other users. You are responsible for managing your
                  groups appropriately.
                </p>
                <p className="text-gray-700">
                  <strong>6.2 Group Privacy:</strong> Group content is only
                  visible to group members. Group administrators control
                  membership and content visibility.
                </p>
                <p className="text-gray-700">
                  <strong>6.3 Invitations:</strong> When inviting users, ensure
                  you have permission to share their contact information.
                </p>
              </div>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-3">
                7. Service Availability
              </h3>
              <div className="space-y-2">
                <p className="text-gray-700">
                  <strong>7.1 Service Continuity:</strong> We strive to provide
                  continuous service but cannot guarantee 100% uptime. We may
                  perform maintenance that temporarily affects availability.
                </p>
                <p className="text-gray-700">
                  <strong>7.2 Service Changes:</strong> We may modify or
                  discontinue features with reasonable notice. Critical changes
                  will be communicated via email or in-app notifications.
                </p>
              </div>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-3">8. Termination</h3>
              <div className="space-y-2">
                <p className="text-gray-700">
                  <strong>8.1 Account Termination:</strong> You may terminate
                  your account at any time. We may terminate accounts that
                  violate these terms.
                </p>
                <p className="text-gray-700">
                  <strong>8.2 Data Deletion:</strong> Upon account termination,
                  your data will be deleted according to our data retention
                  policies.
                </p>
              </div>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-3">
                9. Disclaimers and Limitations
              </h3>
              <div className="space-y-2">
                <p className="text-gray-700">
                  <strong>9.1 Service "As Is":</strong> The service is provided
                  "as is" without warranties of any kind. We do not guarantee
                  error-free operation.
                </p>
                <p className="text-gray-700">
                  <strong>9.2 Liability Limitations:</strong> Our liability is
                  limited to the amount you paid for the service in the past 12
                  months.
                </p>
              </div>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-3">
                10. Contact Information
              </h3>
              <p className="text-gray-700">
                If you have questions about these Terms of Service, please
                contact us at{" "}
                <a
                  href="mailto:support@familjkal.se"
                  className="text-blue-600 hover:underline"
                >
                  support@familjkal.se
                </a>
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-3">
                11. Changes to Terms
              </h3>
              <p className="text-gray-700">
                We may update these terms occasionally. Users will be notified
                of significant changes. Continued use of the service constitutes
                acceptance of updated terms.
              </p>
            </section>

            <div className="border-t pt-4 mt-6">
              <p className="text-xs text-gray-500 text-center">
                Last updated: October 15, 2025
              </p>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
