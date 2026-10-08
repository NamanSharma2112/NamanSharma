import { IconChevronRight } from '@tabler/icons-react'
import { useDirection } from '@base-ui/react/direction-provider'
import { Command as CommandRoot } from '@kmenu/react'
import {
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandList,
  CommandOption,
  useCommand,
} from '@kmenu/react'
import type { CommandOption as CommandOptionType, FilterFunction } from 'kmenu'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { type ReactNode, useCallback, useEffect, useRef, useState } from 'react'

import { search } from '@/lib/command-filter'
import { cn } from '@/lib/utils'

export interface CommandMenuAction extends Omit<CommandOptionType, 'children'> {
  icon?: ReactNode
  shortcut?: Array<string>

  hint?: string

  badge?: string

  crumb?: string

  hidden?: boolean
  children?: Array<CommandMenuAction>
}

const asAction = (option: CommandOptionType<CommandMenuAction>): CommandMenuAction =>
  option as CommandMenuAction

const filterActions: FilterFunction<CommandMenuAction> = (options, query) => {
  const visible = query.trim() ? options : options.filter((option) => !asAction(option).hidden)
  return search(visible, query)
}

function replay(element: HTMLElement | null | undefined, className: string) {
  if (!element) return
  element.classList.remove(className)
  void element.offsetWidth
  element.classList.add(className)
}

function CommandOptions() {
  const { command, state } = useCommand<CommandMenuAction>()

  const position = `${String(state.currentLevel)}:${state.breadcrumbs.map((crumb) => crumb.id).join('>')}`
  const lastPosition = useRef(position)

  const query = state.input
  const topId = state.filtered[0]?.id
  useEffect(() => {
    if (topId) command?.setActiveById(topId)
  }, [command, query, topId])

  useEffect(() => {
    if (lastPosition.current === position) return
    lastPosition.current = position

    const list = document.querySelector<HTMLElement>('.command-list')
    replay(list, 'cmd-level-enter')
    replay(list?.closest<HTMLElement>('.command-dialog'), 'cmd-level-shift')
  }, [position])

  const filtered = state.filtered.map(asAction)
  const groups = [...new Set(filtered.map((action) => action.group))].filter(
    (group) => group !== undefined,
  )
  const ungrouped = filtered.filter((action) => !action.group)

  const renderOption = (action: CommandMenuAction) => (
    <CommandOption
      key={action.id ?? action.label}
      value={action}
      disabled={action.disabled}
      className="command-option"
    >
      <span className="command-option-content">
        {action.icon ? <span className="command-option-icon">{action.icon}</span> : null}
        <span className="command-option-label">{action.label}</span>
      </span>
      {action.badge ? <span className="command-option-badge">{action.badge}</span> : null}
      {action.children ? (
        <IconChevronRight className="command-option-more" />
      ) : action.shortcut ? (
        <span className="command-option-shortcut">
          {action.shortcut.map((key) => (
            <kbd key={key} className="command-shortcut-key">
              {key}
            </kbd>
          ))}
        </span>
      ) : action.hint ? (
        <span className="command-option-hint">{action.hint}</span>
      ) : null}
    </CommandOption>
  )

  if (state.currentLevel > 0) return <>{filtered.map(renderOption)}</>

  return (
    <>
      {ungrouped.map(renderOption)}
      {groups.map((group) => (
        <CommandGroup key={group} heading={<div className="command-group-heading">{group}</div>}>
          {filtered.filter((action) => action.group === group).map(renderOption)}
        </CommandGroup>
      ))}
    </>
  )
}

function Breadcrumbs({
  options,
  scope,
  onLeaveScope,
}: {
  options: Array<CommandMenuAction>
  scope?: string

  onLeaveScope: () => void
}) {
  const { command, state } = useCommand<CommandMenuAction>()
  const reduced = useReducedMotion()
  const direction = useDirection()

  const labels = new Map<string, string>()
  const walk = (actions: Array<CommandMenuAction>) => {
    for (const action of actions) {
      if (action.id) labels.set(action.id, action.crumb ?? action.label)
      if (action.children) walk(action.children)
    }
  }
  walk(options)

  const behind = direction === 'rtl' ? 8 : -8
  const hidden = reduced ? { opacity: 0 } : { opacity: 0, x: behind, filter: 'blur(4px)' }

  const backTo = (depth: number) => {
    for (let left = state.breadcrumbs.length; left > depth; left -= 1) {
      if (!command?.goBack()) break
    }
  }

  const here = state.breadcrumbs.length

  return (
    <div className="command-breadcrumbs">
      {here === 0 && !scope ? (
        <span>Home</span>
      ) : (
        <button
          type="button"
          onClick={() => {
            backTo(0)
            onLeaveScope()
          }}
        >
          Home
        </button>
      )}
      {scope ? (
        here === 0 ? (
          <span>{scope}</span>
        ) : (
          <button
            type="button"
            onClick={() => {
              backTo(0)
            }}
          >
            {scope}
          </button>
        )
      ) : null}
      <AnimatePresence initial={false}>
        {state.breadcrumbs.map(({ id, label }, index) =>
          index === here - 1 ? (
            <motion.span
              key={id}
              initial={hidden}
              animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
              exit={{ ...hidden, transition: { duration: 0.13, ease: [0.23, 1, 0.32, 1] } }}
              transition={{ duration: 0.18, ease: [0.23, 1, 0.32, 1] }}
            >
              {labels.get(id) ?? label}
            </motion.span>
          ) : (
            <motion.button
              key={id}
              type="button"
              initial={hidden}
              animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
              exit={{ ...hidden, transition: { duration: 0.13, ease: [0.23, 1, 0.32, 1] } }}
              transition={{ duration: 0.18, ease: [0.23, 1, 0.32, 1] }}
              onClick={() => {
                backTo(index + 1)
              }}
            >
              {labels.get(id) ?? label}
            </motion.button>
          ),
        )}
      </AnimatePresence>
    </div>
  )
}

function ScopeBackspace({ onLeaveScope }: { onLeaveScope: () => void }) {
  const { state } = useCommand<CommandMenuAction>()
  const depth = state.breadcrumbs.length

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Backspace' || depth > 0) return
      const target = event.target
      if (target instanceof HTMLInputElement && target.value !== '') return
      event.preventDefault()
      onLeaveScope()
    }
    window.addEventListener('keydown', onKeyDown, true)
    return () => window.removeEventListener('keydown', onKeyDown, true)
  }, [depth, onLeaveScope])

  return null
}

const OPEN_EVENT = 'kobra:open-command-menu'

export function openCommandMenu(scope?: string) {
  window.dispatchEvent(new CustomEvent(OPEN_EVENT, { detail: { scope } }))
}

declare global {
  interface WindowEventMap {
    [OPEN_EVENT]: CustomEvent<{ scope?: string }>
  }
}

const OPEN_OVERLAY =
  ':is([role="dialog"],[role="alertdialog"],[role="menu"],[role="listbox"]):is([data-open],[data-state="open"])'

export function CommandMenu({
  actions,
  scopes,
  placeholder = 'Type a command or search…',
}: {
  actions: Array<CommandMenuAction>

  scopes?: Record<
    string,
    { actions: Array<CommandMenuAction>; placeholder: string; crumb?: string }
  >
  placeholder?: string
}) {
  const [open, setOpen] = useState(false)
  const [scope, setScope] = useState<string | null>(null)
  const [isClosing, setIsClosing] = useState(false)
  const [ready, setReady] = useState(false)
  const [sized, setSized] = useState(false)
  const overlayRef = useRef<HTMLDivElement>(null)
  const dialogRef = useRef<HTMLDivElement>(null)
  const sizerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const dialog = dialogRef.current
    const sizer = sizerRef.current
    if (!open || !dialog || !sizer) {
      setSized(false)
      return
    }

    const style = getComputedStyle(dialog)

    const chrome =
      Number.parseFloat(style.borderTopWidth) + Number.parseFloat(style.borderBottomWidth)

    let measured = false
    const observer = new ResizeObserver(([entry]) => {
      const box = entry?.borderBoxSize?.[0]
      if (!box) return

      dialog.style.height = `${box.blockSize + chrome}px`

      if (measured) return
      measured = true
      requestAnimationFrame(() => setSized(true))
    })

    observer.observe(sizer)
    return () => {
      observer.disconnect()
      dialog.style.removeProperty('height')
    }
  }, [open])

  useEffect(() => {
    if (!open) {
      setReady(false)
      return
    }

    const timeout = window.setTimeout(() => setReady(true), 180)
    return () => window.clearTimeout(timeout)
  }, [open])

  const leaveScope = useCallback(() => {
    setScope(null)
  }, [])

  const handleClose = useCallback(() => {
    if (isClosing) return

    setIsClosing(true)
    overlayRef.current?.classList.add('closing')
    dialogRef.current?.classList.add('closing')

    window.setTimeout(() => {
      setOpen(false)
      setIsClosing(false)
      overlayRef.current?.classList.remove('closing')
      dialogRef.current?.classList.remove('closing')
    }, 180)
  }, [isClosing])

  const openMenu = useCallback((next: string | null = null) => {
    setScope(next)

    const overlay = document.querySelector(OPEN_OVERLAY)
    if (!overlay) {
      setOpen(true)
      return
    }

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }))

    const start = performance.now()
    const openWhenGone = () => {
      if (!overlay.isConnected || performance.now() - start > 500) setOpen(true)
      else requestAnimationFrame(openWhenGone)
    }
    requestAnimationFrame(openWhenGone)
  }, [])

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault()
        if (open) setOpen(false)
        else openMenu()
      } else if (event.key === 'Escape' && open && !isClosing) {
        event.preventDefault()
        handleClose()
      }
    }

    const onOpen = (event: WindowEventMap[typeof OPEN_EVENT]) =>
      openMenu(event.detail?.scope ?? null)

    window.addEventListener('keydown', onKeyDown)
    window.addEventListener(OPEN_EVENT, onOpen)
    return () => {
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener(OPEN_EVENT, onOpen)
    }
  }, [handleClose, isClosing, open, openMenu])

  if (!open) return null

  const scoped = scope ? scopes?.[scope] : undefined
  const options = scoped?.actions ?? actions

  return (
    <div ref={overlayRef} className="command-overlay" role="dialog" aria-modal="true">
      <button
        type="button"
        aria-label="Close command menu"
        className="command-backdrop"
        onClick={() => !isClosing && handleClose()}
      />

      <div
        ref={dialogRef}
        className={cn('command-dialog', ready && 'cmd-ready', sized && 'cmd-sized')}
      >

        <div ref={sizerRef}>
          <CommandRoot
            open={open}
            onOpenChange={() => undefined}
            options={options}
            filter={filterActions}
            onSelect={handleClose}
            className="command-root"
          >
            <ScopeBackspace onLeaveScope={leaveScope} />

            <div className="command-header">
              <CommandInput
                placeholder={scoped?.placeholder ?? placeholder}
                className="command-input"
              />
              <button type="button" onClick={handleClose}>
                Esc
              </button>
            </div>
            <Breadcrumbs options={options} scope={scoped?.crumb} onLeaveScope={leaveScope} />
            <CommandList className="command-list" indicatorOffsetY={-8}>
              <CommandEmpty className="command-empty">No results found.</CommandEmpty>
              <CommandOptions />
            </CommandList>
          </CommandRoot>
        </div>
      </div>
    </div>
  )
}
