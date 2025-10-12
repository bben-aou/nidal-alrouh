import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CrisisButton } from "@/components/CrisisButton";
import { Calendar, MapPin, Users, Heart, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const upcomingEvents = [
  {
    id: 1,
    title: "Promenade en plein air - Rabat",
    date: "Samedi 15 Février, 10:00",
    location: "Jardin d'Essais Botaniques",
    type: "En personne",
    attendees: 12,
    category: "Activité physique"
  },
  {
    id: 2,
    title: "Cercle de soutien en ligne",
    date: "Mardi 18 Février, 19:00",
    location: "En ligne (Zoom)",
    type: "Virtuel",
    attendees: 24,
    category: "Soutien par les pairs"
  },
  {
    id: 3,
    title: "Atelier créatif: Art-thérapie",
    date: "Dimanche 23 Février, 14:00",
    location: "Centre culturel, Casablanca",
    type: "En personne",
    attendees: 8,
    category: "Créatif"
  },
  {
    id: 4,
    title: "Session de méditation guidée",
    date: "Jeudi 20 Février, 18:00",
    location: "En ligne",
    type: "Virtuel",
    attendees: 31,
    category: "Bien-être"
  }
];

const Events = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container px-6 py-12">
        {/* Hero */}
        <div className="max-w-5xl mx-auto mb-12">
          <div className="text-center mb-8">
            <Calendar className="h-16 w-16 text-primary mx-auto mb-6" />
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Événements communautaires
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Rejoignez des activités de groupe pour vous connecter, vous soutenir mutuellement et prendre soin de votre bien-être
            </p>
          </div>

          {/* Filter */}
          <div className="flex flex-wrap gap-3 justify-center mb-12">
            <Button variant="outline" size="sm" className="gap-2">
              <Filter className="h-4 w-4" />
              Tous les événements
            </Button>
            <Button variant="outline" size="sm">En personne</Button>
            <Button variant="outline" size="sm">En ligne</Button>
            <Button variant="outline" size="sm">Cette semaine</Button>
          </div>

          {/* Events Grid */}
          <div className="space-y-6">
            {upcomingEvents.map((event) => (
              <div key={event.id} className="card-soft hover-lift">
                <div className="flex flex-col md:flex-row gap-6">
                  {/* Date Badge */}
                  <div className="flex-shrink-0">
                    <div className="w-20 h-20 bg-primary/10 rounded-xl flex flex-col items-center justify-center">
                      <span className="text-2xl font-bold text-primary">
                        {event.date.split(' ')[1]}
                      </span>
                      <span className="text-xs text-muted-foreground uppercase">
                        {event.date.split(' ')[2]}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap gap-2 mb-3">
                      <Badge variant="outline" className="text-xs">
                        {event.category}
                      </Badge>
                      <Badge 
                        className={`text-xs ${
                          event.type === "Virtuel" 
                            ? "bg-secondary/20 text-secondary-foreground" 
                            : "bg-accent/30 text-accent-foreground"
                        }`}
                      >
                        {event.type}
                      </Badge>
                    </div>

                    <h3 className="text-xl font-semibold text-foreground mb-2">
                      {event.title}
                    </h3>

                    <div className="flex flex-col sm:flex-row sm:items-center gap-3 text-sm text-muted-foreground mb-4">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span>{event.date}</span>
                      </div>
                      <span className="hidden sm:inline">•</span>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        <span>{event.location}</span>
                      </div>
                      <span className="hidden sm:inline">•</span>
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        <span>{event.attendees} participants</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-3">
                      <Button className="bg-primary hover:bg-primary-dark">
                        S&apos;inscrire
                      </Button>
                      <Button variant="outline">
                        En savoir plus
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Create Event CTA */}
          <div className="mt-16 bg-secondary/5 rounded-2xl p-8 md:p-12 text-center">
            <Heart className="h-12 w-12 text-secondary mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-foreground mb-4">
              Vous voulez organiser un événement?
            </h2>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Si vous êtes un professionnel de santé, un volontaire ou simplement quelqu&apos;un 
              qui veut rassembler la communauté, créez votre propre événement.
            </p>
            <Button size="lg" className="bg-secondary hover:bg-secondary-light text-secondary-foreground">
              Créer un événement
            </Button>
          </div>
        </div>
      </main>

      <Footer />
      <CrisisButton />
    </div>
  );
};

export default Events;
