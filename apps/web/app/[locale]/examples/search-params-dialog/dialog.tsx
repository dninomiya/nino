"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useQueryState } from "nuqs";
import { useEffect, useState } from "react";

export function SearchParamsDialog() {
  const [id, setId] = useQueryState("id");
  const [title, setTitle] = useState<string | null>(null);

  useEffect(() => {
    if (id !== null) {
      setTitle(id);
    }
  }, [id]);

  return (
    <Dialog open={id !== null} onOpenChange={() => setId(null)}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">閉じる</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
