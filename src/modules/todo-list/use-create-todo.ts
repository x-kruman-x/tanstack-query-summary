import { useMutation, useQueryClient } from "@tanstack/react-query";
import { nanoid } from "nanoid";
import { todoListApi } from "./api";


export function useCreateTodo() {
  const queryClient = useQueryClient();

  const createTodoMutation = useMutation({
    mutationFn: todoListApi.createTodo,
    async onSettled() {
      await queryClient.invalidateQueries(todoListApi.getTodoListQueryOptions());
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
