export interface Product {
  id: string;
  title: string;
  description: string;
  owner_id: number;
  size: string;
  status: number;
  preview_link: string;
  created_at: string;
  prototype_id: string;
  prototype_title: string;
  prototype_version: string;
}

export interface Prototype {
  id: string;
  title: string;
  features: string[];
  version: string;
  sizes: string[];
  updated_at: string;
  status: number;
}
