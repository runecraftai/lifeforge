import { useEffect, useId, useRef } from 'react'
import { createPortal } from 'react-dom'

import { Box, Flex } from '@/components/primitives'
import { Transition } from '@/components/primitives/Transition'

import * as styles from './ModalWrapper.css'

const focusableSelector = [
  'a[href]',
  'area[href]',
  'button:not([disabled])',
  'input:not([disabled]):not([type="hidden"])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  'iframe',
  'object',
  'embed',
  '[contenteditable]',
  '[tabindex]:not([tabindex="-1"])'
].join(',')

function getFocusableElements(element: HTMLElement) {
  return Array.from(
    element.querySelectorAll<HTMLElement>(focusableSelector)
  ).filter(item => item.offsetParent !== null)
}

export function ModalWrapper({
  isOpen,
  isTopmost = true,
  children,
  className,
  modalRef,
  zIndex = 0,
  onClose,
  onExited
}: {
  isOpen: boolean
  isTopmost?: boolean
  children: React.ReactNode
  minWidth?: string
  minHeight?: string
  maxWidth?: string
  className?: string
  modalRef?: React.RefObject<HTMLDivElement | null>
  zIndex?: number
  onClose?: () => void
  onExited?: () => void
}) {
  const dialogRef = useRef<HTMLDivElement>(null)

  const previousActiveElement = useRef<HTMLElement | null>(
    document.activeElement instanceof HTMLElement
      ? document.activeElement
      : null
  )
  const titleId = `modal-title-${useId().replaceAll(':', '')}`

  useEffect(
    () => () => {
      previousActiveElement.current?.focus()
    },
    []
  )

  useEffect(() => {
    const dialog = dialogRef.current

    if (!dialog) return

    const heading = dialog.querySelector<HTMLElement>('h1, h2, h3, h4, h5, h6')

    if (heading) {
      heading.id ||= titleId
      dialog.setAttribute('aria-labelledby', heading.id)
      dialog.removeAttribute('aria-label')
    } else {
      dialog.setAttribute('aria-label', 'Dialog')
    }

    if (isOpen && !dialog.contains(document.activeElement)) {
      const firstFocusableElement = getFocusableElements(dialog)[0]
      ;(firstFocusableElement ?? dialog).focus()
    }
  }, [isOpen, titleId])

  function handleKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    if (event.key === 'Escape') {
      event.preventDefault()
      onClose?.()

      return
    }

    if (event.key !== 'Tab') return

    const dialog = dialogRef.current

    if (!dialog) return

    const focusableElements = getFocusableElements(dialog)

    if (focusableElements.length === 0) {
      event.preventDefault()
      dialog.focus()

      return
    }

    const firstFocusableElement = focusableElements[0]
    const lastFocusableElement = focusableElements.at(-1)

    if (
      event.shiftKey &&
      (document.activeElement === firstFocusableElement ||
        document.activeElement === dialog)
    ) {
      event.preventDefault()
      lastFocusableElement?.focus()
    } else if (
      !event.shiftKey &&
      (document.activeElement === lastFocusableElement ||
        !dialog.contains(document.activeElement))
    ) {
      event.preventDefault()
      firstFocusableElement.focus()
    }
  }

  return createPortal(
    <Transition
      property={
        isOpen
          ? { property: 'opacity', duration: '200ms', easing: 'ease-out' }
          : [
              {
                property: 'z-index',
                duration: '0.1s',
                easing: 'linear',
                delay: '0.2s'
              },
              { property: 'opacity', duration: '0.2s', easing: 'ease-out' }
            ]
      }
    >
      <Box
        ref={modalRef}
        className={styles.overlay({ topmost: isTopmost })}
        height="100dvh"
        left="0"
        minWidth="0"
        position="fixed"
        style={{
          overscrollBehavior: 'contain',
          opacity: Number(isOpen)
        }}
        top="0"
        width="100%"
        zIndex={isOpen ? zIndex.toString() : '-1'}
        onTransitionEnd={onExited}
      >
        <Transition easing="ease-out" property="transform">
          <Flex
            ref={dialogRef}
            aria-modal="true"
            bg={{ base: 'bg-50', dark: 'bg-900' }}
            className={className}
            direction="column"
            left="50%"
            maxHeight="calc(100dvh - 8rem)"
            maxWidth={{
              base: 'calc(100vw - 4rem)',
              sm: 'calc(100vw - 8rem)'
            }}
            minWidth="0"
            overflowX="hidden"
            overflowY="auto"
            p="lg"
            position="absolute"
            r="xl"
            role="dialog"
            style={{
              transform: `translate(-50%, -50%) scale(${!isOpen ? '0.9' : isTopmost ? '1' : '0.95'})`,
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
              willChange: 'transform'
            }}
            tabIndex={-1}
            top="50%"
            width={{
              lg: 'auto',
              base: '100%'
            }}
            onKeyDown={handleKeyDown}
          >
            {children}
          </Flex>
        </Transition>
      </Box>
    </Transition>,
    document.getElementById('app') || document.body
  )
}
