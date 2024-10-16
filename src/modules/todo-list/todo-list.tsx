import { useInfiniteQuery } from "@tanstack/react-query";
import { todoListApi } from "./api";
import { useCallback, useRef, useState } from "react";
import { useTodoList } from "./use-todo-list";

export function TodoList() {
  const { cursor, error, isLoading, todoItems } = useTodoList();

  if (isLoading) {
    return <div>Loading</div>;
  }

  if (error) {
    return <div>error: {JSON.stringify(error)}</div>;
  }

  return (
    <div className="p-5 mx-auto max-w-[1200px] mt-10">
      <h1 className="text-3xl font-bold underline mb-5"> Todo LIst</h1>

      <div className={"flex flex-col gap-4"}>
        {todoItems?.map(todo => (
          <div className="border border-slate-300 rounded p-3" key={todo.id}>
            {todo.text}
          </div>
        ))}
      </div>
      {cursor}
    </div>
  );
}
