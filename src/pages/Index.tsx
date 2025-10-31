import { useState } from "react";
import { LandingPage } from "@/components/LandingPage";
import { ChatInterface } from "@/components/ChatInterface";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { MessageCircle, X, Trash2 } from "lucide-react";

const Index = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  // bump this counter to instruct ChatInterface to clear its conversation
  const [clearSignal, setClearSignal] = useState(0);

  return (
    <>
      <LandingPage />
      
      {/* Floating Chat Button */}
      <Button
        onClick={() => setIsChatOpen(true)}
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 z-50"
        size="icon"
      >
        <MessageCircle className="h-6 w-6" />
      </Button>

      {/* Chat Dialog */}
      <Dialog open={isChatOpen} onOpenChange={setIsChatOpen}>
        <DialogContent className="max-w-4xl h-[80vh] p-0">
          <div className="relative h-full">
            {/* Position the Clear button left of the dialog's built-in Close (which is inside DialogContent) */}
            <div className="absolute top-4 right-12 z-10">
              <Button
                onClick={() => {
                  const ok = window.confirm("Clear conversation? This will remove stored messages.");
                  if (ok) setClearSignal(s => s + 1);
                }}
                className="z-10"
                variant="ghost"
                size="icon"
                aria-label="Clear conversation"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
            <ChatInterface clearSignal={clearSignal} />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Index;
