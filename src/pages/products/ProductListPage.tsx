import { useMemo, useRef, useState, useTransition } from "react";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Drawer from "@mui/material/Drawer";
import InputAdornment from "@mui/material/InputAdornment";
import LinearProgress from "@mui/material/LinearProgress";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import TuneRoundedIcon from "@mui/icons-material/TuneRounded";
import { useProducts } from "../../hooks/useProducts";
import { useCategories } from "../../hooks/useCategories";
import { useProductFilters } from "../../hooks/useProductFilters";
import ProductFilters from "../../components/product/ProductFilters";
import ProductGrid from "../../components/product/ProductGrid";
import ProductSortSelect from "../../components/product/ProductSortSelect";
import { PAGE_SIZE } from "../../hooks/useProductFilters";

// ---------------------------------------------------------------------------
// ProductListPage  (/products)
// ---------------------------------------------------------------------------
// Catalog browsing: filters sidebar (URL-driven), debounced search, sort,
// pagination, and a client-side rating refinement. Filter changes are wrapped
// in useTransition (rule (j)) so typing/sorting stays responsive. On mobile the
// sidebar moves into a drawer.
// ---------------------------------------------------------------------------

const ProductListPage = () => {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));
  const [, startTransition] = useTransition();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const { filters, apiParams, update, reset, hasActiveFilters } = useProductFilters();
  const { data, isLoading, isFetching, isError } = useProducts(apiParams);
  const { data: categories } = useCategories();

  // --- Search: local input, debounced push to the URL -----------------------
  const [searchInput, setSearchInput] = useState(filters.search);
  const searchTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Keep the input in sync when the URL search changes elsewhere (e.g. the
  // navbar search) — adjusting state during render, the React-recommended
  // alternative to a sync effect.
  const [prevUrlSearch, setPrevUrlSearch] = useState(filters.search);
  if (filters.search !== prevUrlSearch) {
    setPrevUrlSearch(filters.search);
    setSearchInput(filters.search);
  }

  const handleSearchChange = (value: string) => {
    setSearchInput(value);
    if (searchTimer.current) clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(() => {
      startTransition(() => update({ search: value }));
    }, 400);
  };

  // Rating is now filtered server-side (minRating), so the returned page IS the
  // filtered set.
  const products = useMemo(() => data?.products ?? [], [data]);
  const allProducts = products;

  // Tag suggestions from the current page (+ any already-selected tags).
  const tagSuggestions = useMemo(() => {
    const set = new Set<string>();
    allProducts.forEach((p) => p.tags.forEach((t) => set.add(t)));
    filters.tags.forEach((t) => set.add(t));
    return Array.from(set).sort().slice(0, 24);
  }, [allProducts, filters.tags]);

  const pagination = data?.pagination;
  const total = pagination?.total ?? 0;

  const handlePageChange = (page: number) => {
    startTransition(() => update({ page }));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Shared sidebar content (used by the desktop column and the mobile drawer).
  const filtersContent = (
    <ProductFilters
      filters={filters}
      update={(patch) => startTransition(() => update(patch))}
      reset={() => startTransition(() => reset())}
      hasActiveFilters={hasActiveFilters}
      categories={categories ?? []}
      tagSuggestions={tagSuggestions}
    />
  );

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 3, md: 5 } }}>
      <Typography variant="h3" sx={{ fontWeight: 800, mb: 0.5 }}>
        Shop
      </Typography>
      <Typography color="text.secondary" sx={{ mb: 3 }}>
        Browse our full catalog.
      </Typography>

      <Box sx={{ display: "flex", gap: 4, alignItems: "flex-start" }}>
        {/* Desktop sidebar */}
        {isDesktop && (
          <Box component="aside" sx={{ width: 264, flexShrink: 0, position: "sticky", top: 88 }}>
            {filtersContent}
          </Box>
        )}

        {/* Main column */}
        <Box sx={{ flex: 1, minWidth: 0 }}>
          {/* Toolbar: search + sort (+ mobile filter button) */}
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={2}
            sx={{ mb: 3, alignItems: { sm: "center" } }}
          >
            <TextField
              size="small"
              fullWidth
              placeholder="Search products…"
              value={searchInput}
              onChange={(e) => handleSearchChange(e.target.value)}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchRoundedIcon fontSize="small" />
                    </InputAdornment>
                  ),
                },
              }}
            />
            <Stack direction="row" spacing={1} sx={{ flexShrink: 0 }}>
              {!isDesktop && (
                <Button
                  variant="outlined"
                  startIcon={<TuneRoundedIcon />}
                  onClick={() => setDrawerOpen(true)}
                >
                  Filters
                </Button>
              )}
              <ProductSortSelect
                value={filters.sort}
                onChange={(sort) => startTransition(() => update({ sort }))}
              />
            </Stack>
          </Stack>

          {/* Result count + subtle fetching indicator */}
          <Box sx={{ mb: 2, minHeight: 24 }}>
            {!isLoading && !isError && (
              <Typography variant="body2" color="text.secondary">
                {products.length === 0
                  ? "No results"
                  : `Showing ${products.length} of ${total} product${total === 1 ? "" : "s"}`}
              </Typography>
            )}
            {isFetching && !isLoading && (
              <LinearProgress sx={{ mt: 1, borderRadius: 1 }} />
            )}
          </Box>

          {isError ? (
            <Alert severity="error">
              We couldn’t load products right now. Please try again later.
            </Alert>
          ) : (
            <ProductGrid
              products={products}
              isLoading={isLoading}
              skeletonCount={PAGE_SIZE}
              emptyMessage="No products match your filters."
            />
          )}

          {/* Pagination (fully server-driven, including the rating filter) */}
          {!isLoading && !isError && pagination && pagination.pages > 1 && (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
              <Pagination
                count={pagination.pages}
                page={filters.page}
                onChange={(_, page) => handlePageChange(page)}
                color="primary"
                shape="rounded"
              />
            </Box>
          )}
        </Box>
      </Box>

      {/* Mobile filter drawer */}
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        slotProps={{ paper: { sx: { width: 300, p: 2 } } }}
      >
        {filtersContent}
        <Button fullWidth variant="contained" sx={{ mt: 2 }} onClick={() => setDrawerOpen(false)}>
          Show results
        </Button>
      </Drawer>
    </Container>
  );
};

export default ProductListPage;
