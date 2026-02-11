"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { createCampaign } from "@/lib/firebase-storage";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function NewCampaignPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !user) return;

    setLoading(true);
    try {
      await createCampaign(name, user.uid);
      router.push("/campaign/select");
    } catch (error) {
      console.error("Falha ao criar campanha:", error);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background parchment-texture">
      <main className="container mx-auto px-4 py-8 max-w-2xl">
        <Card className="metal-border bg-card/50">
          <CardHeader>
            <CardTitle className="font-sans text-2xl">Criar Nova Campanha</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="campaign-name">Nome da Campanha</Label>
                <Input
                  id="campaign-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ex: A Lenda dos Anéis..."
                  className="metal-border"
                />
              </div>
              <Button type="submit" disabled={loading || !name.trim()} className="glow-silver">
                {loading ? "Criando..." : "Criar Campanha"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
