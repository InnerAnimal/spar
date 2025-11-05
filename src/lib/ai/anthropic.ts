import Anthropic from '@anthropic-ai/sdk'

let anthropicInstance: Anthropic | null = null

function getAnthropic() {
  if (!anthropicInstance) {
    if (!process.env.ANTHROPIC_API_KEY) {
      throw new Error('ANTHROPIC_API_KEY is not set')
    }
    anthropicInstance = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    })
  }
  return anthropicInstance
}

export async function chatWithClaude(messages: Array<{ role: 'user' | 'assistant' | 'system'; content: string }>) {
  const anthropic = getAnthropic()
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

