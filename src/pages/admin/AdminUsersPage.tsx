import { useState } from "react";
import Alert from "@mui/material/Alert";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import MenuItem from "@mui/material/MenuItem";
import Pagination from "@mui/material/Pagination";
import Paper from "@mui/material/Paper";
import Select from "@mui/material/Select";
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import { useAdminUsers, useUpdateUserRole, useDeleteUser } from "../../hooks/useAdmin";
import { useDebounce } from "../../hooks/useDebounce";
import { useAppSelector } from "../../hooks/useAppSelector";
import { selectCurrentUser } from "../../features/auth/authSlice";
import { useSnackbar } from "../../hooks/useSnackbar";
import { getErrorMessage } from "../../utils/getErrorMessage";
import type { User, UserRole } from "../../types";

// ---------------------------------------------------------------------------
// AdminUsersPage  (/admin/users)
// ---------------------------------------------------------------------------
// User list with role toggle + delete. You can't change/delete your own account
// from here; the backend also enforces its own rules (errors surface as toasts).
// ---------------------------------------------------------------------------

const PAGE_SIZE = 20;
const ROLES: UserRole[] = ["user", "moderator", "admin", "superadmin"];
const label = (r: UserRole) => r.charAt(0).toUpperCase() + r.slice(1);
const fmtDate = (iso: string) =>
  new Date(iso).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });

const AdminUsersPage = () => {
  const me = useAppSelector(selectCurrentUser);
  const [searchInput, setSearchInput] = useState("");
  const search = useDebounce(searchInput, 400);
  const [role, setRole] = useState<UserRole | "all">("all");
  const [page, setPage] = useState(1);

  const { data, isLoading, isError } = useAdminUsers({
    search: search || undefined,
    role: role === "all" ? undefined : role,
    page,
    limit: PAGE_SIZE,
  });
  const updateRole = useUpdateUserRole();
  const deleteUser = useDeleteUser();
  const { notify } = useSnackbar();

  const [deleteTarget, setDeleteTarget] = useState<User | null>(null);

  const users = data?.users ?? [];
  const pagination = data?.pagination;

  const onChangeRole = (id: string, next: UserRole) => {
    updateRole.mutate(
      { id, role: next },
      {
        onSuccess: () => notify("Role updated", "success"),
        onError: (err) => notify(getErrorMessage(err), "error"),
      },
    );
  };

  const confirmDelete = () => {
    if (!deleteTarget) return;
    deleteUser.mutate(deleteTarget._id, {
      onSuccess: () => {
        setDeleteTarget(null);
        notify("User deleted", "success");
      },
      onError: (err) => notify(getErrorMessage(err), "error"),
    });
  };

  return (
    <Box>
      <Typography variant="h4" sx={{ fontWeight: 800, mb: 3 }}>
        Users
      </Typography>

      <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ mb: 2 }}>
        <TextField
          size="small"
          placeholder="Search by name or email…"
          value={searchInput}
          onChange={(e) => {
            setSearchInput(e.target.value);
            setPage(1);
          }}
          sx={{ flex: 1 }}
        />
        <TextField
          select
          size="small"
          label="Role"
          value={role}
          onChange={(e) => {
            setRole(e.target.value as UserRole | "all");
            setPage(1);
          }}
          sx={{ minWidth: 170 }}
        >
          <MenuItem value="all">All roles</MenuItem>
          {ROLES.map((r) => (
            <MenuItem key={r} value={r}>
              {label(r)}
            </MenuItem>
          ))}
        </TextField>
      </Stack>

      {isError ? (
        <Alert severity="error">Couldn’t load users.</Alert>
      ) : (
        <Paper variant="outlined" sx={{ borderRadius: 3, overflow: "hidden" }}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>User</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Role</TableCell>
                  <TableCell>Verified</TableCell>
                  <TableCell>Joined</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {isLoading ? (
                  Array.from({ length: 6 }).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell colSpan={6}>
                        <Skeleton height={40} />
                      </TableCell>
                    </TableRow>
                  ))
                ) : users.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6}>
                      <Typography color="text.secondary" sx={{ py: 3, textAlign: "center" }}>
                        No users found.
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  users.map((user) => {
                    const isSelf = user._id === me?._id;
                    return (
                      <TableRow key={user._id} hover>
                        <TableCell>
                          <Stack direction="row" spacing={1.5} sx={{ alignItems: "center" }}>
                            <Avatar src={user.avatar?.url} alt={user.name} sx={{ width: 36, height: 36 }}>
                              {user.name.charAt(0).toUpperCase()}
                            </Avatar>
                            <Typography variant="body2" sx={{ fontWeight: 600 }}>
                              {user.name}
                              {isSelf && " (you)"}
                            </Typography>
                          </Stack>
                        </TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          <Select
                            size="small"
                            value={user.role}
                            onChange={(e) => onChangeRole(user._id, e.target.value as UserRole)}
                            disabled={isSelf || updateRole.isPending}
                            sx={{ minWidth: 130 }}
                          >
                            {ROLES.map((r) => (
                              <MenuItem key={r} value={r}>
                                {label(r)}
                              </MenuItem>
                            ))}
                          </Select>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={user.isEmailVerified ? "Verified" : "Unverified"}
                            size="small"
                            color={user.isEmailVerified ? "success" : "default"}
                            variant="outlined"
                          />
                        </TableCell>
                        <TableCell>{fmtDate(user.createdAt)}</TableCell>
                        <TableCell align="right">
                          <IconButton
                            size="small"
                            color="error"
                            disabled={isSelf}
                            onClick={() => setDeleteTarget(user)}
                            aria-label="Delete user"
                          >
                            <DeleteOutlineRoundedIcon fontSize="small" />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}

      {pagination && pagination.pages > 1 && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
          <Pagination count={pagination.pages} page={page} onChange={(_, p) => setPage(p)} color="primary" shape="rounded" />
        </Box>
      )}

      <Dialog open={Boolean(deleteTarget)} onClose={() => setDeleteTarget(null)} maxWidth="xs" fullWidth>
        <DialogTitle>Delete {deleteTarget?.name}?</DialogTitle>
        <DialogActions>
          <Button onClick={() => setDeleteTarget(null)} disabled={deleteUser.isPending}>
            Cancel
          </Button>
          <Button color="error" variant="contained" onClick={confirmDelete} loading={deleteUser.isPending}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminUsersPage;
