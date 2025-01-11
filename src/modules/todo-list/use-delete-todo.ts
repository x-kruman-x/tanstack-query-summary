import { useMutation, useQueryClient } from "@tanstack/react-query";
import { nanoid } from "nanoid";
import { todoListApi } from "./api";

export function useDeleteTodo() {
  const queryClient = useQueryClient();

  const deleteTodoMutation = useMutation({
    mutationFn: todoListApi.deleteTodo,
    async onSettled() {
      // для нового запроса для обновления данных на странице
      queryClient.invalidateQueries({
        queryKey: [todoListApi.baseKey]  // при инвалидации по базовому ключу инвалиидируются все запросы с этим ключом, то есть в нашем случае вообще все запросы
      });
    },
    async onSuccess(_, deletedId) {
      // для ручного изменения кеша прии успешном удалении (принимает data - результат запроса, variables - то, что передаем в мутацию)
      // const todos = queryClient.getQueryData(todoListApi.getTodoListQueryOptions().queryKey) // получаем кеш этого запроса
      // if (todos) {
      //     queryClient.setQueryData(todoListApi.getTodoListQueryOptions().queryKey, todos.filter(item => item.id !== deletedId))  // обновляем кеш, удаляя из списка удаленный id
      // }

      queryClient.setQueryData(
        todoListApi.getTodoListQueryOptions().queryKey,
        todos => todos?.filter(item => item.id !== deletedId) //более короткий вариант
      );
    }
  });

  return {
    handleDelete: deleteTodoMutation.mutate,
    getIsPending: (id: string) =>
      deleteTodoMutation.isPending && deleteTodoMutation.variables === id //проверяет какой id удаляется
  };
}
