import { Header } from "@/components/Header";
import { CrisisButton } from "@/components/CrisisButton";
import { MessageCircle, Calendar, Users, Heart, CheckCircle, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

const HelperDashboard = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container px-6 py-12">
        <div className="max-w-6xl mx-auto">
          {/* Welcome */}
          <div className="mb-12">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
              Merci de votre engagement
            </h1>
            <p className="text-lg text-muted-foreground">
              Votre soutien fait une vraie différence dans la vie des gens.
            </p>
          </div>

          {/* Stats */}
          <div className="grid md:grid-cols-4 gap-6 mb-12">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Personnes aidées</p>
                    <p className="text-3xl font-bold text-foreground">12</p>
                  </div>
                  <Users className="h-8 w-8 text-primary" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Sessions complètes</p>
                    <p className="text-3xl font-bold text-foreground">28</p>
                  </div>
                  <CheckCircle className="h-8 w-8 text-secondary" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Heures de soutien</p>
                    <p className="text-3xl font-bold text-foreground">45</p>
                  </div>
                  <Clock className="h-8 w-8 text-accent-dark" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">En attente</p>
                    <p className="text-3xl font-bold text-foreground">3</p>
                  </div>
                  <MessageCircle className="h-8 w-8 text-primary" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Dashboard Sections */}
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Support Requests */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="h-5 w-5 text-destructive" />
                  Demandes de soutien
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[1, 2, 3].map((item) => (
                    <div key={item} className="p-4 bg-muted/30 rounded-lg">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <p className="font-medium text-foreground">Anonyme</p>
                          <p className="text-sm text-muted-foreground">Demandé il y a 2h</p>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          Anxiété
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">
                        Cherche quelqu&apos;un pour parler de gestion du stress au travail...
                      </p>
                      <div className="flex gap-2">
                        <Button size="sm" className="bg-primary hover:bg-primary-dark">
                          Accepter
                        </Button>
                        <Button size="sm" variant="outline">
                          Voir détails
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Active Conversations */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageCircle className="h-5 w-5 text-secondary" />
                  Conversations actives
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[1, 2].map((item) => (
                    <div key={item} className="p-4 bg-muted/30 rounded-lg hover-lift cursor-pointer">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <Users className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium text-foreground">Utilisateur #{item}</p>
                            <p className="text-xs text-muted-foreground">Actif il y a 5 min</p>
                          </div>
                        </div>
                        <span className="w-2 h-2 rounded-full bg-secondary animate-gentle-pulse" />
                      </div>
                      <p className="text-sm text-muted-foreground pl-13">
                        Merci beaucoup pour votre écoute...
                      </p>
                    </div>
                  ))}
                  <Button variant="outline" className="w-full">
                    Voir tous les messages
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Availability Calendar */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-accent-dark" />
                  Ma disponibilité
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Définissez vos horaires pour offrir du soutien
                  </p>
                  <div className="space-y-2">
                    {["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi"].map((day) => (
                      <div key={day} className="flex items-center justify-between p-2 bg-muted/30 rounded">
                        <span className="text-sm font-medium">{day}</span>
                        <span className="text-xs text-muted-foreground">18:00 - 21:00</span>
                      </div>
                    ))}
                  </div>
                  <Button variant="outline" className="w-full">
                    Modifier ma disponibilité
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Resources for Helpers */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  Ressources pour helpers
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Link href="/resources" className="block p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors">
                    <p className="text-sm font-medium text-foreground mb-1">
                      Guide: Comment écouter activement
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Techniques d&apos;écoute empathique
                    </p>
                  </Link>
                  <Link href="/resources" className="block p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors">
                    <p className="text-sm font-medium text-foreground mb-1">
                      Prendre soin de soi en tant que helper
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Éviter l&apos;épuisement compassionnel
                    </p>
                  </Link>
                  <Link href="/events" className="block p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors">
                    <p className="text-sm font-medium text-foreground mb-1">
                      Rejoindre une supervision de groupe
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Prochain: Jeudi 20 Fév, 20:00
                    </p>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <CrisisButton />
    </div>
  );
};

export default HelperDashboard;
