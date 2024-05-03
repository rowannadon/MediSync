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
import { outputTypes, Person, PathwayTemplate } from './DataTypes';
import { ChevronDown, Rocket } from 'lucide-react';
import { PathwayLaunchEditorFormResourceField } from './PathwayLaunchEditorFormResourceField';
import { Card } from './components/ui/card';
import { Table, TableBody, TableCell, TableRow } from './components/ui/table';
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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from './components/ui/select';
import { Input } from './components/ui/input';
import { parseAbsolute, getLocalTimeZone } from '@internationalized/date';
import axios from 'axios';
import { template } from 'lodash';

const pathwayFormSchema = z.object({
  patient: z.string({
    required_error: 'Please select a patient.',
  }),
  notes: z.string(),
  startDate: z.string(),
  staff: z.array(
    z.object({
      staff: z.string(),
      stageName: z.string(),
      stageId: z.string(),
      value: z.string(),
    }),
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
      value: z.string(),
      stageId: z.string(),
      stageName: z.string(),
      next: z.string(),
      nextId: z.string(),
    }),
  ),
});

interface StaffType {
  staff: string;
  stageId: string;
  value: string;
  stageName: string;
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
  value: string;
  stageId: string;
  stageName: string;
  next: string;
  nextId: string;
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
            stageName: template.name,
            stageId: template.id,
            value: 'Automatic',
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
        pathway?.stages.flatMap((stage, index) => {
          const template = getStageTemplate(stage.template);
          if (!template) return [];
          const ind =
            template.outputs[index] in outputTypes
              ? template.outputs[index]
              : 'Scheduled';
          return stage.next.map((nextStage, index) => ({
            type: template.outputs[index],
            value: '',
            stageId: template.id,
            stageName: template.name,
            next:
              getStageTemplate(
                pathway?.stages.find(
                  (s) => s.id === nextStage[template.outputs[index]],
                )?.template || '',
              )?.name || '',
            nextId: nextStage[ind] || '',
          }));
        }),
      );
    }
  }, [pathway, form]);

  function onSubmit(data: PathwayFormValues) {
    const m = pathway?.stages.map((stage) => {
      return {
        ...stage,
        template: getStageTemplate(stage.template),
      };
    });
    const d = { form: data, stages: m, pathway: pathway };
    console.log('sending data', d);

    axios.post('/api/runningPathways', d).then((res) => {
      console.log(res);
    }).catch((err) => {
      console.log(err);
    });
  }

  function updateStaff(
    field: any[],
    stage: string,
    staff: string,
    newValue: any,
  ) {
    return field.map((item) =>
      item.stageId === stage && item.staff === staff
        ? { ...item, value: newValue }
        : item,
    );
  }

  function updateOutputType(
    field: any[],
    stage: string,
    nextStage: string,
    type: string,
  ) {
    return field.map((item) =>
      item.stageId === stage && item.next === nextStage
        ? { ...item, type: type }
        : item,
    );
  }

  function updateOutputValue(
    field: any[],
    stage: string,
    nextStage: string,
    value: string,
  ) {
    return field.map((item) =>
      item.stageId === stage && item.next === nextStage
        ? { ...item, value: value }
        : item,
    );
  }

  function getOutputValue(field: any[], stage: string, nextStage: string) {
    return field.find(
      (item) => item.stageId === stage && item.next === nextStage,
    )?.value;
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
    <div className="ml-4 mr-4 flex flex-grow flex-col">
      {pathway && (
        <div className="flex flex-grow flex-row">
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
                  name="startDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Start Date</FormLabel>
                      <DateTimePicker
                        granularity={'hour'}
                        aria-label="Launch Date and Time"
                        value={
                          !!field.value
                            ? parseAbsolute(field.value, getLocalTimeZone())
                            : null
                        }
                        onChange={(date) => {
                          field.onChange(
                            date.toDate(getLocalTimeZone()).toISOString(),
                          );
                        }}
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
                      'stageId',
                    ) as { [stageId: string]: [StaffType] };
                    return (
                      <FormItem className="flex flex-col">
                        {staffByStage &&
                          Object.keys(staffByStage) &&
                          Object.keys(staffByStage).map((stage: string) => {
                            return (
                              <div key={stage}>
                                <FormLabel>
                                  {staffByStage[stage][0].stageName}
                                </FormLabel>
                                <Card>
                                  <Table>
                                    <TableBody>
                                      {staffByStage[stage].map(
                                        (staff: StaffType) => {
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
                                                  initialValue={staff.value}
                                                  onFieldChange={(value) => {
                                                    console.log(value);
                                                    field.onChange(
                                                      updateStaff(
                                                        field.value,
                                                        stage,
                                                        staff.staff,
                                                        value,
                                                      ),
                                                    );
                                                  }}
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
                                              <TableCell>{eq.count}</TableCell>
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
                      'stageId',
                    ) as { [stage: string]: [OutputType] };

                    return (
                      <FormItem className="flex flex-col">
                        {outputsByStage &&
                          Object.keys(outputsByStage) &&
                          Object.keys(outputsByStage).map((stage: string) => {
                            return (
                              <div key={stage}>
                                <FormLabel>
                                  {outputsByStage[stage][0].stageName}
                                </FormLabel>
                                <Card className="flex flex-shrink">
                                  <Table>
                                    <TableBody>
                                      {outputsByStage[stage].map(
                                        (output: OutputType, i: number) => {
                                          return (
                                            <TableRow
                                              key={`${output.title}-${stage}-${i}`}
                                              className="flex flex-row justify-between"
                                            >
                                              <TableCell>
                                                {output.next}
                                              </TableCell>
                                              <TableCell>
                                                <Select
                                                  value={output.type}
                                                  onValueChange={(value) => {
                                                    console.log(value);
                                                    field.onChange(
                                                      updateOutputType(
                                                        field.value,
                                                        stage,
                                                        output.next,
                                                        value,
                                                      ),
                                                    );
                                                  }}
                                                >
                                                  <SelectTrigger className="space-x-2">
                                                    <SelectValue placeholder="Select a scheduling type" />
                                                  </SelectTrigger>
                                                  <SelectContent>
                                                    <SelectGroup>
                                                      <SelectLabel>
                                                        Scheduling
                                                      </SelectLabel>
                                                      {outputTypes.map(
                                                        (type) => (
                                                          <SelectItem
                                                            key={type}
                                                            value={type}
                                                          >
                                                            {type}
                                                          </SelectItem>
                                                        ),
                                                      )}
                                                    </SelectGroup>
                                                  </SelectContent>
                                                </Select>
                                              </TableCell>
                                              {output.type === 'Scheduled' && (
                                                <TableCell>
                                                  <DateTimePicker
                                                    granularity={'hour'}
                                                    aria-label="Launch Date and Time"
                                                    value={
                                                      !!getOutputValue(
                                                        field.value,
                                                        stage,
                                                        output.next,
                                                      )
                                                        ? parseAbsolute(
                                                            getOutputValue(
                                                              field.value,
                                                              stage,
                                                              output.next,
                                                            ),
                                                            getLocalTimeZone(),
                                                          )
                                                        : null
                                                    }
                                                    onChange={(date) => {
                                                      field.onChange(
                                                        updateOutputValue(
                                                          field.value,
                                                          stage,
                                                          output.next,
                                                          date
                                                            .toDate(
                                                              getLocalTimeZone(),
                                                            )
                                                            .toISOString(),
                                                        ),
                                                      );
                                                    }}
                                                  />
                                                </TableCell>
                                              )}
                                              {output.type === 'Delay' && (
                                                <TableCell>
                                                  <Input
                                                    placeholder="Delay in minutes"
                                                    value={
                                                      !!getOutputValue(
                                                        field.value,
                                                        stage,
                                                        output.next,
                                                      )
                                                        ? getOutputValue(
                                                            field.value,
                                                            stage,
                                                            output.next,
                                                          )
                                                        : ''
                                                    }
                                                    onChange={(text) => {
                                                      field.onChange(
                                                        updateOutputValue(
                                                          field.value,
                                                          stage,
                                                          output.next,
                                                          text.target.value,
                                                        ),
                                                      );
                                                    }}
                                                  />
                                                </TableCell>
                                              )}
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
        </div>
      )}
    </div>
  );
}
