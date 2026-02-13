"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase-config";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShieldIcon, UsersIcon } from "@/components/icons";
import { Plus } from "lucide-react";

interface Campaign {
  id: string;
  name: string;
  masterId: string;
  inviteCode: string;
  members: string[];
}

export default function CampaignSelectPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const loadCampaigns = async () => {
      const q = query(
        collection(db, "campaigns"),
        where("members", "array-contains", user.uid)
      );
      const snapshot = await getDocs(q);
      const campaignsList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Campaign));
      setCampaigns(campaignsList);
      setLoading(false);
    };

    loadCampaigns();
  }, [user]);

  if (loading) {
    return <div className="min-h-screen bg-background parchment-texture flex items-center justify-center">Carregando...</div>;
  }

  return (
    <div className="min-h-screen bg-background parchment-texture">
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="font-sans text-3xl mb-2 flex items-center gap-3">
              <ShieldIcon className="w-8 h-8 text-primary" />
              Minhas Campanhas
            </h1>
            <p className="font-serif text-muted-foreground">Selecione uma campanha para continuar</p>
          </div>
          <div className="flex gap-2">
            <Button onClick={() => router.push("/campaign/new")} className="glow-silver">
              <Plus className="w-4 h-4 mr-2" />
              Nova Campanha
            </Button>
            <Button variant="outline" onClick={() => router.push("/campaign/join")}>
              Entrar com Código
            </Button>
          </div>
        </div>

        {campaigns.length === 0 ? (
          <Card className="metal-border bg-card/50">
            <CardContent className="py-12 text-center">
              <UsersIcon className="w-16 h-16 mx-auto mb-4 opacity-30" />
              <p className="font-sans text-lg text-muted-foreground mb-4">
                Nenhuma campanha encontrada
              </p>
              <p className="font-serif text-sm text-muted-foreground mb-4">
                Crie sua primeira campanha ou entre com um código de convite
              </p>
              <Button onClick={() => router.push("/campaign/new")} className="glow-silver">
                Criar Primeira Campanha
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {campaigns.map(campaign => (
              <Card
                key={campaign.id}
                className="parchment-texture metal-border hover:glow-gold transition-all cursor-pointer"
                onClick={() => {
                  router.push(`/campaign/${campaign.id}`);
                }}
              >
                <CardHeader>
                  <CardTitle className="font-sans text-xl text-balance">
                    {campaign.name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground font-serif">
                      Membros: {campaign.members.length}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Código: {campaign.inviteCode}
                    </p>
                    <div className="pt-2">
                      {campaign.masterId === user?.uid ? (
                        <span className="text-xs bg-primary text-primary-foreground px-2 py-1 rounded">
                          Mestre
                        </span>
                      ) : (
                        <span className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded">
                          Jogador
                        </span>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
