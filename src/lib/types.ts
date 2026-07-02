export type Product = {
  id: string;
  name: string;
  price: number;
  shortDescription: string;
  description: string;
  images: string[];
  category: string;
  stock: number;
  weight: string;
  size: string;
  willowGrade: string;
  handleType: string;
  featured?: boolean;
};

export type SiteContent = {
  hero: { title: string; subtitle: string; tagline: string };
  about: { title: string; body: string };
  contact: { email: string; phone: string; address: string };
  social: { instagram: string; facebook: string; youtube: string; twitter: string };
  gallery: string[];
  testimonials: { name: string; role: string; quote: string; rating: number }[];
  whyChooseUs: { title: string; body: string }[];
};