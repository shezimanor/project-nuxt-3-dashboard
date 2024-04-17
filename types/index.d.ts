export interface Product {
  id: string;
  title: string;
  description: string;
  product_data: string;
  preview_link: string;
  prototype_id: string;
  prototype_title: string;
  prototype_version: string;
  status: number;
  created_at: string;
  updated_at: string;
}

export interface Prototype {
  id: string;
  title: string;
  description: string;
  version: string;
  features: string[];
  schema: string;
  status: number;
  preview_id: string;
  created_at: string;
  updated_at: string;
}
