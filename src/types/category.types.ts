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
  color?: string; // hex accent for the storefront category tile/pill
  parent?: string | null; // optional self-reference for nested categories
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

/** Body for admin create/update category requests. */
export interface CategoryInput {
  name: string;
  description?: string;
  color?: string; // "" clears the color on update
  isActive?: boolean;
}
