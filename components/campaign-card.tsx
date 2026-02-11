"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield, Users, Share2 } from "lucide-react";
import { InviteCodeDisplay } from "@/components/invite-code-display";

interface CampaignCardProps {
  id: string;
  name: string;
  memberCount: number;
  inviteCode: string;
  isMaster: boolean;
  onEnter: () => void;
  onShare?: () => void;
}

export function CampaignCard({
  name,
  memberCount,
  inviteCode,
  isMaster,
  onEnter,
  onShare,
}: CampaignCardProps) {
  return (
    <Card className="parchment-texture metal-border hover:glow-gold transition-all cursor-pointer group">
      <CardHeader>
        <div className="flex items-start justify-between gap-3">
          <CardTitle className="font-sans text-xl text-balance">
            {name}
          </CardTitle>
          {isMaster && (
            <div className="flex-shrink-0">
              <Button
                variant="ghost"
                size="icon"
                className="opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={(e) => {
                  e.stopPropagation();
                  onShare?.();
                }}
              >
                <Share2 className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm text-muted-foreground font-serif">
            <Users className="w-4 h-4" />
            <span>{memberCount} membro{memberCount !== 1 ? "s" : ""}</span>
          </div>
          <InviteCodeDisplay code={inviteCode} showCopy={false} showShare={false} />
          <div className="pt-2">
            {isMaster ? (
              <span className="inline-flex items-center gap-1 text-xs bg-primary text-primary-foreground px-2 py-1 rounded">
                <Shield className="w-3 h-3" />
                Mestre
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-xs bg-muted text-muted-foreground px-2 py-1 rounded">
                <Users className="w-3 h-3" />
                Jogador
              </span>
            )}
          </div>
          <Button
            onClick={(e) => {
              e.stopPropagation();
              onEnter();
            }}
            className="w-full glow-silver"
          >
            {isMaster ? "Acessar Painel do Mestre" : "Acessar Ficha"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
