import { P } from "@/components/elements/typography";
import { Spinner } from "@/components/ui/spinner";

export default function Loading() {
  return (
    <div className="bg-background/50 flex h-screen w-full items-center justify-center backdrop-blur-sm">
      <div className="flex flex-col items-center gap-4">
        <Spinner className="h-8 w-8" />
        <P className="text-muted-foreground animate-pulse">Loading...</P>
      </div>
    </div>
  );
}
