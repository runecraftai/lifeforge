import z from 'zod'

import forge from '../forge'

export const summarize = forge.mutation({
  description: 'Summarize a YouTube transcript URL',
  input: {
    body: z.object({
      url: z.string().url()
    })
  },
  output: {
    OK: z.string(),
    BAD_REQUEST: z.string()
  }
}).callback(async ({ body: { url }, core: { api: { fetchAI } }, pb, response }) => {
  const captionText = (await fetch(url).then(result => result.text()))
    .replace(/\n/g, ' ')
    .replace(/ +/g, ' ')
    .match(/<text.*?>(.*?)<\/text>/g)
    ?.map(text => text.replace(/<text.*?>|<\/text>/g, ''))
    .join(' ')

  if (!captionText) return response.badRequest('No captions found')

  const result = await fetchAI({
    pb,
    provider: 'groq',
    model: 'llama-3.3-70b-versatile',
    messages: [
      { role: 'system', content: 'Summarize this video transcript concisely.' },
      { role: 'user', content: captionText }
    ]
  })

  return result ? response.ok(result) : response.badRequest('No result found')
})

export default { summarize }
