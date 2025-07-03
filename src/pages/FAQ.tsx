import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from "@/components/ui/accordion";
import { HelpCircle, Calendar, Users, Shield, Zap, Mail } from "lucide-react";
import { Link } from "react-router-dom";

export default function FAQ() {
  const [openItem, setOpenItem] = useState<string | undefined>(undefined);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex flex-col">
      <main className="flex-1">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-6xl mx-auto">
            {/* Hero Section */}
            <div className="text-center mb-12">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <HelpCircle className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                Frequently Asked Questions
              </h1>
              <p className="text-xl text-gray-600">
                Find answers to the most common questions about FamCaly
              </p>
            </div>

            {/* FAQ Categories - Two Columns on Desktop */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column */}
              <div className="space-y-6">
                {/* Getting Started */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Calendar className="w-5 h-5 text-blue-600" />
                      <span>Getting Started</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Accordion
                      type="single"
                      collapsible
                      className="w-full"
                      value={openItem}
                      onValueChange={setOpenItem}
                    >
                      <AccordionItem
                        value="item-1"
                        className="border-b border-gray-200"
                      >
                        <AccordionTrigger className="text-left hover:no-underline py-4 group">
                          <span className="font-medium">
                            How do I create an account?
                          </span>
                        </AccordionTrigger>
                        <AccordionContent className="text-gray-600 leading-relaxed">
                          Click "Register" on the login page and fill in your
                          email address, password, and name. You'll receive a
                          confirmation email to activate your account.
                        </AccordionContent>
                      </AccordionItem>

                      <AccordionItem
                        value="item-2"
                        className="border-b border-gray-200"
                      >
                        <AccordionTrigger className="text-left hover:no-underline py-4 group">
                          <span className="font-medium">
                            How do I create my first group?
                          </span>
                        </AccordionTrigger>
                        <AccordionContent className="text-gray-600 leading-relaxed">
                          After logging in, click "Create new group" on the
                          group selection page. Give the group a name and
                          description, then you can invite family members.
                        </AccordionContent>
                      </AccordionItem>

                      <AccordionItem value="item-3">
                        <AccordionTrigger className="text-left hover:no-underline py-4 group">
                          <span className="font-medium">
                            Can I use FamCaly without a group?
                          </span>
                        </AccordionTrigger>
                        <AccordionContent className="text-gray-600 leading-relaxed">
                          No, FamCaly is designed for collaboration. You must
                          create or join a group to use the calendar. This
                          ensures all events are shared with the right people.
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </CardContent>
                </Card>

                {/* Groups & Sharing */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Users className="w-5 h-5 text-blue-600" />
                      <span>Groups & Sharing</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Accordion
                      type="single"
                      collapsible
                      className="w-full"
                      value={openItem}
                      onValueChange={setOpenItem}
                    >
                      <AccordionItem
                        value="item-4"
                        className="border-b border-gray-200"
                      >
                        <AccordionTrigger className="text-left hover:no-underline py-4 group">
                          <span className="font-medium">
                            How do I invite someone to my group?
                          </span>
                        </AccordionTrigger>
                        <AccordionContent className="text-gray-600 leading-relaxed">
                          In the group selector, click "Invite member" next to
                          your group. Enter the person's email address. The
                          person must already have an account in FamCaly.
                        </AccordionContent>
                      </AccordionItem>

                      <AccordionItem
                        value="item-5"
                        className="border-b border-gray-200"
                      >
                        <AccordionTrigger className="text-left hover:no-underline py-4 group">
                          <span className="font-medium">
                            Can I be in multiple groups?
                          </span>
                        </AccordionTrigger>
                        <AccordionContent className="text-gray-600 leading-relaxed">
                          Yes, you can be a member of multiple groups. Each
                          group has its own calendar and events. You can switch
                          between groups in the group selector.
                        </AccordionContent>
                      </AccordionItem>

                      <AccordionItem value="item-6">
                        <AccordionTrigger className="text-left hover:no-underline py-4 group">
                          <span className="font-medium">
                            Who can see my events?
                          </span>
                        </AccordionTrigger>
                        <AccordionContent className="text-gray-600 leading-relaxed">
                          Only members of the same group can see the events.
                          Your events are private and not shared with other
                          groups or users outside your group.
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </CardContent>
                </Card>
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                {/* Events & Calendar */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <span>Events & Calendar</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Accordion
                      type="single"
                      collapsible
                      className="w-full"
                      value={openItem}
                      onValueChange={setOpenItem}
                    >
                      <AccordionItem
                        value="item-7"
                        className="border-b border-gray-200"
                      >
                        <AccordionTrigger className="text-left hover:no-underline py-4 group">
                          <span className="font-medium">
                            How do I add an event?
                          </span>
                        </AccordionTrigger>
                        <AccordionContent className="text-gray-600 leading-relaxed">
                          Click on a day in the calendar or on "Add event" in
                          the sidebar. Fill in title, date, time, type
                          (booking/task), responsible person, and category.
                        </AccordionContent>
                      </AccordionItem>

                      <AccordionItem
                        value="item-8"
                        className="border-b border-gray-200"
                      >
                        <AccordionTrigger className="text-left hover:no-underline py-4 group">
                          <span className="font-medium">
                            What's the difference between booking and task?
                          </span>
                        </AccordionTrigger>
                        <AccordionContent className="text-gray-600 leading-relaxed">
                          <strong>Booking:</strong> Scheduled times (doctor
                          appointments, meetings, etc.)
                          <br />
                          <strong>Task:</strong> Things that need to be done
                          (grocery shopping, cleaning, etc.)
                        </AccordionContent>
                      </AccordionItem>

                      <AccordionItem value="item-9">
                        <AccordionTrigger className="text-left hover:no-underline py-4 group">
                          <span className="font-medium">
                            Can I edit or delete events?
                          </span>
                        </AccordionTrigger>
                        <AccordionContent className="text-gray-600 leading-relaxed">
                          Yes, you can edit events that you created. Click on
                          the event to open edit mode. You can also delete
                          events you created.
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </CardContent>
                </Card>

                {/* Real-time Updates */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Zap className="w-5 h-5 text-blue-600" />
                      <span>Real-time Updates</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Accordion
                      type="single"
                      collapsible
                      className="w-full"
                      value={openItem}
                      onValueChange={setOpenItem}
                    >
                      <AccordionItem
                        value="item-10"
                        className="border-b border-gray-200"
                      >
                        <AccordionTrigger className="text-left hover:no-underline py-4 group">
                          <span className="font-medium">
                            Does the calendar update automatically?
                          </span>
                        </AccordionTrigger>
                        <AccordionContent className="text-gray-600 leading-relaxed">
                          Yes! When someone in the group adds or changes an
                          event, it appears immediately for all other members.
                          No manual refresh is needed.
                        </AccordionContent>
                      </AccordionItem>

                      <AccordionItem value="item-11">
                        <AccordionTrigger className="text-left hover:no-underline py-4 group">
                          <span className="font-medium">
                            Does it work on all devices?
                          </span>
                        </AccordionTrigger>
                        <AccordionContent className="text-gray-600 leading-relaxed">
                          FamCaly works on all modern browsers on computer,
                          tablet, and mobile. Real-time updates work on all
                          devices.
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </CardContent>
                </Card>

                {/* Security & Privacy */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Shield className="w-5 h-5 text-blue-600" />
                      <span>Security & Privacy</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Accordion
                      type="single"
                      collapsible
                      className="w-full"
                      value={openItem}
                      onValueChange={setOpenItem}
                    >
                      <AccordionItem
                        value="item-12"
                        className="border-b border-gray-200"
                      >
                        <AccordionTrigger className="text-left hover:no-underline py-4 group">
                          <span className="font-medium">
                            Is my data secure?
                          </span>
                        </AccordionTrigger>
                        <AccordionContent className="text-gray-600 leading-relaxed">
                          Yes, we use modern encryption and security standards.
                          Your data is stored securely and only shared with
                          members of your groups.
                        </AccordionContent>
                      </AccordionItem>

                      <AccordionItem value="item-13">
                        <AccordionTrigger className="text-left hover:no-underline py-4 group">
                          <span className="font-medium">
                            Can I delete my account?
                          </span>
                        </AccordionTrigger>
                        <AccordionContent className="text-gray-600 leading-relaxed">
                          Yes, you can delete your account in profile settings.
                          This permanently removes all your data. Note that this
                          affects groups you have created.
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Contact Support */}
            <Card className="mt-12">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Mail className="w-5 h-5 text-blue-600" />
                  <span>Need more help?</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 mb-4">
                  Didn't find the answer you were looking for? We're here to
                  help!
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <a
                    href="mailto:support@familjkal.se"
                    className="link-hover-animation-colored inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Mail className="w-4 h-4 mr-2" />
                    Contact support
                  </a>
                  <Link
                    to="/about"
                    className="link-hover-animation-colored inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Learn more about FamCaly
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
