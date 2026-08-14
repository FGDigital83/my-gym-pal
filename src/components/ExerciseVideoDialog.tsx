import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { findExerciseVideo } from "@/lib/video.functions";
import { ExternalLink } from "lucide-react";

export function ExerciseVideoDialog({
  name,
  open,
  onOpenChange,
}: {
  name: string | null;
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const search = useServerFn(findExerciseVideo);
  const { data, isLoading } = useQuery({
    queryKey: ["exercise-video", name],
    enabled: open && !!name,
    staleTime: 1000 * 60 * 60 * 24,
    queryFn: () => search({ data: { query: name as string } }),
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-base">{name}</DialogTitle>
        </DialogHeader>
        <div className="aspect-video w-full rounded-xl overflow-hidden bg-muted flex items-center justify-center">
          {isLoading && <span className="text-sm text-muted-foreground">Cargando vídeo…</span>}
          {!isLoading && data?.videoId && (
            <iframe
              className="h-full w-full"
              src={`https://www.youtube.com/embed/${data.videoId}?autoplay=1&mute=1&loop=1&playlist=${data.videoId}`}
              title={name ?? "Vídeo del ejercicio"}
              allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          )}
          {!isLoading && !data?.videoId && (
            <span className="text-sm text-muted-foreground px-4 text-center">
              No se ha podido cargar el vídeo. Ábrelo en YouTube.
            </span>
          )}
        </div>
        <a
          href={`https://www.youtube.com/results?search_query=${encodeURIComponent(`${name ?? ""} ejercicio técnica`)}`}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline"
        >
          <ExternalLink className="h-3.5 w-3.5" /> Ver en YouTube
        </a>
      </DialogContent>
    </Dialog>
  );
}
