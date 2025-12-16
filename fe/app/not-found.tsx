import { H1, P } from "@/components/elements/typography";
import { Button } from "@/components/ui/button";
import { FileQuestion } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="text-foreground flex h-screen w-full flex-col items-center justify-center gap-4">
      <div className="bg-muted rounded-full p-4">
        <FileQuestion className="text-muted-foreground h-12 w-12" />
      </div>
      <div className="space-y-2 text-center">
        <H1 className="text-4xl font-bold">404</H1>
        <P className="text-muted-foreground text-xl">Halaman tidak ditemukan</P>
        <P className="text-muted-foreground max-w-[500px]">
          Halaman yang Anda cari tidak ada atau telah dipindahkan.
        </P>
      </div>
      <Button asChild>
        <Link href="/">Kembali ke Beranda</Link>
      </Button>
    </div>
  );
}
