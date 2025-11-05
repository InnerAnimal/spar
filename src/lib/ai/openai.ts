import OpenAI from 'openai'

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function chatWithGPT4(messages: Array<{ role: 'user' | 'assistant' | 'system'; content: string }>) {
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

