import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import {
  Form,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from './components/ui/form';
import { Button } from './components/ui/button';
import { useEffect, useState } from 'react';
import { Textarea } from './components/ui/textarea';
import { outputTypes, Person, PathwayTemplate } from './TempData';
import { ChevronDown, Rocket } from 'lucide-react';
import { PathwayLaunchEditorFormResourceField } from './PathwayLaunchEditorFormResourceField';
import { Card } from './components/ui/card';
import { Table, TableBody, TableCell, TableRow } from './components/ui/table';
import { ScrollArea } from './components/ui/scroll-area';
import { DateTimePicker } from '@/components/ui/date-time-picker/date-time-picker';
import { useRemoteDataStore } from './RemoteDataStore';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from './components/ui/popover';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from './components/ui/command';

const pathwayFormSchema = z.object({
  patient: z.string({
    required_error: 'Please select a patient.',
  }),
  notes: z.string(),
  startDate: z.string(),
  staff: z.array(
    z.object({ staff: z.string(), stage: z.string(), selected: z.string() }),
  ),
  equipment: z.array(
    z.object({
      type: z.string(),
      count: z.number(),
      desc: z.string(),
      stage: z.string(),
    }),
  ),
  outputs: z.array(
    z.object({
      type: z.string(),
      title: z.string(),
      date: z.string(),
      stage: z.string(),
    }),
  ),
});

interface StaffType {
  staff: string;
  stage: string;
}

interface EquipmentType {
  type: string;
  count: number;
  desc: string;
  stage: string;
}

interface OutputType {
  type: string;
  title: string;
  date: string;
  stage: string;
}

type PathwayFormValues = z.infer<typeof pathwayFormSchema>;

interface PathwayLaunchEditorFormProps
  extends React.HTMLAttributes<HTMLElement> {
  pathway: PathwayTemplate | null;
  selectedPathwayPropertyType: string;
}

export function PathwayLaunchEditorForm({
  pathway,
  selectedPathwayPropertyType,
}: PathwayLaunchEditorFormProps) {
  const defaultValues: Partial<PathwayFormValues> = {
    patient: '',
    notes: '',
    startDate: '',
  };

  const people = useRemoteDataStore((state) => state.people);
  const getStageTemplate = useRemoteDataStore(
    (state) => state.getStageTemplate,
  );

  const form = useForm<PathwayFormValues>({
    resolver: zodResolver(pathwayFormSchema),
    defaultValues,
  });

  useEffect(() => {
    if (pathway) {
      form.setValue(
        'staff',
        pathway?.stages.flatMap((stage) => {
          const template = getStageTemplate(stage.template);
          if (!template) return [];
          return template.required_staff.map((staff) => ({
            staff: staff,
            stage: template.name,
            selected: 'Automatic',
          }));
        }),
      );
      form.setValue(
        'equipment',
        pathway?.stages.flatMap((stage) => {
          const template = getStageTemplate(stage.template);
          if (!template) return [];
          return template.required_equipment.map((eq) => ({
            type: eq.type,
            count: eq.count,
            desc: eq.desc,
            stage: template.name,
          }));
        }),
      );
      form.setValue(
        'outputs',
        pathway?.stages.flatMap((stage) => {
          const template = getStageTemplate(stage.template);
          if (!template) return [];
          return template.outputs.map((output) => ({
            type: output,
            title: output,
            date: '',
            stage: template.name,
          }));
        }),
      );
    }
  }, [pathway, form]);

  function onSubmit(data: PathwayFormValues) {
    console.log(data);
  }

  function splitArrayByProperty<ArrayType>(arr: ArrayType[], prop: string) {
    if (!arr) return null;
    return arr.reduce((acc: any, obj: any) => {
      const key = obj[prop];
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(obj);
      return acc;
    }, {});
  }

  return (
    <div className="flex flex-grow flex-col">
      {pathway && (
        <div className="flex flex-grow flex-row">
          <ScrollArea
            className="flex-grow pr-8"
            style={{ maxHeight: 'calc(100vh - 100px)' }}
          >
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="m-1 mb-4 mt-4 flex-grow space-y-8"
              >
                {selectedPathwayPropertyType === 'information' && (
                  <FormField
                    control={form.control}
                    name="patient"
                    render={({ field }) => {
                      const [open, setOpen] = useState(false);
                      return (
                        <FormItem className="flex flex-col">
                          <FormLabel>Patient</FormLabel>
                          <Popover open={open}>
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-8 w-[200px] border-dashed"
                                onClick={() => setOpen(!open)}
                              >
                                <div className="flex flex-grow flex-row justify-between">
                                  <ChevronDown className="mr-2 h-4 w-4" />
                                  <div className="flex-grow text-center">
                                    {field.value}
                                  </div>
                                </div>
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent
                              className="w-[200px] p-0"
                              align="start"
                            >
                              <Command>
                                <CommandInput
                                  placeholder={`Search for ${name}`}
                                />
                                <CommandList>
                                  <CommandEmpty>No results found.</CommandEmpty>
                                  <CommandGroup>
                                    {people.map((person) => {
                                      return (
                                        <CommandItem
                                          key={person.name}
                                          onSelect={() => {
                                            setOpen(false);
                                            field.onChange(person.name);
                                          }}
                                        >
                                          <span>{person.name}</span>
                                        </CommandItem>
                                      );
                                    })}
                                  </CommandGroup>
                                </CommandList>
                              </Command>
                            </PopoverContent>
                          </Popover>
                          <FormDescription>Add a patient.</FormDescription>
                          <FormMessage />
                        </FormItem>
                      );
                    }}
                  />
                )}
                {selectedPathwayPropertyType === 'information' && (
                  <FormField
                    control={form.control}
                    name="notes"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Notes</FormLabel>
                        <Textarea {...field} />

                        <FormDescription>
                          Notes about the patient.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
                {selectedPathwayPropertyType === 'information' && (
                  <FormField
                    control={form.control}
                    name="notes"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Start Date</FormLabel>
                        <DateTimePicker
                          granularity={'hour'}
                          aria-label="Launch Date and Time"
                          onChange={(date) => field.onChange(date.toString())}
                        />

                        <FormDescription>Start date.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
                {selectedPathwayPropertyType === 'resources' && (
                  <FormField
                    control={form.control}
                    name="staff"
                    render={({ field }) => {
                      const staffByStage = splitArrayByProperty(
                        field.value,
                        'stage',
                      ) as { [stage: string]: [StaffType] };
                      return (
                        <FormItem className="flex flex-col">
                          {staffByStage &&
                            Object.keys(staffByStage) &&
                            Object.keys(staffByStage).map((stage: string) => {
                              return (
                                <div key={stage}>
                                  <FormLabel>{stage}</FormLabel>
                                  <Card>
                                    <Table>
                                      <TableBody>
                                        {staffByStage[stage].map(
                                          (staff: StaffType) => {
                                            //console.log(staff)
                                            return (
                                              <TableRow
                                                key={staff.staff}
                                                className="flex flex-row justify-between"
                                              >
                                                <TableCell>
                                                  {staff.staff}
                                                </TableCell>
                                                <TableCell>
                                                  <PathwayLaunchEditorFormResourceField
                                                    name={staff.staff}
                                                    onFieldChange={
                                                      field.onChange
                                                    }
                                                    types={Array.from(
                                                      new Set(
                                                        people.map(
                                                          (p: Person) => p.name,
                                                        ),
                                                      ),
                                                    )}
                                                    options={['Automatic']}
                                                  />
                                                </TableCell>
                                              </TableRow>
                                            );
                                          },
                                        )}
                                      </TableBody>
                                    </Table>
                                  </Card>
                                </div>
                              );
                            })}
                          <FormMessage />
                        </FormItem>
                      );
                    }}
                  />
                )}
                {selectedPathwayPropertyType === 'resources' && (
                  <FormField
                    control={form.control}
                    name="equipment"
                    render={({ field }) => {
                      const eqByStage = splitArrayByProperty(
                        field.value,
                        'stage',
                      ) as { [stage: string]: [EquipmentType] };
                      return (
                        <FormItem className="flex flex-col">
                          {eqByStage &&
                            Object.keys(eqByStage) &&
                            Object.keys(eqByStage).map((stage: string) => {
                              return (
                                <div key={`eq-${stage}`}>
                                  <FormLabel>{stage}</FormLabel>
                                  <Card>
                                    <Table>
                                      <TableBody>
                                        {eqByStage[stage].map(
                                          (eq: EquipmentType) => {
                                            //console.log(staff)
                                            return (
                                              <TableRow
                                                key={`${eq.type}-${eq.stage}`}
                                                className="flex flex-row justify-between"
                                              >
                                                <TableCell>{eq.type}</TableCell>
                                                <TableCell>
                                                  {eq.count}
                                                </TableCell>
                                              </TableRow>
                                            );
                                          },
                                        )}
                                      </TableBody>
                                    </Table>
                                  </Card>
                                </div>
                              );
                            })}
                          <FormMessage />
                        </FormItem>
                      );
                    }}
                  />
                )}
                {selectedPathwayPropertyType === 'schedule' && (
                  <FormField
                    control={form.control}
                    name="outputs"
                    render={({ field }) => {
                      const outputsByStage = splitArrayByProperty(
                        field.value,
                        'stage',
                      ) as { [stage: string]: [OutputType] };

                      return (
                        <FormItem className="flex flex-col">
                          {outputsByStage &&
                            Object.keys(outputsByStage) &&
                            Object.keys(outputsByStage).map((stage: string) => {
                              return (
                                <div key={stage}>
                                  <FormLabel>{stage}</FormLabel>
                                  <Card>
                                    <Table>
                                      <TableBody>
                                        {outputsByStage[stage].map(
                                          (output: OutputType, i: number) => {
                                            //console.log(staff)
                                            return (
                                              <TableRow
                                                key={`${output.title}-${stage}-${i}`}
                                                className="flex flex-row justify-between"
                                              >
                                                <TableCell>
                                                  {output.title}
                                                </TableCell>
                                                <TableCell>
                                                  <PathwayLaunchEditorFormResourceField
                                                    onFieldChange={
                                                      field.onChange
                                                    }
                                                    name={output.type}
                                                    types={Array.from(
                                                      new Set(
                                                        people.map(
                                                          (p: Person) => p.name,
                                                        ),
                                                      ),
                                                    )}
                                                    options={Array.from(
                                                      outputTypes,
                                                    )}
                                                  />
                                                </TableCell>
                                                <TableCell>
                                                  <DateTimePicker
                                                    granularity={'hour'}
                                                    aria-label="Launch Date and Time"
                                                  />
                                                </TableCell>
                                              </TableRow>
                                            );
                                          },
                                        )}
                                      </TableBody>
                                    </Table>
                                  </Card>
                                </div>
                              );
                            })}
                          <FormMessage />
                        </FormItem>
                      );
                    }}
                  />
                )}
                <Button variant="default" size="sm" className="flex space-x-2">
                  <Rocket className="h-6 w-6" />
                  <div>Launch Pathway</div>
                </Button>
              </form>
            </Form>
          </ScrollArea>
        </div>
      )}
    </div>
  );
}
