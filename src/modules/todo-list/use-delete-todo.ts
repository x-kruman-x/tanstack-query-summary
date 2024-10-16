import { useMutation, useQueryClient } from "@tanstack/react-query";
import { todoListApi } from "./api";
import { useSuspenceUser } from "../auth/use-user";

export function useDeleteTodo() {
  const queryClient = useQueryClient();

  const user = useSuspenceUser();

  const deleteTodoMutation = useMutation({
    mutationFn: todoListApi.deleteTodo,
    async onSettled() {
      queryClient.invalidateQueries({
        queryKey: [todoListApi.baseKey]
      });
    },
    async onSuccess(_, deletedId) {
      queryClient.setQueryData(
        todoListApi.getTodoListQueryOptions({ userId: user.data.id }).queryKey,
        todos => todos?.filter(item => item.id !== deletedId)
      );
    }
  });
  deleteTodoMutation.variables;
  return {
    handleDelete: deleteTodoMutation.mutate,
    getIsPending: (id: string) =>
      deleteTodoMutation.isPending && deleteTodoMutation.variables === id
  };
}
