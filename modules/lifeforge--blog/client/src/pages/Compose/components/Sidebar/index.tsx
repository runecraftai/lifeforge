//TODO: TO BE CONTINUED
/* eslint-disable @typescript-eslint/ban-ts-comment */
//@ts-nocheck
import { Icon } from '@iconify/react'

import {
  Button,
  FileInput,
  ListboxInput,
  ListboxOption,
  SidebarWrapper,
  TagsInput,
  TextAreaInput,
  TextInput
} from '@lifeforge/ui'

const BLOG_NAMESPACE = 'apps.@lifeforge/lifeforge--blog'

const VISIBILITY_OPTIONS = [
  {
    label: 'Public',
    icon: 'uil:globe'
  },
  {
    label: 'Private',
    icon: 'tabler:lock'
  },
  {
    label: 'Unlisted',
    icon: 'tabler:eye-off'
  }
]

function Sidebar({
  data,
  setData
}: {
  data: any
  setData: React.Dispatch<React.SetStateAction<any>>
}) {
  return (
    <SidebarWrapper>
      <div className="h-full space-y-3 p-4">
        <div className="mb-4 flex items-center gap-2">
          <Icon className="size-7" icon="tabler:file-settings" />
          <h2 className="text-xl font-semibold">Post Settings</h2>
        </div>
        <TextInput
          icon="tabler:article"
          label="Title"
          namespace={BLOG_NAMESPACE}
          placeholder="Enter the title of your post..."
          value={data.title}
          onChange={(title: string) => {
            setData(prevData => ({ ...prevData, title }))
          }}
        />
        <TextAreaInput
          icon="tabler:quote"
          label="Excerpt"
          namespace={BLOG_NAMESPACE}
          placeholder="Write a short excerpt for your post..."
          value={data.excerpt}
          onChange={(excerpt: string) => {
            setData(prevData => ({ ...prevData, excerpt }))
          }}
        />
        <ListboxInput
          icon="tabler:eye"
          label="Visibility"
          namespace={BLOG_NAMESPACE}
          renderContent={visibility => {
            const selected = VISIBILITY_OPTIONS.find(
              option => option.label.toLowerCase() === visibility
            )

            return (
              <>
                <Icon icon={selected?.icon || 'tabler:eye'} />
                <span>{selected?.label || 'Public'}</span>
              </>
            )
          }}
          value={data.visibility}
          onChange={(visibility: typeof data.visibility) => {
            setData(prevData => ({ ...prevData, visibility }))
          }}
        >
          {VISIBILITY_OPTIONS.map(option => (
            <ListboxOption
              key={option.label}
              icon={option.icon}
              label={option.label}
              value={option.label.toLowerCase()}
            />
          ))}
        </ListboxInput>
        <FileInput
          icon="tabler:photo"
          label="Featured Image"
          mimeTypes={{
            image: ['jpeg', 'png', 'gif', 'webp', 'svg+xml']
          }}
          namespace={BLOG_NAMESPACE}
          sources={{
            ai: {
              defaultPrompt: 'featured image for a blog post'
            },
            pixabay: true,
            url: true
          }}
          value={data.featuredImage}
          onChange={value => {
            setData(prevData => ({ ...prevData, featuredImage: value }))
          }}
        />
        {/* <ListboxInput
          icon="tabler:category"
          label="Category"
          namespace={BLOG_NAMESPACE}
          onChange={(category: string | null) => {
            setData(prevData => ({ ...prevData, category }))
          }}
          value={data.category}
        /> */}
        <TagsInput
          icon="tabler:tags"
          label="labels"
          namespace={BLOG_NAMESPACE}
          placeholder="Add tags to your post..."
          value={data.labels}
          onChange={(labels: string[]) => {
            setData(prevData => ({ ...prevData, labels }))
          }}
        />
        <div className="flex flex-1 flex-col justify-end gap-3">
          <Button
            className="mt-6 w-full"
            icon="tabler:file"
            namespace={BLOG_NAMESPACE}
            variant="secondary"
          >
            Save to Drafts
          </Button>
          <Button
            className="w-full"
            icon="tabler:send"
            namespace={BLOG_NAMESPACE}
          >
            Publish
          </Button>
        </div>
      </div>
    </SidebarWrapper>
  )
}

export default Sidebar
