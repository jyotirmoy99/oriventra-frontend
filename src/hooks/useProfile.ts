import { useMutation } from "@tanstack/react-query";
import { useAppDispatch } from "./useAppDispatch";
import { setUser } from "../features/auth/authSlice";
import * as userService from "../services/user.service";
import type { ProfileInput } from "../services/user.service";

// ---------------------------------------------------------------------------
// Profile mutations
// ---------------------------------------------------------------------------
// Each returns the updated user and syncs it into the Redux auth slice (the
// single source of truth for the signed-in user across the app).
// ---------------------------------------------------------------------------

export function useUpdateProfile() {
  const dispatch = useAppDispatch();
  return useMutation({
    mutationFn: (payload: ProfileInput) => userService.updateProfile(payload),
    onSuccess: (user) => dispatch(setUser(user)),
  });
}

export function useUploadAvatar() {
  const dispatch = useAppDispatch();
  return useMutation({
    mutationFn: (file: File) => userService.uploadAvatar(file),
    onSuccess: (user) => dispatch(setUser(user)),
  });
}

export function useRemoveAvatar() {
  const dispatch = useAppDispatch();
  return useMutation({
    mutationFn: () => userService.removeAvatar(),
    onSuccess: (user) => dispatch(setUser(user)),
  });
}
