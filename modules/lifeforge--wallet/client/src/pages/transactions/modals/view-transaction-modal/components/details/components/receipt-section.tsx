import { Button, ViewImageModal, useModalStore } from '@lifeforge/ui'

import { forgeAPI } from '@/shared/api'

import { useTransactionDetails } from '../transaction-details-context'
import DetailItem from './detail-item'

function ReceiptSection() {
  const transaction = useTransactionDetails()
  const { open } = useModalStore()

  if (!transaction.receipt) return null

  return (
    <DetailItem vertical icon="tabler:receipt" label="receipt">
      <Button
        icon="tabler:eye"
        variant="secondary"
        width="100%"
        onClick={() => {
          open(ViewImageModal, {
            src: forgeAPI.getMedia({
              collectionId: transaction.collectionId,
              recordId: transaction.id,
              fieldId: transaction.receipt || ''
            })
          })
        }}
      >
        View Receipt
      </Button>
    </DetailItem>
  )
}

export default ReceiptSection
