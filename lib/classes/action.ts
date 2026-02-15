import { PlayableCharacter, Monster, Item } from "@/lib/schemas";

// --- Placeholder Interfaces & Classes ---
// Estas interfaces e classes são placeholders e devem ser substituídas
// pelas implementações reais do seu projeto.

/**
 * Representa o estado atual do combate, incluindo efeitos ativos.
 * Esta é uma definição básica. Você deve expandi-la conforme necessário.
 */
export interface CombatState {
  getActiveEffectsFor: (characterId: string) => ActiveEffect[];
}

/**
 * Representa um efeito ativo em um personagem.
 */
export interface ActiveEffect {
  name: string;
  bonus?: string; // ex: "1d4"
  penalty?: number;
  // ... outras propriedades como duração, etc.
}

/**
 * Placeholder para a classe de rolagem de dados.
 * Assumimos que ela possui um método estático 'roll'.
 */
class DiceRoller {
  static roll(dice: string): { total: number; rolls: number[] } {
    // Lógica de rolagem de dados (ex: 1d20, 2d6+3)
    // Esta é uma implementação mock simples.
    console.log(`Rolling ${dice}...`);
    const total = Math.floor(Math.random() * 20) + 1;
    return { total, rolls: [total] };
  }
}

// --- Fim dos Placeholders ---

/**
 * O contexto necessário para resolver uma ação.
 */
export interface ResolveContext {
  combatState: CombatState;
  target?: PlayableCharacter | Monster; // O alvo é opcional
}

/**
 * Representa o resultado de uma ação resolvida.
 * É um objeto de dados imutável que contém todos os detalhes do que aconteceu.
 */
export class ActionResult {
  constructor(
    public readonly rawRoll: { total: number; rolls: number[] },
    public readonly modifiers: { value: number; source: string }[],
    public readonly finalResult: number,
  ) {}

  /**
   * Exemplo de um getter útil para verificar se um ataque acertou.
   * @param ac A Classe de Armadura (AC) do alvo.
   * @returns True se o resultado final for maior ou igual ao AC.
   */
  didHit(ac: number): boolean {
    return this.finalResult >= ac;
  }
}

type ActionType = "attack" | "skill_check" | "saving_throw";

/**
 * Construtor de Ações que usa um Fluent Interface.
 * Permite criar uma descrição de uma ação passo a passo e depois resolvê-la.
 */
export class Action {
  private weapon?: Item;
  private skill?: string;
  private ability?: string;

  constructor(
    private readonly actor: PlayableCharacter | Monster,
    private readonly type: ActionType,
  ) {}

  public setWeapon(weapon: Item): this {
    if (this.type !== "attack") {
      throw new Error("setWeapon só pode ser usado em ações do tipo 'attack'.");
    }
    this.weapon = weapon;
    return this;
  }

  public setSkill(skill: string): this {
    if (this.type !== "skill_check") {
      throw new Error(
        "setSkill só pode ser usado em ações do tipo 'skill_check'.",
      );
    }
    this.skill = skill;
    return this;
  }

  public setAbility(ability: string): this {
    if (this.type !== "saving_throw") {
      throw new Error(
        "setAbility só pode ser usado em ações do tipo 'saving_throw'.",
      );
    }
    this.ability = ability;
    return this;
  }

  /**
   * Resolve a ação usando o contexto fornecido.
   * @param context O contexto de combate e o alvo (opcional).
   * @returns Um objeto ActionResult com todos os detalhes da resolução.
   */
  public resolve(context: ResolveContext): ActionResult {
    const { combatState, target } = context;
    const modifiers: { value: number; source: string }[] = [];

    // 1. Rolagem de dado principal
    const roll = DiceRoller.roll("1d20");

    // 2. Coleta de modificadores baseados no tipo de ação
    if (this.type === "attack") {
      if (!this.weapon) throw new Error("Arma não definida para o ataque.");
      if (!target) throw new Error("Alvo não definido para o ataque.");

      // Lógica para modificador de atributo (ex: Força ou Destreza)
      // TODO: Implementar um método em Player/Monster para buscar o modificador do atributo
      // const attributeMod = this.actor.getAttributeModifier(this.weapon.attribute);
      // modifiers.push({ value: attributeMod, source: 'Atributo' });
    }

    if (this.type === "saving_throw") {
      // Lógica para bônus de proficiência em saving throws, se aplicável
    }

    // 3. Coleta de modificadores situacionais do CombatState
    //TODO: Also added this exclamation to build, check later
    const activeEffects = combatState.getActiveEffectsFor(this.actor.id!);
    for (const effect of activeEffects) {
      if (effect.bonus) {
        const bonusRoll = DiceRoller.roll(effect.bonus);
        modifiers.push({ value: bonusRoll.total, source: effect.name });
      }
      if (effect.penalty) {
        modifiers.push({ value: effect.penalty, source: effect.name });
      }
    }

    // 4. Cálculo do resultado final
    const finalResult =
      roll.total + modifiers.reduce((sum, mod) => sum + mod.value, 0);

    // 5. Retorna o objeto de resultado
    return new ActionResult(roll, modifiers, finalResult);
  }
}
