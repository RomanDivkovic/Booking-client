import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

interface PrivacyPolicyModalProps {
  children: React.ReactNode;
}

export const PrivacyPolicyModal: React.FC<PrivacyPolicyModalProps> = ({
  children
}) => {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">
            Privacy Policy
          </DialogTitle>
        </DialogHeader>
        <ScrollArea className="max-h-[60vh] pr-4">
          <div className="space-y-6 text-sm leading-relaxed">
            <section>
              <h3 className="text-lg font-semibold mb-3">
                1. Information We Collect
              </h3>
              <div className="space-y-2">
                <p className="text-gray-700">
                  <strong>1.1 Personal Information:</strong> When you create an
                  account, we collect your email address, name, and any other
                  information you provide.
                </p>
                <p className="text-gray-700">
                  <strong>1.2 Usage Data:</strong> We collect information about
                  how you use FamCaly, including events you create, groups you
                  join, and features you use.
                </p>
                <p className="text-gray-700">
                  <strong>1.3 Device Information:</strong> We may collect
                  information about your device, browser, and operating system
                  for security and optimization purposes.
                </p>
              </div>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-3">
                2. How We Use Your Information
              </h3>
              <div className="space-y-2">
                <p className="text-gray-700">
                  <strong>2.1 Service Provision:</strong> To provide, maintain,
                  and improve FamCaly services.
                </p>
                <p className="text-gray-700">
                  <strong>2.2 Communication:</strong> To send you important
                  updates, security alerts, and respond to your requests.
                </p>
                <p className="text-gray-700">
                  <strong>2.3 Security:</strong> To protect against fraud,
                  abuse, and ensure platform security.
                </p>
                <p className="text-gray-700">
                  <strong>2.4 Analytics:</strong> To understand how our service
                  is used and improve user experience.
                </p>
              </div>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-3">
                3. Information Sharing
              </h3>
              <div className="space-y-2">
                <p className="text-gray-700">
                  <strong>3.1 With Group Members:</strong> Event information and
                  group content is shared with other members of your groups.
                </p>
                <p className="text-gray-700">
                  <strong>3.2 Service Providers:</strong> We may share data with
                  trusted third-party service providers who help us operate
                  FamCaly.
                </p>
                <p className="text-gray-700">
                  <strong>3.3 Legal Requirements:</strong> We may disclose
                  information if required by law or to protect rights and
                  safety.
                </p>
                <p className="text-gray-700">
                  <strong>3.4 Business Transfers:</strong> In the event of a
                  merger or acquisition, user data may be transferred as part of
                  the transaction.
                </p>
              </div>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-3">4. Data Security</h3>
              <div className="space-y-2">
                <p className="text-gray-700">
                  <strong>4.1 Security Measures:</strong> We implement
                  industry-standard security measures to protect your data,
                  including encryption and access controls.
                </p>
                <p className="text-gray-700">
                  <strong>4.2 Data Retention:</strong> We retain your data only
                  as long as necessary for the purposes outlined in this policy
                  or as required by law.
                </p>
                <p className="text-gray-700">
                  <strong>4.3 Data Deletion:</strong> You can request deletion
                  of your account and associated data at any time.
                </p>
              </div>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-3">5. Your Rights</h3>
              <div className="space-y-2">
                <p className="text-gray-700">
                  <strong>5.1 Access:</strong> You can access and update your
                  personal information in your account settings.
                </p>
                <p className="text-gray-700">
                  <strong>5.2 Data Portability:</strong> You can request a copy
                  of your data in a portable format.
                </p>
                <p className="text-gray-700">
                  <strong>5.3 Deletion:</strong> You can request deletion of
                  your account and personal data.
                </p>
                <p className="text-gray-700">
                  <strong>5.4 Opt-out:</strong> You can opt out of non-essential
                  communications and data processing.
                </p>
              </div>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-3">
                6. Cookies and Tracking
              </h3>
              <div className="space-y-2">
                <p className="text-gray-700">
                  <strong>6.1 Essential Cookies:</strong> We use cookies
                  necessary for the functioning of FamCaly.
                </p>
                <p className="text-gray-700">
                  <strong>6.2 Analytics:</strong> We may use analytics tools to
                  understand service usage and improve performance.
                </p>
                <p className="text-gray-700">
                  <strong>6.3 Cookie Preferences:</strong> You can manage cookie
                  preferences through your browser settings.
                </p>
              </div>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-3">
                7. Children's Privacy
              </h3>
              <p className="text-gray-700">
                FamCaly is not intended for children under 13. We do not
                knowingly collect personal information from children under 13.
                If we become aware of such collection, we will delete the
                information immediately.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-3">
                8. International Data Transfers
              </h3>
              <p className="text-gray-700">
                Your data may be transferred to and processed in countries other
                than your own. We ensure appropriate safeguards are in place for
                such transfers.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-3">
                9. Changes to This Policy
              </h3>
              <p className="text-gray-700">
                We may update this Privacy Policy from time to time. We will
                notify you of significant changes via email or through the
                FamCaly application.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-3">10. Contact Us</h3>
              <p className="text-gray-700">
                If you have questions about this Privacy Policy or our data
                practices, please contact us at{" "}
                <a
                  href="mailto:privacy@familjkal.se"
                  className="text-blue-600 hover:underline"
                >
                  privacy@familjkal.se
                </a>
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
