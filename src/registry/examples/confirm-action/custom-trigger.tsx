import { Button } from "@/components/ui/button";
import { ConfirmAction } from "@/registry/base/confirm-action/components/confirm-action";
import { Trash2Icon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const INITIAL_TASKS = [
  { id: 1, title: "Review pull request", label: "Code Review" },
  { id: 2, title: "Update dependencies", label: "Maintenance" },
  { id: 3, title: "Write release notes", label: "Docs" },
];

export function CustomTriggerConfirmAction() {
  const [tasks, setTasks] = useState(INITIAL_TASKS);

  if (tasks.length === 0) {
    return (
      <Button variant="outline" onClick={() => setTasks(INITIAL_TASKS)}>
        Reset tasks
      </Button>
    );
  }

  return (
    <div className="w-80 divide-y overflow-hidden rounded-xl border">
      {tasks.map((task) => (
        <div
          key={task.id}
          className="group flex items-center justify-between px-4 py-3"
        >
          <div className="flex flex-col gap-0.5">
            <p className="text-sm font-medium">{task.title}</p>
            <p className="text-xs text-muted-foreground">{task.label}</p>
          </div>

          <ConfirmAction
            title="Remove task?"
            description={`"${task.title}" will be permanently removed.`}
            confirmText="Remove"
            confirmVariant="destructive"
            action={async () => {
              await new Promise((r) => setTimeout(r, 800));
              setTasks((t) => t.filter((x) => x.id !== task.id));
            }}
            onSuccess={() => toast.success("Task removed")}
          >
            <Button
              variant="ghost"
              size="icon"
              className="size-7 text-muted-foreground opacity-0 transition-opacity hover:bg-destructive/10 hover:text-destructive group-hover:opacity-100"
            >
              <Trash2Icon className="size-3.5" />
            </Button>
          </ConfirmAction>
        </div>
      ))}
    </div>
  );
}
