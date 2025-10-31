import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface CuisineSelectorProps {
  onSelect: (cuisine: "north" | "south") => void;
}

export const CuisineSelector = ({ onSelect }: CuisineSelectorProps) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-8 p-6">
      <div className="text-center space-y-3">
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          CurryHub
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl">
          Explore the rich flavors of Indian cuisine. Choose your culinary journey!
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6 w-full max-w-3xl">
        <Card 
          className="p-8 hover:shadow-lg transition-all duration-300 cursor-pointer border-2 hover:border-primary group"
          onClick={() => onSelect("north")}
        >
          <div className="text-center space-y-4">
            <div className="text-6xl">🍛</div>
            <h2 className="text-2xl font-bold group-hover:text-primary transition-colors">
              North Indian Food
            </h2>
            <p className="text-muted-foreground">
              Rich gravies, tandoori delights, and aromatic biryanis
            </p>
            <Button className="w-full bg-gradient-to-r from-primary to-orange-500 hover:opacity-90">
              Explore North Indian
            </Button>
          </div>
        </Card>

        <Card 
          className="p-8 hover:shadow-lg transition-all duration-300 cursor-pointer border-2 hover:border-accent group"
          onClick={() => onSelect("south")}
        >
          <div className="text-center space-y-4">
            <div className="text-6xl">🍲</div>
            <h2 className="text-2xl font-bold group-hover:text-accent transition-colors">
              South Indian Food
            </h2>
            <p className="text-muted-foreground">
              Crispy dosas, fluffy idlis, and flavorful sambar
            </p>
            <Button className="w-full bg-accent hover:opacity-90">
              Explore South Indian
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};
