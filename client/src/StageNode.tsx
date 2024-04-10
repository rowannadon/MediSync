import { Handle, Position } from 'reactflow';
import { StageDisplay } from './StageDisplay';
import { Stage } from './TempData';

export function StageNode(props: any) {
  const stage = props.data.stage;

  const mapStageToHandles = (stage: Stage | null) => {
    if (!stage || stage.next === null) {
      return [];
    } else if (typeof stage.next === 'string') {
      return [
        <Handle
          key={1}
          id={stage.name}
          type="source"
          position={Position.Bottom}
        />,
      ];
    } else if (Array.isArray(stage.next)) {
      const length = stage.next.length;
      return stage.next.map((_, index) => {
        const padding = 40;
        const totalWidth = 260 - padding * 2;
        const spaceBetween = totalWidth / (length - 1);
        const left = index * spaceBetween;
        return (
          <Handle
            key={index}
            style={{ left: left + padding }}
            id={index.toString()}
            type="source"
            position={Position.Bottom}
          />
        );
      });
    } else {
      return [];
    }
  };

  return (
    <>
      <StageDisplay
        stage={props.data.stage}
        onClick={null}
        selected={props.selected}
      />
      {mapStageToHandles(stage)}
      <Handle type="target" position={Position.Top} />
    </>
  );
}
