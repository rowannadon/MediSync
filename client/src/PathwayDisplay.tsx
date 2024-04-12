import { Card } from './components/ui/card';
import { nodeColors, PathwayTemplate } from './TempData';
import { useDrag } from 'react-dnd';

interface PathwayProps {
  pathway: PathwayTemplate;
  onClick: any;
  selected: boolean;
}

const Display = (props: {
  pathway: PathwayTemplate;
  onClick: any;
  selected: boolean;
}) => {
  const [{ isDragging }, drag, dragPreview] = useDrag(() => ({
    // "type" is required. It is used by the "accept" specification of drop targets.
    type: 'pathway',
    item: { props },
    // The collect function utilizes a "monitor" instance (see the Overview for what this is)
    // to pull important pieces of state from the DnD system.
    collect: (monitor: any) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  return (
    <div
      ref={dragPreview}
      style={{ opacity: isDragging ? 0.8 : 1 }}
      className=" mr-2 bg-transparent"
    >
      <Card
        ref={drag}
        onClick={props.onClick}
        key={props.pathway.title}
        style={{
          backgroundColor: nodeColors['pathway'],
        }}
        className={`m-0 flex min-h-[70px] min-w-[260px] max-w-[260px] cursor-pointer flex-col items-center justify-center border-[2px] border-transparent p-2 hover:brightness-95 hover:filter
         ${props.selected ? 'border-[#888]' : ''}`}
      >
        <h1 className="text-center text-base">{props.pathway.title}</h1>
        <p className="text-center text-xs text-muted-foreground">
          {props.pathway.desc}
        </p>
      </Card>
    </div>
  );
};

export const PathwayDisplay = ({
  pathway,
  onClick,
  selected,
}: PathwayProps) => {
  return <Display pathway={pathway} onClick={onClick} selected={selected} />;
};
