import {
  FilePlus,
  FolderOpen,
  Plus,
  RefreshCcw,
  Save,
  Trash,
} from 'lucide-react';
import NavMenu from './NavMenu';
import { Button } from './components/ui/button';
import { Card } from './components/ui/card';
import ReactFlow, {
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  Background,
  Controls,
  Edge,
  Node,
  ReactFlowInstance,
  ReactFlowProvider,
  useStoreApi,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from './components/ui/tooltip';
import { StageLibrary } from './StageLibrary';
import { Procedure, procedures, Stage } from './TempData';
import { StageNode } from './StageNode';
import { useDrop } from 'react-dnd';
import PathwayFlowDisplay from './PathwayFlowDisplay';
import { PathwayLibrary } from './PathwayLibrary';

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

  nodes.forEach((node) => {
    const nodesAtDepth = nodesByDepth[node.data.depth];
    console.log(nodesAtDepth);
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

const PathwayEditorInner = () => {
  const [selectedPathway, setSelectedPathway] = useState<Procedure | null>(
    procedures[0],
  );

  return (
    <div className="flex h-screen max-h-screen w-screen flex-row bg-secondary">
      <NavMenu />
      <div className="flex h-screen max-h-screen flex-grow flex-row">
        <StageLibrary onStageClick={() => null} selected="" />
        <div className="flex h-screen flex-grow flex-col">
          <Card className="space-between ml-2 mr-2 mt-2 flex flex-row">
            <TooltipProvider>
              <div className="flex flex-1 flex-row space-x-2 p-4">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="icon">
                      <FilePlus className="h-6 w-6" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" sideOffset={5}>
                    <p>New</p>
                  </TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="icon">
                      <RefreshCcw className="h-6 w-6" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" sideOffset={5}>
                    <p>Reload</p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <div className="flex flex-grow flex-row items-center justify-center p-4">
                <h1 className="  text-lg font-bold">Pathway Template Editor</h1>
              </div>
              <div className="flex flex-1 flex-row-reverse space-x-2 space-x-reverse p-4">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="icon">
                      <Plus className="h-6 w-6" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" sideOffset={5}>
                    <p>Add Node</p>
                  </TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="icon">
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
          <PathwayFlowDisplay pathway={selectedPathway} control={true} />
          {/* <Card className="mb-2 mr-2 mt-2 flex w-[300px] p-4">
          {selectedNode === null && <h1>No node selected...</h1>}
          {selectedNode && (
            <p className="break-all">{JSON.stringify(selectedNode)}</p>
          )}
        </Card> */}
        </div>
        <PathwayLibrary
          onPathwayClick={(pathway: Procedure) => {
            console.log(pathway);
            if (selectedPathway !== pathway) {
              setSelectedPathway(pathway);
            } else {
              setSelectedPathway(null);
            }
          }}
          selectedPathway={selectedPathway}
        />
      </div>
    </div>
  );
};

function PathwayEditor(props: any) {
  return (
    <ReactFlowProvider>
      <PathwayEditorInner {...props} />
    </ReactFlowProvider>
  );
}

export default PathwayEditor;