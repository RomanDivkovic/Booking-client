import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { User, Mail, Calendar, Shield, Save, Camera } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';

export default function Profile() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [profileData, setProfileData] = useState({
    full_name: user?.user_metadata?.full_name || '',
    email: user?.email || '',
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const getUserInitials = (email: string) => {
    return email.substring(0, 2).toUpperCase();
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: profileData.full_name,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);

      if (error) throw error;

      toast({
        title: 'Profil uppdaterad!',
        description: 'Din profil har uppdaterats framgångsrikt.',
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: 'Fel vid uppdatering',
        description: 'Kunde inte uppdatera profilen. Försök igen.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast({
        title: 'Lösenord matchar inte',
        description: 'Det nya lösenordet och bekräftelsen matchar inte.',
        variant: 'destructive',
      });
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast({
        title: 'Lösenord för kort',
        description: 'Lösenordet måste vara minst 6 tecken långt.',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: passwordData.newPassword,
      });

      if (error) throw error;

      toast({
        title: 'Lösenord ändrat!',
        description: 'Ditt lösenord har uppdaterats framgångsrikt.',
      });

      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch (error) {
      console.error('Error changing password:', error);
      toast({
        title: 'Fel vid lösenordsändring',
        description: 'Kunde inte ändra lösenordet. Försök igen.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex flex-col">
      <Header />
      
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Min Profil</h1>
              <p className="text-gray-600">Hantera din profil och säkerhetsinställningar</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Profile Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <User className="w-5 h-5 text-blue-600" />
                    <span>Profilinformation</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-4 mb-6">
                    <Avatar className="w-20 h-20">
                      <AvatarFallback className="bg-blue-100 text-blue-600 text-2xl font-medium">
                        {getUserInitials(user?.email || '')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="text-lg font-semibold">{profileData.full_name || 'Användare'}</h3>
                      <p className="text-gray-600">{user?.email}</p>
                      <p className="text-sm text-gray-500">
                        Medlem sedan {user?.created_at ? new Date(user.created_at).toLocaleDateString('sv-SE') : 'N/A'}
                      </p>
                    </div>
                  </div>

                  <form onSubmit={handleProfileUpdate} className="space-y-4">
                    <div>
                      <Label htmlFor="full_name">Namn</Label>
                      <Input
                        id="full_name"
                        value={profileData.full_name}
                        onChange={(e) => setProfileData(prev => ({ ...prev, full_name: e.target.value }))}
                        placeholder="Ditt namn"
                      />
                    </div>

                    <div>
                      <Label htmlFor="email">E-post</Label>
                      <Input
                        id="email"
                        value={profileData.email}
                        disabled
                        className="bg-gray-50"
                      />
                      <p className="text-sm text-gray-500 mt-1">
                        E-postadressen kan inte ändras
                      </p>
                    </div>

                    <Button type="submit" disabled={loading} className="w-full">
                      <Save className="w-4 h-4 mr-2" />
                      {loading ? 'Sparar...' : 'Spara ändringar'}
                    </Button>
                  </form>
                </CardContent>
              </Card>

              {/* Password Change */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Shield className="w-5 h-5 text-blue-600" />
                    <span>Ändra lösenord</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handlePasswordChange} className="space-y-4">
                    <div>
                      <Label htmlFor="newPassword">Nytt lösenord</Label>
                      <Input
                        id="newPassword"
                        type="password"
                        value={passwordData.newPassword}
                        onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                        placeholder="Minst 6 tecken"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="confirmPassword">Bekräfta nytt lösenord</Label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        value={passwordData.confirmPassword}
                        onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                        placeholder="Upprepa lösenordet"
                        required
                      />
                    </div>

                    <Button type="submit" disabled={loading} className="w-full">
                      <Shield className="w-4 h-4 mr-2" />
                      {loading ? 'Ändrar...' : 'Ändra lösenord'}
                    </Button>
                  </form>

                  <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-medium text-blue-900 mb-2">Säkerhetstips</h4>
                    <ul className="text-sm text-blue-800 space-y-1">
                      <li>• Använd minst 6 tecken</li>
                      <li>• Kombinera bokstäver och siffror</li>
                      <li>• Undvik personlig information</li>
                      <li>• Använd olika lösenord för olika tjänster</li>
                    </ul>
                  </div>
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
