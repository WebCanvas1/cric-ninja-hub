import { createFileRoute } from "@tanstack/react-router";
import { useState, type ComponentType } from "react";
import { SiteLayout } from "@/components/site/Layout";
import {
  useAdminAuth,
  useProducts,
  useContent,
  fileToBase64,
  formatPrice,
  type Product,
  type SiteContent,
} from "@/lib/store";
import { LogOut, Plus, Trash2, Save, Upload, X, Lock, Package, Image as ImageIcon, Info, Phone, Share2, LayoutDashboard } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Admin — CRIC NINJA" }] }),
  component: Admin,
});

const inputCls = "w-full rounded-sm border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary";
const labelCls = "mb-1 block text-[10px] font-bold uppercase tracking-widest text-muted-foreground";
const btnPrimary = "inline-flex items-center gap-2 rounded-sm bg-primary px-4 py-2.5 text-xs font-bold uppercase tracking-widest text-primary-foreground hover:brightness-110";
const btnGhost = "inline-flex items-center gap-2 rounded-sm border border-border bg-card px-4 py-2.5 text-xs font-bold uppercase tracking-widest hover:border-primary hover:text-primary";

function Admin() {
  const auth = useAdminAuth();
  if (!auth.authed) return <AdminLogin />;
  return <AdminDashboard />;
}

function AdminLogin() {
  const auth = useAdminAuth();
  const [pw, setPw] = useState("");
  const [err, setErr] = useState("");

  return (
    <SiteLayout>
      <div className="mx-auto flex min-h-[70vh] max-w-md items-center px-4">
        <div className="w-full rounded-md border border-border bg-card p-8 shadow-card">
          <div className="mb-6 flex items-center gap-3">
            <div className="grid h-11 w-11 place-items-center rounded-sm bg-primary text-primary-foreground"><Lock className="h-5 w-5" /></div>
            <div>
              <div className="text-xs font-bold uppercase tracking-[0.3em] text-primary">Restricted</div>
              <h1 className="display text-2xl font-bold uppercase tracking-wider">Admin Login</h1>
            </div>
          </div>
          <form onSubmit={(e) => { e.preventDefault(); if (auth.login(pw)) toast.success("Welcome back, admin."); else setErr("Incorrect password."); }}>
            <label className={labelCls}>Password</label>
            <input type="password" value={pw} onChange={(e) => { setPw(e.target.value); setErr(""); }} className={inputCls} placeholder="Enter admin password" />
            {err && <p className="mt-2 text-xs text-primary">{err}</p>}
            <p className="mt-3 text-[10px] uppercase tracking-widest text-muted-foreground">Default: cricninja2026</p>
            <button type="submit" className={`${btnPrimary} mt-5 w-full justify-center`}>Sign In</button>
          </form>
        </div>
      </div>
    </SiteLayout>
  );
}

type Tab = "products" | "homepage" | "about" | "contact" | "social" | "gallery";

function AdminDashboard() {
  const auth = useAdminAuth();
  const [tab, setTab] = useState<Tab>("products");

  const tabs: { id: Tab; label: string; icon: ComponentType<{ className?: string }> }[] = [
    { id: "products", label: "Products", icon: Package },
    { id: "homepage", label: "Homepage", icon: LayoutDashboard },
    { id: "about", label: "About", icon: Info },
    { id: "contact", label: "Contact", icon: Phone },
    { id: "social", label: "Social", icon: Share2 },
    { id: "gallery", label: "Gallery", icon: ImageIcon },
  ];

  return (
    <SiteLayout>
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="text-xs font-bold uppercase tracking-[0.3em] text-primary">Control Panel</div>
            <h1 className="display text-4xl font-bold uppercase tracking-wider">Admin Dashboard</h1>
          </div>
          <button onClick={() => { auth.logout(); toast.success("Signed out"); }} className={btnGhost}>
            <LogOut className="h-3.5 w-3.5" /> Logout
          </button>
        </div>

        <div className="grid gap-6 lg:grid-cols-[220px_1fr]">
          <aside className="h-fit rounded-md border border-border bg-card p-2">
            {tabs.map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`flex w-full items-center gap-3 rounded-sm px-3 py-2.5 text-left text-sm font-semibold transition-colors ${
                  tab === t.id ? "bg-primary text-primary-foreground" : "text-foreground/80 hover:bg-secondary"
                }`}
              >
                <t.icon className="h-4 w-4" /> {t.label}
              </button>
            ))}
          </aside>

          <div>
            {tab === "products" && <ProductsTab />}
            {tab === "homepage" && <HomepageTab />}
            {tab === "about" && <AboutTab />}
            {tab === "contact" && <ContactTab />}
            {tab === "social" && <SocialTab />}
            {tab === "gallery" && <GalleryTab />}
          </div>
        </div>
      </div>
    </SiteLayout>
  );
}

// ---------- Products ----------

function emptyProduct(): Product {
  return {
    id: "new-" + Math.random().toString(36).slice(2, 8),
    name: "New Bat",
    price: 9999,
    shortDescription: "",
    description: "",
    images: [],
    category: "English Willow",
    stock: 10,
    weight: "",
    size: "SH",
    willowGrade: "",
    handleType: "",
  };
}

function ProductsTab() {
  const [products, setProducts] = useProducts();
  const [editing, setEditing] = useState<Product | null>(null);

  function save(p: Product) {
    const existing = products.find((x) => x.id === p.id);
    const next = existing ? products.map((x) => (x.id === p.id ? p : x)) : [p, ...products];
    setProducts(next);
    setEditing(null);
    toast.success("Product saved");
  }

  function del(id: string) {
    if (!confirm("Delete this product?")) return;
    setProducts(products.filter((p) => p.id !== id));
    toast.success("Product deleted");
  }

  if (editing) return <ProductEditor product={editing} onSave={save} onCancel={() => setEditing(null)} />;

  return (
    <div className="rounded-md border border-border bg-card p-6">
      <div className="mb-5 flex items-center justify-between">
        <h2 className="display text-2xl font-bold uppercase tracking-wider">Products ({products.length})</h2>
        <button onClick={() => setEditing(emptyProduct())} className={btnPrimary}><Plus className="h-4 w-4" /> Add Product</button>
      </div>
      <div className="space-y-2">
        {products.map((p) => (
          <div key={p.id} className="flex items-center gap-4 rounded-sm border border-border bg-background p-3">
            <div className="h-14 w-14 shrink-0 overflow-hidden rounded-sm bg-secondary">
              {p.images[0] ? <img src={p.images[0]} className="h-full w-full object-cover" alt="" /> : <div className="grid h-full place-items-center text-xs text-muted-foreground">No img</div>}
            </div>
            <div className="min-w-0 flex-1">
              <div className="truncate font-bold">{p.name}</div>
              <div className="text-xs text-muted-foreground">{p.category} · {formatPrice(p.price)} · Stock {p.stock}</div>
            </div>
            <button onClick={() => setEditing(p)} className={btnGhost}>Edit</button>
            <button onClick={() => del(p.id)} className="inline-flex items-center gap-1 rounded-sm border border-border bg-card px-3 py-2.5 text-xs font-bold uppercase tracking-widest text-primary hover:bg-primary hover:text-primary-foreground">
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function ProductEditor({ product, onSave, onCancel }: { product: Product; onSave: (p: Product) => void; onCancel: () => void }) {
  const [p, setP] = useState<Product>(product);
  const set = <K extends keyof Product>(k: K, v: Product[K]) => setP({ ...p, [k]: v });

  async function onFiles(files: FileList | null) {
    if (!files) return;
    const arr = await Promise.all(Array.from(files).map(fileToBase64));
    set("images", [...p.images, ...arr]);
  }

  return (
    <div className="rounded-md border border-border bg-card p-6">
      <div className="mb-5 flex items-center justify-between">
        <h2 className="display text-2xl font-bold uppercase tracking-wider">Edit Product</h2>
        <div className="flex gap-2">
          <button onClick={onCancel} className={btnGhost}>Cancel</button>
          <button onClick={() => onSave(p)} className={btnPrimary}><Save className="h-4 w-4" /> Save</button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2"><label className={labelCls}>Name</label><input className={inputCls} value={p.name} onChange={(e) => set("name", e.target.value)} /></div>
        <div><label className={labelCls}>Category</label><input className={inputCls} value={p.category} onChange={(e) => set("category", e.target.value)} /></div>
        <div><label className={labelCls}>Price (₹)</label><input type="number" className={inputCls} value={p.price} onChange={(e) => set("price", +e.target.value)} /></div>
        <div><label className={labelCls}>Stock</label><input type="number" className={inputCls} value={p.stock} onChange={(e) => set("stock", +e.target.value)} /></div>
        <div><label className={labelCls}>Weight</label><input className={inputCls} value={p.weight} onChange={(e) => set("weight", e.target.value)} /></div>
        <div><label className={labelCls}>Size</label><input className={inputCls} value={p.size} onChange={(e) => set("size", e.target.value)} /></div>
        <div><label className={labelCls}>Willow Grade</label><input className={inputCls} value={p.willowGrade} onChange={(e) => set("willowGrade", e.target.value)} /></div>
        <div><label className={labelCls}>Handle Type</label><input className={inputCls} value={p.handleType} onChange={(e) => set("handleType", e.target.value)} /></div>
        <div className="sm:col-span-2"><label className={labelCls}>Short Description</label><input className={inputCls} value={p.shortDescription} onChange={(e) => set("shortDescription", e.target.value)} /></div>
        <div className="sm:col-span-2"><label className={labelCls}>Full Description</label><textarea rows={5} className={`${inputCls} resize-none`} value={p.description} onChange={(e) => set("description", e.target.value)} /></div>
        <div className="sm:col-span-2">
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={!!p.featured} onChange={(e) => set("featured", e.target.checked)} /> Featured on homepage</label>
        </div>
      </div>

      {/* Images */}
      <div className="mt-6">
        <label className={labelCls}>Product Images (Base64)</label>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {p.images.map((src, i) => (
            <div key={i} className="group relative aspect-square overflow-hidden rounded-sm border border-border">
              <img src={src} alt="" className="h-full w-full object-cover" />
              <button
                onClick={() => set("images", p.images.filter((_, idx) => idx !== i))}
                className="absolute right-1 top-1 rounded-full bg-black/70 p-1 text-white opacity-0 group-hover:opacity-100"
              ><X className="h-3 w-3" /></button>
            </div>
          ))}
          <label className="flex aspect-square cursor-pointer items-center justify-center rounded-sm border border-dashed border-border bg-background text-xs uppercase tracking-widest text-muted-foreground hover:border-primary hover:text-primary">
            <input type="file" accept="image/*" multiple className="hidden" onChange={(e) => onFiles(e.target.files)} />
            <div className="flex flex-col items-center gap-1"><Upload className="h-4 w-4" /> Upload</div>
          </label>
        </div>
      </div>
    </div>
  );
}

// ---------- Content tabs ----------

function HomepageTab() {
  const [content, setContent] = useContent();
  const [draft, setDraft] = useState(content);
  return (
    <div className="rounded-md border border-border bg-card p-6">
      <h2 className="display mb-5 text-2xl font-bold uppercase tracking-wider">Homepage Hero</h2>
      <div className="grid gap-4">
        <div><label className={labelCls}>Hero title</label><input className={inputCls} value={draft.hero.title} onChange={(e) => setDraft({ ...draft, hero: { ...draft.hero, title: e.target.value } })} /></div>
        <div><label className={labelCls}>Subtitle</label><input className={inputCls} value={draft.hero.subtitle} onChange={(e) => setDraft({ ...draft, hero: { ...draft.hero, subtitle: e.target.value } })} /></div>
        <div><label className={labelCls}>Tagline</label><input className={inputCls} value={draft.hero.tagline} onChange={(e) => setDraft({ ...draft, hero: { ...draft.hero, tagline: e.target.value } })} /></div>

        <h3 className="display mt-4 text-lg font-bold uppercase tracking-wider">Why Choose Us</h3>
        {draft.whyChooseUs.map((f, i) => (
          <div key={i} className="grid gap-2 rounded-sm border border-border bg-background p-3 sm:grid-cols-[1fr_2fr]">
            <input className={inputCls} value={f.title} onChange={(e) => { const w = [...draft.whyChooseUs]; w[i] = { ...w[i], title: e.target.value }; setDraft({ ...draft, whyChooseUs: w }); }} />
            <input className={inputCls} value={f.body} onChange={(e) => { const w = [...draft.whyChooseUs]; w[i] = { ...w[i], body: e.target.value }; setDraft({ ...draft, whyChooseUs: w }); }} />
          </div>
        ))}
      </div>
      <button className={`${btnPrimary} mt-5`} onClick={() => { setContent(draft); toast.success("Homepage updated"); }}><Save className="h-4 w-4" /> Save</button>
    </div>
  );
}

function AboutTab() {
  const [content, setContent] = useContent();
  const [draft, setDraft] = useState(content.about);
  return (
    <div className="rounded-md border border-border bg-card p-6">
      <h2 className="display mb-5 text-2xl font-bold uppercase tracking-wider">About Section</h2>
      <div className="grid gap-4">
        <div><label className={labelCls}>Title</label><input className={inputCls} value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} /></div>
        <div><label className={labelCls}>Body</label><textarea rows={8} className={`${inputCls} resize-none`} value={draft.body} onChange={(e) => setDraft({ ...draft, body: e.target.value })} /></div>
      </div>
      <button className={`${btnPrimary} mt-5`} onClick={() => { setContent({ ...content, about: draft }); toast.success("About updated"); }}><Save className="h-4 w-4" /> Save</button>
    </div>
  );
}

function ContactTab() {
  const [content, setContent] = useContent();
  const [draft, setDraft] = useState(content.contact);
  return (
    <div className="rounded-md border border-border bg-card p-6">
      <h2 className="display mb-5 text-2xl font-bold uppercase tracking-wider">Contact Details</h2>
      <div className="grid gap-4">
        <div><label className={labelCls}>Email</label><input className={inputCls} value={draft.email} onChange={(e) => setDraft({ ...draft, email: e.target.value })} /></div>
        <div><label className={labelCls}>Phone</label><input className={inputCls} value={draft.phone} onChange={(e) => setDraft({ ...draft, phone: e.target.value })} /></div>
        <div><label className={labelCls}>Address</label><input className={inputCls} value={draft.address} onChange={(e) => setDraft({ ...draft, address: e.target.value })} /></div>
      </div>
      <button className={`${btnPrimary} mt-5`} onClick={() => { setContent({ ...content, contact: draft }); toast.success("Contact updated"); }}><Save className="h-4 w-4" /> Save</button>
    </div>
  );
}

function SocialTab() {
  const [content, setContent] = useContent();
  const [draft, setDraft] = useState(content.social);
  return (
    <div className="rounded-md border border-border bg-card p-6">
      <h2 className="display mb-5 text-2xl font-bold uppercase tracking-wider">Social Links</h2>
      <div className="grid gap-4 sm:grid-cols-2">
        {(["instagram", "facebook", "youtube", "twitter"] as const).map((k) => (
          <div key={k}><label className={labelCls}>{k}</label><input className={inputCls} value={draft[k]} onChange={(e) => setDraft({ ...draft, [k]: e.target.value })} /></div>
        ))}
      </div>
      <button className={`${btnPrimary} mt-5`} onClick={() => { setContent({ ...content, social: draft }); toast.success("Socials updated"); }}><Save className="h-4 w-4" /> Save</button>
    </div>
  );
}

function GalleryTab() {
  const [content, setContent] = useContent();

  async function addFiles(files: FileList | null) {
    if (!files) return;
    const arr = await Promise.all(Array.from(files).map(fileToBase64));
    setContent({ ...content, gallery: [...content.gallery, ...arr] });
    toast.success(`${arr.length} image(s) added`);
  }
  function remove(i: number) {
    setContent({ ...content, gallery: content.gallery.filter((_, idx) => idx !== i) });
  }

  return (
    <div className="rounded-md border border-border bg-card p-6">
      <div className="mb-5 flex items-center justify-between">
        <h2 className="display text-2xl font-bold uppercase tracking-wider">Website Gallery</h2>
        <label className={btnPrimary + " cursor-pointer"}>
          <input type="file" accept="image/*" multiple className="hidden" onChange={(e) => addFiles(e.target.files)} />
          <Upload className="h-4 w-4" /> Upload
        </label>
      </div>
      {content.gallery.length === 0 ? (
        <div className="rounded-sm border border-dashed border-border p-10 text-center text-sm text-muted-foreground">No gallery images yet.</div>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
          {content.gallery.map((src, i) => (
            <div key={i} className="group relative aspect-square overflow-hidden rounded-sm border border-border">
              <img src={src} alt="" className="h-full w-full object-cover" />
              <button onClick={() => remove(i)} className="absolute right-1 top-1 rounded-full bg-black/70 p-1 text-white opacity-0 group-hover:opacity-100"><X className="h-3 w-3" /></button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}