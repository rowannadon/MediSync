import { cn } from '@/lib/utils';
import { Tabs, TabsList, TabsTrigger } from './components/ui/tabs';
import { useEffect, useState } from 'react';

interface SidebarNavProps extends React.HTMLAttributes<HTMLElement> {
  items: {
    title: string;
    id: string;
  }[];
  selected: string;
  setSelected: (id: string) => void;
}

export function SidebarNav({ items, setSelected }: SidebarNavProps) {
  const [selected, setSelectedLocal] = useState('information');

  useEffect(() => {
    setSelected(selected);
  }, [selected]);

  return (
    <div className="ml-4 mr-4 mt-1 flex max-h-[40px] flex-grow">
      <Tabs
        className="flex flex-grow"
        defaultValue="information"
        onValueChange={(v) => setSelectedLocal(v)}
      >
        <TabsList className="grid w-full grid-cols-3 bg-background">
          {items.map((item) => (
            <TabsTrigger
              key={item.id}
              value={item.id}
              className="rounded-lg bg-background"
              style={{
                backgroundColor:
                  item.id === selected ? '#f0f0f0' : 'background',
              }}
            >
              {item.title}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
    </div>
  );
}
