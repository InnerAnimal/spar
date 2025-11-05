import Anthropic from '@anthropic-ai/sdk'

export const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

export async function chatWithClaude(messages: Array<{ role: 'user' | 'assistant' | 'system'; content: string }>) {
  const response = await anthropic.messages.create({
    model: 'claude-3-5-sonnet-20241022',
    max_tokens: 1024,
    messages: messages
      .filter(msg => msg.role !== 'system') // Claude doesn't use system messages the same way
      .map(msg => ({
        role: msg.role === 'user' ? 'user' : 'assistant',
        content: msg.content,
      })),
  })

  return response.content[0]?.type === 'text' ? response.content[0].text : ''
}

