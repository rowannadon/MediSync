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
import { outputTypes, StageTemplate, stageTypes } from './TempData';
import { StageEditorFormResourceField } from './StageEditorFormResourceField';
import { useRemoteDataStore } from './RemoteDataStore';

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
  outputs: z.array(z.string()),
});

type StageFormValues = z.infer<typeof stageFormSchema>;

interface StageEditorFormProps extends React.HTMLAttributes<HTMLElement> {
  stage: StageTemplate | null;
  selectedStagePropertyType: string;
}

export function StageEditorForm(props: StageEditorFormProps) {
  const people = useRemoteDataStore((state) => state.people);
  const rooms = useRemoteDataStore((state) => state.rooms);

  const defaultValues: StageFormValues = {
    title: '',
    type: '',
    desc: '',
    staff: [],
    equipment: [],
    outputs: [],
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
      form.setValue('outputs', props.stage?.outputs || []);
    }
  }, [props.stage, form]);

  function onSubmit(data: StageFormValues) {
    console.log(data);
  }

  return (
    <div className="flex-grow pl-1 pr-1">
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
                              <SelectItem key={type} value={type}>
                                {type}
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
                        displayIndex={false}
                        count={false}
                        items={field.value.map((v: any) => ({
                          value: v,
                          count: 1,
                        }))}
                        resources={Array.from(
                          new Set(people.map((p) => p.role)),
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
                        displayIndex={false}
                        name="Equipment"
                        count={true}
                        items={field.value.map((v: any) => ({
                          value: v.type,
                          count: v.count,
                        }))}
                        resources={Array.from(
                          new Set(
                            rooms
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
                      <FormLabel>Outputs</FormLabel>
                      <StageEditorFormResourceField
                        key={JSON.stringify(field.value)}
                        name="Outputs"
                        displayAll={true}
                        displayIndex={true}
                        count={false}
                        items={field.value.map((v: string) => ({
                          value: v,
                          count: 1,
                        }))}
                        resources={outputTypes.map((v) => ({
                          value: v,
                          count: 1,
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
