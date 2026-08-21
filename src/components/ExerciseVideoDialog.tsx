import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { exerciseImageFor, exerciseVideoFor } from "@/lib/exercise-media";
import { Bot } from "lucide-react";
import type { Muscle } from "@/lib/muscles";

export function ExerciseVideoDialog({
  name,
  muscle,
  open,
  onOpenChange,
}: {
  name: string | null;
  muscle?: Muscle | null;
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const video = name ? exerciseVideoFor(name) : null;
  const image = name ? exerciseImageFor(name, muscle) : null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-base">{name}</DialogTitle>
          <DialogDescription className="flex items-center gap-1.5">
            <Bot className="h-4 w-4 text-primary" /> Demostración creada con IA, sin personas reales
          </DialogDescription>
        </DialogHeader>
        <div className="aspect-video w-full overflow-hidden rounded-lg bg-muted flex items-center justify-center">
          {video ? (
            <video className="h-full w-full object-cover" src={video} autoPlay muted loop playsInline controls aria-label={`Demostración IA de ${name ?? "ejercicio"}`} />
          ) : image ? (
            <div className="relative h-full w-full">
              <img src={image} alt={`Zona muscular trabajada en ${name ?? "el ejercicio"}`} className="h-full w-full object-cover opacity-70" />
              <div className="absolute inset-x-0 bottom-0 bg-background/90 p-4 text-center text-sm text-muted-foreground">
                El vídeo IA específico de este ejercicio se añadirá próximamente.
              </div>
            </div>
          ) : null}
        </div>
      </DialogContent>
    </Dialog>
  );
}
