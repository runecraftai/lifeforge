import { Icon as IconifyIcon } from '@iconify/react'
import _ from 'lodash'

import { useModuleMetadata } from '@lifeforge/federation'
import { useModuleTranslation } from '@lifeforge/localization'

import { useMainSidebarState } from '../../../providers'

function getTKeys(
  namespace: string | undefined,
  title: string,
  target: string
) {
  const withPrefix = (middle: string) => [
    `${middle}${_.camelCase(title)}.${target}`,
    `${middle}${title}.${target}`,
    ...(namespace
      ? [
          `${namespace}:${middle}${_.camelCase(title)}.${target}`,
          `${namespace}:${middle}${title}.${target}`
        ]
      : [])
  ]

  return [
    ...withPrefix('subsections.'),
    ...withPrefix(''),
    `common.${title}:${target}`,
    target
  ]
}

export interface ModuleHeaderTailwindProps {
  /** Optional Iconify icon name. */
  icon?: string
  /** Optional title override for the module metadata. */
  title?: string
  /** Content rendered in the right-hand action area. */
  trailing?: React.ReactNode
  /** Translation namespace, or false to render the title directly. */
  namespace?: string | false
}

export function ModuleHeaderTailwind({
  icon,
  title,
  trailing,
  namespace
}: ModuleHeaderTailwindProps) {
  const { title: innerTitle, icon: innerIcon } = useModuleMetadata()

  const resolvedTitle = title ?? innerTitle
  const resolvedIcon = icon ?? innerIcon
  const titleText = resolvedTitle?.toString() ?? ''

  const { t } = useModuleTranslation(
    namespace === false ? [] : [`common.${titleText}`, namespace ?? '']
  )

  const { toggleSidebar, sidebarExpanded } = useMainSidebarState()

  const translatedTitle =
    namespace === false ? titleText : t(getTKeys(namespace, titleText, 'title'))
  const translatedDescription =
    namespace === false
      ? `Description for ${titleText}`
      : t(getTKeys(namespace, titleText, 'description'))

  return (
    <header className="mb-6 flex w-full min-w-0 items-center justify-between gap-8">
      <div className="flex min-w-0 w-full items-center gap-4">
        {!sidebarExpanded && (
          <button
            aria-label="Open navigation"
            className="block shrink-0 rounded-lg p-4 text-muted hover:bg-lf-bg-100 sm:hidden"
            type="button"
            onClick={toggleSidebar}
          >
            <IconifyIcon aria-hidden="true" icon="tabler:menu" />
          </button>
        )}
        {resolvedIcon !== undefined && (
          <div className="flex h-[3.5em] w-[3.5em] shrink-0 items-center justify-center rounded-lg bg-primary/20 sm:h-[4em] sm:w-[4em]">
            <IconifyIcon
              aria-hidden="true"
              className="text-[2rem] text-primary"
              icon={resolvedIcon}
            />
          </div>
        )}
        <div className="flex min-w-0 w-full flex-col gap-1">
          <h1 className="flex min-w-0 w-full items-end gap-3 whitespace-nowrap text-2xl font-semibold sm:text-3xl">
            <span className="block min-w-0 truncate">{translatedTitle}</span>
          </h1>
          <p className="block min-w-0 w-full truncate whitespace-nowrap text-sm text-muted sm:text-base">
            {translatedDescription}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2">{trailing}</div>
    </header>
  )
}
