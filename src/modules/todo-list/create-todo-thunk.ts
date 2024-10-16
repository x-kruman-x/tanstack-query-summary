import { queryClient } from "../../shared/api/query-client";
import { AppThunk } from "../../shared/redux";
import { MutationObserver, useMutation } from "@tanstack/react-query";
import { TodoDto, todoListApi } from "./api";
import { nanoid } from "nanoid";
import { authSlice } from "../auth/auth.slice";
import { authApi } from "../auth/api";

export const createTodoThunk = (text: string): AppThunk => async (
  dispatch,
  getState
) => {
  const userId = authSlice.selectors.userId(getState());

  if (!userId) {
    throw new Error("user not login");
  }

  const user = await queryClient.fetchQuery(authApi.getUserById(userId));

  const newTodo: TodoDto = {
    id: nanoid(),
    done: false,
    text: `${text}. Owner: ${user.login}`,
    userId
  };

  queryClient.cancelQueries({
    queryKey: [todoListApi.baseKey]
  });

  const prevTasks = queryClient.getQueryData(
    todoListApi.getTodoListQueryOptions({ userId }).queryKey
  );

  queryClient.setQueryData(
    todoListApi.getTodoListQueryOptions({ userId }).queryKey,
    tasks => [...(tasks ?? []), newTodo]
  );

  try {
    await new MutationObserver(queryClient, {
      mutationFn: todoListApi.createTodo
    }).mutate(newTodo);
  } catch (e) {
    queryClient.setQueryData(
      todoListApi.getTodoListQueryOptions({ userId }).queryKey,
      prevTasks
    );
  } finally {
    queryClient.invalidateQueries({
      queryKey: [todoListApi.baseKey]
    });
  }
};

export const useCreateLoading = () =>
  useMutation({
    mutationKey: ["create-todo"]
  }).isPending;
