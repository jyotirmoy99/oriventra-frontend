import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { alpha, styled } from "@mui/material/styles";
import InputBase from "@mui/material/InputBase";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import { productsSearchPath } from "../../routes/paths";

// ---------------------------------------------------------------------------
// SearchBar
// ---------------------------------------------------------------------------
// Controlled search field. On submit it navigates to the product listing with
// a `search` query param (Feature 5 reads it). Live/typeahead search will reuse
// the shared `useDebounce` hook there; here we keep it submit-driven so the
// Navbar stays lightweight.
// ---------------------------------------------------------------------------

// Rounded, theme-aware search container (subtle tinted background).
const SearchRoot = styled("form")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(1),
  width: "100%",
  borderRadius: 999,
  paddingInline: theme.spacing(2),
  height: 42,
  backgroundColor: alpha(theme.palette.text.primary, 0.05),
  border: `1px solid ${theme.palette.divider}`,
  transition: theme.transitions.create(["border-color", "background-color"]),
  "&:focus-within": {
    borderColor: theme.palette.primary.main,
    backgroundColor: alpha(theme.palette.primary.main, 0.06),
  },
}));

interface SearchBarProps {
  /** Called after a successful submit (e.g. close the mobile drawer). */
  onSubmitted?: () => void;
  autoFocus?: boolean;
}

const SearchBar = ({ onSubmitted, autoFocus }: SearchBarProps) => {
  const [term, setTerm] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    navigate(productsSearchPath(term));
    onSubmitted?.();
  };

  return (
    <SearchRoot onSubmit={handleSubmit} role="search">
      <SearchRoundedIcon fontSize="small" sx={{ color: "text.secondary" }} />
      <InputBase
        value={term}
        onChange={(e) => setTerm(e.target.value)}
        placeholder="Search products…"
        autoFocus={autoFocus}
        inputProps={{ "aria-label": "Search products" }}
        sx={{ flex: 1, fontSize: 14 }}
      />
    </SearchRoot>
  );
};

export default SearchBar;
