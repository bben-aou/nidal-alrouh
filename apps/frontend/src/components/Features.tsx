import { MessageCircle, Users, BookOpen, Calendar, Shield, Heart } from "lucide-react";

const features = [
  {
    icon: MessageCircle,
    title: "Forum communautaire",
    description: "Partagez votre expérience et soutenez les autres dans un espace sûr et modéré",
    color: "text-primary",
  },
  {
    icon: Users,
    title: "Messagerie privée",
    description: "Connectez-vous avec des pairs et des professionnels en toute confidentialité",
    color: "text-secondary",
  },
  {
    icon: BookOpen,
    title: "Ressources éducatives",
    description: "Accédez à des articles, stratégies d&apos;adaptation et ressources d&apos;urgence",
    color: "text-accent-dark",
  },
  {
    icon: Calendar,
    title: "Événements communautaires",
    description: "Rejoignez des promenades, rencontres et activités créatives en groupe",
    color: "text-primary",
  },
  {
    icon: Shield,
    title: "Anonymat protégé",
    description: "Participez de manière anonyme si vous préférez - votre vie privée est respectée",
    color: "text-secondary",
  },
  {
    icon: Heart,
    title: "Suivi personnel",
    description: "Suivez votre humeur et votre progression dans un journal privé",
    color: "text-accent-dark",
  },
];

export const Features = () => {
  return (
    <section className="py-20 bg-muted/30">
      <div className="container px-6">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Comment nous pouvons vous aider
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Des outils et ressources pensés pour vous accompagner dans votre parcours
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <div
              key={index}
              className="card-soft hover-lift animate-slide-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <feature.icon className={`h-12 w-12 mb-4 ${feature.color}`} />
              <h3 className="text-xl font-semibold mb-3 text-foreground">
                {feature.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
