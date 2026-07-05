import { useState, type ComponentType } from "react";
import { SiteLayout } from "@/components/site/Layout";
import {
  useAdminAuth,
  useProducts,
  useContent,
  useCategories,
  optimizeImage,
  IMAGE_PRESETS,
  formatPrice,
  type Product,
  type Category,
} from "@/lib/store";
import { LogOut, Plus, Trash2, Save, Upload, X, Lock, Package, Image as ImageIcon, Info, Phone, Share2, LayoutDashboard, Loader2, ArrowLeft, ArrowRight, Replace } from "lucide-react";
import { toast } from "sonner";

const inputCls = "w-full rounded-sm border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary";
const labelCls = "mb-1 block text-[10px] font-bold uppercase tracking-widest text-muted-foreground";
const btnPrimary = "inline-flex items-center gap-2 rounded-sm bg-primary px-4 py-2.5 text-xs font-bold uppercase tracking-widest text-primary-foreground hover:brightness-110";
const btnGhost = "inline-flex items-center gap-2 rounded-sm border border-border bg-card px-4 py-2.5 text-xs font-bold uppercase tracking-widest hover:border-primary hover:text-primary";

export default function Admin() {
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

type Tab =
  | "products"
  | "categories"
  | "branding"
  | "homepage"
  | "about"
  | "contact"
  | "social"
  | "gallery";

function AdminDashboard() {
  const auth = useAdminAuth();
  const [tab, setTab] = useState<Tab>("products");

 const tabs: { id: Tab; label: string; icon: ComponentType<{ className?: string }> }[] = [
  { id: "products", label: "Products", icon: Package },
  { id: "categories", label: "Categories", icon: Package },
  { id: "branding", label: "Branding", icon: ImageIcon },
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
            {tab === "categories" && <CategoriesTab />}
            {tab === "branding" && <BrandingTab />}
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
    price: 99.99,
    shortDescription: "",
    description: "",
    images: [],
    category: "english-willow",
    stock: 10,
    weight: "",
    size: "SH",
    willowGrade: "",
    handleType: "",
  };
}

function ProductsTab() {
  const [products, setProducts] = useProducts();
  const [categories] = useCategories();
  const [editing, setEditing] = useState<Product | null>(null);

  function categoryName(categoryId: string) {
    return categories.find((cat) => cat.id === categoryId)?.name || categoryId;
  }

  async function save(p: Product) {
    const existing = products.find((x) => x.id === p.id);
    const next = existing ? products.map((x) => (x.id === p.id ? p : x)) : [p, ...products];
    try {
      await setProducts(next);
      setEditing(null);
      toast.success("Product saved");
    } catch (err) {
      console.error(err);
      toast.error("Save failed. Image was not stored permanently. Please check Cloudflare KV binding or image size.");
    }
  }

  async function del(id: string) {
    if (!confirm("Delete this product?")) return;
    try {
      await setProducts(products.filter((p) => p.id !== id));
      toast.success("Product deleted");
    } catch (err) {
      console.error(err);
      toast.error("Delete failed. Please check Cloudflare KV binding.");
    }
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
              <div className="text-xs text-muted-foreground">{categoryName(p.category)} · {formatPrice(p.price)} · Stock {p.stock}</div>
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
  const [categories] = useCategories();
  const [p, setP] = useState<Product>(product);
  const [uploading, setUploading] = useState(false);
  const [replaceIdx, setReplaceIdx] = useState<number | null>(null);
  const set = <K extends keyof Product>(k: K, v: Product[K]) => setP({ ...p, [k]: v });

  async function onFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    setUploading(true);
    try {
      const preset = IMAGE_PRESETS.product;
      const arr = await Promise.all(
        Array.from(files).map((f) => optimizeImage(f, preset.w, preset.h, preset.q)),
      );
      set("images", [...p.images, ...arr]);
      toast.success(`${arr.length} image(s) added`);
    } catch {
      toast.error("Failed to process image(s)");
    } finally {
      setUploading(false);
    }
  }

  async function onReplace(files: FileList | null, idx: number) {
    if (!files?.[0]) return;
    setUploading(true);
    setReplaceIdx(idx);
    try {
      const preset = IMAGE_PRESETS.product;
      const src = await optimizeImage(files[0], preset.w, preset.h, preset.q);
      const next = [...p.images];
      next[idx] = src;
      set("images", next);
      toast.success("Image replaced");
    } catch {
      toast.error("Failed to replace image");
    } finally {
      setUploading(false);
      setReplaceIdx(null);
    }
  }

  function move(idx: number, dir: -1 | 1) {
    const next = [...p.images];
    const target = idx + dir;
    if (target < 0 || target >= next.length) return;
    [next[idx], next[target]] = [next[target], next[idx]];
    set("images", next);
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
        <div>
          <label className={labelCls}>Category</label>
          <select
            className={inputCls}
            value={p.category}
            onChange={(e) => set("category", e.target.value)}
          >
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>
        <div><label className={labelCls}>Price (AUD)</label><input type="number" step="0.01" className={inputCls} value={p.price} onChange={(e) => set("price", +e.target.value)} /></div>
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
        <div className="mb-2 flex items-center justify-between">
          <label className={labelCls}>Product Images ({p.images.length}) — 1000×1000 recommended</label>
          {uploading && <span className="inline-flex items-center gap-1 text-xs text-muted-foreground"><Loader2 className="h-3 w-3 animate-spin" /> Optimizing…</span>}
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {p.images.map((src, i) => (
            <div key={i} className="group relative aspect-square overflow-hidden rounded-sm border border-border">
              <img src={src} alt="" loading="lazy" className="h-full w-full object-cover" />
              {i === 0 && (
                <span className="absolute left-1 top-1 rounded-sm bg-primary px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-widest text-primary-foreground">Main</span>
              )}
              <div className="absolute inset-x-1 bottom-1 flex justify-between gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                <button
                  type="button"
                  disabled={i === 0}
                  onClick={() => move(i, -1)}
                  className="rounded-sm bg-black/70 p-1 text-white disabled:opacity-30"
                  title="Move left"
                ><ArrowLeft className="h-3 w-3" /></button>
                <button
                  type="button"
                  disabled={i === p.images.length - 1}
                  onClick={() => move(i, 1)}
                  className="rounded-sm bg-black/70 p-1 text-white disabled:opacity-30"
                  title="Move right"
                ><ArrowRight className="h-3 w-3" /></button>
                <label className="cursor-pointer rounded-sm bg-black/70 p-1 text-white" title="Replace">
                  <input type="file" accept="image/*" className="hidden" onChange={(e) => onReplace(e.target.files, i)} />
                  <Replace className="h-3 w-3" />
                </label>
                <button
                  type="button"
                  onClick={() => set("images", p.images.filter((_, idx) => idx !== i))}
                  className="rounded-sm bg-black/70 p-1 text-white"
                  title="Remove"
                ><X className="h-3 w-3" /></button>
              </div>
              {replaceIdx === i && (
                <div className="absolute inset-0 grid place-items-center bg-black/60 text-white"><Loader2 className="h-4 w-4 animate-spin" /></div>
              )}
            </div>
          ))}
          <label className="flex aspect-square cursor-pointer items-center justify-center rounded-sm border border-dashed border-border bg-background text-xs uppercase tracking-widest text-muted-foreground hover:border-primary hover:text-primary">
            <input type="file" accept="image/*" multiple className="hidden" onChange={(e) => onFiles(e.target.files)} />
            <div className="flex flex-col items-center gap-1">
              {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
              {uploading ? "Uploading" : "Upload"}
            </div>
          </label>
        </div>
      </div>
    </div>
  );
}

// ---------- Categories ----------

function slugifyCategory(value: string) {
  const slug = value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return slug || "category-" + Math.random().toString(36).slice(2, 8);
}

function CategoriesTab() {
  const [categories, setCategories] = useCategories();
  const [products] = useProducts();

  async function save(next: Category[], message = "Categories updated") {
    try {
      await setCategories(next);
      toast.success(message);
    } catch (err) {
      console.error(err);
      toast.error("Save failed. Please check Cloudflare KV binding.");
    }
  }

  async function addCategory() {
    const baseName = "New Category";
    const baseId = slugifyCategory(baseName);
    let id = baseId;
    let count = 2;

    while (categories.some((cat) => cat.id === id)) {
      id = `${baseId}-${count}`;
      count++;
    }

    await save([...categories, { id, name: baseName }], "Category added");
  }

  async function updateCategoryName(category: Category, name: string) {
    const next = categories.map((cat) =>
      cat.id === category.id ? { ...cat, name } : cat,
    );

    await save(next);
  }

  async function deleteCategory(category: Category) {
    const usedCount = products.filter((product) => product.category === category.id).length;

    if (usedCount > 0) {
      toast.error("Move products out of this category before deleting it.");
      return;
    }

    if (!confirm(`Delete category "${category.name}"?`)) return;

    await save(
      categories.filter((cat) => cat.id !== category.id),
      "Category deleted",
    );
  }

  function moveCategory(index: number, direction: -1 | 1) {
    const target = index + direction;

    if (target < 0 || target >= categories.length) return;

    const next = [...categories];
    [next[index], next[target]] = [next[target], next[index]];
    void save(next, "Category order updated");
  }

  return (
    <div className="rounded-md border border-border bg-card p-6">
      <div className="mb-5 flex items-center justify-between">
        <h2 className="display text-2xl font-bold uppercase tracking-wider">Categories ({categories.length})</h2>
        <button onClick={addCategory} className={btnPrimary}>
          <Plus className="h-4 w-4" /> Add Category
        </button>
      </div>

      <div className="space-y-3">
        {categories.map((category, index) => {
          const usedCount = products.filter((product) => product.category === category.id).length;

          return (
            <div key={category.id} className="rounded-sm border border-border bg-background p-4">
              <div className="grid gap-3 sm:grid-cols-[1fr_auto] sm:items-end">
                <div>
                  <label className={labelCls}>Category Name</label>
                  <input
                    className={inputCls}
                    value={category.name}
                    onChange={(e) => void updateCategoryName(category, e.target.value)}
                  />
                  <p className="mt-1 text-[10px] uppercase tracking-widest text-muted-foreground">
                    ID: {category.id} · {usedCount} product(s)
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    disabled={index === 0}
                    onClick={() => moveCategory(index, -1)}
                    className={btnGhost + " disabled:opacity-40"}
                  >
                    <ArrowLeft className="h-3.5 w-3.5" /> Up
                  </button>
                  <button
                    type="button"
                    disabled={index === categories.length - 1}
                    onClick={() => moveCategory(index, 1)}
                    className={btnGhost + " disabled:opacity-40"}
                  >
                    <ArrowRight className="h-3.5 w-3.5" /> Down
                  </button>
                  <button
                    type="button"
                    onClick={() => void deleteCategory(category)}
                    className="inline-flex items-center gap-1 rounded-sm border border-border bg-card px-3 py-2.5 text-xs font-bold uppercase tracking-widest text-primary hover:bg-primary hover:text-primary-foreground"
                  >
                    <Trash2 className="h-3.5 w-3.5" /> Delete
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ---------- Content tabs ----------

function HomepageTab() {
  const [content, setContent] = useContent();
  const [draft, setDraft] = useState(content);
  const [busy, setBusy] = useState(false);

  async function onHeroImage(files: FileList | null) {
    if (!files?.[0]) return;
    setBusy(true);
    try {
      const preset = IMAGE_PRESETS.hero;
      const image = await optimizeImage(files[0], preset.w, preset.h, preset.q);
      setDraft({ ...draft, hero: { ...draft.hero, image } });
      toast.success("Hero image ready — click Save to publish");
    } catch {
      toast.error("Failed to process hero image");
    } finally {
      setBusy(false);
    }
  }

  function removeHeroImage() {
    setDraft({
      ...draft,
      hero: { ...draft.hero, image: "" },
    });
  }

  return (
    <div className="rounded-md border border-border bg-card p-6">
      <h2 className="display mb-5 text-2xl font-bold uppercase tracking-wider">Homepage Hero</h2>
      <div className="grid gap-4">
        <div><label className={labelCls}>Hero title</label><input className={inputCls} value={draft.hero.title} onChange={(e) => setDraft({ ...draft, hero: { ...draft.hero, title: e.target.value } })} /></div>
        <div><label className={labelCls}>Subtitle</label><input className={inputCls} value={draft.hero.subtitle} onChange={(e) => setDraft({ ...draft, hero: { ...draft.hero, subtitle: e.target.value } })} /></div>
        <div><label className={labelCls}>Tagline</label><input className={inputCls} value={draft.hero.tagline} onChange={(e) => setDraft({ ...draft, hero: { ...draft.hero, tagline: e.target.value } })} /></div>

        <div>
          <label className={labelCls}>Hero Image</label>
          {draft.hero.image ? (
            <div className="group relative mb-3 h-48 overflow-hidden rounded-sm border border-border bg-background">
              <img src={draft.hero.image} alt="Hero preview" className="h-full w-full object-cover" />
              <button
                type="button"
                onClick={removeHeroImage}
                className="absolute right-2 top-2 rounded-full bg-black/70 p-1.5 text-white opacity-0 transition-opacity group-hover:opacity-100"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <div className="mb-3 rounded-sm border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
              No hero image uploaded yet.
            </div>
          )}
          <label className={btnGhost + " cursor-pointer"}>
            <input type="file" accept="image/*" className="hidden" onChange={(e) => onHeroImage(e.target.files)} />
            {busy ? <><Loader2 className="h-4 w-4 animate-spin" /> Optimizing…</> : <><Upload className="h-4 w-4" /> {draft.hero.image ? "Replace Hero Image" : "Upload Hero Image"} (1600×900)</>}
          </label>
        </div>

        <h3 className="display mt-4 text-lg font-bold uppercase tracking-wider">Why Choose Us</h3>
        {draft.whyChooseUs.map((f, i) => (
          <div key={i} className="grid gap-2 rounded-sm border border-border bg-background p-3 sm:grid-cols-[1fr_2fr]">
            <input className={inputCls} value={f.title} onChange={(e) => { const w = [...draft.whyChooseUs]; w[i] = { ...w[i], title: e.target.value }; setDraft({ ...draft, whyChooseUs: w }); }} />
            <input className={inputCls} value={f.body} onChange={(e) => { const w = [...draft.whyChooseUs]; w[i] = { ...w[i], body: e.target.value }; setDraft({ ...draft, whyChooseUs: w }); }} />
          </div>
        ))}
      </div>
      <button className={`${btnPrimary} mt-5`} onClick={async () => {
        try { await setContent(draft); toast.success("Homepage updated"); }
        catch (err) { console.error(err); toast.error("Save failed. Image was not stored permanently. Please check Cloudflare KV binding or image size."); }
      }}><Save className="h-4 w-4" /> Save</button>
    </div>
  );
}

function BrandingTab() {
  const [content, setContent] = useContent();
  const [draft, setDraft] = useState(content);
  const [busy, setBusy] = useState(false);

  async function onLogo(files: FileList | null) {
    if (!files?.[0]) return;

    setBusy(true);

    try {
      const preset = IMAGE_PRESETS.about;

      const logo = await optimizeImage(
        files[0],
        preset.w,
        preset.h,
        preset.q,
      );

      setDraft({
        ...draft,
        branding: {
          ...(draft.branding ?? {}),
          logo,
        },
      });

      toast.success("Logo ready. Click Save.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="rounded-md border border-border bg-card p-6">
      <h2 className="display mb-5 text-2xl font-bold uppercase tracking-wider">
        Website Logo
      </h2>

      {(draft.branding?.logo ?? "") ? (
        <div className="mb-4">
          <img
            src={draft.branding.logo}
            className="h-40 w-40 rounded-full border object-cover"
          />
        </div>
      ) : (
        <div className="mb-4 rounded border border-dashed p-8 text-center text-sm text-muted-foreground">
          No logo uploaded.
        </div>
      )}

      <label className={btnGhost + " cursor-pointer"}>
        <input
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => onLogo(e.target.files)}
        />

        {busy ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Optimizing...
          </>
        ) : (
          <>
            <Upload className="h-4 w-4" />
            Upload Logo
          </>
        )}
      </label>

      <button
        className={`${btnPrimary} mt-5`}
        onClick={async () => {
          await setContent(draft);
          toast.success("Logo updated");
        }}
      >
        <Save className="h-4 w-4" />
        Save
      </button>
    </div>
  );
}


      

function AboutTab() {
  const [content, setContent] = useContent();
  const [draft, setDraft] = useState(content);
  const [busy, setBusy] = useState(false);

  async function onAboutImage(files: FileList | null) {
    if (!files?.[0]) return;
    setBusy(true);
    try {
      const preset = IMAGE_PRESETS.about;
      const image = await optimizeImage(files[0], preset.w, preset.h, preset.q);
      setDraft({ ...draft, about: { ...draft.about, image } });
      toast.success("About image ready — click Save to publish");
    } catch {
      toast.error("Failed to process about image");
    } finally {
      setBusy(false);
    }
  }

  function removeAboutImage() {
    setDraft({
      ...draft,
      about: { ...draft.about, image: "" },
    });
  }

  return (
    <div className="rounded-md border border-border bg-card p-6">
      <h2 className="display mb-5 text-2xl font-bold uppercase tracking-wider">About Section</h2>
      <div className="grid gap-4">
        <div>
          <label className={labelCls}>Title</label>
          <input
            className={inputCls}
            value={draft.about.title}
            onChange={(e) =>
              setDraft({
                ...draft,
                about: { ...draft.about, title: e.target.value },
              })
            }
          />
        </div>

        <div>
          <label className={labelCls}>Body</label>
          <textarea
            rows={8}
            className={`${inputCls} resize-none`}
            value={draft.about.body}
            onChange={(e) =>
              setDraft({
                ...draft,
                about: { ...draft.about, body: e.target.value },
              })
            }
          />
        </div>

        <div>
          <label className={labelCls}>About Image</label>
          {draft.about.image ? (
            <div className="group relative mb-3 h-48 overflow-hidden rounded-sm border border-border bg-background">
              <img src={draft.about.image} alt="About preview" className="h-full w-full object-cover" />
              <button
                type="button"
                onClick={removeAboutImage}
                className="absolute right-2 top-2 rounded-full bg-black/70 p-1.5 text-white opacity-0 transition-opacity group-hover:opacity-100"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <div className="mb-3 rounded-sm border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
              No about image uploaded yet.
            </div>
          )}
          <label className={btnGhost + " cursor-pointer"}>
            <input type="file" accept="image/*" className="hidden" onChange={(e) => onAboutImage(e.target.files)} />
            {busy ? <><Loader2 className="h-4 w-4 animate-spin" /> Optimizing…</> : <><Upload className="h-4 w-4" /> {draft.about.image ? "Replace About Image" : "Upload About Image"} (1200×800)</>}
          </label>
        </div>
      </div>

      <button
        className={`${btnPrimary} mt-5`}
        onClick={async () => {
          try { await setContent(draft); toast.success("About updated"); }
          catch (err) { console.error(err); toast.error("Save failed. Image was not stored permanently. Please check Cloudflare KV binding or image size."); }
        }}
      >
        <Save className="h-4 w-4" /> Save
      </button>
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
      <button className={`${btnPrimary} mt-5`} onClick={async () => {
        try { await setContent({ ...content, contact: draft }); toast.success("Contact updated"); }
        catch (err) { console.error(err); toast.error("Save failed. Please check Cloudflare KV binding."); }
      }}><Save className="h-4 w-4" /> Save</button>
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
      <button className={`${btnPrimary} mt-5`} onClick={async () => {
        try { await setContent({ ...content, social: draft }); toast.success("Socials updated"); }
        catch (err) { console.error(err); toast.error("Save failed. Please check Cloudflare KV binding."); }
      }}><Save className="h-4 w-4" /> Save</button>
    </div>
  );
}

function GalleryTab() {
  const [content, setContent] = useContent();
  const [draft, setDraft] = useState(content);
  const [busy, setBusy] = useState(false);

  async function addFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    setBusy(true);
    try {
      const preset = IMAGE_PRESETS.gallery;
      const arr = await Promise.all(
        Array.from(files).map((f) => optimizeImage(f, preset.w, preset.h, preset.q)),
      );
      setDraft({ ...draft, gallery: [...draft.gallery, ...arr] });
      toast.success(`${arr.length} image(s) added. Click Save Gallery to publish.`);
    } catch {
      toast.error("Failed to process image(s)");
    } finally {
      setBusy(false);
    }
  }

  function remove(i: number) {
    setDraft({ ...draft, gallery: draft.gallery.filter((_, idx) => idx !== i) });
  }

  async function saveGallery() {
    try { await setContent(draft); toast.success("Gallery saved"); }
    catch (err) { console.error(err); toast.error("Save failed. Image was not stored permanently. Please check Cloudflare KV binding or image size."); }
  }

  return (
    <div className="rounded-md border border-border bg-card p-6">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <h2 className="display text-2xl font-bold uppercase tracking-wider">Website Gallery</h2>
        <div className="flex flex-wrap gap-2">
          <label className={btnGhost + " cursor-pointer"}>
            <input type="file" accept="image/*" multiple className="hidden" onChange={(e) => addFiles(e.target.files)} />
            {busy ? <><Loader2 className="h-4 w-4 animate-spin" /> Optimizing…</> : <><Upload className="h-4 w-4" /> Upload</>}
          </label>
          <button onClick={saveGallery} className={btnPrimary}>
            <Save className="h-4 w-4" /> Save Gallery
          </button>
        </div>
      </div>

      {draft.gallery.length === 0 ? (
        <div className="rounded-sm border border-dashed border-border p-10 text-center text-sm text-muted-foreground">No gallery images yet.</div>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
          {draft.gallery.map((src, i) => (
            <div key={i} className="group relative aspect-square overflow-hidden rounded-sm border border-border">
              <img src={src} alt="" loading="lazy" className="h-full w-full object-cover" />
              <button onClick={() => remove(i)} className="absolute right-1 top-1 rounded-full bg-black/70 p-1 text-white opacity-0 group-hover:opacity-100"><X className="h-3 w-3" /></button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
