import { useInfiniteQuery } from "@tanstack/react-query";
import { todoListApi } from "./api";

import { useRef, useCallback } from "react";
export function useTodoList() {
  const {
    data: todoItems,
    error,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage
  } = useInfiniteQuery({
    ...todoListApi.getTodoListInfinityQueryOptions()
  });

  const cursorRef = useIntersection(() => {
    fetchNextPage();
  });

  const cursor = (
    <div className="flex gap-2 mt-4" ref={cursorRef}>
      {!hasNextPage && <div>Нет данных для загрузки </div>}
      {isFetchingNextPage && <div>...Loading</div>}
    </div>
  );

  return { error, todoItems, isLoading, cursor };
}

export function useIntersection(onIntersect: () => void) {
  const unsubscribe = useRef(() => {});

  return useCallback((el: HTMLDivElement | null) => {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(intersection => {
        if (intersection.isIntersecting) {
          onIntersect();
        }
      });
    });

    if (el) {
      observer.observe(el);
      unsubscribe.current = () => observer.disconnect();
    } else {
      unsubscribe.current();
    }
  }, []);
}
