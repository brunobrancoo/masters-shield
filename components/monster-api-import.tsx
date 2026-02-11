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
