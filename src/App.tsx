import { useState, useEffect, useRef } from 'react';
import Header from './components/Header';
import ModelSelector from './components/ModelSelector';
import ChatBox from './components/ChatBox';
import InputArea from "./components/InputArea";
import ChatStats from './components/ChatStats';
import { initializeWebLLMEngine, streamingGenerating, availableModels, setProgressCallback, modelDetailsList } from './utils/llm';
import '@fontsource/inter';
import ChatHeader from './components/ChatHeader';

const TEMPERATURE = 0.7;
const TOP_P = 1;
const PAGE_TITLE = "WebLLM Playground ✨";
const PAGE_HEADING = "WebLLM Playground ✨";
const PAGE_DESCRIPTION = "Blazing fast inference with WebGPU and WebLLM running locally in your browser.";

interface Message {
  content: string;
  role: 'system' | 'user' | 'assistant';
}

interface ChatStatistics {
  promptTokens: number;
  completionTokens: number;
  prefillSpeed: number;
  decodingSpeed: number;
}

function App() {
  const [isModelLoaded, setIsModelLoaded] = useState<boolean>(false);
  const [selectedModel, setSelectedModel] = useState<string>(availableModels[0]);
  const [chatMessages, setChatMessages] = useState<Message[]>([]);
  const [isGeneratingResponse, setIsGeneratingResponse] = useState<boolean>(false);
  const [chatStatistics, setChatStatistics] = useState<ChatStatistics>({
    promptTokens: 0,
    completionTokens: 0,
    prefillSpeed: 0,
    decodingSpeed: 0,
  });
  const [loadingProgress, setLoadingProgress] = useState<string>('');
  const [isModelSelectorVisible, setIsModelSelectorVisible] = useState<boolean>(true);
  const [areChatStatsVisible, setAreChatStatsVisible] = useState<boolean>(true);

  const downloadStatusRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.title = PAGE_TITLE;

    setProgressCallback((progress: string) => {
      setLoadingProgress(progress);
    });
  }, []);

  const handleModelLoad = async (): Promise<void> => {
    try {
      setLoadingProgress('Loading...');
      await initializeWebLLMEngine(
        selectedModel,
        TEMPERATURE,
        TOP_P,
        () => {
          setIsModelLoaded(true);
          setLoadingProgress('Model loaded successfully');
          setIsModelSelectorVisible(false);
        }
      );
    } catch (error) {
      console.error("Error loading model:", error);
      setLoadingProgress('Error loading model. Please try again.');
    }
  };

  const handleSendMessage = async (input: string): Promise<void> => {
    if (!isModelLoaded || input.trim().length === 0) return;

    setIsGeneratingResponse(true);
    const updatedMessages: Message[] = [...chatMessages, { content: input, role: "user" }];
    setChatMessages(updatedMessages);

    try {
      await streamingGenerating(
        updatedMessages,
        (currentMessage: string) => {
          const newMessage: Message = { content: currentMessage, role: "assistant" };
          setChatMessages([...updatedMessages, newMessage]);
        },
        (finalMessage: string, usage: any) => {
          const finalAssistantMessage: Message = { content: finalMessage, role: "assistant" };
          setChatMessages([...updatedMessages, finalAssistantMessage]);

          const updatedStats = {
            promptTokens: Math.round(usage.prompt_tokens) || 0,
            completionTokens: Math.round(usage.completion_tokens) || 0,
            prefillSpeed: Math.round(usage.extra?.prefill_tokens_per_s) || 0,
            decodingSpeed: Math.round(usage.extra?.decode_tokens_per_s) || 0,
          };


          setChatStatistics(updatedStats);
          setIsGeneratingResponse(false);
        },
        (error: Error) => {
          console.error("Error generating response:", error);
          setIsGeneratingResponse(false);
        }
      );
    } catch (error) {
      console.error("Error in handleSendMessage:", error);
      setIsGeneratingResponse(false);
    }
  };

  const handleExampleSelection = (message: string) => {
    handleSendMessage(message);
  };

  const handleChatClear = () => {
    setChatMessages([]);
  };

  // Retrieve the icon for the selected model
  let selectedModelDetails = null;
  for (let i = 0; i < modelDetailsList.length; i++) {
    if (selectedModel.toLowerCase().includes(modelDetailsList[i].name)) {
      selectedModelDetails = modelDetailsList[i];
      break;
    }
  }
  const SelectedModelIcon = selectedModelDetails ? selectedModelDetails.icon : null;

  return (
    <div className="min-h-screen flex flex-col bg-[#121212] text-gray-300 font-inter">
      {/* Chat Header */}
      {isModelLoaded && !isModelSelectorVisible && (
        <div className="sticky top-0 z-10 bg-[#121212]">
          <ChatHeader
            selectedModel={selectedModel}
            SelectedModelIcon={SelectedModelIcon}
            onClearChat={handleChatClear}
          />
        </div>
      )}
      
      {/* Model Selector */}
      {isModelSelectorVisible && (
        <div className="flex-shrink-0 px-4 py-6 sm:px-6">
          <Header heading={PAGE_HEADING} description={PAGE_DESCRIPTION} />
          <ModelSelector
            selectedModel={selectedModel}
            setSelectedModel={setSelectedModel}
            onModelLoad={handleModelLoad}
            isModelLoaded={isModelLoaded}
            availableModels={availableModels}
            loadProgress={loadingProgress}
          />
          <div ref={downloadStatusRef} id="download-status" className="text-center text-sm text-gray-400 mt-2"></div>
        </div>
      )}

      {/* Chat Area */}
      {isModelLoaded && (
        <div className="flex-grow flex flex-col overflow-auto px-4 sm:px-6">
          <div className="flex-grow max-w-3xl w-full mx-auto flex flex-col h-full">
            <ChatBox 
            messages={chatMessages} 
            onExampleClick={handleExampleSelection} 
            isGenerating={isGeneratingResponse}
          />
          </div>
        </div>
      )}

      {/* Input Area */}
      {isModelLoaded && (
        <div className="sticky bottom-0 bg-[#121212]">
          <InputArea 
          onSendMessage={handleSendMessage} 
          isGenerating={isGeneratingResponse} 
          isModelLoaded={isModelLoaded} 
          />
        </div>
      )}

      {/* Chat Statistics */}
      {areChatStatsVisible && (
        <ChatStats 
          stats={chatStatistics} 
          onClose={() => setAreChatStatsVisible(false)} 
        />
      )}
    </div>
  );
}

export default App;