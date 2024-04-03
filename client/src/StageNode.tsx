import { Handle, Position } from 'reactflow';
import { StageDisplay } from './StageDisplay';

export function StageNode(props: any) {
  return (
    <>
      <StageDisplay
        stage={props.data.stage}
        onClick={null}
        selected={props.selected}
      />
      <Handle type="target" position={Position.Top} />
      <Handle type="source" position={Position.Bottom} />
    </>
  );
}
