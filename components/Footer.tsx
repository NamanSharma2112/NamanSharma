import React from "react";

export default function Footer() {
  return (
    <footer className="w-full h-full custom-bg flex flex-col items-center justify-center relative overflow-hidden">
      <div className="absolute bottom-8 left-8 right-8 flex flex-col md:flex-row justify-between items-center text-zinc-500 text-sm gap-4">
        <span>© {new Date().getFullYear()} Naman Sharma. All rights reserved.</span>
        <div className="flex gap-6 font-medium">
          <a href="#" className="hover:text-white transition-colors">Twitter / X</a>
          <a href="#" className="hover:text-white transition-colors">LinkedIn</a>
          <a href="#" className="hover:text-white transition-colors">GitHub</a>
        </div>
      </div>
    </footer>
  );
}
