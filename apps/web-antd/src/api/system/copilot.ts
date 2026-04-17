import { requestClient } from '#/api/request';

export async function CopilotSSE(
  data: Msg,
  options?: {
    onEnd?: () => void;
    onMessage?: (message: string) => void;
  },
): Promise<void> {
  return requestClient.postSSE('/basic-api/v1/copilot/sse', data, {
    headers: {
      'Content-Type': 'application/json',
    },
    ...options,
  });
}

export interface Message {
  role: string;
  content: string;
  timestamp: string;
}

export interface Msg {
  id: string;
  items: Message[];
}

export async function CopilotSSEStream(
  data: Msg,
  options?: {
    onChunk?: (chunk: string, isDone?: boolean) => void;
    onComplete?: (fullResponse: string) => void;
    onError?: (error: Error) => void;
  },
): Promise<void> {
  try {
    const response = await fetch('/basic-api/api/v1/copilot/sse', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'text/event-stream', // 表明期望SSE响应
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    if (!response.body) {
      throw new Error('响应体不可读');
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let fullResponse = '';

    while (true) {
      const { done, value } = await reader.read();

      if (done) {
        options?.onComplete?.(fullResponse);
        break;
      }

      // 解码并处理数据块
      const chunk = decoder.decode(value, { stream: true });
      fullResponse += chunk;

      // 解析SSE格式（data: xxx\n\n）
      const lines = chunk.split('\n');
      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = line.slice(6); // 移除"data: "前缀
          options?.onChunk?.(data, false);
        }
      }

      options?.onChunk?.(chunk, false);
    }
  } catch (error) {
    options?.onError?.(error as Error);
  }
}
