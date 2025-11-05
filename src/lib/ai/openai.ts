import OpenAI from 'openai'

let openaiInstance: OpenAI | null = null

function getOpenAI() {
  if (!openaiInstance) {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY is not set')
    }
    openaiInstance = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    })
  }
  return openaiInstance
}

export async function chatWithGPT4(messages: Array<{ role: 'user' | 'assistant' | 'system'; content: string }>) {
  const openai = getOpenAI()
  const completion = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: messages.map(msg => ({
      role: msg.role,
      content: msg.content,
    })),
    temperature: 0.7,
  })

  return completion.choices[0]?.message?.content || ''
}

