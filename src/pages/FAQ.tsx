import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { HelpCircle, Calendar, Users, Shield, Zap, Mail } from 'lucide-react';

export default function FAQ() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex flex-col">
      <Header />
      
      <main className="flex-1">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-6xl mx-auto">
            {/* Hero Section */}
            <div className="text-center mb-12">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <HelpCircle className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-4xl font-bold text-gray-900 mb-4">Vanliga frågor</h1>
              <p className="text-xl text-gray-600">
                Hitta svar på de vanligaste frågorna om FamiljKal
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
                      <span>Komma igång</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Accordion type="single" collapsible className="w-full">
                      <AccordionItem value="item-1" className="border-b border-gray-200">
                        <AccordionTrigger className="text-left hover:no-underline py-4">
                          <span className="font-medium">Hur skapar jag ett konto?</span>
                        </AccordionTrigger>
                        <AccordionContent className="text-gray-600 leading-relaxed">
                          Klicka på "Registrera" på inloggningssidan och fyll i din e-postadress, 
                          lösenord och namn. Du får en bekräftelse via e-post för att aktivera ditt konto.
                        </AccordionContent>
                      </AccordionItem>
                      
                      <AccordionItem value="item-2" className="border-b border-gray-200">
                        <AccordionTrigger className="text-left hover:no-underline py-4">
                          <span className="font-medium">Hur skapar jag min första grupp?</span>
                        </AccordionTrigger>
                        <AccordionContent className="text-gray-600 leading-relaxed">
                          Efter inloggning klickar du på "Skapa ny grupp" på gruppväljarsidan. 
                          Ge gruppen ett namn och beskrivning, sedan kan du bjuda in familjemedlemmar.
                        </AccordionContent>
                      </AccordionItem>
                      
                      <AccordionItem value="item-3">
                        <AccordionTrigger className="text-left hover:no-underline py-4">
                          <span className="font-medium">Kan jag använda FamiljKal utan grupp?</span>
                        </AccordionTrigger>
                        <AccordionContent className="text-gray-600 leading-relaxed">
                          Nej, FamiljKal är designat för samarbete. Du måste skapa eller gå med i 
                          en grupp för att använda kalendern. Detta säkerställer att alla händelser 
                          delas med rätt personer.
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
                      <span>Grupper & Delning</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Accordion type="single" collapsible className="w-full">
                      <AccordionItem value="item-4" className="border-b border-gray-200">
                        <AccordionTrigger className="text-left hover:no-underline py-4">
                          <span className="font-medium">Hur bjuder jag in någon till min grupp?</span>
                        </AccordionTrigger>
                        <AccordionContent className="text-gray-600 leading-relaxed">
                          I gruppväljaren, klicka på "Bjud in medlem" bredvid din grupp. 
                          Ange personens e-postadress. Personen måste redan ha ett konto i FamiljKal.
                        </AccordionContent>
                      </AccordionItem>
                      
                      <AccordionItem value="item-5" className="border-b border-gray-200">
                        <AccordionTrigger className="text-left hover:no-underline py-4">
                          <span className="font-medium">Kan jag vara med i flera grupper?</span>
                        </AccordionTrigger>
                        <AccordionContent className="text-gray-600 leading-relaxed">
                          Ja, du kan vara medlem i flera grupper. Varje grupp har sin egen kalender 
                          och händelser. Du kan växla mellan grupper i gruppväljaren.
                        </AccordionContent>
                      </AccordionItem>
                      
                      <AccordionItem value="item-6">
                        <AccordionTrigger className="text-left hover:no-underline py-4">
                          <span className="font-medium">Vem kan se mina händelser?</span>
                        </AccordionTrigger>
                        <AccordionContent className="text-gray-600 leading-relaxed">
                          Endast medlemmar i samma grupp kan se händelserna. Dina händelser är 
                          privata och delas inte med andra grupper eller användare utanför din grupp.
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
                      <Calendar className="w-5 h-5 text-blue-600" />
                      <span>Händelser & Kalender</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Accordion type="single" collapsible className="w-full">
                      <AccordionItem value="item-7" className="border-b border-gray-200">
                        <AccordionTrigger className="text-left hover:no-underline py-4">
                          <span className="font-medium">Hur lägger jag till en händelse?</span>
                        </AccordionTrigger>
                        <AccordionContent className="text-gray-600 leading-relaxed">
                          Klicka på en dag i kalendern eller på "Lägg till händelse" i sidopanelen. 
                          Fyll i titel, datum, tid, typ (bokning/uppgift), ansvarig person och kategori.
                        </AccordionContent>
                      </AccordionItem>
                      
                      <AccordionItem value="item-8" className="border-b border-gray-200">
                        <AccordionTrigger className="text-left hover:no-underline py-4">
                          <span className="font-medium">Vad är skillnaden mellan bokning och uppgift?</span>
                        </AccordionTrigger>
                        <AccordionContent className="text-gray-600 leading-relaxed">
                          <strong>Bokning:</strong> Tider som är schemalagda (läkarbesök, möten, etc.)<br/>
                          <strong>Uppgift:</strong> Saker som behöver göras (handla mat, städa, etc.)
                        </AccordionContent>
                      </AccordionItem>
                      
                      <AccordionItem value="item-9">
                        <AccordionTrigger className="text-left hover:no-underline py-4">
                          <span className="font-medium">Kan jag redigera eller ta bort händelser?</span>
                        </AccordionTrigger>
                        <AccordionContent className="text-gray-600 leading-relaxed">
                          Ja, du kan redigera händelser som du har skapat. Klicka på händelsen 
                          för att öppna redigeringsläget. Du kan också ta bort händelser du skapat.
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
                      <span>Realtidsuppdateringar</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Accordion type="single" collapsible className="w-full">
                      <AccordionItem value="item-10" className="border-b border-gray-200">
                        <AccordionTrigger className="text-left hover:no-underline py-4">
                          <span className="font-medium">Uppdateras kalendern automatiskt?</span>
                        </AccordionTrigger>
                        <AccordionContent className="text-gray-600 leading-relaxed">
                          Ja! När någon i gruppen lägger till eller ändrar en händelse syns det 
                          omedelbart för alla andra medlemmar. Ingen manuell uppdatering behövs.
                        </AccordionContent>
                      </AccordionItem>
                      
                      <AccordionItem value="item-11">
                        <AccordionTrigger className="text-left hover:no-underline py-4">
                          <span className="font-medium">Fungerar det på alla enheter?</span>
                        </AccordionTrigger>
                        <AccordionContent className="text-gray-600 leading-relaxed">
                          FamiljKal fungerar på alla moderna webbläsare på dator, surfplatta och mobil. 
                          Realtidsuppdateringar fungerar på alla enheter.
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
                      <span>Säkerhet & Integritet</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Accordion type="single" collapsible className="w-full">
                      <AccordionItem value="item-12" className="border-b border-gray-200">
                        <AccordionTrigger className="text-left hover:no-underline py-4">
                          <span className="font-medium">Är min data säker?</span>
                        </AccordionTrigger>
                        <AccordionContent className="text-gray-600 leading-relaxed">
                          Ja, vi använder modern kryptering och säkerhetsstandarder. Din data lagras 
                          säkert och delas endast med medlemmar i dina grupper.
                        </AccordionContent>
                      </AccordionItem>
                      
                      <AccordionItem value="item-13">
                        <AccordionTrigger className="text-left hover:no-underline py-4">
                          <span className="font-medium">Kan jag ta bort mitt konto?</span>
                        </AccordionTrigger>
                        <AccordionContent className="text-gray-600 leading-relaxed">
                          Ja, du kan ta bort ditt konto i profilinställningarna. Detta tar bort 
                          all din data permanent. Observera att detta påverkar grupper du har skapat.
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
                  <span>Behöver du mer hjälp?</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 mb-4">
                  Hittade du inte svaret du letade efter? Vi är här för att hjälpa dig!
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <a 
                    href="mailto:support@familjkal.se" 
                    className="inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Mail className="w-4 h-4 mr-2" />
                    Kontakta support
                  </a>
                  <a 
                    href="/about" 
                    className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Läs mer om FamiljKal
                  </a>
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