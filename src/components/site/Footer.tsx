import { Link } from "react-router-dom";
import { useContent, LOGO_URL } from "@/lib/store";
import { Instagram, Facebook, Youtube, Twitter, Mail, Phone, MapPin } from "lucide-react";

export function Footer() {
  const [content] = useContent();
  return (
    <footer className="mt-24 border-t border-border bg-card">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-4">
        <div>
          <img
  src={content.branding.logo || LOGO_URL}
  alt="CRIC NINJA"
  className="mb-4 h-14 w-14 rounded-full object-cover ring-2 ring-primary/40"
/>
          <p className="text-sm text-muted-foreground">{content.about.body.slice(0, 140)}...</p>
        </div>
        <div>
          <h4 className="mb-4 text-sm font-bold uppercase tracking-widest text-primary">Shop</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link to="/shop">All Bats</Link></li>
            <li><Link to="/shop">English Willow</Link></li>
            <li><Link to="/shop">Kashmir Willow</Link></li>
            <li><Link to="/shop">Junior</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="mb-4 text-sm font-bold uppercase tracking-widest text-primary">Contact</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2"><Mail className="mt-0.5 h-4 w-4" /> {content.contact.email}</li>
            <li className="flex items-start gap-2"><Phone className="mt-0.5 h-4 w-4" /> {content.contact.phone}</li>
            <li className="flex items-start gap-2"><MapPin className="mt-0.5 h-4 w-4" /> {content.contact.address}</li>
          </ul>
        </div>
        <div>
          <h4 className="mb-4 text-sm font-bold uppercase tracking-widest text-primary">Follow</h4>
          <div className="flex gap-3">
            <a href={content.social.instagram} target="_blank" rel="noreferrer" className="rounded-md border border-border p-2 hover:border-primary hover:text-primary"><Instagram className="h-4 w-4" /></a>
            <a href={content.social.facebook} target="_blank" rel="noreferrer" className="rounded-md border border-border p-2 hover:border-primary hover:text-primary"><Facebook className="h-4 w-4" /></a>
            <a href={content.social.youtube} target="_blank" rel="noreferrer" className="rounded-md border border-border p-2 hover:border-primary hover:text-primary"><Youtube className="h-4 w-4" /></a>
            <a href={content.social.twitter} target="_blank" rel="noreferrer" className="rounded-md border border-border p-2 hover:border-primary hover:text-primary"><Twitter className="h-4 w-4" /></a>
          </div>
          <div className="mt-6">
            <Link to="/admin" className="text-xs uppercase tracking-widest text-muted-foreground hover:text-primary">Admin</Link>
          </div>
        </div>
      </div>
      <div className="border-t border-border py-5 text-center text-xs uppercase tracking-widest text-muted-foreground">
        © {new Date().getFullYear()} CRIC NINJA — Forged for Champions
      </div>
    </footer>
  );
}
