import { useTodoList } from "./use-todo-list";
import { useCreateTodo } from "./use-create-todo";
import { useDeleteTodo } from "./use-delete-todo";
import { useToggleTodo } from "./use-toggle-todo";
import { useSuspenceUser, useUser } from "../auth/use-user";
import { todoListApi } from "./api";
import { useSuspenseQuery } from "@tanstack/react-query";

export function TodoList() {
  useSuspenseQuery({
    ...todoListApi.getTodoListQueryOptions({ userId: "3" })
  });
  useSuspenseQuery({
    ...todoListApi.getTodoListQueryOptions({ userId: "2" })
  });

  const { todoItems } = useTodoList();
  const { data: user } = useSuspenceUser();
  const createTodo = useCreateTodo();
  const deleteTodo = useDeleteTodo();
  const { toggleTodo } = useToggleTodo();

  return (
    <div className="p-5 mx-auto max-w-[1200px] mt-10">
      <h1 className="text-3xl font-bold underline mb-5">
        {" "}
        Todo LIst. {user.login}
      </h1>

      <form className="flex gap-2 mb-5" onSubmit={createTodo.handleCreate}>
        <input
          className="rounded p-2 border border-teal-500"
          type="text"
          name="text"
        />
        <button
          disabled={createTodo.isLoading}
          className="rounded p-2 border border-teal-500 disabled:opacity-50"
        >
          Создать
        </button>
      </form>
      <div className={"flex flex-col gap-4"}>
        {todoItems?.map(todo => (
          <div
            className="border border-slate-300 rounded p-3 flex justify-between"
            key={todo.id}
          >
            <input
              type="checkbox"
              checked={todo.done}
              onChange={() => toggleTodo(todo.id, todo.done)}
            />

            {todo.text}

            <button
              disabled={deleteTodo.getIsPending(todo.id)}
              onClick={() => deleteTodo.handleDelete(todo.id)}
              className="text-rose-500 font-bold disabled:text-rose-300"
            >
              Удалить
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
