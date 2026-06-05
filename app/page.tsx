import Profile from "@/components/Profile";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Naman Sharma",
  description:
    "Naman Sharma is a Design Engineer building modern web experiences.",
};

export default function Home() {
  return <Profile />;
}
