import { Pencil, X } from 'lucide-react';
import { Button } from './components/ui/button';
import { Card } from './components/ui/card';
import { Stage } from './TempData';

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
  return (
    <Card
      onClick={props.onClick}
      key={props.stage.name}
      className={`border- flex h-[70px] w-full cursor-pointer flex-col items-center justify-center p-2 hover:brightness-95 hover:filter ${
        props.color
      } ${props.selected ? 'border-[2px] border-blue-300' : ''}`}
    >
      <h1 className=" text-base">{props.stage.name}</h1>
      <p className="text-xs text-muted-foreground">{props.stage.desc}</p>
    </Card>
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
