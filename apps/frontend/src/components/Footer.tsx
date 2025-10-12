import Link from "next/link";
import { Heart } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="bg-muted/30 border-t border-border py-12">
      <div className="container px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            {/* Brand */}
            <div className="space-y-4">
              <h3 className="font-arabic text-2xl font-bold text-primary">
                نضال الروح
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Plateforme de soutien en santé mentale pour le Maroc.
                Sans but lucratif, open-source, née d&apos;une expérience vécue.
              </p>
            </div>

            {/* Links */}
            <div className="space-y-4">
              <h4 className="font-semibold text-foreground">Ressources</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="/about" className="hover:text-primary transition-colors">
                    À propos
                  </Link>
                </li>
                <li>
                  <Link href="/forum" className="hover:text-primary transition-colors">
                    Forum communautaire
                  </Link>
                </li>
                <li>
                  <Link href="/resources" className="hover:text-primary transition-colors">     
                    Ressources éducatives
                  </Link>
                </li>
                <li>
                  <Link href="/events" className="hover:text-primary transition-colors">
                    Événements
                  </Link>
                </li>
              </ul>
            </div>

            {/* Legal */}
            <div className="space-y-4">
              <h4 className="font-semibold text-foreground">Légal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="/privacy" className="hover:text-primary transition-colors">
                    Politique de confidentialité
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="hover:text-primary transition-colors">
                    Conditions d&apos;utilisation
                  </Link>
                </li>
                <li>
                  <Link href="/code-of-conduct" className="hover:text-primary transition-colors"> 
                    Code de conduite
                  </Link>
                </li>
                <li>
                  <Link href="/accessibility" className="hover:text-primary transition-colors">
                    Accessibilité
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom */}
          <div className="border-t border-border pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground text-center md:text-left">
              © 2025 Nidal Al-Rouh. Projet open-source à but non lucratif.
            </p>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>Fait avec</span>
              <Heart className="h-4 w-4 text-destructive fill-current" />
              <span>pour la communauté marocaine</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
