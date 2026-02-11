"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { D20 } from "@/components/icons";

interface D20RollDialogProps {
  onRoll: () => void;
  advantage: "normal" | "advantage" | "disadvantage";
  setAdvantage: (value: "normal" | "advantage" | "disadvantage") => void;
  rolls: number[];
  isRolling: boolean;
}

export default function D20RollDialog({
  onRoll,
  advantage,
  setAdvantage,
  rolls,
  isRolling,
}: D20RollDialogProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="font-sans">
          <D20 className="w-5 h-5 mr-2" />
          Rolar d20
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Rolar um d20</DialogTitle>
        </DialogHeader>
        <div className="py-4 space-y-4">
          <div className="flex justify-center gap-2">
            <Button
              variant={advantage === "advantage" ? "default" : "outline"}
              onClick={() => setAdvantage("advantage")}
            >
              Vantagem
            </Button>
            <Button
              variant={advantage === "normal" ? "default" : "outline"}
              onClick={() => setAdvantage("normal")}
            >
              Normal
            </Button>
            <Button
              variant={advantage === "disadvantage" ? "default" : "outline"}
              onClick={() => setAdvantage("disadvantage")}
            >
              Desvantagem
            </Button>
          </div>
          {rolls.length > 0 && (
            <div className="border-t border-border pt-4">
              <p className="text-center text-muted-foreground">Resultado:</p>
              <div className="flex items-center justify-center gap-4 mt-2">
                {isRolling ? (
                  <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                ) : advantage === "normal" ? (
                  <p className="text-4xl font-bold">{rolls[0]}</p>
                ) : (
                  <>
                    <p className="text-2xl font-bold line-through text-muted-foreground">
                      {advantage === "advantage"
                        ? Math.min(rolls[0], rolls[1])
                        : Math.max(rolls[0], rolls[1])}
                    </p>
                    <p className="text-4xl font-bold text-primary">
                      {rolls[2]}
                    </p>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
        <DialogFooter className="mt-4">
          <Button onClick={onRoll} disabled={isRolling} className="w-full">
            {isRolling ? "Rolando..." : "Rolar!"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
