import {
  FilePlus,
  FolderOpen,
  Plus,
  RefreshCcw,
  Save,
  Trash,
} from 'lucide-react';
import NavMenu from './NavMenu';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from './components/ui/accordion';
import { Button } from './components/ui/button';
import { Card } from './components/ui/card';
import ReactFlow, {
  applyEdgeChanges,
  applyNodeChanges,
  Background,
  Controls,
  Edge,
  Node,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from './components/ui/tooltip';
import { StageLibrary } from './StageLibrary';
import { Procedure, procedures, Stage } from './TempData';
import { StageNode } from './StageNode';

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
      data: { label: node.name, stage: node },
      position: { x: nodesByDepth[depth].length * 310, y: y },
      type: 'stage',
    });

    nodesByDepth[depth].push(nodes[nodes.length - 1]);

    let nextDepth = depth;
    if (Array.isArray(node.next)) {
      for (const nextNode of node.next) {
        edges.push({
          id: `${node.name}-${nextNode}`,
          source: node.name,
          target: nextNode,
          type: 'default',
        });
        nextDepth = Math.max(nextDepth, traverse(nextNode, depth + 1));
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

  return { nodes, edges, nodesByDepth };
}

const PathwayEditor = () => {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [selectedNode, setSelectedNode] = useState<any>(null);

  const nodeTypes = useMemo(() => ({ stage: StageNode }), []);

  useEffect(() => {
    if (procedures[0]) {
      const startStage = procedures[0].stages.find(
        (stage) => stage.start !== null,
      );
      console.log(startStage);
      if (startStage) {
        const convertedNodesAndEdges = convertToNodesAndEdges(
          procedures[0].stages,
          startStage.name,
        );
        setNodes(convertedNodesAndEdges.nodes);
        setEdges(convertedNodesAndEdges.edges);
        console.log('tests: ', [convertedNodesAndEdges.nodesByDepth]);
      }
    }
  }, [procedures]);

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

  const onEdgesChange = useCallback(
    (changes: any) => setEdges((eds: Edge[]) => applyEdgeChanges(changes, eds)),
    [],
  );

  return (
    <div className="flex h-screen max-h-screen w-screen flex-row overflow-clip bg-secondary">
      <NavMenu />
      <div className="h-screen max-h-screen flex-grow">
        <div className="flex flex-grow flex-row">
          <StageLibrary className="w-[300px]" />
          <div className="flex h-screen flex-grow flex-col">
            <Card className="space-between ml-2 mr-2 mt-2 flex flex-row">
              <TooltipProvider>
                <div className="flex flex-grow flex-row space-x-2 p-1">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="outline" size="icon" className="h-8 w-8">
                        <FilePlus className="h-6 w-6" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="bottom" sideOffset={5}>
                      <p>New</p>
                    </TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="outline" size="icon" className="h-8 w-8">
                        <Save className="h-6 w-6" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="bottom" sideOffset={5}>
                      <p>Save</p>
                    </TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="outline" size="icon" className="h-8 w-8">
                        <FolderOpen className="h-6 w-6" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="bottom" sideOffset={5}>
                      <p>Open</p>
                    </TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="outline" size="icon" className="h-8 w-8">
                        <RefreshCcw className="h-6 w-6" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="bottom" sideOffset={5}>
                      <p>Reload</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
                <div className="flex flex-grow flex-row items-center p-1">
                  <h1 className="text-lg">My Pathway Template</h1>
                </div>
                <div className="flex flex-grow flex-row-reverse space-x-2 space-x-reverse p-1">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="outline" size="icon" className="h-8 w-8">
                        <Plus className="h-6 w-6" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="bottom" sideOffset={5}>
                      <p>Add Node</p>
                    </TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="outline" size="icon" className="h-8 w-8">
                        <Trash className="h-6 w-6" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="bottom" sideOffset={5}>
                      <p>Delete Node</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
              </TooltipProvider>
            </Card>
            <ReactFlow
              nodes={nodes}
              edges={edges}
              nodeTypes={nodeTypes}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              fitView
            >
              <Background className="bg-secondary" />
              <Controls />
            </ReactFlow>
          </div>
          <Card className="mb-2 mr-2 mt-2 flex w-[300px] p-4">
            {selectedNode === null && <h1>No node selected...</h1>}
            {selectedNode && (
              <p className="break-all">{JSON.stringify(selectedNode)}</p>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PathwayEditor;
