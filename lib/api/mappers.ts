import type { Monster } from '@/lib/interfaces/interfaces';
import type { GetMonsterQuery } from '@/lib/generated/graphql';

export function mapGraphQLMonsterToMonster(
  apiMonster: GetMonsterQuery['monster']
): Partial<Monster> {
  if (!apiMonster) return {};

  return {
    id: apiMonster.index || crypto.randomUUID(),
    name: apiMonster.name,
    type: mapMonsterType(apiMonster.type),
    level: apiMonster.challenge_rating || 1,
    hp: apiMonster.hit_points || 0,
    maxHp: apiMonster.hit_points || 0,
    attributes: {
      for: apiMonster.strength || 10,
      des: apiMonster.dexterity || 10,
      con: apiMonster.constitution || 10,
      int: apiMonster.intelligence || 10,
      sab: apiMonster.wisdom || 10,
      car: apiMonster.charisma || 10,
    },
    skills: apiMonster.special_abilities?.map((a) => a?.name).filter(Boolean) as string[] || [],
    notes: formatMonsterNotes(apiMonster),
  };
}

function mapMonsterType(type: string | undefined | null): string {
  if (!type) return 'Desconhecido';
  
  const typeMap: Record<string, string> = {
    aberration: 'Aberração',
    beast: 'Besta',
    celestial: 'Celestial',
    construct: 'Constructo',
    dragon: 'Dragão',
    elemental: 'Elemental',
    fey: 'Fada',
    fiend: 'Criatura Infernal',
    giant: 'Gigante',
    humanoid: 'Humanoide',
    monstrosity: 'Monstruosidade',
    ooze: 'Limo',
    plant: 'Planta',
    undead: 'Morto-vivo',
  };
  return typeMap[type.toLowerCase()] || type;
}

function formatMonsterNotes(apiMonster: GetMonsterQuery['monster']): string {
  if (!apiMonster) return '';
  
  const acValues = apiMonster.armor_class?.map((ac) => {
    if ('value' in ac && 'type' in ac) {
      return `${ac.value} (${ac.type})`;
    }
    return '';
  }).filter(Boolean).join(', ');
  
  const lines = [
    `CA: ${acValues || 'N/A'}`,
    `PV: ${apiMonster.hit_points}`,
    `Deslocamento: ${apiMonster.speed?.walk || '0 ft'}`,
    `ND: ${apiMonster.challenge_rating}`,
    '',
    'Resistências:',
    ...(apiMonster.damage_resistances?.length ? apiMonster.damage_resistances : ['Nenhuma']),
    '',
    'Imunidades:',
    ...(apiMonster.damage_immunities?.length ? apiMonster.damage_immunities : ['Nenhuma']),
    '',
    'Ações:',
    ...(apiMonster.actions?.map((a) => `- ${a?.name}: ${a?.desc}`) || []),
  ];
  return lines.join('\n');
}
