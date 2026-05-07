import Link from "next/link";
import { Navbar } from "@/components/public/Navbar";
import { Footer } from "@/components/public/Footer";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      <main className="flex-1 flex flex-col items-center justify-center text-center px-4">
        <div className="animate-fade-in-up">
          <p
            className="text-8xl sm:text-9xl font-bold text-primary/20 mb-4 leading-none"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            404
          </p>
          <h1
            className="text-3xl sm:text-4xl font-bold text-foreground mb-4"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            Signal Lost
          </h1>
          <p className="text-muted-foreground max-w-md mb-8 leading-relaxed">
            The article you&apos;re looking for has been unpublished, moved, or
            never existed. Navigate back to the brief.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/">
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2">
                <ArrowLeft className="w-4 h-4" />
                Back to Home
              </Button>
            </Link>
          </div>
        </div>

        <div
          className="absolute inset-0 -z-10 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(circle at 50% 50%, oklch(0.769 0.188 70.08) 0%, transparent 60%)",
          }}
        />
      </main>

      <Footer />
    </div>
  );
}
