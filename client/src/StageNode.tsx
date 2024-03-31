import { useCallback } from 'react';
import { Handle, Position } from 'reactflow';
import { StageDisplay } from './StageDisplay';

export function StageNode(props: any) {
  return (
    <>
      <Handle type="target" position={Position.Top} />
      <StageDisplay
        stage={props.data.stage}
        onClick={null}
        selected={props.selected}
      />
      <Handle type="source" position={Position.Bottom} id="a" />
    </>
  );
}
