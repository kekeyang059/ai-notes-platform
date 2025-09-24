interface OpenRouterRequest {
  model: string;
  messages: Array<{
    role: 'user' | 'assistant' | 'system';
    content: string;
  }>;
  max_tokens?: number;
  temperature?: number;
}

interface OpenRouterResponse {
  choices: Array<{
    message: {
      role: string;
      content: string;
    };
  }>;
}

const API_ENDPOINT = 'https://openrouter.ai/api/v1/chat/completions';
const DEFAULT_MODEL = 'deepseek/deepseek-chat';

// 可用的AI模型列表
export const AVAILABLE_MODELS = [
  { id: 'deepseek/deepseek-chat', name: 'DeepSeek Chat', description: '高性能中文对话模型' },
  { id: 'openai/gpt-4o-mini', name: 'GPT-4o Mini', description: 'OpenAI最新小型模型' },
  { id: 'openai/gpt-3.5-turbo', name: 'GPT-3.5 Turbo', description: 'OpenAI经典模型' },
  { id: 'anthropic/claude-3-haiku', name: 'Claude 3 Haiku', description: 'Anthropic快速模型' },
  { id: 'google/gemini-flash-1.5', name: 'Gemini Flash 1.5', description: 'Google高速模型' },
  { id: 'google/gemini-2.0-flash-exp', name: 'Gemini 2.5', description: 'Google最新实验性模型' }
];

export async function callOpenRouter(
  messages: Array<{ role: 'user' | 'assistant'; content: string }>,
  apiKey: string,
  model: string = DEFAULT_MODEL
): Promise<string> {
  try {
    // 添加系统消息提供当前日期时间信息
    const now = new Date();
    const currentDateTime = now.toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      weekday: 'long',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
    
    const systemMessage = {
      role: 'system' as const,
      content: `当前日期时间：${currentDateTime}。请在回答时使用准确的当前日期时间信息。`
    };
    
    const messagesWithSystem = [systemMessage, ...messages];
    
    const response = await fetch(API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'http://localhost:3002',
        'X-Title': 'AI Notes'
      },
      body: JSON.stringify({
        model: model,
        messages: messagesWithSystem,
        max_tokens: 2000,
        temperature: 0.7
      } as OpenRouterRequest)
    });

    if (!response.ok) {
      throw new Error(`API调用失败: ${response.status}`);
    }

    const data: OpenRouterResponse = await response.json();
    return data.choices[0]?.message?.content || '抱歉，没有收到回复。';
  } catch (error) {
    console.error('调用AI服务出错:', error);
    throw new Error('AI服务调用失败，请检查网络连接和API密钥。');
  }
}

export async function polishText(text: string, apiKey: string, model?: string): Promise<string> {
  const messages = [
    {
      role: 'user' as const,
      content: `请帮我润色以下文本，使其更加通顺和专业，但保持原意不变：\n\n${text}`
    }
  ];
  
  return await callOpenRouter(messages, apiKey, model);
}

export async function generateTags(text: string, apiKey: string, model?: string): Promise<string[]> {
  const messages = [
    {
      role: 'user' as const,
      content: `请为以下文本生成3-5个合适的标签，用逗号分隔：\n\n${text}`
    }
  ];
  
  const response = await callOpenRouter(messages, apiKey, model);
  return response.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
}