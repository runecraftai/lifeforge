import { useTranslation } from 'react-i18next'

import type { Module } from '@lifeforge/configs'
import {
  Box,
  Card,
  ConfirmationModal,
  ContextMenu,
  ContextMenuItem,
  Flex,
  Icon,
  Text,
  colorWithOpacity,
  useModalStore
} from '@lifeforge/ui'

function ModuleItem({
  module,
  onUninstall
}: {
  module: Module
  onUninstall: (moduleName: string) => Promise<void>
}) {
  // Module name format: @lifeforge/lifeforge--wallet -> lifeforge--wallet
  const moduleKey = module.name.replace('@lifeforge/', '')

  const { t, i18n } = useTranslation([
    `apps.${moduleKey}`,
    'common.module-manager'
  ])

  const translatedTitle = i18n.exists(`apps.${moduleKey}:title`)
    ? t(`apps.${moduleKey}:title`)
    : module.displayName

  const { open } = useModalStore()

  function handleUninstall() {
    open(ConfirmationModal, {
      title: t('common.module-manager:modals.uninstall.title', {
        module: translatedTitle
      }),
      description: t('common.module-manager:modals.uninstall.description', {
        module: translatedTitle
      }),
      confirmationButton: 'delete',
      onConfirm: () => onUninstall(module.name)
    })
  }

  return (
    <Card gap="md" minWidth="0">
      <Flex align="start" gap="md">
        <Flex
          centered
          shadow
          bg={colorWithOpacity('custom-500', '20%')}
          flexShrink="0"
          height="3em"
          r="lg"
          width="3em"
        >
          <Icon color="primary" icon={module.icon} size="1.5em" />
        </Flex>
        <Flex align="start" flex="1" gap="md" justify="between" minWidth="0">
          <Box minWidth="0">
            <Flex align="center" gap="sm">
              <Text truncate as="h3" size="lg" weight="semibold">
                {translatedTitle}
              </Text>
            </Flex>
            <Text color="muted" size="sm">
              v{module.version}
            </Text>
          </Box>
          <ContextMenu>
            <ContextMenuItem
              dangerous
              icon="tabler:trash"
              label="uninstall"
              namespace="common.module-manager"
              onClick={handleUninstall}
            />
          </ContextMenu>
        </Flex>
      </Flex>
      <Text as="p" color="muted" leading="relaxed" lineClamp={2}>
        {i18n.exists(`apps.${moduleKey}:description`)
          ? t([`apps.${moduleKey}:description`])
          : module.description}
      </Text>
      <Box style={{ marginTop: 'auto' }}>
        {module.author && (
          <Flex asChild align="center" gap="sm">
            <Text color="muted">
              <Icon icon="tabler:user" size="1.1rem" />
              <span>{module.author.split('<')[0].trim()}</span>
            </Text>
          </Flex>
        )}
      </Box>
    </Card>
  )
}

export default ModuleItem
