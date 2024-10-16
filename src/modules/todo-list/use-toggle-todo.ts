import { useMutation, useQueryClient } from "@tanstack/react-query";
import { todoListApi } from "./api";
import { useSuspenceUser } from "../auth/use-user";

export function useToggleTodo() {
  const user = useSuspenceUser();
  const queryClient = useQueryClient();

  const updateTodoMutation = useMutation({
    mutationFn: todoListApi.updateTodo,
    onMutate: async newTodo => {
      await queryClient.cancelQueries({
        queryKey: [todoListApi.baseKey]
      });

      const previousTodos = queryClient.getQueryData(
        todoListApi.getTodoListQueryOptions({ userId: user.data.id }).queryKey
      );

      queryClient.setQueryData(
        todoListApi.getTodoListQueryOptions({ userId: user.data.id }).queryKey,
        old =>
          old?.map(todo =>
            todo.id === newTodo.id ? { ...todo, ...newTodo } : todo
          )
      );

      return { previousTodos };
    },

    onError: (_, __, context) => {
      if (context) {
        queryClient.setQueryData(
          todoListApi.getTodoListQueryOptions({ userId: user.data.id })
            .queryKey,
          context.previousTodos
        );
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: [todoListApi.baseKey]
      });
    }
  });

  const toggleTodo = (id: string, done: boolean) => {
    updateTodoMutation.mutate({
      id,
      done: !done
    });
  };

  return {
    toggleTodo
  };
}
