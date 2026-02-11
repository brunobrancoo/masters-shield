import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "badge-base inline-flex items-center justify-center w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-class-accent focus-visible:ring-class-accent/50 focus-visible:ring-[2px] transition-[color,box-shadow] overflow-hidden",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-class-accent text-white [a&]:hover:bg-class-accent/90",
        secondary:
          "border-transparent bg-bg-elevated text-text-primary [a&]:hover:bg-bg-elevated/90",
        destructive:
          "border-transparent bg-damage text-white [a&]:hover:bg-damage/90 focus-visible:ring-damage/20",
        outline:
          "text-text-primary [a&]:hover:bg-bg-surface [a&]:hover:text-text-secondary",
        // Rarity variants
        "rarity-common":
          "badge-rarity-common",
        "rarity-uncommon":
          "badge-rarity-uncommon",
        "rarity-rare":
          "badge-rarity-rare",
        "rarity-very-rare":
          "badge-rarity-very-rare",
        "rarity-legendary":
          "badge-rarity-legendary",
        "rarity-artifact":
          "badge-rarity-artifact",
        // Damage type variants
        "dmg-fire":
          "text-dmg-fire border-dmg-fire/30 bg-dmg-fire/10",
        "dmg-cold":
          "text-dmg-cold border-dmg-cold/30 bg-dmg-cold/10",
        "dmg-lightning":
          "text-dmg-lightning border-dmg-lightning/30 bg-dmg-lightning/10",
        "dmg-thunder":
          "text-dmg-thunder border-dmg-thunder/30 bg-dmg-thunder/10",
        "dmg-acid":
          "text-dmg-acid border-dmg-acid/30 bg-dmg-acid/10",
        "dmg-poison":
          "text-dmg-poison border-dmg-poison/30 bg-dmg-poison/10",
        "dmg-necrotic":
          "text-dmg-necrotic border-dmg-necrotic/30 bg-dmg-necrotic/10",
        "dmg-radiant":
          "text-dmg-radiant border-dmg-radiant/30 bg-dmg-radiant/10",
        "dmg-psychic":
          "text-dmg-psychic border-dmg-psychic/30 bg-dmg-psychic/10",
        "dmg-force":
          "text-dmg-force border-dmg-force/30 bg-dmg-force/10",
        "dmg-bludgeoning":
          "text-dmg-bludgeoning border-dmg-bludgeoning/30 bg-dmg-bludgeoning/10",
        "dmg-piercing":
          "text-dmg-piercing border-dmg-piercing/30 bg-dmg-piercing/10",
        "dmg-slashing":
          "text-dmg-slashing border-dmg-slashing/30 bg-dmg-slashing/10",
        // Condition variants
        "condition-blinded":
          "text-condition-blinded border-condition-blinded/30 bg-condition-blinded/10",
        "condition-charmed":
          "text-condition-charmed border-condition-charmed/30 bg-condition-charmed/10",
        "condition-frightened":
          "text-condition-frightened border-condition-frightened/30 bg-condition-frightened/10",
        "condition-paralyzed":
          "text-condition-paralyzed border-condition-paralyzed/30 bg-condition-paralyzed/10",
        "condition-poisoned":
          "text-condition-poisoned border-condition-poisoned/30 bg-condition-poisoned/10",
        "condition-stunned":
          "text-condition-stunned border-condition-stunned/30 bg-condition-stunned/10",
        "condition-unconscious":
          "text-condition-unconscious border-condition-unconscious/30 bg-condition-unconscious/10",
        "condition-restrained":
          "text-condition-restrained border-condition-restrained/30 bg-condition-restrained/10",
        "condition-invisible":
          "text-condition-invisible border-condition-invisible/30 bg-condition-invisible/10",
        "condition-exhaustion":
          "text-condition-exhaustion border-condition-exhaustion/30 bg-condition-exhaustion/10",
        // Buff/Debuff variants
        buff:
          "text-buff border-buff/30 bg-buff/10",
        debuff:
          "text-debuff border-debuff/30 bg-debuff/10",
        healing:
          "text-healing border-healing/30 bg-healing/10",
        damage:
          "text-damage border-damage/30 bg-damage/10",
        temp:
          "text-temp border-temp/30 bg-temp/10",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({
  className,
  variant,
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "span"

  return (
    <Comp
      data-slot="badge"
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  )
}

export { Badge, badgeVariants }
