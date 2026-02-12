import { useQuery } from '@tanstack/react-query';
import { graphqlClient } from '@/lib/graphql/client';
import {
  GetMonstersDocument,
  GetMonsterDocument,
  GetSpellsDocument,
  GetSpellDocument,
  GetClassesDocument,
  GetClassDocument,
  GetRacesDocument,
  GetRaceDocument,
  GetEquipmentDocument,
} from '@/lib/generated/graphql';
import { Spell } from '@/lib/interfaces/interfaces';
import { filterMeaningfulItems } from './utils';

export function useMonsters(name?: string) {
  return useQuery({
    queryKey: ['monsters', name],
    queryFn: async () => {
      const response = await graphqlClient.request(GetMonstersDocument, { name });
      if (response.monsters) {
        return {
          ...response,
          monsters: filterMeaningfulItems(response.monsters),
        };
      }
      return response;
    },
  });
}

export function useMonster(index: string) {
  return useQuery({
    queryKey: ['monster', index],
    queryFn: async () => {
      return graphqlClient.request(GetMonsterDocument, { index });
    },
    enabled: !!index,
  });
}

export function useSpells(name?: string, level?: number[]) {
  return useQuery({
    queryKey: ['spells', name, level],
    queryFn: async () => {
      const response = await graphqlClient.request(GetSpellsDocument, { name, level });
      if (response.spells) {
        return {
          ...response,
          spells: filterMeaningfulItems(response.spells),
        };
      }
      return response;
    },
  });
}

export function useSpell(index: string) {
  return useQuery({
    queryKey: ['spell', index],
    queryFn: async () => {
      return graphqlClient.request(GetSpellDocument, { index });
    },
    enabled: !!index,
  });
}

export function useClasses() {
  return useQuery({
    queryKey: ['classes'],
    queryFn: async () => {
      const response = await graphqlClient.request(GetClassesDocument);
      if (response.classes) {
        return {
          ...response,
          classes: filterMeaningfulItems(response.classes),
        };
      }
      return response;
    },
  });
}

export function useClass(index: string) {
  return useQuery({
    queryKey: ['class', index],
    queryFn: async () => {
      return graphqlClient.request(GetClassDocument, { index });
    },
    enabled: !!index,
  });
}

export function useRaces() {
  return useQuery({
    queryKey: ['races'],
    queryFn: async () => {
      const response = await graphqlClient.request(GetRacesDocument);
      if (response.races) {
        return {
          ...response,
          races: filterMeaningfulItems(response.races),
        };
      }
      return response;
    },
  });
}

export function useRace(index: string) {
  return useQuery({
    queryKey: ['race', index],
    queryFn: async () => {
      return graphqlClient.request(GetRaceDocument, { index });
    },
    enabled: !!index,
  });
}

export function useEquipment(name?: string) {
  return useQuery({
    queryKey: ['equipment', name],
    queryFn: async () => {
      const response = await graphqlClient.request(GetEquipmentDocument, { name });
      if (response.equipments) {
        return {
          ...response,
          equipments: filterMeaningfulItems(response.equipments),
        };
      }
      return response;
    },
  });
}

function mapApiSpellToInterface(spell: any): Spell {
  return {
    index: spell.index || '',
    name: spell.name || '',
    level: spell.level || 0,
    school: spell.school?.name || '',
    castingTime: spell.casting_time || '',
    duration: spell.duration || '',
    range: spell.range || '',
    components: spell.components?.join(', ') || '',
    description: spell.desc || [],
    concentration: spell.concentration || false,
    ritual: spell.ritual || false,
    attackType: spell.attack_type || undefined,
    damage: spell.damage ? {
      damageType: spell.damage.damage_type?.name || undefined,
      damageAtSlotLevel: spell.damage.damage_at_slot_level?.map((v: any) => `${v.level}: ${v.value}`) || [],
    } : undefined,
    dc: spell.dc ? {
      dcType: spell.dc.dc_type?.index || undefined,
      dcSuccess: spell.dc.dc_success || undefined,
    } : undefined,
    areaOfEffect: spell.area_of_effect ? {
      size: spell.area_of_effect.size || undefined,
      type: spell.area_of_effect.type || undefined,
    } : undefined,
    higherLevel: spell.higher_level || [],
    material: spell.material || undefined,
  };
}

export { mapApiSpellToInterface };
export {
  isEmptyObject,
  filterEmptyObjects,
  isMeaningfulItem,
  filterMeaningfulItems,
  sanitizeApiResponse,
} from './utils';