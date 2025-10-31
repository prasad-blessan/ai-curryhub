import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send } from "lucide-react";
import { streamChat } from "@/utils/chatApi";
import { toast } from "sonner";

type Message = { role: "user" | "assistant"; content: string };

interface ChatInterfaceProps {
  // increment this prop to trigger a clear from the parent (Index.tsx)
  clearSignal?: number;
}

export const ChatInterface = ({ clearSignal }: ChatInterfaceProps) => {
  const STORAGE_KEY = "ai_food_messages";

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const clearedOnceRef = useRef(false);

  const welcomeMessage: Message = {
    role: "assistant",
    content:
      "Welcome to CurryHub! 🍛🍲\n\nI can help you explore the delicious world of Indian cuisine - both North and South Indian!\n\n**North Indian**: Butter Chicken, Paneer Tikka, Dal Makhani, Chole Bhature, Biryani, and more!\n\n**South Indian**: Masala Dosa, Idli, Sambar, Uttapam, Vada, and more!\n\nWhat would you like to know about? You can ask for:\n- A specific dish recipe\n- List of popular dishes from either region\n- Cooking tips and techniques\n- Differences between regional variations\n- Ingredient substitutions",
  };

  // Load persisted messages from localStorage on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Message[];
        if (Array.isArray(parsed) && parsed.length > 0) {
          setMessages(parsed);
          return;
        }
      }
    } catch (e) {
      // ignore and fall back to welcome
      console.error("Failed to read messages from storage:", e);
    }
    setMessages([welcomeMessage]);
  }, []);

  // Persist messages to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    } catch (e) {
      console.error("Failed to save messages to storage:", e);
    }
  }, [messages]);

  // Respond to clear requests from parent (clearSignal increments)
  useEffect(() => {
    if (typeof clearSignal !== "number") return;
    // Ignore the initial mount (clearSignal may be 0 initially)
    if (!clearedOnceRef.current) {
      clearedOnceRef.current = true;
      return;
    }
    // When clearSignal changes after mount, clear storage and reset messages
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      console.error("Failed to remove storage key:", e);
    }
    setMessages([welcomeMessage]);
    toast.success("Conversation cleared");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clearSignal]);

  useEffect(() => {
    const root = scrollRef.current as HTMLElement | null;
    if (!root) return;

    // Radix adds a viewport element; try to find it by data attribute first
    let viewport = root.querySelector('[data-radix-scroll-area-viewport]') as HTMLElement | null;
    if (!viewport) viewport = root.firstElementChild as HTMLElement | null;
    if (!viewport) return;

    // Temporarily ensure smooth scrolling is enabled on the viewport
    const prevScrollBehavior = viewport.style.scrollBehavior;
    try {
      viewport.style.scrollBehavior = "smooth";
      // Use scrollTo with top to ensure smooth animation
      viewport.scrollTo?.({ top: viewport.scrollHeight, behavior: "smooth" });
      // Fallback if scrollTo isn't available
      if (viewport.scrollTop !== viewport.scrollHeight) {
        viewport.scrollTop = viewport.scrollHeight;
      }
    } finally {
      // Restore previous value after a short delay to avoid interfering with user scroll
      setTimeout(() => {
        viewport && (viewport.style.scrollBehavior = prevScrollBehavior || "");
      }, 300);
    }
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: "user", content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    // Simple client-side guard: if the user's question doesn't appear to be about
    // food/recipes/cooking, return a friendly canned reply without calling the API.
    const cannedNonFoodReply =
      "I’m primarily here to help you with CurryHub South Indian recipes and cooking tips! If you have any questions or need a recipe, feel free to ask. How can I help with your cooking today?";

    const isFoodRelated = (text: string) => {
      if (!text) return false;
      const keywords = [
        "recipe",
        "cook",
        "cooking",
        "ingredient",
        "ingredients",
        "dish",
        "dishes",
        "curry",
        "idli",
        "dosa",
        "sambar",
        "vada",
        "biryani",
        "masala",
        "pantry",
        "grind",
        "roast",
        "fry",
        "bake",
        "steamed",
        "marinate",
        "south indian",
        "north indian",
        "chicken",
        "fish"
      ];

      const lower = text.toLowerCase();
      // If any keyword appears in the text, consider it food-related.
      return keywords.some(k => lower.includes(k));
    };

    if (!isFoodRelated(input)) {
      // Append the user's message and the canned assistant reply, then stop.
      setMessages(prev => [...prev, { role: "assistant", content: cannedNonFoodReply }]);
      setIsLoading(false);
      return;
    }

    let assistantContent = "";
    const updateAssistant = (chunk: string) => {
      assistantContent += chunk;
      setMessages(prev => {
        const last = prev[prev.length - 1];
        if (last?.role === "assistant") {
          return prev.map((m, i) => 
            i === prev.length - 1 ? { ...m, content: assistantContent } : m
          );
        }
        return [...prev, { role: "assistant", content: assistantContent }];
      });
    };

    try {
      await streamChat({
        messages: [...messages, userMessage],
        onDelta: updateAssistant,
        onDone: () => setIsLoading(false),
      });
    } catch (error) {
      console.error("Chat error:", error);
      toast.error(error instanceof Error ? error.message : "Failed to send message");
      setIsLoading(false);
      setMessages(prev => prev.filter(m => m !== userMessage));
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-background via-secondary/20 to-background">
      <div className="bg-card border-b shadow-sm">
        <div className="px-4 py-4 flex items-center gap-4 justify-between">
          <div className="flex items-center gap-3">
            <div className="text-3xl">🍛🍲</div>
            <div>
              <h2 className="font-bold text-lg">CurryHub</h2>
              <p className="text-sm text-muted-foreground">Ask me anything about Indian recipes and cooking!</p>
            </div>
          </div>

          <div />
        </div>
      </div>

      <ScrollArea ref={scrollRef} className=" px-4 py-6" style={{ height: "412px" }}>
        <div className="space-y-4">
          {messages.map((message, i) => (
            <div
              key={i}
              className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <Card
                className={`max-w-[80%] p-4 ${
                  message.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-card"
                }`}
              >
                <div className="whitespace-pre-wrap text-sm leading-relaxed">
                  {message.content}
                </div>
              </Card>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <Card className="max-w-[80%] p-4 bg-card">
                <div className="flex gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </Card>
            </div>
          )}
        </div>
      </ScrollArea>

      <div className="bg-card border-t shadow-lg">
        <div className="px-4 py-4">
          <div className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask about a dish or recipe..."
              disabled={isLoading}
              className="flex-1"
            />
            <Button 
              onClick={sendMessage} 
              disabled={!input.trim() || isLoading}
              size="icon"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
