// ---------------------------------------------------------------------------
// Category types (mirror the backend category module)
// ---------------------------------------------------------------------------

export interface CategoryImage {
  url: string;
  publicId: string;
}

export interface Category {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  image?: CategoryImage;
  parent?: string | null; // optional self-reference for nested categories
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
