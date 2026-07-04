import { SiteLayout } from "@/components/site/Layout";
import { useContent } from "@/lib/store";
import { Mail, Phone, MapPin, Send } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function Contact() {
  const [content] = useContent();
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });

  const input =
    "w-full rounded-sm border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary";

  return (
    <SiteLayout>
      <section className="bg-hero">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
          <div className="text-xs font-bold uppercase tracking-[0.3em] text-primary">
            Get in Touch
          </div>

          <h1 className="display mt-2 text-5xl font-bold uppercase tracking-wider sm:text-6xl">
            Contact <span className="text-gradient-red">Us</span>
          </h1>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:px-6 md:grid-cols-2">
        <div className="space-y-5">
          <div className="flex items-start gap-4 rounded-md border border-border bg-card p-5">
            <Mail className="h-5 w-5 text-primary" />
            <div>
              <div className="text-[10px] uppercase tracking-widest text-muted-foreground">
                Email
              </div>
              <div className="font-semibold">{content.contact.email}</div>
            </div>
          </div>

          <div className="flex items-start gap-4 rounded-md border border-border bg-card p-5">
            <Phone className="h-5 w-5 text-primary" />
            <div>
              <div className="text-[10px] uppercase tracking-widest text-muted-foreground">
                Phone
              </div>
              <div className="font-semibold">{content.contact.phone}</div>
            </div>
          </div>

          <div className="flex items-start gap-4 rounded-md border border-border bg-card p-5">
            <MapPin className="h-5 w-5 text-primary" />
            <div>
              <div className="text-[10px] uppercase tracking-widest text-muted-foreground">
                Workshop
              </div>
              <div className="font-semibold">{content.contact.address}</div>
            </div>
          </div>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            toast.success("Message sent! We'll reply within 24h.");
            setForm({
              name: "",
              email: "",
              message: "",
            });
          }}
          className="rounded-md border border-border bg-card p-6"
        >
          <input
            required
            placeholder="Your name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className={input}
          />

          <input
            required
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className={`${input} mt-3`}
          />

          <textarea
            required
            rows={6}
            placeholder="Message"
            value={form.message}
            onChange={(e) =>
              setForm({ ...form, message: e.target.value })
            }
            className={`${input} mt-3 resize-none`}
          />

          <button
            type="submit"
            className="mt-4 inline-flex items-center gap-2 rounded-sm bg-primary px-6 py-3 text-sm font-bold uppercase tracking-widest text-primary-foreground hover:brightness-110"
          >
            <Send className="h-4 w-4" />
            Send Message
          </button>
        </form>
      </section>
    </SiteLayout>
  );
}
