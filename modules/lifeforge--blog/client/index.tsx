import { useQuery } from '@tanstack/react-query'
import { Button, EmptyStateScreen, ModuleHeader, WithQuery } from 'lifeforge-ui'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router'

import forgeAPI from '@/utils/forgeAPI'

function Blog() {
  const { t } = useTranslation('apps.blog')

  const entriesQuery = useQuery(forgeAPI.blog.entries.list.queryOptions())

  return (
    <>
      <ModuleHeader
        actionButton={
          <Button
            as={Link}
            icon="tabler:plus"
            to="/blog/compose"
            tProps={{
              item: t('items.post')
            }}
            variant="primary"
          >
            New
          </Button>
        }
      />
      <WithQuery query={entriesQuery}>
        {entries =>
          entries.length > 0 ? (
            <></>
          ) : (
            <EmptyStateScreen
              icon="tabler:article-off"
              message={{
                id: 'entries',
                namespace: 'apps.blog'
              }}
            />
          )
        }
      </WithQuery>
    </>
  )
}

export default Blog
