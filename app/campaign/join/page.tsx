"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase-config";
import { joinCampaign } from "@/lib/firebase-storage";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function JoinCampaignPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [inviteCode, setInviteCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteCode.trim() || !user) return;

    setLoading(true);
    setError("");

    try {
      const campaignsQuery = query(collection(db, "campaigns"), where("inviteCode", "==", inviteCode.toUpperCase()));
      const snapshot = await getDocs(campaignsQuery);

      if (snapshot.empty) {
        setError("Código de convite inválido");
        setLoading(false);
        return;
      }

      const campaignDoc = snapshot.docs[0];
      await joinCampaign(campaignDoc.id, user.uid);
      router.push(`/campaign/${campaignDoc.id}`);
    } catch (error: any) {
      setError(error.message || "Erro ao entrar na campanha");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background parchment-texture">
      <main className="container mx-auto px-4 py-8 max-w-2xl">
        <Card className="metal-border bg-card/50">
          <CardHeader>
            <CardTitle className="font-sans text-2xl">Entrar em Campanha</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="invite-code">Código de Convite</Label>
                <Input
                  id="invite-code"
                  value={inviteCode}
                  onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
                  placeholder="XXXXXXXX"
                  maxLength={8}
                  className="metal-border font-mono text-center text-2xl uppercase"
                />
              </div>
              {error && <p className="text-destructive text-sm">{error}</p>}
              <Button type="submit" disabled={loading || !inviteCode.trim()} className="glow-silver">
                {loading ? "Entrando..." : "Entrar"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
