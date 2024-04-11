export interface Product {
  id: string;
  title: string;
  description: string;
  size: string;
  preview_link: string;
  prototype_id: string;
  prototype_title: string;
  prototype_version: string;
  owner_id: number;
  status: number;
  created_at: string;
}

export interface Prototype {
  id: string;
  title: string;
  description: string;
  version: string;
  features: string[];
  schema: string;
  status: number;
  created_at: string;
  updated_at: string;
}
