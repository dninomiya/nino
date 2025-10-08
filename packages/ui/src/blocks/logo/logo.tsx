"use client";

import img from "./logo.jpg";
import Image from "next/image";
import { APP_NAME } from "@workspace/lib/constants";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu";
import Link from "next/link";
import { Download } from "lucide-react";
import { useState } from "react";

export const Logo = ({
  width = 40,
  height = 40,
}: {
  width?: number;
  height?: number;
}) => {
  const [open, setOpen] = useState(false);

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <div className="relative w-fit overflow-hidden rounded-full">
        <DropdownMenuTrigger className="absolute inset-0" disabled />
        <Link
          href="/about"
          className="relative"
          onContextMenu={(e) => {
            e.preventDefault();
            setOpen(true);
          }}
        >
          <Image src={img} alt={APP_NAME} width={width} height={height} />
        </Link>
      </div>
      <DropdownMenuContent>
        <DropdownMenuItem asChild>
          <a href="/brandkit.zip" download>
            <Download />
            ブランドキットを取得
          </a>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
