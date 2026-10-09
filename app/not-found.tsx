import type { Metadata } from "next";
import Lost from "@/components/home/Lost";

export const metadata: Metadata = {
  title: "404 — Naman Sharma",
  description: "That address does not go anywhere.",
};

export default function NotFound() {
  return <Lost />;
}
