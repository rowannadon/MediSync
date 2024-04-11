import { Handle, Position } from 'reactflow';
import { StageDisplay } from './StageDisplay';
import { PathwayStage, StageType } from './TempData';
import { useRemoteDataStore } from './RemoteDataStore';
import { get } from 'lodash';

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

    const length = stage.next.length;
    if (length <= 1) {
      return [
        <Handle
          key={1}
          id={template?.name}
          type="source"
          position={Position.Bottom}
        />,
      ];
    }

    const padding = 40;
    const totalWidth = 260 - padding * 2;
    const spaceBetween = totalWidth / (length - 1);

    return stage.next.map((_, index) => {
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
  };

  const handles = mapStageToHandles(stage);

  return (
    <>
      <StageDisplay
        stage={template ? template : stage}
        onClick={null}
        selected={props.selected}
      />
      {handles}
      <Handle type="target" position={Position.Top} />
    </>
  );
}
