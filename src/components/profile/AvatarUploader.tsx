import { useRef, type ChangeEvent } from "react";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import PhotoCameraRoundedIcon from "@mui/icons-material/PhotoCameraRounded";
import { useAppSelector } from "../../hooks/useAppSelector";
import { selectCurrentUser } from "../../features/auth/authSlice";
import { useUploadAvatar, useRemoveAvatar } from "../../hooks/useProfile";
import { useSnackbar } from "../../hooks/useSnackbar";
import { getErrorMessage } from "../../utils/getErrorMessage";

// ---------------------------------------------------------------------------
// AvatarUploader
// ---------------------------------------------------------------------------
// Shows the current avatar with upload/remove controls. Validates the file type
// and size client-side before sending (multipart) to /users/me/avatar.
// ---------------------------------------------------------------------------

const MAX_BYTES = 2 * 1024 * 1024; // 2 MB

const AvatarUploader = () => {
  const user = useAppSelector(selectCurrentUser);
  const upload = useUploadAvatar();
  const remove = useRemoveAvatar();
  const { notify } = useSnackbar();
  const inputRef = useRef<HTMLInputElement>(null);

  const onPick = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = ""; // allow re-picking the same file
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      notify("Please choose an image file", "error");
      return;
    }
    if (file.size > MAX_BYTES) {
      notify("Image must be 2 MB or smaller", "error");
      return;
    }
    upload.mutate(file, {
      onSuccess: () => notify("Avatar updated", "success"),
      onError: (err) => notify(getErrorMessage(err), "error"),
    });
  };

  const busy = upload.isPending || remove.isPending;

  return (
    <Stack direction="row" spacing={3} sx={{ alignItems: "center" }}>
      <Avatar
        src={user?.avatar?.url}
        alt={user?.name}
        sx={{ width: 88, height: 88, fontSize: 32, bgcolor: "primary.main" }}
      >
        {user?.name?.charAt(0).toUpperCase()}
      </Avatar>

      <Box>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          hidden
          onChange={onPick}
        />
        <Stack direction="row" spacing={1}>
          <Button
            variant="outlined"
            startIcon={<PhotoCameraRoundedIcon />}
            onClick={() => inputRef.current?.click()}
            loading={upload.isPending}
            disabled={busy}
          >
            {user?.avatar?.url ? "Change" : "Upload"}
          </Button>
          {user?.avatar?.url && (
            <Button
              color="error"
              onClick={() =>
                remove.mutate(undefined, {
                  onSuccess: () => notify("Avatar removed", "success"),
                  onError: (err) => notify(getErrorMessage(err), "error"),
                })
              }
              loading={remove.isPending}
              disabled={busy}
            >
              Remove
            </Button>
          )}
        </Stack>
        <Box sx={{ mt: 1, color: "text.secondary", fontSize: 13 }}>
          JPG or PNG, up to 2 MB.
        </Box>
      </Box>
    </Stack>
  );
};

export default AvatarUploader;
