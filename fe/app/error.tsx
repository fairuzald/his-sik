"use client";

import { H2, P } from "@/components/elements/typography";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";
import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="text-foreground flex h-screen w-full flex-col items-center justify-center gap-4">
      <div className="bg-destructive/10 rounded-full p-4">
        <AlertTriangle className="text-destructive h-12 w-12" />
      </div>
      <div className="space-y-2 text-center">
        <H2 className="text-2xl font-bold">Ada yang salah!</H2>
        <P className="text-muted-foreground max-w-[500px]">
          Terjadi kesalahan yang tidak terduga. Silakan coba lagi nanti.
        </P>
      </div>
      <div className="flex gap-4">
        <Button onClick={() => window.location.reload()} variant="outline">
          Muat Ulang Halaman
        </Button>
        <Button onClick={() => reset()}>Coba Lagi</Button>
      </div>
    </div>
  );
}
