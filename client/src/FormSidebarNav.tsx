import { cn } from '@/lib/utils';

interface SidebarNavProps extends React.HTMLAttributes<HTMLElement> {
  items: {
    title: string;
    id: string;
  }[];
  selected: string;
  setSelected: (id: string) => void;
}

export function SidebarNav({
  className,
  items,
  selected,
  setSelected,
  ...props
}: SidebarNavProps) {
  return (
    <nav
      className={cn(
        'ml-4 mt-4 flex min-w-[150px] flex-shrink flex-col space-y-2 p-1',
        className,
      )}
      {...props}
    >
      {items.map((item) => (
        <div
          key={item.id}
          onClick={() => setSelected(item.id)}
          className={cn(
            'flex w-full cursor-pointer items-center rounded-lg p-2 pl-4 text-center font-semibold text-muted-foreground',
            selected === item.id
              ? 'bg-muted text-foreground'
              : 'hover:bg-muted hover:underline',
            'justify-start',
          )}
        >
          {item.title}
        </div>
      ))}
    </nav>
  );
}
