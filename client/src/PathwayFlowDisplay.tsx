import ReactFlow, {
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  Background,
  Controls,
  Edge,
  Node,
  Position,
  ReactFlowProvider,
  useReactFlow,
  useStoreApi,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { PathwayStage, PathwayTemplate } from './DataTypes';
import { StageNode } from './StageNode';
import { useDrop } from 'react-dnd';
import { v4 as uuid } from 'uuid';
import './flow.css';
import { useRemoteDataStore } from './RemoteDataStore';
import { useLocalDataStore } from './LocalDataStore';
import dagre from 'dagre';

const convertToNodesAndEdges = (
  stages: PathwayStage[],
): { nodes: Node[]; edges: Edge[] } => {
  const nodes: Node[] = [];
  const edges: Edge[] = [];

  stages.forEach((stage) => {
    if (!nodes.find((n) => n.id === stage.id)) {
      nodes.push({
        id: stage.id,
        data: { stage: stage, depth: 0 },
        position: { x: 0, y: 0 },
        type: 'stage',
      });
    }

    if (stage.next) {
      for (let i = 0; i < stage.next.length; i++) {
        const val = Object.values(stage.next[i])[0];
        const key = Object.keys(stage.next[i])[0];
        edges.push({
          id: `${stage.id}=${val}`,
          source: stage.id,
          target: val,
          type: 'default',
          sourceHandle: `${key}$${i}`,
        });
      }
    }
  });

  return { nodes, edges };
};

interface PathwayEditorInnerProps {
  control: boolean;
}

const PathwayEditorInner = ({ control }: PathwayEditorInnerProps) => {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [selectedNode, setSelectedNode] = useState<any>(null);
  const dropRef = useRef<HTMLDivElement>(null);
  const nodeTypes = useMemo(() => ({ stage: StageNode }), []);
  const flow = useReactFlow();
  const addStageToPathwayTemplate = useRemoteDataStore(
    (state) => state.addStageToPathwayTemplate,
  );
  const removeStageFromPathwayTemplate = useRemoteDataStore(
    (state) => state.removeStageFromPathwayTemplate,
  );

  const addNextToPathwayStage = useRemoteDataStore(
    (state) => state.addNextToPathwayStage,
  );
  const removeNextFromPathwayStage = useRemoteDataStore(
    (state) => state.removeNextFromPathwayStage,
  );
  const getStageTemplate = useRemoteDataStore(
    (state) => state.getStageTemplate,
  );
  const stageTemplates = useRemoteDataStore((state) => state.stages);
  const selectedPathway = useLocalDataStore((state) => state.selectedPathway);
  const selectedPathwayRef = useRef(selectedPathway);

  useEffect(() => {
    selectedPathwayRef.current = selectedPathway;
    if (selectedPathway && selectedPathway.stages.length > 0) {
      const convertedNodesAndEdges = convertToNodesAndEdges(
        selectedPathway.stages,
      );
      const layoutedElements = getLayoutedElements(
        convertedNodesAndEdges.nodes,
        convertedNodesAndEdges.edges,
      );
      setNodes(layoutedElements.nodes);
      setEdges(layoutedElements.edges);
      setTimeout(() => flow.fitView({ duration: 300 }), 100);
    } else {
      setNodes([]);
      setEdges([]);
    }
  }, [selectedPathway]);

  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));

  const nodeWidth = 250;
  const nodeHeight = 50;

  const getLayoutedElements = (
    nodes: Node[],
    edges: Edge[],
    direction = 'TB',
  ) => {
    const isHorizontal = direction === 'LR';
    dagreGraph.setGraph({ rankdir: direction });

    nodes.forEach((node) => {
      dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
    });

    edges.forEach((edge) => {
      dagreGraph.setEdge(edge.source, edge.target);
    });

    dagre.layout(dagreGraph);

    nodes.forEach((node) => {
      const nodeWithPosition = dagreGraph.node(node.id);
      node.targetPosition = isHorizontal
        ? ('left' as Position)
        : ('top' as Position);
      node.sourcePosition = isHorizontal
        ? ('right' as Position)
        : ('bottom' as Position);

      node.position = {
        x: nodeWithPosition.x - nodeWidth / 2,
        y: nodeWithPosition.y - nodeHeight / 2,
      };

      return node;
    });

    return { nodes, edges };
  };

  const handleNodeAdded = useCallback(
    (change: any) => {
      const addedNode = nodes.find((node) => node.id === change.id);
      if (
        addedNode &&
        selectedPathway &&
        !selectedPathway.stages.some((stage) => stage.id === addedNode.id)
      ) {
        console.log('adding stage');
        addStageToPathwayTemplate(selectedPathway.id, addedNode.data.stage);
      }
    },
    [nodes, selectedPathway, addStageToPathwayTemplate],
  );

  const handleNodeRemoved = useCallback(
    (change: any) => {
      const removedNode = nodes.find((node) => node.id === change.id);
      if (
        removedNode &&
        selectedPathway &&
        selectedPathway.stages.some((stage) => stage.id === removedNode.id)
      ) {
        removeStageFromPathwayTemplate(
          selectedPathway.id,
          removedNode.data.stage.id,
        );
      }
    },
    [nodes, selectedPathway, removeStageFromPathwayTemplate],
  );

  const handleEdgeCreated = useCallback(
    (params: any) => {
      console.log(params);
      if (!selectedPathway) return;
      const sourceStage = selectedPathway.stages.find(
        (node) => node.id === params.source,
      );
      const targetStage = selectedPathway.stages.find(
        (node) => node.id === params.target,
      );

      console.log(sourceStage, targetStage);
      if (sourceStage && targetStage) {
        console.log('adding edge');
        console.log(params.sourceHandle.split('$')[0]);
        addNextToPathwayStage(
          selectedPathway.id,
          sourceStage.id,
          targetStage.id,
          params.sourceHandle.split('$')[0],
        );
      }
    },
    [addNextToPathwayStage, selectedPathway],
  );

  const handleEdgeChanged = useCallback(
    (changes: any) => {
      changes.forEach((change: any) => {
        if (change.type === 'remove') {
          const [sourceId, targetId] = change.id.split('=');
          if (selectedPathway) {
            const sourceStage = selectedPathway.stages.find(
              (node) => node.id === sourceId,
            );
            const targetStage = selectedPathway.stages.find(
              (node) => node.id === targetId,
            );

            if (sourceStage && targetStage) {
              console.log('removing edge');
              removeNextFromPathwayStage(
                selectedPathway.id,
                sourceStage.id,
                targetStage.id,
              );
            }
          }
        }
      });
    },
    [removeNextFromPathwayStage, selectedPathway],
  );

  const onNodesChange = useCallback(
    (changes: any) => {
      setNodes((nds) => applyNodeChanges(changes, nds));
      changes.forEach((change: any) => {
        if (change.type === 'dimensions') {
          handleNodeAdded(change);
        }
        if (change.type === 'remove') {
          handleNodeRemoved(change);
        }
        if (change.type === 'select' && change.selected) {
          setSelectedNode(nodes.find((node) => node.id === change.id));
        }
      });
    },
    [nodes, handleNodeAdded, handleNodeRemoved],
  );

  const onConnect = useCallback(
    (params: any) => {
      handleEdgeCreated(params);
      setEdges((eds: Edge[]) => {
        return addEdge(params, eds);
      });
    },
    [handleEdgeCreated],
  );

  const onEdgesChange = useCallback(
    (changes: any) => {
      handleEdgeChanged(changes);
      setEdges((eds: Edge[]) => {
        return applyEdgeChanges(changes, eds);
      });
    },
    [handleEdgeChanged],
  );

  const getCorrectDroppedOffsetValue = (
    initialPosition: any,
    finalPosition: any,
  ) => {
    // get the container (view port) position by react ref...
    if (!dropRef.current) return { x: 0, y: 0 };
    const dropTargetPosition = dropRef.current.getBoundingClientRect();

    const { y: finalY, x: finalX } = finalPosition;
    const { y: initialY, x: initialX } = initialPosition;

    // calculate the correct position removing the viewport position.
    // finalY > initialY, I'm dragging down, otherwise, dragging up
    const newYposition =
      finalY > initialY
        ? initialY + (finalY - initialY) - dropTargetPosition.top
        : initialY - (initialY - finalY) - dropTargetPosition.top;

    const newXposition =
      finalX > initialX
        ? initialX + (finalX - initialX) - dropTargetPosition.left
        : initialX - (initialX - finalX) - dropTargetPosition.left;

    return {
      x: newXposition,
      y: newYposition,
    };
  };

  const handleStageDropped = (item: any, monitor: any) => {
    const stage = item.props.stage;
    const pathwayStage = {
      id: uuid(),
      template: stage.id,
      next: [],
      start: false,
    };

    const coords = getCorrectDroppedOffsetValue(
      monitor.getInitialSourceClientOffset(),
      monitor.getSourceClientOffset(),
    );
    const state = store.getState();
    const zoomMultiplier = 1 / state.transform[2];
    const newNode: Node = {
      id: pathwayStage.id,
      data: { stage: pathwayStage },
      position: {
        x: (coords.x - state.transform[0]) * zoomMultiplier,
        y: (coords.y - state.transform[1]) * zoomMultiplier,
      },
      type: 'stage',
    };
    console.log(
      stageTemplates.find((template) => template.id === pathwayStage.template),
    );
    console.log(pathwayStage.template);
    console.log(getStageTemplate(pathwayStage.template));
    setNodes((prevNodes) => [...prevNodes, newNode]);
  };

  const store = useStoreApi();

  const [{ canDrop, isOver }, dropTarget] = useDrop(() => ({
    // The type (or types) to accept - strings or symbols
    accept: 'stage',
    // Props to collect
    drop: (item: any, monitor: any) => {
      console.log(selectedPathwayRef.current);
      if (selectedPathwayRef.current) {
        handleStageDropped(item, monitor);
      }
    },
    collect: (monitor: any) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  }));

  return (
    <div className="flex flex-grow" ref={dropRef}>
      <ReactFlow
        ref={dropTarget}
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onConnect={control ? onConnect : undefined}
        onNodesChange={control ? onNodesChange : undefined}
        onEdgesChange={control ? onEdgesChange : undefined}
        fitView
        selectNodesOnDrag={control}
      >
        <Background className="bg-secondary" />
        <Controls />
      </ReactFlow>
    </div>
  );
};

function PathwayFlowDisplay(props: any) {
  return (
    <ReactFlowProvider>
      <PathwayEditorInner {...props} />
    </ReactFlowProvider>
  );
}

export default PathwayFlowDisplay;
