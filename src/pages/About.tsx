import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Calendar,
  Users,
  Shield,
  Zap,
  Heart,
  Code,
  Globe,
  Smartphone,
  Mail,
  HelpCircle
} from "lucide-react";
import { Link } from "react-router-dom";

export default function About() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex flex-col">
      <Header />

      <main className="flex-1">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto">
            {/* Hero Section */}
            <div className="text-center mb-12">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Calendar className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                About FamCal
              </h1>
              <p className="text-xl text-gray-600">
                The modern family calendar that brings everyone together
              </p>
            </div>

            {/* Mission Statement */}
            <Card className="mb-12">
              <CardContent className="pt-8">
                <div className="text-center">
                  <Heart className="w-12 h-12 text-red-500 mx-auto mb-4" />
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    Our Mission
                  </h2>
                  <p className="text-lg text-gray-600 leading-relaxed">
                    We believe that families should spend more time together and
                    less time coordinating. FamCal makes it easy to share
                    schedules, assign tasks, and stay organized as a family.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Users className="w-5 h-5 text-blue-600" />
                    <span>Group Collaboration</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    Create groups for your family, roommates, or any household.
                    Share calendars, assign tasks, and keep everyone in sync
                    with real-time updates.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Calendar className="w-5 h-5 text-blue-600" />
                    <span>Smart Calendar</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    View your schedule in month, week, or day format. Add
                    events, tasks, and appointments with ease. Everything
                    updates in real-time for all group members.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Shield className="w-5 h-5 text-blue-600" />
                    <span>Privacy & Security</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    Your data is secure and private. We use modern encryption
                    and security standards. Your events are only shared with
                    members of your groups.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Zap className="w-5 h-5 text-blue-600" />
                    <span>Real-time Updates</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    When someone adds or changes an event, everyone in the group
                    sees it immediately. No manual refresh needed - everything
                    stays synchronized automatically.
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Technology Stack */}
            <Card className="mb-12">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Code className="w-5 h-5 text-blue-600" />
                  <span>Built with Modern Technology</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                      <Code className="w-6 h-6 text-blue-600" />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">
                      React & TypeScript
                    </h3>
                    <p className="text-sm text-gray-600">
                      Modern, type-safe frontend built with React and TypeScript
                      for reliability and performance.
                    </p>
                  </div>

                  <div className="text-center">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                      <Globe className="w-6 h-6 text-green-600" />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">
                      Supabase
                    </h3>
                    <p className="text-sm text-gray-600">
                      Powerful backend with real-time database, authentication,
                      and row-level security.
                    </p>
                  </div>

                  <div className="text-center">
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                      <Smartphone className="w-6 h-6 text-purple-600" />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">
                      Responsive Design
                    </h3>
                    <p className="text-sm text-gray-600">
                      Works perfectly on desktop, tablet, and mobile devices
                      with a beautiful, modern interface.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Team Section */}
            <Card>
              <CardHeader>
                <CardTitle>Our Team</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-6">
                  FamCal is developed by a small team passionate about making
                  family life easier through technology. We believe in building
                  tools that actually help people and respect their privacy.
                </p>

                <div className="bg-blue-50 rounded-lg p-6">
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Get in Touch
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Have questions, suggestions, or feedback? We'd love to hear
                    from you!
                  </p>
                  <div className="text-center">
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">
                      Get in Touch
                    </h3>
                    <p className="text-gray-600 mb-6">
                      Have questions or suggestions? We'd love to hear from you!
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                      <a
                        href="mailto:hello@familjkal.se"
                        className="link-hover-animation-colored inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        <Mail className="w-4 h-4 mr-2" />
                        Send us an email
                      </a>
                      <Link
                        to="/faq"
                        className="link-hover-animation-colored inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <HelpCircle className="w-4 h-4 mr-2" />
                        View FAQ
                      </Link>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
