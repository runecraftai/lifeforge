import type { InferOutput } from '@lifeforge/api'
import { WithMasterPassword, WithQueryData, useModalStore } from '@lifeforge/ui'

import { forgeAPI } from '@/shared/api'

import ContentContainer from './components/content-container'
import RecoverAccountModal from './components/modals/recover-account-modal'
import ShowRecoveryKeyModal from './components/modals/show-recovery-key-modal'
import { VEKProvider } from './providers/vekprovider'

export type PasswordEntry = InferOutput<typeof forgeAPI.entries.list>[number]

export type PasswordCategory = InferOutput<
  typeof forgeAPI.categories.list
>[number]

function Passwords() {
  const { open } = useModalStore()

  return (
    <WithQueryData contract={forgeAPI.master.hasMasterPassword}>
      {hasMasterPassword => (
        <WithMasterPassword
          controllers={{
            createPassword: forgeAPI.master.create,
            getChallenge: forgeAPI.master.getChallenge,
            verifyPassword: forgeAPI.master.verify
          }}
          hasMasterPassword={hasMasterPassword}
          onCreate={data => {
            if (data.recovery_key) {
              open(ShowRecoveryKeyModal, {
                recoveryKey: data.recovery_key
              })
            }
          }}
          onRecoveryRequested={() => {
            open(RecoverAccountModal, {})
          }}
        >
          {masterPassword => (
            <VEKProvider masterPassword={masterPassword}>
              <ContentContainer masterPassword={masterPassword} />
            </VEKProvider>
          )}
        </WithMasterPassword>
      )}
    </WithQueryData>
  )
}

export default Passwords
