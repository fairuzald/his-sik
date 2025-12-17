import { H1, H4, Small } from "@/components/elements/typography";
import Image from "next/image";
import Link from "next/link";

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  description: string;
  footerText?: string;
  footerLink?: string;
  footerLinkText?: string;
  imageAlt?: string;
}

export default function AuthLayout({
  children,
  title,
  description,
  footerText,
  footerLink,
  footerLinkText,
}: AuthLayoutProps) {
  return (
    <div className="bg-muted/20 flex min-h-screen items-center justify-center p-4">
      <div className="grid w-full max-w-[900px] grid-cols-1 overflow-hidden rounded-xl border shadow-xl md:grid-cols-2">
        {/* Left Side - Form */}
        <div className="bg-background flex flex-col justify-center p-8 md:p-12">
          <div className="mb-8 text-center md:text-left">
            <Link href="/" className="mb-4 inline-block">
              <div className="flex items-center gap-2">
                <Image
                  src="/logo.png"
                  alt="MediCare Logo"
                  width={40}
                  height={40}
                />
                <H4 className="text-primary font-bold">MediCare</H4>
              </div>
            </Link>
            <H1 className="mb-2 text-2xl font-bold md:text-3xl">{title}</H1>
            <p className="text-muted-foreground">{description}</p>
          </div>

          {children}

          {footerText && footerLink && footerLinkText && (
            <div className="mt-6 text-center text-sm md:text-left">
              <span className="text-muted-foreground">{footerText} </span>
              <Link
                href={footerLink}
                className="text-primary hover:text-primary/80 font-medium underline-offset-4 hover:underline"
              >
                {footerLinkText}
              </Link>
            </div>
          )}

          <div className="mt-auto pt-8 text-center md:text-left">
            <Small className="text-muted-foreground/60 text-xs">
              &copy; {new Date().getFullYear()} MediCare HIS. All rights
              reserved.
            </Small>
          </div>
        </div>

        {/* Right Side - Image/Banner */}
        <div className="bg-primary/5 relative hidden items-center justify-center p-12 md:flex">
          <div className="bg-linear-to-br from-primary/20 via-primary/5 to-background/5 absolute inset-0" />
          {/* Abstract decorative elements could go here */}
          <div className="relative z-10 flex flex-col items-center justify-center text-center">
            <div className="mb-6 rounded-2xl bg-white/40 p-6 shadow-sm backdrop-blur-sm">
              <Image
                src="/logo.png"
                alt="MediCare Illustration"
                width={200}
                height={200}
                className="opacity-90"
              />
            </div>
            <H4 className="text-foreground mb-2 font-bold">
              Comprehensive Healthcare
            </H4>
            <p className="text-foreground/80 max-w-xs text-sm">
              Manage patients, appointments, and medical records with our
              state-of-the-art Hospital Information System.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
