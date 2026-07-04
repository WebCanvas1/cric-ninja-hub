import { SiteLayout } from "@/components/site/Layout";
import { useContent, LOGO_URL } from "@/lib/store";
import { Award, Hammer, Shield, Zap } from "lucide-react";

export default function About() {
  const [content] = useContent();

  return (
    <SiteLayout>
      <section className="bg-hero">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-20 sm:px-6 md:grid-cols-2 md:items-center">
          <div>
            <div className="text-xs font-bold uppercase tracking-[0.3em] text-primary">
              Our Story
            </div>

            <h1 className="display mt-2 text-5xl font-bold uppercase leading-tight tracking-wider sm:text-6xl">
              {content.about.title}
            </h1>

            <p className="mt-6 text-lg text-muted-foreground">
              {content.about.body}
            </p>
          </div>

          <div className="relative aspect-square overflow-hidden rounded-full border-2 border-primary/30 shadow-red">
            <img
              src={content.about.image || LOGO_URL}
              alt={content.about.title}
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {content.whyChooseUs.map((f, i) => {
            const Icons = [Hammer, Award, Shield, Zap];
            const Icon = Icons[i % Icons.length];

            return (
              <div
                key={i}
                className="rounded-md border border-border bg-card p-6"
              >
                <Icon className="h-8 w-8 text-primary" />

                <h3 className="display mt-4 text-lg font-bold uppercase">
                  {f.title}
                </h3>

                <p className="mt-2 text-sm text-muted-foreground">
                  {f.body}
                </p>
              </div>
            );
          })}
        </div>
      </section>
    </SiteLayout>
  );
}
