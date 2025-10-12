"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Heart, Users, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Header } from "@/components/Header";
import { CrisisButton } from "@/components/CrisisButton";

const Auth = () => {
  const searchParams = useSearchParams();
  const userType = searchParams?.get("type") || "seeker";
  const [isLogin, setIsLogin] = useState(true);

  const isSeekerPath = userType === "seeker";

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container max-w-lg mx-auto px-6 py-12">
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-8">
          <ArrowLeft className="h-4 w-4" />
          Retour à l&apos;accueil
        </Link>

        <Card className="shadow-soft-lg">
          <CardHeader className="text-center space-y-4">
            <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mx-auto ${
              isSeekerPath ? 'bg-primary/10' : 'bg-secondary/10'
            }`}>
              {isSeekerPath ? (
                <Heart className="h-8 w-8 text-primary" />
              ) : (
                <Users className="h-8 w-8 text-secondary" />
              )}
            </div>
            <CardTitle className="text-2xl">
              {isSeekerPath ? "Bienvenue - Vous n'êtes pas seul(e)" : "Merci de votre aide"}
            </CardTitle>
            <CardDescription>
              {isSeekerPath 
                ? "Connectez-vous pour accéder au soutien dont vous avez besoin"
                : "Connectez-vous pour offrir votre soutien à la communauté"
              }
            </CardDescription>
          </CardHeader>

          <CardContent>
            <Tabs value={isLogin ? "login" : "signup"} onValueChange={(v) => setIsLogin(v === "login")} className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="login">Se connecter</TabsTrigger>
                <TabsTrigger value="signup">S&apos;inscrire</TabsTrigger>
              </TabsList>

              <TabsContent value="login" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="votre@email.com"
                    className="h-11"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Mot de passe</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    className="h-11"
                  />
                </div>
                <Button
                  className={`w-full h-11 ${
                    isSeekerPath 
                      ? 'bg-primary hover:bg-primary-dark' 
                      : 'bg-secondary hover:bg-secondary-light text-secondary-foreground'
                  }`}
                >
                  Se connecter
                </Button>
                <p className="text-center text-sm text-muted-foreground">
                  <a href="#" className="text-primary hover:underline">
                    Mot de passe oublié?
                  </a>
                </p>
              </TabsContent>

              <TabsContent value="signup" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nom (optionnel - anonymat respecté)</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Votre nom ou pseudonyme"
                    className="h-11"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-email">Email</Label>
                  <Input
                    id="signup-email"
                    type="email"
                    placeholder="votre@email.com"
                    className="h-11"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-password">Mot de passe</Label>
                  <Input
                    id="signup-password"
                    type="password"
                    placeholder="••••••••"
                    className="h-11"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirmer le mot de passe</Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    placeholder="••••••••"
                    className="h-11"
                  />
                </div>
                <div className="bg-accent/10 rounded-lg p-3 text-sm text-muted-foreground">
                  <p className="flex items-start gap-2">
                    <span className="text-accent-dark font-semibold">✓</span>
                    Votre vie privée est notre priorité. Vous pouvez toujours choisir de rester anonyme.
                  </p>
                </div>
                <Button
                  className={`w-full h-11 ${
                    isSeekerPath 
                      ? 'bg-primary hover:bg-primary-dark' 
                      : 'bg-secondary hover:bg-secondary-light text-secondary-foreground'
                  }`}
                >
                  Créer mon compte
                </Button>
              </TabsContent>
            </Tabs>

            <div className="mt-6 pt-6 border-t border-border">
              <p className="text-center text-sm text-muted-foreground">
                Vous voulez {isSeekerPath ? "aider" : "recevoir du soutien"}?{" "}
                <Link
                  href={`/auth?type=${isSeekerPath ? 'helper' : 'seeker'}`}
                  className="text-primary hover:underline font-medium"
                >
                  Changez de parcours
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </main>

      <CrisisButton />
    </div>
  );
};

export default Auth;
