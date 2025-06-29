import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Users, Shield, Zap, Heart, Target } from 'lucide-react';

export default function About() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex flex-col">
      <Header />
      
      <main className="flex-1">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto">
            {/* Hero Section */}
            <div className="text-center mb-12">
              <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Calendar className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-4xl font-bold text-gray-900 mb-4">Om FamiljKal</h1>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                En modern familjekalender som hjälper hushåll att organisera sina aktiviteter, 
                dela ansvar och hålla koll på viktiga händelser.
              </p>
            </div>

            {/* Mission */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Target className="w-5 h-5 text-blue-600" />
                  <span>Vårt uppdrag</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed">
                  FamiljKal skapades med visionen att göra det enklare för familjer och hushåll 
                  att koordinera sina liv. Vi tror att när alla i familjen har koll på vad som 
                  händer, kan ni fokusera på det som verkligen betyder något - tid tillsammans.
                </p>
              </CardContent>
            </Card>

            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Calendar className="w-5 h-5 text-blue-600" />
                    <span>Delad Kalender</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    Alla i hushållet ser samma kalender i realtid. Lägg till händelser, 
                    bokningar och uppgifter som alla kan se och hantera.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Users className="w-5 h-5 text-blue-600" />
                    <span>Grupphantering</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    Skapa grupper för olika hushåll eller aktiviteter. Bjud in medlemmar 
                    och hantera roller och behörigheter enkelt.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Zap className="w-5 h-5 text-blue-600" />
                    <span>Realtidsuppdateringar</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    När någon lägger till eller ändrar en händelse syns det omedelbart 
                    för alla medlemmar i gruppen.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Shield className="w-5 h-5 text-blue-600" />
                    <span>Säker & Privat</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    Din data är säker med oss. Vi använder modern kryptering och 
                    säkerhetsstandarder för att skydda din information.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Target className="w-5 h-5 text-blue-600" />
                    <span>Ansvarstilldelning</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    Tilldela ansvar för olika uppgifter och händelser. 
                    Håll koll på vem som ska göra vad och när.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Heart className="w-5 h-5 text-blue-600" />
                    <span>Användarvänlig</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    Enkelt och intuitivt gränssnitt som fungerar på alla enheter. 
                    Ingen komplicerad setup - kom igång direkt.
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Team/Story */}
            <Card>
              <CardHeader>
                <CardTitle>Vår historia</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose prose-gray max-w-none">
                  <p className="text-gray-700 leading-relaxed mb-4">
                    FamiljKal föddes ur en personlig behov - att bättre koordinera vårt 
                    familjeliv. Vi upptäckte att många familjer kämpade med samma utmaningar: 
                    att hålla koll på alla aktiviteter, bokningar och uppgifter som behöver 
                    göras i ett hushåll.
                  </p>
                  <p className="text-gray-700 leading-relaxed">
                    Med modern teknologi och fokus på användarvänlighet skapade vi en 
                    lösning som verkligen fungerar för familjer. FamiljKal hjälper dig 
                    att minska stress, öka kommunikationen och skapa mer kvalitetstid 
                    tillsammans.
                  </p>
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