"use client";

import { useEffect, useMemo, useState } from "react";
import { ChevronDown, ChevronUp, Dices, TimerReset } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { onRollsChange, type CampaignRoll } from "@/lib/firebase-storage";
import { cn } from "@/lib/utils";

interface RollHistoryPanelProps {
  campaignId: string;
  position?: "left" | "right";
  className?: string;
}

const RECENT_ROLLS_LIMIT = 5;

function getRollDate(createdAt: CampaignRoll["createdAt"]): Date | null {
  if (!createdAt) return null;
  if (typeof createdAt.toDate === "function") {
    return createdAt.toDate();
  }
  if (createdAt instanceof Date) {
    return createdAt;
  }
  if (typeof createdAt.seconds === "number") {
    return new Date(
      createdAt.seconds * 1000 +
        Math.floor((createdAt.nanoseconds ?? 0) / 1_000_000),
    );
  }
  return null;
}

function formatRollTime(createdAt: CampaignRoll["createdAt"]): string {
  const date = getRollDate(createdAt);
  if (!date) return "agora";

  return new Intl.DateTimeFormat("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function RollHistoryItem({ roll }: { roll: CampaignRoll }) {
  const breakdown = Array.isArray(roll.breakdown) ? roll.breakdown : [];

  return (
    <div className="rounded-lg border border-border-default bg-bg-surface/70 p-3">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate font-semibold text-text-primary">
            {roll.userName}
          </p>
          <p className="text-xs text-text-secondary">{formatRollTime(roll.createdAt)}</p>
        </div>
        <Badge variant="outline" className="shrink-0 border-class-accent/30">
          {roll.dice || "Rolagem"}
        </Badge>
      </div>

      <div className="mt-3 flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs uppercase tracking-wide text-text-secondary">
            Rolagens
          </p>
          <div className="mt-1 flex flex-wrap gap-1">
            {breakdown.length > 0 ? (
              breakdown.map((value, index) => (
                <span
                  key={`${roll.id}-${index}-${value}`}
                  className="inline-flex min-w-8 items-center justify-center rounded-md border border-border-default bg-background px-2 py-1 font-mono text-sm text-text-primary"
                >
                  {value}
                </span>
              ))
            ) : (
              <span className="text-sm text-text-secondary">
                Sem detalhamento disponível
              </span>
            )}
          </div>
        </div>

        <div className="shrink-0 text-right">
          <p className="text-xs uppercase tracking-wide text-text-secondary">
            Resultado
          </p>
          <p className="font-mono text-2xl font-bold text-class-accent">
            {roll.total ?? roll.result}
          </p>
        </div>
      </div>
    </div>
  );
}

export function RollHistoryPanel({
  campaignId,
  position = "right",
  className,
}: RollHistoryPanelProps) {
  const [rolls, setRolls] = useState<CampaignRoll[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);
  const [visibleCount, setVisibleCount] = useState(RECENT_ROLLS_LIMIT);

  useEffect(() => {
    setIsExpanded(window.innerWidth >= 1024);
  }, []);

  useEffect(() => {
    return onRollsChange(campaignId, setRolls);
  }, [campaignId]);

  useEffect(() => {
    setVisibleCount((current) =>
      Math.max(RECENT_ROLLS_LIMIT, Math.min(current, rolls.length || RECENT_ROLLS_LIMIT)),
    );
  }, [rolls.length]);

  const recentRolls = useMemo(
    () => rolls.slice(0, visibleCount),
    [rolls, visibleCount],
  );
  const olderRolls = useMemo(() => rolls.slice(visibleCount), [rolls, visibleCount]);
  const latestRoll = recentRolls[0];
  const latestBreakdown = Array.isArray(latestRoll?.breakdown)
    ? latestRoll.breakdown
    : [];

  return (
    <>
      <div
        className={cn(
          "pointer-events-none fixed bottom-4 z-40 w-[min(24rem,calc(100vw-2rem))]",
          position === "left" ? "left-4" : "right-4",
          className,
        )}
      >
        <Card className="pointer-events-auto gap-0 overflow-hidden border border-border-default bg-card/95 py-0 shadow-2xl backdrop-blur">
          <CardHeader className="gap-3 px-4 py-4">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Dices className="h-4 w-4 text-class-accent" />
                  Rolagens Recentes
                </CardTitle>
                <CardDescription>
                  {latestRoll
                    ? `${latestRoll.userName} rolou ${latestRoll.dice || "os dados"}`
                    : "As novas rolagens aparecem aqui em tempo real"}
                </CardDescription>
              </div>

              <div className="flex shrink-0 items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsExpanded((current) => !current)}
                  aria-label={
                    isExpanded ? "Minimizar histórico" : "Expandir histórico"
                  }
                >
                  {isExpanded ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronUp className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            {!isExpanded && latestRoll && (
              <div className="flex items-center justify-between gap-3 rounded-lg border border-border-default bg-bg-surface/70 px-3 py-2">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-text-primary">
                    {latestRoll.userName}
                  </p>
                  <p className="text-xs text-text-secondary">
                    {latestBreakdown.length > 0
                      ? latestBreakdown.join(", ")
                      : "Sem detalhamento disponível"}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-text-secondary">
                    {formatRollTime(latestRoll.createdAt)}
                  </p>
                  <p className="font-mono text-xl font-bold text-class-accent">
                    {latestRoll.total ?? latestRoll.result}
                  </p>
                </div>
              </div>
            )}
          </CardHeader>

          {isExpanded && (
            <CardContent className="px-4 pb-4">
              {recentRolls.length > 0 ? (
                <ScrollArea className="h-[min(26rem,calc(100vh-12rem))] pr-1">
                  <div className="space-y-3">
                    {recentRolls.map((roll) => (
                      <RollHistoryItem key={roll.id} roll={roll} />
                    ))}

                    {olderRolls.length > 0 && (
                      <Button
                        variant="outline"
                        className="w-full bg-background"
                        onClick={() =>
                          setVisibleCount((current) =>
                            Math.min(current + RECENT_ROLLS_LIMIT, rolls.length),
                          )
                        }
                      >
                        <TimerReset className="mr-2 h-4 w-4" />
                        Carregar mais {Math.min(RECENT_ROLLS_LIMIT, olderRolls.length)}
                      </Button>
                    )}

                    {visibleCount > RECENT_ROLLS_LIMIT && (
                      <Button
                        variant="ghost"
                        className="w-full"
                        onClick={() => setVisibleCount(RECENT_ROLLS_LIMIT)}
                      >
                        Mostrar apenas as 5 mais recentes
                      </Button>
                    )}
                  </div>
                </ScrollArea>
              ) : (
                <div className="rounded-lg border border-dashed border-border-default bg-bg-surface/50 px-4 py-6 text-center text-sm text-text-secondary">
                  Nenhuma rolagem registrada nesta campanha ainda.
                </div>
              )}
            </CardContent>
          )}
        </Card>
      </div>
    </>
  );
}
