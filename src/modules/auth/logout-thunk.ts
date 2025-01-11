import { queryClient } from "../../shared/api/query-client";
import { AppThunk } from "../../shared/redux";
import {
  useMutation,
} from "@tanstack/react-query";
import { authSlice } from "./auth.slice";

export const logoutThunk = (): AppThunk => async (dispatch, getState) => {
  dispatch(authSlice.actions.removeUser());
  queryClient.removeQueries(); // удаляет все запросы из кеша. Лучше всего при логауте
//   queryClient.resetQueries; // приводит текущие запросы к начальному состоянию
  localStorage.removeItem("userId");
};
