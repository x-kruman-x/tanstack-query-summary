import { useQuery } from "@tanstack/react-query";
import { authApi } from "./api";
import { authSlice } from "./auth.slice";
import { useSelector } from "react-redux";

export function useUser() {
  const userId = useSelector(authSlice.selectors.userId);
  return useQuery({
    ...authApi.getUserById(userId!),
    enabled: Boolean(userId)
  });
}
