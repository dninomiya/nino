"use client";

import { fetchFeedItems } from "@/actions";
import { toast } from "sonner";

export function FetchFeedButton() {
  return (
    <button
      onClick={() => {
        fetchFeedItems().then(() => {
          toast.success("Feed fetched successfully");
        });
      }}
    >
      Fetch Feed
    </button>
  );
}
