import { useTodoList } from "./use-todo-list";
import { useCreateTodo } from "./use-create-todo";
import { useDeleteTodo } from "./use-delete-todo";
import { useToggleTodo } from "./use-toggle-todo";
import { useUser } from "../auth/use-user";

export function TodoList() {
  const { error, isLoading, todoItems } = useTodoList();
  
  const userQuery = useUser();

  // console.log(userQuery.data?.)
  const createTodo = useCreateTodo();
  const deleteTodo = useDeleteTodo();
  const { toggleTodo } = useToggleTodo();

  if (isLoading) {
    return <div>Loading</div>;
  }

  if (error) {
    return <div>error: {JSON.stringify(error)}</div>;
  }

  return (
    <div className="p-5 mx-auto max-w-[1200px] mt-10">
      <h1 className="text-3xl font-bold underline mb-5"> Todo List. </h1>

      <form className="flex gap-2 mb-5" onSubmit={createTodo.handleCreate}>
        <input
          className="rounded p-2 border border-teal-500"
          type="text"
          name="text"
        />
        <button
          disabled={createTodo.isPending}
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
              className="text-rose-500 text-bold font-bold disabled:text-rose-300"
            >
              Удалить
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
