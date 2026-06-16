import { Controller, FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Divider from "@mui/material/Divider";
import FormControlLabel from "@mui/material/FormControlLabel";
import Grid from "@mui/material/Grid";
import MenuItem from "@mui/material/MenuItem";
import Switch from "@mui/material/Switch";
import TextField from "@mui/material/TextField";
import { useCategories } from "../../hooks/useCategories";
import { useCreateProduct, useUpdateProduct } from "../../hooks/useAdmin";
import { useSnackbar } from "../../hooks/useSnackbar";
import { getErrorMessage } from "../../utils/getErrorMessage";
import RHFTextField from "../form/RHFTextField";
import ProductImageManager from "./ProductImageManager";
import {
  productSchema,
  type ProductFormValues,
} from "../../validations/product.schema";
import type { Product, ProductInput } from "../../types/product.types";

// ---------------------------------------------------------------------------
// ProductFormDialog — create or edit a product (admin).
// ---------------------------------------------------------------------------
// Images are managed (upload/remove) only when editing, since the image
// endpoints need a product id. Create first, then add images via Edit.
// ---------------------------------------------------------------------------

interface ProductFormDialogProps {
  open: boolean;
  onClose: () => void;
  product?: Product; // present → edit mode
}

const toFormValues = (product?: Product): Partial<ProductFormValues> =>
  product
    ? {
        name: product.name,
        description: product.description,
        brand: product.brand ?? "",
        category: product.category?._id ?? "",
        tags: product.tags.join(", "),
        price: String(product.price),
        compareAtPrice: product.compareAtPrice != null ? String(product.compareAtPrice) : "",
        stock: String(product.stock),
        sku: product.sku ?? "",
        isActive: product.isActive,
        isFeatured: product.isFeatured,
      }
    : { isActive: true, isFeatured: false };

const ProductFormDialog = ({ open, onClose, product }: ProductFormDialogProps) => {
  const isEdit = Boolean(product);
  const { data: categories } = useCategories();
  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();
  const { notify } = useSnackbar();

  const methods = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    // `values` keeps the form in sync when switching which product is edited.
    values: toFormValues(product) as ProductFormValues,
  });

  const isSubmitting = createProduct.isPending || updateProduct.isPending;

  const onSubmit = (values: ProductFormValues) => {
    const payload: ProductInput = {
      name: values.name,
      description: values.description,
      brand: values.brand?.trim() || undefined,
      category: values.category,
      tags: values.tags
        ? values.tags.split(",").map((t) => t.trim()).filter(Boolean)
        : undefined,
      price: Number(values.price),
      compareAtPrice: values.compareAtPrice ? Number(values.compareAtPrice) : undefined,
      stock: Number(values.stock),
      sku: values.sku?.trim() || undefined,
      isActive: values.isActive,
      isFeatured: values.isFeatured,
    };

    const onError = (err: unknown) => notify(getErrorMessage(err), "error");
    if (isEdit && product) {
      updateProduct.mutate(
        { id: product._id, payload },
        { onSuccess: () => notify("Product updated", "success"), onError },
      );
    } else {
      createProduct.mutate(payload, {
        onSuccess: () => {
          notify("Product created — edit it to add images", "success");
          onClose();
        },
        onError,
      });
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{isEdit ? "Edit product" : "New product"}</DialogTitle>
      <DialogContent dividers>
        <FormProvider {...methods}>
          <Box component="form" id="product-form" onSubmit={methods.handleSubmit(onSubmit)} noValidate>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12 }}>
                <RHFTextField name="name" label="Name" />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <RHFTextField name="description" label="Description" multiline minRows={3} />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Controller
                  name="category"
                  control={methods.control}
                  render={({ field, fieldState }) => (
                    <TextField
                      {...field}
                      select
                      fullWidth
                      size="small"
                      label="Category"
                      error={Boolean(fieldState.error)}
                      helperText={fieldState.error?.message}
                    >
                      {(categories ?? []).map((c) => (
                        <MenuItem key={c._id} value={c._id}>
                          {c.name}
                        </MenuItem>
                      ))}
                    </TextField>
                  )}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <RHFTextField name="brand" label="Brand (optional)" />
              </Grid>
              <Grid size={{ xs: 6, sm: 4 }}>
                <RHFTextField name="price" label="Price" type="number" />
              </Grid>
              <Grid size={{ xs: 6, sm: 4 }}>
                <RHFTextField name="compareAtPrice" label="Compare-at (optional)" type="number" />
              </Grid>
              <Grid size={{ xs: 6, sm: 4 }}>
                <RHFTextField name="stock" label="Stock" type="number" />
              </Grid>
              <Grid size={{ xs: 6 }}>
                <RHFTextField name="sku" label="SKU (optional)" />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <RHFTextField name="tags" label="Tags (comma-separated)" />
              </Grid>
              <Grid size={{ xs: 6 }}>
                <Controller
                  name="isActive"
                  control={methods.control}
                  render={({ field }) => (
                    <FormControlLabel
                      control={<Switch checked={!!field.value} onChange={field.onChange} />}
                      label="Active"
                    />
                  )}
                />
              </Grid>
              <Grid size={{ xs: 6 }}>
                <Controller
                  name="isFeatured"
                  control={methods.control}
                  render={({ field }) => (
                    <FormControlLabel
                      control={<Switch checked={!!field.value} onChange={field.onChange} />}
                      label="Featured"
                    />
                  )}
                />
              </Grid>
            </Grid>
          </Box>
        </FormProvider>

        {/* Images (edit only) */}
        {isEdit && product && (
          <>
            <Divider sx={{ my: 3 }} />
            <ProductImageManager product={product} />
          </>
        )}

        {!isEdit && (
          <Alert severity="info" sx={{ mt: 2 }}>
            Save the product first, then edit it to upload images.
          </Alert>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={isSubmitting}>
          Close
        </Button>
        <Button type="submit" form="product-form" variant="contained" loading={isSubmitting}>
          {isEdit ? "Save changes" : "Create product"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ProductFormDialog;
