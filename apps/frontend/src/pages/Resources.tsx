import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CrisisButton } from "@/components/CrisisButton";
import { BookOpen, Heart, Brain, Users, Phone, FileText } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const resourceCategories = [
  {
    icon: Brain,
    title: "Comprendre la santé mentale",
    color: "text-primary",
    articles: [
      "Qu&apos;est-ce que l&apos;anxiété?",
      "Reconnaître les signes de dépression",
      "Vivre avec un trouble bipolaire",
      "Stress post-traumatique: comprendre et surmonter"
    ]
  },
  {
    icon: Heart,
    title: "Stratégies d&apos;adaptation",
    color: "text-secondary",
    articles: [
      "Techniques de respiration pour l&apos;anxiété",
      "Journal thérapeutique: comment commencer",
      "Méditation et pleine conscience",
      "Gérer les crises de panique"
    ]
  },
  {
    icon: Users,
    title: "Relations et soutien",
    color: "text-accent-dark",
    articles: [
      "Comment parler de santé mentale à sa famille",
      "Trouver du soutien dans la communauté",
      "Soutenir un proche en détresse",
      "Établir des limites saines"
    ]
  },
  {
    icon: Phone,
    title: "Ressources d&apos;urgence",
    color: "text-destructive",
    articles: [
      "Lignes d&apos;écoute au Maroc",
      "Que faire en cas de crise?",
      "Trouver de l&apos;aide professionnelle",
      "Services gratuits et abordables"
    ]
  }
];

const Resources = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container px-6 py-12">
        {/* Hero */}
        <div className="max-w-5xl mx-auto text-center mb-12">
          <BookOpen className="h-16 w-16 text-primary mx-auto mb-6" />
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Bibliothèque de ressources
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Des informations fiables et des stratégies pratiques pour votre parcours de santé mentale
          </p>
        </div>

        {/* Search */}
        <div className="max-w-2xl mx-auto mb-16">
          <div className="relative">
            <Input
              placeholder="Rechercher des articles, guides, stratégies..."
              className="h-12 pl-4 pr-12 text-base"
            />
            <Button
              className="absolute right-1 top-1 h-10 bg-primary hover:bg-primary-dark"
            >
              Rechercher
            </Button>
          </div>
        </div>

        {/* Categories */}
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            {resourceCategories.map((category, idx) => (
              <div key={idx} className="card-soft hover-lift">
                <div className="flex items-start gap-4 mb-6">
                  <div className={`flex-shrink-0 w-12 h-12 rounded-full bg-muted flex items-center justify-center`}>
                    <category.icon className={`h-6 w-6 ${category.color}`} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-semibold text-foreground mb-2">
                      {category.title}
                    </h2>
                  </div>
                </div>
                <ul className="space-y-3">
                  {category.articles.map((article, articleIdx) => (
                    <li key={articleIdx}>
                      <a
                        href="#"
                        className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors group"
                      >
                        <FileText className="h-4 w-4 flex-shrink-0 group-hover:text-primary" />
                        <span className="group-hover:underline">{article}</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Featured Section */}
          <div className="mt-16 bg-primary/5 rounded-2xl p-8 md:p-12">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl font-bold text-foreground mb-4">
                Guide de premiers pas
              </h2>
              <p className="text-lg text-muted-foreground mb-6">
                Si vous ne savez pas par où commencer, consultez notre guide complet pour 
                prendre soin de votre santé mentale au Maroc.
              </p>
              <Button size="lg" className="bg-primary hover:bg-primary-dark">
                <BookOpen className="mr-2 h-5 w-5" />
                Télécharger le guide gratuit
              </Button>
            </div>
          </div>

          {/* Community Contributed */}
          <div className="mt-16">
            <h2 className="text-3xl font-bold text-foreground mb-8 text-center">
              Ressources partagées par la communauté
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {[1, 2, 3].map((item) => (
                <div key={item} className="card-soft hover-lift">
                  <div className="mb-4">
                    <span className="inline-block px-3 py-1 bg-secondary/10 text-secondary text-xs font-medium rounded-full">
                      Partagé par la communauté
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    Témoignage: Mon parcours avec l&apos;anxiété
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Une histoire d&apos;espoir et de résilience partagée par un membre de notre communauté.
                  </p>
                  <Button variant="outline" size="sm">
                    Lire l&apos;article
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      <Footer />
      <CrisisButton />
    </div>
  );
};

export default Resources;
