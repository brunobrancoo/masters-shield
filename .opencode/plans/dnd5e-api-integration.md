# D&D 5e API Integration Plan

## Overview

Integrate the [D&D 5e SRD API](https://5e-bits.github.io/docs/api) into Master's Shield Digital to enable:
- Monster search and import from official 5e sources
- Spell data enrichment for player characters  
- Equipment/item data from SRD
- Class, race, and feat reference data

## API Details

**Base URL:** `https://www.dnd5eapi.co/graphql`

The API supports **GraphQL natively** at the `/graphql` endpoint, making it perfect for GraphQL Code Generator integration.

## Implementation Phases

### Phase 1: Dependencies & Configuration

#### 1.1 Install Dependencies

```bash
npm install @tanstack/react-query axios
npm install -D @graphql-codegen/cli @graphql-codegen/typescript @graphql-codegen/typescript-operations @graphql-codegen/typescript-react-query graphql
```

#### 1.2 GraphQL Code Generator Configuration

Create `graphql-codegen.ts`:

```typescript
import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  schema: 'https://www.dnd5eapi.co/graphql',
  documents: 'lib/graphql/**/*.graphql',
  generates: {
    'lib/generated/': {
      preset: 'client',
      plugins: [],
      presetConfig: {
        gqlTagName: 'gql',
      },
    },
  },
};

export default config;
```

Update `package.json`:

```json
{
  "scripts": {
    "codegen": "graphql-codegen --config graphql-codegen.ts",
    "codegen:watch": "graphql-codegen --config graphql-codegen.ts --watch"
  }
}
```

#### 1.3 Create GraphQL Documents

Create `lib/graphql/monsters.graphql`:

```graphql
query GetMonsters($name: String) {
  monsters(name: $name) {
    index
    name
    type
    challenge_rating
    hit_points
    armor_class {
      value
      type
    }
  }
}

query GetMonster($index: String!) {
  monster(index: $index) {
    index
    name
    size
    type
    alignment
    armor_class {
      value
      type
    }
    hit_points
    hit_dice
    speed {
      walk
      fly
      swim
    }
    strength
    dexterity
    constitution
    intelligence
    wisdom
    charisma
    proficiencies {
      value
      proficiency {
        name
      }
    }
    damage_vulnerabilities
    damage_resistances
    damage_immunities
    condition_immunities {
      name
    }
    senses {
      passive_perception
      darkvision
    }
    languages
    challenge_rating
    xp
    special_abilities {
      name
      desc
    }
    actions {
      name
      desc
      attack_bonus
      damage {
        damage_type {
          name
        }
        damage_dice
      }
    }
  }
}
```

Create `lib/graphql/spells.graphql`:

```graphql
query GetSpells($name: String, $level: Int) {
  spells(name: $name, level: $level) {
    index
    name
    level
    school {
      name
    }
  }
}

query GetSpell($index: String!) {
  spell(index: $index) {
    index
    name
    desc
    higher_level
    range
    components
    material
    ritual
    duration
    concentration
    casting_time
    level
    school {
      name
    }
    classes {
      name
    }
  }
}
```

### Phase 2: API Client Setup

#### 2.1 Create GraphQL Client

Create `lib/graphql/client.ts`:

```typescript
import { GraphQLClient } from 'graphql-request';

export const graphqlClient = new GraphQLClient('https://www.dnd5eapi.co/graphql', {
  headers: {
    'Content-Type': 'application/json',
  },
});
```

#### 2.2 Create React Query Hooks

Create `lib/api/hooks.ts`:

```typescript
import { useQuery } from '@tanstack/react-query';
import { graphqlClient } from '@/lib/graphql/client';
import {
  GetMonstersDocument,
  GetMonsterDocument,
  GetSpellsDocument,
  GetSpellDocument,
} from '@/lib/generated/graphql';

export function useMonsters(name?: string) {
  return useQuery({
    queryKey: ['monsters', name],
    queryFn: async () => {
      return graphqlClient.request(GetMonstersDocument, { name });
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

export function useSpells(name?: string, level?: number) {
  return useQuery({
    queryKey: ['spells', name, level],
    queryFn: async () => {
      return graphqlClient.request(GetSpellsDocument, { name, level });
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
```

### Phase 3: Data Mapping Layer

Create `lib/api/mappers.ts`:

```typescript
import type { Monster, Item } from '@/lib/interfaces/interfaces';
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
  
  const lines = [
    `CA: ${apiMonster.armor_class?.map((ac) => `${ac?.value} (${ac?.type})`).join(', ')}`,
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
```

### Phase 4: UI Integration

#### 4.1 Update MonsterList with API Search

Update `components/monster-list.tsx`:

```typescript
import { useState } from 'react';
import { useMonsters, useMonster } from '@/lib/api/hooks';
import { mapGraphQLMonsterToMonster } from '@/lib/api/mappers';
import { graphqlClient } from '@/lib/graphql/client';
import { GetMonsterDocument } from '@/lib/generated/graphql';

export function MonsterList({ monsters, onSelectMonster, onDeleteMonster }: MonsterListProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showApiSearch, setShowApiSearch] = useState(false);
  
  const { data: searchResults, isLoading } = useMonsters(searchQuery);
  
  const handleImportMonster = async (monsterIndex: string) => {
    const data = await graphqlClient.request(GetMonsterDocument, { index: monsterIndex });
    if (data.monster) {
      const mappedMonster = mapGraphQLMonsterToMonster(data.monster);
      onSelectMonster({ ...mappedMonster, id: crypto.randomUUID() } as Monster);
    }
  };
  
  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Input
          placeholder="Buscar monstros..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <Button 
          variant="outline" 
          onClick={() => setShowApiSearch(!showApiSearch)}
        >
          {showApiSearch ? 'Local' : 'API 5e'}
        </Button>
      </div>
      
      {showApiSearch && (
        <Card className="bg-muted">
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground mb-2">
              Resultados da API D&D 5e
            </p>
            {isLoading ? (
              <p>Carregando...</p>
            ) : (
              <ScrollArea className="h-64">
                <div className="space-y-2">
                  {searchResults?.monsters?.map((monster) => (
                    <div 
                      key={monster?.index}
                      className="flex justify-between items-center p-2 border rounded"
                    >
                      <div>
                        <span className="font-medium">{monster?.name}</span>
                        <span className="text-sm text-muted-foreground ml-2">
                          ND {monster?.challenge_rating}
                        </span>
                      </div>
                      <Button 
                        size="sm" 
                        onClick={() => handleImportMonster(monster?.index || '')}
                      >
                        Importar
                      </Button>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            )}
          </CardContent>
        </Card>
      )}
      
      {/* Existing local monsters list */}
    </div>
  );
}
```

#### 4.2 Create Monster Import Dialog

Create `components/monster-api-import.tsx`:

```typescript
'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent } from '@/components/ui/card';
import { useMonsters } from '@/lib/api/hooks';
import { mapGraphQLMonsterToMonster } from '@/lib/api/mappers';
import { graphqlClient } from '@/lib/graphql/client';
import { GetMonsterDocument } from '@/lib/generated/graphql';
import type { Monster } from '@/lib/interfaces/interfaces';

interface MonsterApiImportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onImport: (monster: Monster) => void;
}

export function MonsterApiImportDialog({ 
  open, 
  onOpenChange, 
  onImport 
}: MonsterApiImportDialogProps) {
  const [searchQuery, setSearchQuery] = useState('');
  
  const { data, isLoading } = useMonsters(searchQuery);
  
  const handleImport = async (monsterIndex: string) => {
    const result = await graphqlClient.request(GetMonsterDocument, { index: monsterIndex });
    if (result.monster) {
      const mapped = mapGraphQLMonsterToMonster(result.monster);
      onImport({ ...mapped, id: crypto.randomUUID() } as Monster);
      onOpenChange(false);
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Importar Monstro da API D&D 5e</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <Input
            placeholder="Buscar monstro..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          
          <ScrollArea className="h-96">
            {isLoading ? (
              <p className="text-center py-8">Carregando...</p>
            ) : (
              <div className="space-y-2">
                {data?.monsters?.map((monster) => (
                  <Card key={monster?.index}>
                    <CardContent className="p-4 flex justify-between items-center">
                      <div>
                        <p className="font-bold">{monster?.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {monster?.type} • ND {monster?.challenge_rating}
                        </p>
                      </div>
                      <Button onClick={() => handleImport(monster?.index || '')}>
                        Importar
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
}
```

### Phase 5: Additional GraphQL Queries

Add more queries as needed:

Create `lib/graphql/classes.graphql`:

```graphql
query GetClasses {
  classes {
    index
    name
    hit_die
  }
}

query GetClass($index: String!) {
  class(index: $index) {
    index
    name
    hit_die
    proficiencies {
      name
    }
    saving_throws {
      name
    }
  }
}
```

Create `lib/graphql/races.graphql`:

```graphql
query GetRaces {
  races {
    index
    name
    speed
  }
}

query GetRace($index: String!) {
  race(index: $index) {
    index
    name
    speed
    ability_bonuses {
      ability_score {
        name
      }
      bonus
    }
  }
}
```

## Implementation Steps

### Step 1: Install and Configure
```bash
npm install @tanstack/react-query graphql-request
npm install -D @graphql-codegen/cli @graphql-codegen/client-preset

# Run codegen
npx graphql-codegen --config graphql-codegen.ts
```

### Step 2: Add QueryClient Provider
Update `app/layout.tsx`:

```typescript
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      refetchOnWindowFocus: false,
    },
  },
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}
```

### Step 3: Test the Integration
1. Import the `MonsterApiImportDialog` component
2. Add a button to open it in the monster list
3. Test importing a monster from the API
4. Verify the data mapping works correctly

## Key Considerations

### Data Mapping
- API uses English field names (strength, dexterity) → App uses Portuguese abbreviations (for, des)
- API has more detailed data than the app's model (legendary actions, lair actions)
- Map only the fields needed by the app

### Caching Strategy
- GraphQL queries cached by React Query
- Monster data rarely changes, use long staleTime
- Consider persisting cache to localStorage

### Error Handling
- Handle network errors gracefully
- Show loading states during API calls
- Validate imported data before saving

## Next Steps

1. Run `npm install` with the dependencies
2. Run `npx graphql-codegen init` for interactive setup
3. Create the GraphQL document files
4. Run `npm run codegen` to generate types
5. Implement the MonsterApiImportDialog
6. Test with a few monster imports
7. Add spell/equipment integration

## Resources

- [D&D 5e API Documentation](https://5e-bits.github.io/docs/api)
- [GraphQL Code Generator](https://the-guild.dev/graphql/codegen)
- [Apollo Sandbox Explorer](https://studio.apollographql.com/sandbox/explorer) (for testing queries)
