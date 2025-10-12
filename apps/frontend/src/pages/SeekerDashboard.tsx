import { Header } from "@/components/Header";
import { CrisisButton } from "@/components/CrisisButton";
import { MessageCircle, BookOpen, Calendar, TrendingUp, Heart, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

const SeekerDashboard = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container px-6 py-12">
        <div className="max-w-6xl mx-auto">
          {/* Welcome */}
          <div className="mb-12">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
              Bienvenue dans votre espace sûr
            </h1>
            <p className="text-lg text-muted-foreground">
              Vous n&apos;êtes pas seul(e) dans votre parcours. Explorez les ressources et le soutien disponibles.
            </p>
          </div>

          {/* Quick Actions */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <Link href="/forum">
              <Card className="hover-lift cursor-pointer h-full">
                <CardHeader>
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <MessageCircle className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>Forum communautaire</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Partagez votre expérience et trouvez du soutien
                  </p>
                </CardContent>
              </Card>
            </Link>

            <Card className="hover-lift cursor-pointer h-full">
              <CardHeader>
                <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-secondary" />
                </div>
                <CardTitle>Trouver de l&apos;aide</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Connectez-vous avec des helpers disponibles
                </p>
              </CardContent>
            </Card>

            <Link href="/resources">
              <Card className="hover-lift cursor-pointer h-full">
                <CardHeader>
                  <div className="w-12 h-12 rounded-full bg-accent/30 flex items-center justify-center mb-4">
                    <BookOpen className="h-6 w-6 text-accent-dark" />
                  </div>
                  <CardTitle>Ressources</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Articles, guides et stratégies d&apos;adaptation
                  </p>
                </CardContent>
              </Card>
            </Link>
          </div>

          {/* Dashboard Sections */}
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Mood Tracker */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  Suivi de l&apos;humeur
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Comment vous sentez-vous aujourd&apos;hui?
                  </p>
                  <div className="flex gap-2 justify-between">
                    {["😢", "😟", "😐", "🙂", "😊"].map((emoji, idx) => (
                      <button
                        key={idx}
                        className="w-12 h-12 rounded-full bg-muted hover:bg-accent/20 transition-colors text-2xl"
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                  <div className="pt-4">
                    <p className="text-xs text-muted-foreground mb-2">
                      Votre humeur cette semaine
                    </p>
                    <div className="h-32 bg-muted/30 rounded-lg flex items-end justify-around p-4">
                      {[60, 40, 55, 70, 50, 65, 75].map((height, idx) => (
                        <div
                          key={idx}
                          className="w-6 bg-primary/50 rounded-t"
                          style={{ height: `${height}%` }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Conversations */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageCircle className="h-5 w-5 text-secondary" />
                  Messages récents
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center py-8 text-muted-foreground">
                    <p className="mb-4">Aucun message pour le moment</p>
                    <Button variant="outline" className="gap-2">
                      <Users className="h-4 w-4" />
                      Trouver un helper
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Upcoming Events */}
            <Link href="/events">
              <Card className="hover-lift cursor-pointer">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-accent-dark" />
                    Événements à venir
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg">
                      <Calendar className="h-4 w-4 text-primary mt-1" />
                      <div className="text-sm">
                        <p className="font-medium text-foreground">Promenade en plein air</p>
                        <p className="text-xs text-muted-foreground">Samedi 15 Fév, 10:00</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg">
                      <Calendar className="h-4 w-4 text-secondary mt-1" />
                      <div className="text-sm">
                        <p className="font-medium text-foreground">Cercle de soutien en ligne</p>
                        <p className="text-xs text-muted-foreground">Mardi 18 Fév, 19:00</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>

            {/* Personal Journal */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="h-5 w-5 text-destructive" />
                  Journal personnel
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Écrivez vos pensées et réflexions en toute confidentialité
                </p>
                <Button variant="outline" className="w-full">
                  Ouvrir mon journal
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <CrisisButton />
    </div>
  );
};

export default SeekerDashboard;
