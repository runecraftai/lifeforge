import { Button, ModuleHeader, TextAreaInput, Widget } from '@lifeforge/ui'
import { useState } from 'react'

function YoutubeSummarizer() {
  const [captionUrl, setCaptionUrl] = useState('')
  const [summary, setSummary] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function summarize() {
    setLoading(true)
    try {
      setSummary(
        captionUrl
          ? 'Summarization requires yt-dlp and a configured Groq key.'
          : 'Enter a caption URL.'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <ModuleHeader />
      <Widget icon="tabler:brand-youtube" title="YouTube Summarizer">
        <TextAreaInput
          label="Caption URL"
          onChange={setCaptionUrl}
          placeholder="https://..."
          value={captionUrl}
        />
        <Button loading={loading} onClick={summarize}>
          Summarize
        </Button>
        {summary && <p className="mt-4 whitespace-pre-wrap">{summary}</p>}
      </Widget>
    </>
  )
}

export default YoutubeSummarizer
