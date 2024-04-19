import { Handle, Position } from 'reactflow';
import { StageDisplay } from './StageDisplay';
import { PathwayStage, StageType } from './DataTypes';
import { useRemoteDataStore } from './RemoteDataStore';

export function StageNode(props: any) {
  const stage = props.data.stage;
  const getStageTemplate = useRemoteDataStore(
    (state) => state.getStageTemplate,
  );
  const template = getStageTemplate(stage.template);

  const mapStageToHandles = (stage: PathwayStage | null) => {
    if (!stage || stage.next === null || !Array.isArray(stage.next)) {
      return [];
    }

    const width = 268;
    const length = template?.outputs.length || 1;

    const padding = width / (length + 1);

    const totalWidth = width - padding * 2;
    const spaceBetween = length > 1 ? totalWidth / (length - 1) : 1;

    return (
      template &&
      template.outputs.map((output, index) => {
        const left = index * spaceBetween;
        return (
          <Handle
            key={index}
            style={{ left: left + padding }}
            id={`${output}$${index.toString()}`}
            type="source"
            position={Position.Bottom}
          />
        );
      })
    );
  };

  return (
    <>
      <StageDisplay
        stage={template ? template : stage}
        onClick={null}
        selected={props.selected}
      />
      {mapStageToHandles(stage)}
      <Handle type="target" position={Position.Top} />
    </>
  );
}
