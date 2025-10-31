import { Card } from "@/components/ui/card";

export const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-background">
      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center space-y-6 mb-16">
          <div className="text-6xl mb-4">🍛🍲</div>
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            CurryHub
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Your personal guide to authentic Indian cuisine. Explore recipes, learn cooking techniques, and discover the rich flavors of India.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto mb-16">
          <Card className="p-6 hover:shadow-lg transition-all duration-300">
            <div className="text-4xl mb-4">📖</div>
            <h3 className="text-xl font-bold mb-2">Recipe Library</h3>
            <p className="text-muted-foreground">
              Access hundreds of authentic North and South Indian recipes with detailed instructions
            </p>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-all duration-300">
            <div className="text-4xl mb-4">👨‍🍳</div>
            <h3 className="text-xl font-bold mb-2">Cooking Tips</h3>
            <p className="text-muted-foreground">
              Learn professional techniques to make your dishes perfect every time
            </p>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-all duration-300">
            <div className="text-4xl mb-4">🌶️</div>
            <h3 className="text-xl font-bold mb-2">Regional Variations</h3>
            <p className="text-muted-foreground">
              Discover different styles and flavors from various regions of India
            </p>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-all duration-300">
            <div className="text-4xl mb-4">🥘</div>
            <h3 className="text-xl font-bold mb-2">North Indian</h3>
            <p className="text-muted-foreground">
              Butter Chicken, Paneer Tikka, Dal Makhani, Chole Bhature, and more
            </p>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-all duration-300">
            <div className="text-4xl mb-4">🍲</div>
            <h3 className="text-xl font-bold mb-2">South Indian</h3>
            <p className="text-muted-foreground">
              Masala Dosa, Idli, Sambar, Uttapam, Vada, and traditional delicacies
            </p>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-all duration-300">
            <div className="text-4xl mb-4">💬</div>
            <h3 className="text-xl font-bold mb-2">AI Powered</h3>
            <p className="text-muted-foreground">
              Get instant answers to your cooking questions with our intelligent assistant
            </p>
          </Card>
        </div>

        {/* CTA Section */}
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-bold">Ready to Start Cooking?</h2>
          <p className="text-muted-foreground text-lg">
            Click the chat icon in the bottom right corner to begin your culinary journey!
          </p>
          <div className="text-4xl animate-bounce">👇</div>
        </div>
      </div>
    </div>
  );
};
