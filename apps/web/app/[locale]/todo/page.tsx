import { TaskForm } from "./components/task-form";
import { TodoItem } from "./components/todo-item";

export default function TodoPage() {
  return (
    <div className="h-dvh light bg-brand">
      <div className="overflow-hidden">
        <div className="grid grid-cols-4 -m-px">
          <div className="space-y-2 border border-dashed p-8">
            <h2 className="text-lg font-bold text-zinc-700">nino</h2>
            <TodoItem item={{ id: "1", title: "test", completed: false }} />
            <TaskForm />
          </div>
        </div>
      </div>
    </div>
  );
}
