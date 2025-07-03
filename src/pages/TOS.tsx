import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Shield, User, Calendar } from "lucide-react";

export default function TOS() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex flex-col">
      <main className="flex-1">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto">
            {/* Hero Section */}
            <div className="text-center mb-12">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <FileText className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                Terms of Service
              </h1>
              <p className="text-xl text-gray-600">
                Please read these terms carefully before using FamiljKal
              </p>
            </div>

            {/* Terms Content */}
            <div className="space-y-8">
              {/* Acceptance */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <User className="w-5 h-5 text-blue-600" />
                    <span>1. Acceptance of Terms</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 leading-relaxed">
                    By accessing and using FamiljKal, you accept and agree to be
                    bound by the terms and provision of this agreement. If you
                    do not agree to abide by the above, please do not use this
                    service.
                  </p>
                </CardContent>
              </Card>

              {/* Service Description */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Calendar className="w-5 h-5 text-blue-600" />
                    <span>2. Service Description</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    FamiljKal is a collaborative calendar application that
                    allows families and households to share schedules, manage
                    events, and coordinate activities. The service includes:
                  </p>
                  <ul className="list-disc list-inside text-gray-700 space-y-2">
                    <li>Calendar management and event scheduling</li>
                    <li>Group creation and member management</li>
                    <li>Real-time updates and synchronization</li>
                    <li>Task assignment and tracking</li>
                    <li>Mobile and web access</li>
                  </ul>
                </CardContent>
              </Card>

              {/* User Accounts */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <User className="w-5 h-5 text-blue-600" />
                    <span>3. User Accounts</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p className="text-gray-700 leading-relaxed">
                      To use FamiljKal, you must create an account. You are
                      responsible for:
                    </p>
                    <ul className="list-disc list-inside text-gray-700 space-y-2">
                      <li>
                        Maintaining the confidentiality of your account
                        credentials
                      </li>
                      <li>All activities that occur under your account</li>
                      <li>Providing accurate and complete information</li>
                      <li>Notifying us immediately of any unauthorized use</li>
                    </ul>
                    <p className="text-gray-700 leading-relaxed">
                      You must be at least 13 years old to create an account. If
                      you are under 18, you must have parental consent to use
                      the service.
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Privacy and Data */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Shield className="w-5 h-5 text-blue-600" />
                    <span>4. Privacy and Data Protection</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p className="text-gray-700 leading-relaxed">
                      We are committed to protecting your privacy. Our data
                      practices are governed by our Privacy Policy, which is
                      incorporated into these terms.
                    </p>
                    <p className="text-gray-700 leading-relaxed">
                      You retain ownership of your data. We will not sell, rent,
                      or share your personal information with third parties
                      except as described in our Privacy Policy.
                    </p>
                    <p className="text-gray-700 leading-relaxed">
                      You can delete your account and all associated data at any
                      time through your profile settings.
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Acceptable Use */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Shield className="w-5 h-5 text-blue-600" />
                    <span>5. Acceptable Use</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p className="text-gray-700 leading-relaxed">
                      You agree to use FamiljKal only for lawful purposes and in
                      accordance with these terms. You agree not to:
                    </p>
                    <ul className="list-disc list-inside text-gray-700 space-y-2">
                      <li>
                        Use the service for any illegal or unauthorized purpose
                      </li>
                      <li>Violate any applicable laws or regulations</li>
                      <li>Infringe on the rights of others</li>
                      <li>
                        Attempt to gain unauthorized access to the service
                      </li>
                      <li>Interfere with or disrupt the service</li>
                      <li>Share inappropriate or offensive content</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              {/* Intellectual Property */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <FileText className="w-5 h-5 text-blue-600" />
                    <span>6. Intellectual Property</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p className="text-gray-700 leading-relaxed">
                      FamiljKal and its original content, features, and
                      functionality are owned by us and are protected by
                      international copyright, trademark, and other intellectual
                      property laws.
                    </p>
                    <p className="text-gray-700 leading-relaxed">
                      You retain ownership of any content you create or upload
                      to the service. By using FamiljKal, you grant us a limited
                      license to store and display your content as necessary to
                      provide the service.
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Limitation of Liability */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Shield className="w-5 h-5 text-blue-600" />
                    <span>7. Limitation of Liability</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 leading-relaxed">
                    In no event shall FamiljKal be liable for any indirect,
                    incidental, special, consequential, or punitive damages,
                    including without limitation, loss of profits, data, use,
                    goodwill, or other intangible losses, resulting from your
                    use of the service.
                  </p>
                </CardContent>
              </Card>

              {/* Changes to Terms */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <FileText className="w-5 h-5 text-blue-600" />
                    <span>8. Changes to Terms</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 leading-relaxed">
                    We reserve the right to modify these terms at any time. We
                    will notify users of any material changes via email or
                    through the service. Your continued use of FamiljKal after
                    such modifications constitutes acceptance of the updated
                    terms.
                  </p>
                </CardContent>
              </Card>

              {/* Contact Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <User className="w-5 h-5 text-blue-600" />
                    <span>9. Contact Information</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 leading-relaxed">
                    If you have any questions about these Terms of Service,
                    please contact us at:
                  </p>
                  <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                    <p className="text-gray-700">
                      <strong>Email:</strong> legal@familjkal.se
                      <br />
                      <strong>Last updated:</strong> December 2024
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
