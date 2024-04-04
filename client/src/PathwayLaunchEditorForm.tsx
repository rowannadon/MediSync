import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { date, z } from 'zod';

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
import {
  Select,
  SelectItem,
  SelectLabel,
  SelectContent,
  SelectTrigger,
  SelectValue,
  SelectGroup,
} from './components/ui/select';
import { useEffect } from 'react';
import { Textarea } from './components/ui/textarea';
import {
  displayedPeople,
  displayedRooms,
  Person,
  Procedure,
  Stage,
} from './TempData';
import { Rocket } from 'lucide-react';
import { PathwayLaunchEditorFormResourceField } from './PathwayLaunchEditorFormResourceField';

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
  staff: z.array(z.string()),
  equipment: z.array(
    z.object({ type: z.string(), count: z.number(), desc: z.string() }),
  ),
});

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
        props.pathway?.stages.flatMap((stage: Stage) => stage.required_staff) ||
          [],
      );
      form.setValue(
        'equipment',
        props.pathway?.stages.flatMap(
          (stage: Stage) => stage.required_equipment,
        ) || [],
      );
    }
  }, [props.pathway, form]);

  function onSubmit(data: PathwayFormValues) {
    console.log(data);
  }

  return (
    <div className="w-[50%]">
      {props.pathway && (
        <div className="flex flex-grow flex-row p-2">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex-grow space-y-8"
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
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Staff</FormLabel>
                      {field.value.map((value: string) => {
                        return (
                          <PathwayLaunchEditorFormResourceField
                            name={value}
                            types={displayedPeople.map((p: Person) => p.name)}
                            options={['Schedule Automatic']}
                          />
                        );
                      })}

                      <FormDescription>Select staff</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
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
