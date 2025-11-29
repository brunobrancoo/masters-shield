import { z } from "zod"

export const attributesSchema = z.object({
  for: z.number().min(1).max(30),
  des: z.number().min(1).max(30),
  con: z.number().min(1).max(30),
  int: z.number().min(1).max(30),
  sab: z.number().min(1).max(30),
  car: z.number().min(1).max(30),
})

export const monsterSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  type: z.string().min(1, "Tipo é obrigatório"),
  level: z.number().min(1).max(30),
  hp: z.number().min(1),
  attributes: attributesSchema,
  skills: z.array(z.string()),
  notes: z.string(),
})

export const npcSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  race: z.string().min(1, "Raça é obrigatória"),
  class: z.string().min(1, "Classe é obrigatória"),
  level: z.number().min(1).max(30),
  hp: z.number().min(1),
  attributes: attributesSchema,
  skills: z.array(z.string()),
  personality: z.string(),
  notes: z.string(),
})

export type MonsterFormData = z.infer<typeof monsterSchema>
export type NPCFormData = z.infer<typeof npcSchema>
