import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ShieldIcon } from "@/components/icons";

export function PlayerNotFound() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-background parchment-texture">
      <main className="container mx-auto px-4 py-8">
        <Card className="metal-border bg-card/50">
          <CardContent className="py-12 text-center">
            <ShieldIcon className="w-16 h-16 mx-auto mb-4 opacity-30" />
            <p className="font-sans text-lg text-muted-foreground">
              Personagem não encontrado
            </p>
            <Button
              onClick={() => router.push("/player")}
              className="mt-4 glow-silver"
            >
              Voltar
            </Button>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
