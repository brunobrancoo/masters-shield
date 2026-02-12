# Plan: Homebrew Tabs for Add Item Dialog

## Overview
Refactor `components/add-item-dialog.tsx` to use a tabbed interface with two tabs:
- **API Tab**: Search and select items from D&D 5e API (existing behavior)
- **Homebrew Tab**: Search and select from a campaign-specific "homebrews" subcollection

---

## 1. Add UI Tabs Component

### 1.1 Verify Tabs Component
- The shadcn Tabs component already exists at `components/ui/tabs.tsx`
- Components: `Tabs`, `TabsList`, `TabsTrigger`, `TabsContent`
- No installation needed

### 1.2 Update AddItemDialog Props
Add `campaignId` prop to access the campaign's homebrews subcollection:
```typescript
interface AddItemDialogProps {
  onAdd: (item: Item) => void;
  campaignId: string; // NEW
}
```

---

## 2. Create Homebrew Interface/Type

### 2.1 Define Homebrew Type in interfaces
Add to `lib/interfaces/interfaces.ts`:
```typescript
export interface Homebrew {
  id: string;
  name: string;
  itemType: "item" | "spell" | "feat" | "feature";
  item?: Item;
  spell?: Spell;
  feat?: {
    index: string;
    name: string;
    desc: string[];
    prerequisites: string[];
  };
  feature?: {
    index: string;
    name: string;
    desc: string[];
    level: number;
    source: string;
    class?: string;
    subclass?: string;
  };
  createdAt?: any; // Firestore timestamp
  updatedAt?: any; // Firestore timestamp
}
```

**Note:** Schema based on D&D 5e GraphQL API:
- `feat` has `index`, `name`, `desc` (array), `prerequisites` (array)
- `feature` has `index`, `name`, `desc` (array), `level`, `source`, `class`, `subclass` references

---

## 3. Firebase Storage Functions

### 3.1 Add Homebrew CRUD Functions to `lib/firebase-storage.ts`

#### Get Homebrews
```typescript
export function getHomebrews(campaignId: string) {
  return getDocs(collection(db, "campaigns", campaignId, "homebrews"));
}
```

#### Create Homebrew
```typescript
export async function createHomebrew(
  campaignId: string,
  homebrew: Omit<Homebrew, "id" | "createdAt" | "updatedAt">,
): Promise<string> {
  const homebrewRef = await addDoc(
    collection(db, "campaigns", campaignId, "homebrews"),
    {
      ...homebrew,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    },
  );
  return homebrewRef.id;
}
```

#### onHomebrewsChange (Real-time listener)
```typescript
export function onHomebrewsChange(
  campaignId: string,
  callback: (homebrews: Homebrew[]) => void,
) {
  const q = collection(db, "campaigns", campaignId, "homebrews");
  const unsubscribe = onSnapshot(q, (snapshot) => {
    const homebrews = snapshot.docs.map(
      (doc) => ({ id: doc.id, ...doc.data() }) as Homebrew,
    );
    callback(homebrews);
  });
  return unsubscribe;
}
```

---

## 4. Update AddItemDialog Component

### 4.1 Add Tabs State
```typescript
const [activeTab, setActiveTab] = useState<"api" | "homebrew">("api");
const [homebrewSearchQuery, setHomebrewSearchQuery] = useState("");
const debouncedHomebrewSearchQuery = useDebounce(homebrewSearchQuery, 300);
```

### 4.2 Add Homebrew Data Fetching
```typescript
const [homebrews, setHomebrews] = useState<Homebrew[]>([]);

useEffect(() => {
  if (!campaignId) return;
  
  const unsubscribe = onHomebrewsChange(campaignId, (data) => {
    setHomebrews(data);
  });
  
  return () => unsubscribe();
}, [campaignId]);
```

### 4.3 Filter Homebrew by Search
```typescript
const filteredHomebrews = useMemo(() => {
  if (!debouncedHomebrewSearchQuery) {
    return homebrews.filter(hb => hb.itemType === "item");
  }
  
  return homebrews.filter(hb => {
    return (
      hb.itemType === "item" &&
      hb.name.toLowerCase().includes(debouncedHomebrewSearchQuery.toLowerCase())
    );
  });
}, [homebrews, debouncedHomebrewSearchQuery]);
```

### 4.4 Handle Homebrew Selection
```typescript
const handleSelectHomebrewItem = (homebrew: Homebrew) => {
  setSelectedItemIndex(null);
  
  if (homebrew.item) {
    setValue("name", homebrew.item.name, { shouldDirty: true });
    setValue("type", homebrew.item.type, { shouldDirty: true });
    setValue("price", homebrew.item.price, { shouldDirty: true });
    setValue("distance", homebrew.item.distance, { shouldDirty: true });
    setValue("damage.dice", homebrew.item.damage.dice, { shouldDirty: true });
    setValue("damage.number", homebrew.item.damage.number, { shouldDirty: true });
    setValue("damage.type", homebrew.item.damage.type, { shouldDirty: true });
    setValue("magic", homebrew.item.magic, { shouldDirty: true });
    setValue("attackbonus", homebrew.item.attackbonus, { shouldDirty: true });
    setValue("defensebonus", homebrew.item.defensebonus, { shouldDirty: true });
    setValue("notes", homebrew.item.notes, { shouldDirty: true });
    setValue("equipped", homebrew.item.equipped, { shouldDirty: true });
  }
  
  setTimeout(() => trigger(), 0);
};
```

### 4.5 Handle Form Submission with Homebrew Save
Update `onSubmit` to save to homebrews when applicable:
```typescript
const onSubmit = async (data: ItemFormData) => {
  const item: Item = { ...data, equipped: false };
  onAdd(item);
  
  // Check if item came from homebrew or is a new custom item
  const selectedHomebrew = filteredHomebrews.find(hb => hb.name === data.name);
  
  if (!selectedHomebrew && campaignId) {
    // Save new item to homebrews if it wasn't from API
    try {
      await createHomebrew(campaignId, {
        name: data.name,
        itemType: "item",
        item: item,
      });
    } catch (error) {
      console.error("Failed to save to homebrew:", error);
    }
  }
  
  reset();
  setOpen(false);
  setSearchQuery("");
  setHomebrewSearchQuery("");
  setSelectedItemIndex(null);
};
```

### 4.6 Update JSX with Tabs
Replace current API search section with tabbed interface:

```tsx
<Tabs defaultValue="api" value={activeTab} onValueChange={(v) => setActiveTab(v as "api" | "homebrew")}>
  <TabsList className="w-full">
    <TabsTrigger value="api">API D&D 5e</TabsTrigger>
    <TabsTrigger value="homebrew">Homebrew</TabsTrigger>
  </TabsList>

  {/* API Tab */}
  <TabsContent value="api">
    {/* Existing API search section */}
    <div className="bg-bg-surface rounded-lg border border-border-default p-6 shadow-lg">
      <Label className="font-heading text-sm uppercase tracking-wider text-text-secondary mb-4 block flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-arcane-400 animate-pulse"></span>
        Buscar na API D&D 5e
      </Label>
      {/* Existing API search input and results */}
    </div>
  </TabsContent>

  {/* Homebrew Tab */}
  <TabsContent value="homebrew">
    <div className="bg-bg-surface rounded-lg border border-border-default p-6 shadow-lg">
      <Label className="font-heading text-sm uppercase tracking-wider text-text-secondary mb-4 block flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-nature-400 animate-pulse"></span>
        Buscar na coleção Homebrew
      </Label>
      
      <div className="flex items-center gap-3">
        <Input
          placeholder="Digite para buscar itens homebrew..."
          value={homebrewSearchQuery}
          onChange={(e) => {
            setHomebrewSearchQuery(e.target.value);
            setSelectedItemIndex(null);
          }}
          className="bg-bg-inset border-border-default focus:border-nature-400 h-11 flex-1"
        />
      </div>
      
      <div className="mt-4 border border-border-default rounded-md bg-bg-inset max-h-72 overflow-y-auto">
        {filteredHomebrews.length === 0 ? (
          <div className="p-6 text-center">
            <p className="text-sm text-text-secondary">
              {homebrewSearchQuery 
                ? `Nenhum item homebrew encontrado para "${homebrewSearchQuery}"`
                : "Nenhum item homebrew adicionado ainda"}
            </p>
            <p className="text-xs text-text-tertiary mt-1">
              Itens adicionados manualmente aparecerão aqui
            </p>
          </div>
        ) : (
          <div className="divide-y divide-border-subtle">
            {filteredHomebrews.map((homebrew) => (
              <button
                key={homebrew.id}
                type="button"
                onClick={() => handleSelectHomebrewItem(homebrew)}
                className="w-full text-left px-4 py-3 hover:bg-bg-surface transition-all flex justify-between items-center"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm">{homebrew.name}</span>
                    <Badge className="text-[10px] bg-nature-400/20 text-nature-400">
                      Custom
                    </Badge>
                  </div>
                  {homebrew.item?.notes && (
                    <p className="text-xs text-text-tertiary mt-1 line-clamp-1">
                      {homebrew.item.notes}
                    </p>
                  )}
                </div>
                <Plus className="w-4 h-4 text-nature-400" />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  </TabsContent>
</Tabs>
```

---

## 5. Update Parent Component Prop Passing

### 5.1 Update PlayerInventorySection
Pass `campaignId` to AddItemDialog:
```typescript
interface PlayerInventorySectionProps {
  player: Player;
  editItemIndex: number | null;
  setEditItemIndex: (index: number | null) => void;
  onAddItem: (item: Item) => void;
  onRemoveItem: (index: number) => void;
  onToggleEquip: (index: number) => void;
  onUpdateItem: (index: number, updatedItem: Item) => void;
  campaignId: string; // NEW
}
```

### 5.2 Update PlayerPage
Pass `campaignId` to PlayerInventorySection:
```typescript
<PlayerInventorySection 
  player={player} 
  editItemIndex={editItemIndex} 
  setEditItemIndex={setEditItemIndex} 
  onAddItem={addItem} 
  onRemoveItem={removeItem} 
  onToggleEquip={toggleEquip} 
  onUpdateItem={updateItem}
  campaignId={campaignId || ""} // NEW
/>
```

---

## 6. Implementation Order

1. **First**: Add `Homebrew` interface to `lib/interfaces/interfaces.ts`
2. **Second**: Add Firebase functions to `lib/firebase-storage.ts`
3. **Third**: Update `AddItemDialog` props and component to use tabs
4. **Fourth**: Update `PlayerInventorySection` props
5. **Fifth**: Update `PlayerPage` to pass campaignId
6. **Last**: Test implementation (add item from API, add item from homebrew, verify homebrew saving)

---

## 7. UI Notes

### 7.1 Visual Differentiation
- API tab: Use arcane/purple color scheme (icon: wand/sparkles)
- Homebrew tab: Use nature/green color scheme (icon: leaf/plus)

### 7.2 Empty States
- API tab: Shows instruction to search with examples ("sword", "armor", "shield")
- Homebrew tab: Shows "No homebrew items added yet" with instruction that manually added items will appear here

### 7.3 Badge Styling
- API items: Show category badge (Weapon, Armor, Gear)
- Homebrew items: Show "Custom" badge in nature/green color

---

## 8. Edge Cases

### 8.1 Missing campaignId
- If `campaignId` is not provided, homebrew tab should be disabled or show warning
- Homebrew features only work within a campaign context

### 8.2 Homebrew Item Types
- Initial implementation only supports items ( itemType: "item" )
- Future expansion: Support spells, feats, abilities with different tabs or dialogs

### 8.3 Data Validation
- Ensure homebrew item has all required Item fields before adding to player inventory
- Handle cases where homebrew.item might be partially filled

---

## 9. Future Enhancements (Out of Scope)

- Support for spells in homebrew (would require AddSpellDialog integration)
- Support for feats/abilities in homebrew
- Edit/delete homebrew items from the tab
- Import/export homebrew collections between campaigns
- Share homebrew items with other campaigns
