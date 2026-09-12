import { ListboxInput, ListboxOption, Text } from '@lifeforge/ui'

import { useTodoListContext } from '@/entities/task'

export function TagsSelector({
  tags,
  setTags
}: {
  tags: string[]
  setTags: (tags: string[]) => void
}) {
  const { tagsListQuery } = useTodoListContext()

  const tagsList = tagsListQuery.data ?? []

  return (
    <ListboxInput
      multiple
      icon="tabler:tags"
      label="tags"
      renderContent={() => (
        <Text truncate>
          {tags.length > 0
            ? tags
                .map(tag => `# ${tagsList.find(t => t.id === tag)?.name}`)
                .join(', ')
            : 'None'}
        </Text>
      )}
      value={tags}
      onChange={setTags}
    >
      {tagsList.map(({ name, id }, i) => (
        <ListboxOption key={i} icon="tabler:hash" label={name} value={id} />
      ))}
    </ListboxInput>
  )
}
