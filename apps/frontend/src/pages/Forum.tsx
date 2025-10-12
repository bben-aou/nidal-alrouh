import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CrisisButton } from "@/components/CrisisButton";
import { MessageCircle, Plus, Search, Filter, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

const forumTopics = [
  { 
    id: 1, 
    title: "Comment gérer l&apos;anxiété au quotidien?", 
    author: "Anonyme", 
    replies: 23, 
    tags: ["anxiété", "stratégies"], 
    verified: false 
  },
  { 
    id: 2, 
    title: "Ressources pour dépression - partage d&apos;expérience", 
    author: "Dr. Amina K.", 
    replies: 45, 
    tags: ["dépression", "soutien"], 
    verified: true 
  },
  { 
    id: 3, 
    title: "Trouver un thérapeute à Casablanca", 
    author: "Youssef M.", 
    replies: 12, 
    tags: ["ressources", "Casablanca"], 
    verified: false 
  },
  { 
    id: 4, 
    title: "Soutien familial - comment en parler?", 
    author: "Anonyme", 
    replies: 31, 
    tags: ["famille", "communication"], 
    verified: false 
  },
];

const Forum = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container px-6 py-12">
        {/* Header */}
        <div className="max-w-5xl mx-auto mb-12">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <div>
              <h1 className="text-4xl font-bold text-foreground mb-2">
                Forum communautaire
              </h1>
              <p className="text-muted-foreground">
                Un espace sûr pour partager, écouter et se soutenir mutuellement
              </p>
            </div>
            <Button className="bg-primary hover:bg-primary-dark gap-2">
              <Plus className="h-4 w-4" />
              Nouvelle discussion
            </Button>
          </div>

          {/* Safe Space Notice */}
          <div className="bg-accent/10 border border-accent/20 rounded-lg p-4 mb-8">
            <div className="flex items-start gap-3">
              <Shield className="h-5 w-5 text-accent-dark flex-shrink-0 mt-0.5" />
              <div className="text-sm text-foreground/90">
                <p className="font-medium mb-1">Espace sûr et modéré</p>
                <p className="text-muted-foreground">
                  Ce forum est modéré pour assurer un environnement respectueux. 
                  Vous pouvez poster de façon anonyme. Soyez bienveillant et respectueux.
                </p>
              </div>
            </div>
          </div>

          {/* Search and Filter */}
          <div className="flex flex-col sm:flex-row gap-3 mb-8">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher dans les discussions..."
                className="pl-10 h-11"
              />
            </div>
            <Button variant="outline" className="gap-2">
              <Filter className="h-4 w-4" />
              Filtrer
            </Button>
          </div>

          {/* Topics */}
          <div className="space-y-4">
            {forumTopics.map((topic) => (
              <div
                key={topic.id}
                className="card-soft hover-lift cursor-pointer"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <MessageCircle className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <h3 className="text-lg font-semibold text-foreground hover:text-primary transition-colors">
                        {topic.title}
                      </h3>
                      {topic.verified && (
                        <Badge variant="secondary" className="flex-shrink-0 bg-secondary/20 text-secondary-foreground">
                          ✓ Vérifié
                        </Badge>
                      )}
                    </div>
                    <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground mb-3">
                      <span>Par {topic.author}</span>
                      <span>•</span>
                      <span>{topic.replies} réponses</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {topic.tags.map((tag, idx) => (
                        <Badge
                          key={idx}
                          variant="outline"
                          className="text-xs"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Empty State */}
          <div className="text-center py-12 mt-8">
            <p className="text-muted-foreground mb-4">
              Plus de discussions à venir. Soyez le premier à partager!
            </p>
            <Button variant="outline" className="gap-2">
              <Plus className="h-4 w-4" />
              Créer une discussion
            </Button>
          </div>
        </div>
      </main>

      <Footer />
      <CrisisButton />
    </div>
  );
};

export default Forum;
