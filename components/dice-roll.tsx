import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { DiceRoll } from "@/lib/interfaces/dice-roll";
import { D20 } from "./icons";
import { useState } from "react";

export default function DiceRollModal() {
  const [roll, setRoll] = useState();
  return (
    <Dialog>
      <DialogTrigger>
        <D20 className="h-14 w-14" />
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you absolutely sure?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
