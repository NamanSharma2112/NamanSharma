"use client"

import * as React from "react"
import { Command as CommandPrimitive } from "cmdk"

import { cn } from "@/lib/utils"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  InputGroup,
  InputGroupAddon,
} from "@/components/ui/input-group"
import { SearchIcon } from "lucide-react"

function Command({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive>) {
  return (
    <CommandPrimitive
      data-slot="command"
      className={cn(
        "flex size-full flex-col overflow-hidden rounded-xl! bg-transparent p-1 text-zinc-900 dark:text-zinc-100",
        className
      )}
      {...props}
    />
  )
}

function CommandDialog({
  title = "Command Palette",
  description = "Search for a command to run...",
  children,
  className,
  showCloseButton = false,
  ...props
}: React.ComponentProps<typeof Dialog> & {
  title?: string
  description?: string
  className?: string
  showCloseButton?: boolean
}) {
  return (
    <Dialog {...props}>
      <DialogHeader className="sr-only">
        <DialogTitle>{title}</DialogTitle>
        <DialogDescription>{description}</DialogDescription>
      </DialogHeader>
      <DialogContent
        className={cn(
          // Centred, and carrying one edge rather than a border and a ring.
          "overflow-hidden rounded-xl! p-0 bg-white/95 dark:bg-[#111110]/95 backdrop-blur-xl shadow-2xl border-0 ring-1 ring-black/10 dark:ring-white/10",
          "data-open:animate-none data-closed:animate-none data-[state=open]:cmk-animate-in data-[state=closed]:cmk-animate-out",
          className
        )}
        showCloseButton={showCloseButton}
        onOpenAutoFocus={(event) => {
          // Left alone, the dialog focuses the first button — the theme
          // toggle — which then opens wearing a focus ring. cmdk's root owns
          // the arrow-key handling and is already focusable, so parking focus
          // there keeps the keyboard working with nothing highlighted.
          event.preventDefault()
          document.querySelector<HTMLElement>("[cmdk-root]")?.focus()
        }}
      >
        <Command className="p-0 outline-none">{children}</Command>
      </DialogContent>
    </Dialog>
  )
}

function CommandInput({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.Input>) {
  return (
    <div data-slot="command-input-wrapper" className="p-1 pb-0">
      <InputGroup className="h-8! rounded-lg! border-zinc-200/50 dark:border-zinc-800/50 bg-zinc-100/50 dark:bg-zinc-900/50 shadow-none! *:data-[slot=input-group-addon]:pl-2!">
        <CommandPrimitive.Input
          data-slot="command-input"
          className={cn(
            "w-full text-sm outline-hidden disabled:cursor-not-allowed disabled:opacity-50 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-500 dark:placeholder:text-zinc-400 bg-transparent",
            className
          )}
          {...props}
        />
        <InputGroupAddon>
          <SearchIcon className="size-4 shrink-0 opacity-50 text-zinc-500 dark:text-zinc-400" />
        </InputGroupAddon>
      </InputGroup>
    </div>
  )
}

function CommandList({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.List>) {
  return (
    <CommandPrimitive.List
      data-slot="command-list"
      className={cn(
        "no-scrollbar max-h-72 scroll-py-1 overflow-x-hidden overflow-y-auto outline-none",
        className
      )}
      {...props}
    />
  )
}

function CommandEmpty({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.Empty>) {
  return (
    <CommandPrimitive.Empty
      data-slot="command-empty"
      className={cn("py-6 text-center text-sm", className)}
      {...props}
    />
  )
}

function CommandGroup({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.Group>) {
  return (
    <CommandPrimitive.Group
      data-slot="command-group"
      className={cn(
        "overflow-hidden **:[[cmdk-group-heading]]:px-3 **:[[cmdk-group-heading]]:pt-1 **:[[cmdk-group-heading]]:pb-1.5 **:[[cmdk-group-heading]]:text-[12px] **:[[cmdk-group-heading]]:font-medium **:[[cmdk-group-heading]]:text-zinc-500 dark:**:[[cmdk-group-heading]]:text-zinc-400",
        className
      )}
      {...props}
    />
  )
}

function CommandSeparator({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.Separator>) {
  return (
    <CommandPrimitive.Separator
      data-slot="command-separator"
      className={cn("h-px w-full bg-black/10 dark:bg-white/10", className)}
      {...props}
    />
  )
}

function CommandItem({
  className,
  children,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.Item>) {
  return (
    <CommandPrimitive.Item
      data-slot="command-item"
      className={cn(
        "group/command-item relative flex cursor-default select-none items-center outline-hidden data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50 data-[selected=true]:bg-black/[0.055] dark:data-[selected=true]:bg-white/[0.07] data-[selected=true]:text-zinc-900 dark:data-[selected=true]:text-white [&_svg]:pointer-events-none [&_svg]:shrink-0",
        className
      )}
      {...props}
    >
      {children}
    </CommandPrimitive.Item>
  )
}

function CommandShortcut({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="command-shortcut"
      className={cn(
        "ml-auto text-xs tracking-widest text-muted-foreground group-data-selected/command-item:text-foreground",
        className
      )}
      {...props}
    />
  )
}

export {
  Command,
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandShortcut,
  CommandSeparator,
}
