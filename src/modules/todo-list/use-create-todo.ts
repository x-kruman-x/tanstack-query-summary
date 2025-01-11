import { useMutation, useQueryClient } from "@tanstack/react-query";
import { nanoid } from "nanoid";
import { todoListApi } from "./api";


export function useCreateTodo() {
  const queryClient = useQueryClient();

  const createTodoMutation = useMutation({
    mutationFn: todoListApi.createTodo,
    // onSuccess срабатывает при успехе
    // onError срабатывает при ошибке
    async onSettled() { // срабатывает всегда 
      // await queryClient.invalidateQueries(todoListApi.getTodoListQueryOptions()); // invalidateQueries помечает все запросы, которые подходят по ключу // если закинуть getTodoListQueryOptions(), то перезапросит только этот запрос
      await queryClient.invalidateQueries({
        queryKey: [todoListApi.baseKey] 
      }); // при инвалидации по базовому ключу инвалиидируются все запросы с этим ключом, то есть в нашем случае вообще все запросы
    }
  });

  const handleCreate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const text = String(formData.get("text") ?? "");

    createTodoMutation.mutate({
      id: nanoid(),
      done: false,
      text: text,
      userId: "1"
    });

    e.currentTarget.reset();
  };

  return {
    handleCreate,
    isPending: createTodoMutation.isPending 
  };
}
