import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Calendar, Shield, Users } from 'lucide-react';

export default function TOS() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex flex-col">
      <Header />
      
      <main className="flex-1">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto">
            {/* Hero Section */}
            <div className="text-center mb-12">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <FileText className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-4xl font-bold text-gray-900 mb-4">Användarvillkor</h1>
              <p className="text-xl text-gray-600">
                Senast uppdaterad: {new Date().toLocaleDateString('sv-SE')}
              </p>
            </div>

            {/* Terms Content */}
            <div className="space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle>1. Tjänstebeskrivning</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    FamiljKal är en webbaserad kalendertjänst som låter användare skapa grupper, 
                    dela kalendrar och koordinera händelser och uppgifter inom hushåll och familjer.
                  </p>
                  <p className="text-gray-700 leading-relaxed">
                    Genom att använda FamiljKal godkänner du dessa användarvillkor och vår 
                    integritetspolicy.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>2. Användarregistrering</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="text-gray-700 leading-relaxed space-y-2">
                    <li>• Du måste vara minst 13 år gammal för att skapa ett konto</li>
                    <li>• Du ansvarar för att all information du anger är korrekt och aktuell</li>
                    <li>• Du ansvarar för att hålla ditt lösenord säkert och konfidentiellt</li>
                    <li>• Du får inte dela ditt konto med andra personer</li>
                    <li>• Du måste meddela oss omedelbart vid misstänkt säkerhetsöverträdelse</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>3. Acceptabel användning</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    Du åtar dig att använda FamiljKal endast för lagliga och etiska ändamål. 
                    Du får inte:
                  </p>
                  <ul className="text-gray-700 leading-relaxed space-y-2">
                    <li>• Använda tjänsten för olaglig aktivitet</li>
                    <li>• Dela innehåll som är kränkande, hotfullt eller olämpligt</li>
                    <li>• Försöka hacka eller störa tjänsten</li>
                    <li>• Använda automatiserade system för att komma åt tjänsten</li>
                    <li>• Dela personuppgifter om andra utan deras samtycke</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>4. Grupphantering och delning</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="text-gray-700 leading-relaxed space-y-2">
                    <li>• Du ansvarar för innehållet i grupper du skapar</li>
                    <li>• Du får bara bjuda in personer som du har rätt att dela information med</li>
                    <li>• Alla gruppmedlemmar måste ha ett giltigt konto</li>
                    <li>• Du kan när som helst lämna en grupp</li>
                    <li>• Gruppskapare kan ta bort medlemmar från gruppen</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>5. Dataskydd och integritet</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    Vi tar din integritet på allvar. Se vår integritetspolicy för detaljer om 
                    hur vi hanterar din data.
                  </p>
                  <ul className="text-gray-700 leading-relaxed space-y-2">
                    <li>• Vi samlar endast in data som behövs för tjänsten</li>
                    <li>• Din data delas endast med medlemmar i dina grupper</li>
                    <li>• Vi använder modern kryptering för att skydda din data</li>
                    <li>• Du kan när som helst begära att få din data raderad</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>6. Tjänstens tillgänglighet</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="text-gray-700 leading-relaxed space-y-2">
                    <li>• Vi strävar efter hög tillgänglighet men kan inte garantera 100% uptime</li>
                    <li>• Vi kan behöva stänga av tjänsten för underhåll</li>
                    <li>• Vi ansvarar inte för förluster på grund av driftstörningar</li>
                    <li>• Vi meddelar i förväg vid planerade underhållsstopp</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>7. Ansvarsfriskrivning</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    FamiljKal tillhandahålls "i befintligt skick" utan garantier. Vi ansvarar inte för:
                  </p>
                  <ul className="text-gray-700 leading-relaxed space-y-2">
                    <li>• Indirekta eller följdskador</li>
                    <li>• Förlust av data eller innehåll</li>
                    <li>• Felaktig information som användare lägger till</li>
                    <li>• Konflikter mellan gruppmedlemmar</li>
                    <li>• Skador från tredjepartstjänster</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>8. Ändringar av villkoren</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 leading-relaxed">
                    Vi förbehåller oss rätten att ändra dessa villkor. Vid väsentliga ändringar 
                    meddelar vi dig via e-post eller genom ett meddelande i tjänsten. Fortsatt 
                    användning efter ändringar innebär att du accepterar de nya villkoren.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>9. Uppsägning</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="text-gray-700 leading-relaxed space-y-2">
                    <li>• Du kan när som helst avsluta ditt konto</li>
                    <li>• Vi kan avsluta ditt konto vid överträdelse av villkoren</li>
                    <li>• Vid avslut raderas din data inom 30 dagar</li>
                    <li>• Grupper du skapat påverkas av ditt avslut</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>10. Kontakt</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 leading-relaxed">
                    Vid frågor om dessa villkor, kontakta oss på{' '}
                    <a href="mailto:legal@familjkal.se" className="text-blue-600 hover:underline">
                      legal@familjkal.se
                    </a>
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
} 