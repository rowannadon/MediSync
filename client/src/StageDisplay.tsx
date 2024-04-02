import { Card } from './components/ui/card';
import { Stage } from './TempData';
import { useDrag } from 'react-dnd';

interface StageProps {
  stage: Stage;
  onClick: any;
  selected: boolean;
}

const Display = (props: {
  stage: Stage;
  color: string;
  onClick: any;
  selected: boolean;
}) => {
  const [{ isDragging }, drag, dragPreview] = useDrag(() => ({
    // "type" is required. It is used by the "accept" specification of drop targets.
    type: 'stage',
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
        key={props.stage.name}
        className={`m-0 flex min-h-[70px] min-w-[260px] cursor-pointer flex-col items-center justify-center p-2 hover:brightness-95 hover:filter ${
          props.color
        } ${props.selected ? 'border-[2px] border-blue-300' : ''}`}
      >
        <h1 className=" text-base">{props.stage.name}</h1>
        <p className="text-center text-xs text-muted-foreground">
          {props.stage.desc}
        </p>
      </Card>
    </div>
  );
};

export const StageDisplay = ({ stage, onClick, selected }: StageProps) => {
  if (stage.type === 'post-operative') {
    return (
      <Display
        stage={stage}
        color="bg-green-200"
        onClick={onClick}
        selected={selected}
      />
    );
  } else if (stage.type === 'peri-operative') {
    return (
      <Display
        stage={stage}
        color="bg-yellow-200"
        onClick={onClick}
        selected={selected}
      />
    );
  } else if (stage.type === 'pre-operative') {
    return (
      <Display
        stage={stage}
        color="bg-red-200"
        onClick={onClick}
        selected={selected}
      />
    );
  } else {
    return null;
  }
};
