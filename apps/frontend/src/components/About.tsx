import { Heart, Lock, Globe } from "lucide-react";

export const About = () => {
  return (
    <section className="py-20 bg-background">
      <div className="container px-6">
        <div className="max-w-4xl mx-auto space-y-12">
          <div className="text-center animate-fade-in">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Notre mission
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Nidal Al-Rouh est née d&apos;une expérience vécue pour aider les personnes 
              qui souffrent en silence. Nous croyons que personne ne devrait affronter 
              seul ses défis de santé mentale.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 pt-8">
            <div className="text-center space-y-4">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                <Heart className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground">
                Compassion
              </h3>
              <p className="text-muted-foreground">
                Créer un espace sûr où chaque parcours est honoré avec dignité et respect
              </p>
            </div>

            <div className="text-center space-y-4">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-secondary/10 mb-4">
                <Lock className="h-8 w-8 text-secondary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground">
                Confidentialité
              </h3>
              <p className="text-muted-foreground">
                Votre vie privée et votre anonymat sont notre priorité absolue
              </p>
            </div>

            <div className="text-center space-y-4">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent/30 mb-4">
                <Globe className="h-8 w-8 text-accent-dark" />
              </div>
              <h3 className="text-xl font-semibold text-foreground">
                Communauté
              </h3>
              <p className="text-muted-foreground">
                Bâtir des ponts entre ceux qui cherchent de l&apos;aide et ceux qui peuvent aider
              </p>
            </div>
          </div>

          <div className="bg-accent/10 rounded-2xl p-8 mt-12">
            <p className="text-center text-foreground/90 text-lg leading-relaxed">
              &ldquo;نضال الروح&rdquo; signifie &ldquo;la lutte de l&apos;âme&rdquo; ou &ldquo;le parcours de l&apos;âme&rdquo; -
              reconnaissant la bataille intérieure tout en célébrant la résilience qui vit en chacun de nous.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
