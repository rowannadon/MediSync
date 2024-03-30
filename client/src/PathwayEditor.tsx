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
} from 'reactflow';
import 'reactflow/dist/style.css';
import { useCallback, useState } from 'react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from './components/ui/tooltip';

const initialNodes = [
  {
    id: '1',
    data: { label: 'START' },
    position: { x: 100, y: 0 },
    type: 'input',
  },
  {
    id: '2',
    data: { label: 'END' },
    position: { x: 0, y: 200 },
  },
  {
    id: '3',
    data: { label: 'END2' },
    position: { x: 200, y: 200 },
  },
  {
    id: '4',
    data: { label: 'DECISION' },
    position: { x: 100, y: 100 },
  },
];

const initialEdges: Edge[] = [
  { id: '1-4', source: '1', target: '4', type: 'default' },
  { id: '4-2', source: '4', target: '2', type: 'default' },
  { id: '4-3', source: '4', target: '3', type: 'default' },
];

const PathwayEditor = () => {
  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState<Edge[]>(initialEdges);
  const [selectedNode, setSelectedNode] = useState<any>(null);

  const onNodesChange = useCallback(
    (changes: any) => {
      setNodes((nds) => applyNodeChanges(changes, nds));
      console.log(changes);
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
          <Card className="mb-2 mt-2 flex w-[200px]">
            <Accordion
              type="single"
              collapsible
              className="w-full text-foreground"
            >
              <AccordionItem value="Stages">
                <AccordionTrigger className="p-2">Stages</AccordionTrigger>
                <AccordionContent className="space-y-2 p-2">
                  <Card>
                    <h1 className="flex h-[50px] items-center justify-center text-xl">
                      START
                    </h1>
                  </Card>
                  <Card>
                    <h1 className="flex h-[50px] items-center justify-center text-xl">
                      END
                    </h1>
                  </Card>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="Decisions">
                <AccordionTrigger className="p-2">Decisions</AccordionTrigger>
                <AccordionContent className="space-y-2 p-2">
                  <Card>
                    <h1 className="flex h-[50px] items-center justify-center text-xl">
                      DECISION 1
                    </h1>
                  </Card>
                  <Card>
                    <h1 className="flex h-[50px] items-center justify-center text-xl">
                      DECISION 2
                    </h1>
                  </Card>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </Card>
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
                  <h1 className="text-xl font-bold">My Pathway Template</h1>
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
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              fitView
            >
              <Background className="bg-secondary" />
              <Controls />
            </ReactFlow>
          </div>
          <Card className="mb-2 mr-2 mt-2 flex w-[300px] p-2">
            {selectedNode === null && <h1>No node selected...</h1>}
            {selectedNode && <p>{JSON.stringify(selectedNode)}</p>}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PathwayEditor;
