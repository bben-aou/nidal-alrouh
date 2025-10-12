import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CrisisButton } from "@/components/CrisisButton";
import { About as AboutSection } from "@/components/About";
import { Heart, Users, Shield, Globe } from "lucide-react";

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main>
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-b from-primary/5 to-background">
          <div className="container px-6 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              À propos de Nidal Al-Rouh
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              نضال الروح (Nidal Al-Rouh) signifie &quot;la lutte de l&apos;âme&quot; ou &quot;le parcours de l&apos;âme&quot;. 
              C&apos;est une reconnaissance de la bataille intérieure que vivent tant de personnes.
            </p>
          </div>
        </section>

        <AboutSection />

        {/* Story Section */}
        <section className="py-20 bg-muted/30">
          <div className="container px-6">
            <div className="max-w-4xl mx-auto space-y-8">
              <h2 className="text-3xl font-bold text-foreground text-center mb-8">
                Notre histoire
              </h2>
              <div className="prose prose-lg max-w-none space-y-6 text-foreground/90">
                <p className="leading-relaxed">
                  Nidal Al-Rouh est né d&apos;une expérience vécue. Nous avons vu de près la douleur 
                  de ceux qui souffrent en silence, isolés par la stigmatisation entourant la santé 
                  mentale au Maroc.
                </p>
                <p className="leading-relaxed">
                  Trop souvent, les personnes qui traversent des moments difficiles - anxiété, 
                  dépression, troubles bipolaires - n&apos;ont nulle part où se tourner. Les services 
                  professionnels sont limités ou inaccessibles. La famille peut ne pas comprendre. 
                  Les amis peuvent s&apos;éloigner.
                </p>
                <p className="leading-relaxed">
                  Nous croyons que personne ne devrait affronter seul ses défis de santé mentale. 
                  C&apos;est pourquoi nous avons créé cette plateforme - un espace sûr où les Marocains 
                  peuvent trouver du soutien, de la compréhension et de l&apos;espoir.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-6 pt-8">
                <div className="card-soft">
                  <h3 className="text-xl font-semibold text-foreground mb-3">
                    Sans but lucratif
                  </h3>
                  <p className="text-muted-foreground">
                    Nidal Al-Rouh est une organisation à but non lucratif. Nous ne vendons pas 
                    vos données, nous ne facturons pas de frais. Notre seul objectif est d&apos;aider.
                  </p>
                </div>
                <div className="card-soft">
                  <h3 className="text-xl font-semibold text-foreground mb-3">
                    Open-source
                  </h3>
                  <p className="text-muted-foreground">
                    Notre code est ouvert et transparent. Nous croyons en la transparence et en 
                    la collaboration communautaire pour créer un meilleur système de soutien.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="py-20 bg-background">
          <div className="container px-6">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-foreground text-center mb-12">
                Nos valeurs fondamentales
              </h2>
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <Heart className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-foreground mb-2">
                        Compassion avant tout
                      </h3>
                      <p className="text-muted-foreground">
                        Chaque personne mérite d&apos;être entendue, respectée et soutenue dans son parcours unique.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center">
                      <Shield className="h-6 w-6 text-secondary" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-foreground mb-2">
                        Sécurité et confidentialité
                      </h3>
                      <p className="text-muted-foreground">
                        Votre vie privée est sacrée. Anonymat protégé, données chiffrées, zéro jugement.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-accent/30 flex items-center justify-center">
                      <Users className="h-6 w-6 text-accent-dark" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-foreground mb-2">
                        Force communautaire
                      </h3>
                      <p className="text-muted-foreground">
                        Le soutien par les pairs est puissant. Ensemble, nous sommes plus forts.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <Globe className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-foreground mb-2">
                        Sensibilité culturelle
                      </h3>
                      <p className="text-muted-foreground">
                        Respect des valeurs marocaines et islamiques, adaptation au contexte local.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <CrisisButton />
    </div>
  );
};

export default About;
