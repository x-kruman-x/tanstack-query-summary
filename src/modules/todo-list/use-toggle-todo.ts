import { useMutation, useQueryClient } from "@tanstack/react-query";
import { todoListApi } from "./api";

export function useToggleTodo() {
  const queryClient = useQueryClient();

  const updateTodoMutation = useMutation({
    mutationFn: todoListApi.updateTodo,
    // модиифицируем кеш
    onMutate: async newTodo => {
      // сюда передаётся variables
      // отменяем запрос в туду, чтоюы когда мы что-то изменили, то запрос, нам не изменил обратно
      await queryClient.cancelQueries({
        queryKey: [todoListApi.baseKey]
      });


      // взяли данные из кеша на текущий момент
      const previousTodos = queryClient.getQueryData(
        todoListApi.getTodoListQueryOptions().queryKey //если есть страницы, фильтры, пагинации и тд, то прокидываем
      );


      // Optimistically update to the new value
      // обновили данные, сделали новым значением, поменяли кеш
      queryClient.setQueryData(
        todoListApi.getTodoListQueryOptions().queryKey,
        old =>
          old?.map(todo =>
            todo.id === newTodo.id ? { ...todo, ...newTodo } : todo     // обновляем значение
          )
      );

      // предыдущие тудушки передали в контекст
      return { previousTodos };
    },
    // If the mutation fails,
    // use the context returned from onMutate to roll back
    // при ошибке пропихиваем в кеш обратно прошлое значение из контекста
    onError: (_, __, context) => {
      if (context) {
        queryClient.setQueryData(todoListApi.getTodoListQueryOptions().queryKey, context.previousTodos);  // если контекст, то откатываем назад 
      }
    },
    // Always refetch after error or success:
    // инвалидируем наши тудушки (делаем новый запрос)
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: [todoListApi.baseKey] // при инвалидации по базовому ключу инвалиидируются все запросы с этим ключом, то есть в нашем случае вообще все запросы
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
