"use client";

import { useEffect, useMemo, useState } from "react";
import { getTodos } from "./data";
import { Todo } from "./type";
import { useQueryState } from "nuqs";

export function TodoList() {
  const [todos, setTodos] = useState<Todo[] | null>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search] = useQueryState("q", {
    defaultValue: "",
  });

  useEffect(() => {
    getTodos().then((todos) => {
      setTodos(todos);
      setIsLoading(false);
    });
  }, []);

  const filteredTodos = useMemo(() => {
    return todos?.filter((todo) => todo.title.includes(search));
  }, [todos, search]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <ul>
      {filteredTodos?.map((todo) => (
        <li key={todo.id}>
          {todo.id}_{todo.title}
        </li>
      ))}
    </ul>
  );
}
