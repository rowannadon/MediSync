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
import { displayedPeople, displayedRooms, Stage } from './TempData';
import { StageEditorFormResourceField } from './StageEditorFormResourceField';

const stageFormSchema = z.object({
  title: z
    .string()
    .min(2, {
      message: 'Title must be at least 2 characters.',
    })
    .max(30, {
      message: 'Title must not be longer than 30 characters.',
    }),
  type: z.string({
    required_error: 'Please select a type.',
  }),
  desc: z.string({
    required_error: 'Please add a description.',
  }),
  staff: z.array(z.string()),
  equipment: z.array(
    z.object({ type: z.string(), count: z.number(), desc: z.string() }),
  ),
  outputs: z.array(z.object({ type: z.string(), title: z.string() })),
});

type StageFormValues = z.infer<typeof stageFormSchema>;

interface StageEditorFormProps extends React.HTMLAttributes<HTMLElement> {
  stage: Stage | null;
  selectedStagePropertyType: string;
}

export function StageEditorForm(props: StageEditorFormProps) {
  const stageTypes = [
    { label: 'Pre-Operative', value: 'pre-operative' },
    { label: 'Peri-Operative', value: 'peri-operative' },
    { label: 'Post-Operative', value: 'post-operative' },
  ];

  const defaultValues: Partial<StageFormValues> = {
    title: props.stage?.name || '',
    type: props.stage?.type || '',
    desc: props.stage?.desc || '',
    staff: props.stage?.required_staff || [],
    equipment: props.stage?.required_equipment || [],
    outputs: [{ type: 'defaultOutput', title: 'Default Output' }],
  };

  const form = useForm<StageFormValues>({
    resolver: zodResolver(stageFormSchema),
    defaultValues,
  });

  useEffect(() => {
    if (props.stage) {
      form.setValue('title', props.stage?.name);
      form.setValue('type', props.stage?.type);
      form.setValue('desc', props.stage?.desc);
      form.setValue('staff', props.stage?.required_staff);
      form.setValue('equipment', props.stage?.required_equipment);

      const mapStageToOutputs = (stage: Stage | null) => {
        if (!stage || stage.next === null) {
          return [];
        } else if (typeof stage.next === 'string') {
          return [
            {
              type: 'Scheduled Output',
              title: 'Scheduled Output',
              date: stage.date,
            },
          ];
        } else if (Array.isArray(stage.next)) {
          return stage.next.map((_, index) => ({
            type: 'Scheduled Output',
            title: `Scheduled Output ${index + 1}`,
            date: stage.date,
          }));
        } else {
          return [];
        }
      };

      form.setValue('outputs', mapStageToOutputs(props.stage));
    }
  }, [props.stage, form]);

  function onSubmit(data: StageFormValues) {
    console.log(data);
  }

  return (
    <div className="flex-grow">
      {props.stage && (
        <div className="flex flex-grow flex-row p-2">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex-grow space-y-8"
            >
              {props.selectedStagePropertyType === 'information' && (
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
                        This is the title of the stage that will be displayed in
                        the stage library and pathway editor.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
              {props.selectedStagePropertyType === 'information' && (
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Stage Category</FormLabel>
                      <Select value={field.value}>
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Select a stage type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>Category</SelectLabel>
                            {stageTypes.map((type) => (
                              <SelectItem key={type.value} value={type.value}>
                                {type.label}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>

                      <FormDescription>
                        Category of the stage in the pathway.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
              {props.selectedStagePropertyType === 'information' && (
                <FormField
                  control={form.control}
                  name="desc"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Description</FormLabel>
                      <Textarea placeholder="" {...field} />

                      <FormDescription>Add a description.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
              {props.selectedStagePropertyType === 'resources' && (
                <FormField
                  control={form.control}
                  name="staff"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Staff</FormLabel>
                      <StageEditorFormResourceField
                        key={JSON.stringify(field.value)}
                        name="Staff"
                        displayAll={false}
                        count={false}
                        items={field.value.map((v: any) => ({
                          value: v,
                          count: 1,
                        }))}
                        resources={Array.from(
                          new Set(displayedPeople.map((p) => p.role)),
                        ).map((p) => ({
                          value: p,
                          count: 1,
                        }))}
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
              {props.selectedStagePropertyType === 'resources' && (
                <FormField
                  control={form.control}
                  name="equipment"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Equipment</FormLabel>
                      <StageEditorFormResourceField
                        key={JSON.stringify(field.value)}
                        displayAll={false}
                        name="Equipment"
                        count={true}
                        items={field.value.map((v: any) => ({
                          value: v.type,
                          count: v.count,
                        }))}
                        resources={Array.from(
                          new Set(
                            displayedRooms
                              .flatMap((r) => r.equipment)
                              .map((p) => p.type),
                          ),
                        ).map((v) => ({ value: v, count: 1 }))}
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
              {props.selectedStagePropertyType === 'outputs' && (
                <FormField
                  control={form.control}
                  name="outputs"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Equipment</FormLabel>
                      <StageEditorFormResourceField
                        key={JSON.stringify(field.value)}
                        name="Outputs"
                        displayAll={true}
                        count={false}
                        items={field.value.map((v: any) => ({
                          value: v.title,
                          count: 1,
                          type: v.type,
                          date: v.date,
                        }))}
                        resources={field.value.map((v: any) => ({
                          value: v.type,
                          count: 1,
                          type: v.type,
                          date: v.date,
                        }))}
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
              <Button type="submit">Save Changes</Button>
            </form>
          </Form>
        </div>
      )}
    </div>
  );
}
