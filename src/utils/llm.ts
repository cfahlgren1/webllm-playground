import * as webllm from "@mlc-ai/web-llm";
import {
  MetaIcon,
  MicrosoftIcon,
  MistralIcon,
  GoogleIcon,
  SnowflakeIcon,
  QwenIcon,
  SmolLMIcon,
} from '../components/icons';

export interface ModelDetails {
  name: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}

export const modelDetailsList: ModelDetails[] = [
  { name: 'llama', icon: MetaIcon },
  { name: 'phi', icon: MicrosoftIcon },
  { name: 'mistral', icon: MistralIcon },
  { name: 'gemma', icon: GoogleIcon },
  { name: 'snowflake', icon: SnowflakeIcon },
  { name: 'qwen', icon: QwenIcon },
  { name: 'smollm', icon: SmolLMIcon },
];

let engine: webllm.MLCEngine | null = null;
let progressCallback: ((progress: string) => void) | null = null;

export async function initializeWebLLMEngine(
  selectedModel: string,
  temperature: number,
  topP: number,
  onCompletion: () => void
): Promise<void> {
  try {
    engine = new webllm.MLCEngine();
    engine.setInitProgressCallback(handleEngineInitProgress);

    const config = { temperature, top_p: topP };
    await engine.reload(selectedModel, config);
    onCompletion();
  } catch (error) {
    console.error("Error loading model:", error);
    throw error;
  }
}

export function setProgressCallback(callback: (progress: string) => void): void {
  progressCallback = callback;
}

function handleEngineInitProgress(report: { text: string }): void {
  if (progressCallback) {
    progressCallback(report.text);
  }
}

export async function streamingGenerating(
  messages: webllm.ChatCompletionMessageParam[],
  onUpdate: (currentMessage: string) => void,
  onFinish: (finalMessage: string, usage: webllm.CompletionUsage) => void,
  onError: (error: Error) => void
): Promise<void> {
  if (!engine) {
    onError(new Error("Engine not initialized"));
    return;
  }

  try {
    let currentMessage = "";
    let usage: webllm.CompletionUsage | undefined;

    const completion = await engine.chat.completions.create({
      stream: true,
      messages,
      stream_options: { include_usage: true },
    });

    for await (const chunk of completion) {
      const delta = chunk.choices[0]?.delta.content;
      if (delta) currentMessage += delta;
      if (chunk.usage) {
        usage = chunk.usage;
      }
      onUpdate(currentMessage);
    }

    const finalMessage = await engine.getMessage();
    if (usage) {
      onFinish(finalMessage, usage as webllm.CompletionUsage);
    } else {
      throw new Error("Usage data not available");
    }
  } catch (error) {
    onError(error as Error);
  }
}

export const availableModels: string[] = [];
for (let i = 0; i < webllm.prebuiltAppConfig.model_list.length; i++) {
  availableModels.push(webllm.prebuiltAppConfig.model_list[i].model_id);
}