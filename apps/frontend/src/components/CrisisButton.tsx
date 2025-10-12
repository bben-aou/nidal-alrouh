"use client";

import { AlertCircle, Phone } from "lucide-react";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export const CrisisButton = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="crisis-button"
        aria-label="Emergency crisis support"
      >
        <AlertCircle className="inline-block mr-2 h-5 w-5" />
        <span className="font-semibold">Aide d&apos;urgence</span>
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-destructive flex items-center gap-2">
              <AlertCircle className="h-6 w-6" />
              Aide d&apos;urgence immédiate
            </DialogTitle>
            <DialogDescription className="text-base pt-4 space-y-4">
              <div className="text-foreground font-medium">
                Si vous êtes en crise ou pensez à vous faire du mal, veuillez contacter immédiatement:
              </div>
              
              <div className="space-y-3 pt-2">
                <a
                  href="tel:0801004747"
                  className="flex items-center gap-3 p-4 bg-primary/10 rounded-lg hover:bg-primary/20 transition-colors"
                >
                  <Phone className="h-5 w-5 text-primary" />
                  <div className="text-left">
                    <div className="font-semibold text-foreground">Ligne d&apos;écoute nationale</div>
                    <div className="text-lg font-bold text-primary">0801 00 47 47</div>
                  </div>
                </a>

                <a
                  href="tel:141"
                  className="flex items-center gap-3 p-4 bg-destructive/10 rounded-lg hover:bg-destructive/20 transition-colors"
                >
                  <Phone className="h-5 w-5 text-destructive" />
                  <div className="text-left">
                    <div className="font-semibold text-foreground">Urgences médicales</div>
                    <div className="text-lg font-bold text-destructive">141</div>
                  </div>
                </a>

                <a
                  href="tel:19"
                  className="flex items-center gap-3 p-4 bg-accent/30 rounded-lg hover:bg-accent/50 transition-colors"
                >
                  <Phone className="h-5 w-5 text-accent-foreground" />
                  <div className="text-left">
                    <div className="font-semibold text-foreground">Police/Urgences</div>
                    <div className="text-lg font-bold text-accent-foreground">19</div>
                  </div>
                </a>
              </div>

              <div className="text-sm text-muted-foreground pt-2">
                Vous n&apos;êtes pas seul(e). Ces lignes sont disponibles 24h/24 et 7j/7.
              </div>
            </DialogDescription>
          </DialogHeader>
          
          <Button
            onClick={() => setOpen(false)}
            variant="outline"
            className="mt-4"
          >
            Fermer
          </Button>
        </DialogContent>
      </Dialog>
    </>
  );
};
