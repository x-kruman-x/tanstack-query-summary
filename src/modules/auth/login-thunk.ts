import { queryClient } from "../../shared/api/query-client";
import { AppThunk } from "../../shared/redux";
import { authApi } from "./api";
import {
  MutationObserver,
  useMutation,
  useMutationState
} from "@tanstack/react-query";
import { authSlice } from "./auth.slice";

export const loginThunk = (login: string, password: string): AppThunk => async (
  dispatch,
  getState
) => {
  const user = await new MutationObserver(queryClient, {
    mutationKey: ["login"],
    mutationFn: authApi.loginUser
  }).mutate({
    login,
    password
  });

  if (user) {
    dispatch(authSlice.actions.addUser({ userId: user.id }));
    // queryClient.setQueryData(authApi.getUserById(user.id).queryKey, user);
    localStorage.setItem("userId", user.id);
  }

  dispatch(authSlice.actions.setError("Пароль или логин неверные"));
};

export const useLoginLoading = () =>
  useMutation({ mutationKey: ["login"] }).isPending;
