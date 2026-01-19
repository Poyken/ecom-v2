"use client";

import { useTransition } from "react";

export default function DeleteButton({ id, action, label = "Delete" }: { id: string, action: (id: string) => Promise<any>, label?: string }) {
  const [isPending, startTransition] = useTransition();

  return (
    <button 
      disabled={isPending}
      onClick={() => {
        if (confirm(`Are you sure you want to delete this ${label.toLowerCase()}?`)) {
          startTransition(async () => {
            const result = await action(id);
            if (result.error) alert(result.error);
          });
        }
      }}
      className="text-zinc-400 hover:text-red-500 transition-colors disabled:opacity-50"
    >
      {isPending ? 'Deleting...' : label}
    </button>
  );
}
