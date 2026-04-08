"use client"
import Bookmark from "@/components/Bookmark";
import { HoldToConfirmFinal } from "@/components/Delete";
import Image from "next/image";

export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-100 font-sans dark:bg-black">
  
     <HoldToConfirmFinal
        text="Delete project"
        onConfirm={() => alert('Poof! Deleted.')}
      />
    </div>
  );
}
