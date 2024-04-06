import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from './components/ui/form';
import { Input } from './components/ui/input';
import { Button } from './components/ui/button';
import { useEffect } from 'react';
import { Textarea } from './components/ui/textarea';
import { displayedPeople, Person, Procedure, Stage, stages } from './TempData';
import { Rocket } from 'lucide-react';
import { PathwayLaunchEditorFormResourceField } from './PathwayLaunchEditorFormResourceField';
import { Card } from './components/ui/card';
import { Table, TableBody, TableCell, TableRow } from './components/ui/table';
import { ScrollArea } from './components/ui/scroll-area';
import { DateTimePicker } from '@/components/ui/date-time-picker/date-time-picker';

const pathwayFormSchema = z.object({
  title: z
    .string()
    .min(2, {
      message: 'Title must be at least 2 characters.',
    })
    .max(30, {
      message: 'Title must not be longer than 30 characters.',
    }),
  patient: z.string({
    required_error: 'Please select a patient.',
  }),
  desc: z.string({
    required_error: 'Please add a description.',
  }),
  staff: z.array(z.object({ staff: z.string(), stage: z.string() })),
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

export const mapStageToOutputs = (stage: Stage | null) => {
  if (!stage || stage.next === null) {
    return [];
  } else if (typeof stage.next === 'string') {
    return [
      {
        type: 'scheduledOutput',
        title: 'Scheduled Output',
        date: stage.date,
        stage: stage.name,
      },
    ];
  } else if (Array.isArray(stage.next)) {
    return stage.next.map((_, index) => ({
      type: 'scheduledOutput',
      title: `Scheduled Output ${index + 1}`,
      date: stage.date,
      stage: stage.name,
    }));
  } else {
    return [];
  }
};

type PathwayFormValues = z.infer<typeof pathwayFormSchema>;

interface PathwayLaunchEditorFormProps
  extends React.HTMLAttributes<HTMLElement> {
  pathway: Procedure | null;
  selectedPathwayPropertyType: string;
}

export function PathwayLaunchEditorForm(props: PathwayLaunchEditorFormProps) {
  const defaultValues: Partial<PathwayFormValues> = {
    title: props.pathway?.title || '',
    patient: props.pathway?.patient || '',
    desc: props.pathway?.desc || '',
  };

  const form = useForm<PathwayFormValues>({
    resolver: zodResolver(pathwayFormSchema),
    defaultValues,
  });

  useEffect(() => {
    if (props.pathway) {
      form.setValue('title', props.pathway?.title);
      form.setValue('patient', props.pathway?.patient);
      form.setValue('desc', props.pathway?.desc);
      form.setValue(
        'staff',
        props.pathway?.stages.flatMap((stage) =>
          stage.required_staff.map((staff) => ({
            staff: staff,
            stage: stage.name,
          })),
        ),
      );
      form.setValue(
        'equipment',
        props.pathway?.stages.flatMap((stage) =>
          stage.required_equipment.map((eq) => ({
            type: eq.type,
            count: eq.count,
            desc: eq.desc,
            stage: stage.name,
          })),
        ),
      );
      form.setValue(
        'outputs',
        props.pathway?.stages.flatMap((stage) => mapStageToOutputs(stage)),
      );
    }
  }, [props.pathway, form]);

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
      {props.pathway && (
        <div className="flex flex-grow flex-row">
          <ScrollArea
            className="flex-grow pr-8"
            style={{ maxHeight: 'calc(100vh - 100px)' }}
          >
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="mb-4 mt-4 flex-grow space-y-8"
              >
                {props.selectedPathwayPropertyType === 'information' && (
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                          <Input placeholder="Stage title" {...field} />
                        </FormControl>
                        <FormDescription>
                          This is the title of the stage that will be displayed
                          for the running pathway.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
                {props.selectedPathwayPropertyType === 'information' && (
                  <FormField
                    control={form.control}
                    name="desc"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Description</FormLabel>
                        <Textarea placeholder="" {...field} />

                        <FormDescription>
                          Add a description of the procedure to be performed.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
                {props.selectedPathwayPropertyType === 'information' && (
                  <FormField
                    control={form.control}
                    name="patient"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Patient</FormLabel>
                        <Input placeholder="" {...field} />

                        <FormDescription>Add a patient.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
                {props.selectedPathwayPropertyType === 'resources' && (
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
                                                    types={displayedPeople.map(
                                                      (p: Person) => p.name,
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
                {props.selectedPathwayPropertyType === 'resources' && (
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
                                <div key={stage}>
                                  <FormLabel>{stage}</FormLabel>
                                  <Card>
                                    <Table>
                                      <TableBody>
                                        {eqByStage[stage].map(
                                          (eq: EquipmentType) => {
                                            //console.log(staff)
                                            return (
                                              <TableRow
                                                key={eq.type}
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
                {props.selectedPathwayPropertyType === 'schedule' && (
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
                                          (output: OutputType) => {
                                            //console.log(staff)
                                            return (
                                              <TableRow
                                                key={output.title}
                                                className="flex flex-row justify-between"
                                              >
                                                <TableCell>
                                                  {output.title}
                                                </TableCell>
                                                <TableCell>
                                                  <PathwayLaunchEditorFormResourceField
                                                    name={output.type}
                                                    types={displayedPeople.map(
                                                      (p: Person) => p.name,
                                                    )}
                                                    options={[
                                                      'Scheduled',
                                                      'Next Available',
                                                      'Delay',
                                                    ]}
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
              </form>
            </Form>
          </ScrollArea>
        </div>
      )}
    </div>
  );
}
