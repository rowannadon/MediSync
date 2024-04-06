import ReactFlow, {
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  Background,
  Controls,
  Edge,
  Node,
  ReactFlowProvider,
  useReactFlow,
  useStoreApi,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Procedure, Stage } from './TempData';
import { StageNode } from './StageNode';
import { useDrop } from 'react-dnd';

function convertToNodesAndEdges(
  linkedList: Stage[],
  startingNode: string,
): { nodes: Node[]; edges: Edge[]; nodesByDepth: Node[][] } {
  const nodes: Node[] = [];
  const edges: Edge[] = [];
  const nodesByDepth: Node[][] = [];

  // Function to recursively traverse the linked list and calculate depth
  function traverse(nodeName: string, depth: number): number {
    const node = linkedList.find((node) => node.name === nodeName);
    if (!node) return 0;

    const y = depth * 100;

    if (!nodesByDepth[depth]) {
      nodesByDepth[depth] = [];
    }

    nodes.push({
      id: node.name,
      data: { label: node.name, stage: node, depth: depth },
      position: { x: 0, y: y },
      type: 'stage',
    });

    if (!nodesByDepth[depth].find((n) => n.id === node.name)) {
      nodesByDepth[depth].push(nodes[nodes.length - 1]);
    }

    let nextDepth = depth;
    if (Array.isArray(node.next)) {
      for (let i = 0; i < node.next.length; i++) {
        edges.push({
          id: `${node.name}-${node.next[i]}`,
          source: node.name,
          target: node.next[i],
          type: 'default',
          sourceHandle: i.toString(),
        });
        nextDepth = Math.max(nextDepth, traverse(node.next[i], depth + 1));
      }
    } else if (node.next) {
      edges.push({
        id: `${node.name}-${node.next}`,
        source: node.name,
        target: node.next,
        type: 'default',
      });
      nextDepth = Math.max(nextDepth, traverse(node.next, depth + 1));
    }

    return nextDepth;
  }

  // Start traversing from the provided starting node
  traverse(startingNode, 0);

  nodes.forEach((node) => {
    const nodesAtDepth = nodesByDepth[node.data.depth];
    if (nodesAtDepth.length > 1) {
      const index = nodesAtDepth.findIndex((n) => n.id === node.id);
      if (index > 0) {
        node.position.x = 270 * index;
      }
    } else {
      // if there is only one node at depth, offset by 1/2 of the max number of nodes at any level minus 1
      const max = Math.max(...nodesByDepth.map((n) => n.length));
      node.position.x = 270 * ((max - 1) / 2);
    }
  });

  return { nodes, edges, nodesByDepth };
}

const PathwayEditorInner = (props: {
  pathway: Procedure;
  control: boolean;
}) => {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [selectedNode, setSelectedNode] = useState<any>(null);
  const dropRef = useRef<HTMLDivElement>(null);
  const nodeTypes = useMemo(() => ({ stage: StageNode }), []);
  const flow = useReactFlow();

  useEffect(() => {
    if (props.pathway) {
      const startStage = props.pathway.stages.find(
        (stage) => stage.start !== null,
      );
      if (startStage) {
        const convertedNodesAndEdges = convertToNodesAndEdges(
          props.pathway.stages,
          startStage.name,
        );
        setNodes(convertedNodesAndEdges.nodes);
        setEdges(convertedNodesAndEdges.edges);
        // fit view
        setTimeout(() => flow.fitView({ duration: 300 }), 100);
      }
    }
  }, [props.pathway]);

  const onNodesChange = useCallback(
    (changes: any) => {
      setNodes((nds) => applyNodeChanges(changes, nds));
      //console.log(changes);
      changes.forEach((change: any) => {
        if (change.type === 'select' && change.selected) {
          setSelectedNode(nodes.find((node) => node.id === change.id));
        }
      });
    },
    [nodes],
  );

  const onConnect = useCallback(
    (params: any) => setEdges((eds: Edge[]) => addEdge(params, eds)),
    [],
  );

  const onEdgesChange = useCallback(
    (changes: any) => setEdges((eds: Edge[]) => applyEdgeChanges(changes, eds)),
    [],
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

  const store = useStoreApi();

  const [{ canDrop, isOver }, dropTarget] = useDrop(() => ({
    // The type (or types) to accept - strings or symbols
    accept: 'stage',
    // Props to collect
    drop: (item: any, monitor: any) => {
      const node = item.props.stage;
      console.log(item.props.stage.name);
      const coords = getCorrectDroppedOffsetValue(
        monitor.getInitialSourceClientOffset(),
        monitor.getSourceClientOffset(),
      );
      const state = store.getState();
      const zoomMultiplier = 1 / state.transform[2];
      console.log(state.transform);
      const newNode: Node = {
        id: node.name,
        data: { label: node.name, stage: node },
        position: {
          x: (coords.x - state.transform[0]) * zoomMultiplier,
          y: (coords.y - state.transform[1]) * zoomMultiplier,
        },
        type: 'stage',
      };
      console.log(newNode);
      setNodes((prevNodes) => [...prevNodes, newNode]);
    },
    collect: (monitor: any) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  }));

  const onLoad = (e: any) => {
    console.log(e);
    //reactFlowInstance.fitView();
  };

  return (
    <div className="flex flex-grow" ref={dropRef}>
      <ReactFlow
        ref={dropTarget}
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onConnect={props.control ? onConnect : undefined}
        onNodesChange={props.control ? onNodesChange : undefined}
        onEdgesChange={props.control ? onEdgesChange : undefined}
        fitView
        selectNodesOnDrag={props.control}
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
