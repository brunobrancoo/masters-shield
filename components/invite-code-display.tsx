"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Copy, Check } from "lucide-react";
import { toast } from "sonner";

interface InviteCodeDisplayProps {
  code: string;
  showCopy?: boolean;
  showShare?: boolean;
}

export function InviteCodeDisplay({ 
  code, 
  showCopy = true, 
  showShare = true 
}: InviteCodeDisplayProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      toast.success("Código copiado para a área de transferência!");
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error("Erro ao copiar código");
    }
  };

  const handleShare = async () => {
    const shareUrl = `${window.location.origin}/campaign/join?code=${code}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Convite para Campanha",
          text: `Entre na minha campanha no Escudo do Mestre Digital! Código: ${code}`,
          url: shareUrl,
        });
      } catch (error) {
        if ((error as Error).name !== "AbortError") {
          toast.error("Erro ao compartilhar");
        }
      }
    } else {
      handleCopy();
    }
  };

  return (
    <Card className="metal-border bg-card/50">
      <CardContent className="py-4">
        <div className="flex items-center gap-4">
          <div className="flex-1 text-center">
            <p className="text-xs text-muted-foreground font-serif mb-1">
              Código de Convite
            </p>
            <p className="font-mono text-3xl font-bold tracking-wider">
              {code}
            </p>
          </div>
          {showCopy && (
            <Button
              variant="outline"
              size="icon"
              onClick={handleCopy}
              className="glow-silver"
            >
              {copied ? (
                <Check className="w-4 h-4" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </Button>
          )}
          {showShare && (
            <Button
              variant="outline"
              size="icon"
              onClick={handleShare}
              className="glow-silver"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-4 h-4"
              >
                <circle cx="18" cy="5" r="3" />
                <circle cx="6" cy="12" r="3" />
                <circle cx="18" cy="19" r="3" />
                <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
                <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
              </svg>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
