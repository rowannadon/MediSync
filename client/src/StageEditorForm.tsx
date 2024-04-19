import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { isEqual, isMatch } from 'lodash';
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
import { useEffect, useState } from 'react';
import { Textarea } from './components/ui/textarea';
import {
  OutputType,
  outputTypes,
  StageTemplate,
  StageType,
  stageTypes,
} from './DataTypes';
import { StageEditorFormResourceField } from './StageEditorFormResourceField';
import { useRemoteDataStore } from './RemoteDataStore';
import { Separator } from './components/ui/separator';
import { CircleAlert } from 'lucide-react';
import { ScrollArea } from './components/ui/scroll-area';
import { useLocalDataStore } from './LocalDataStore';
import { is } from 'date-fns/locale';

const stageFormSchema = z.object({
  name: z
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
  room: z.string(),
  durationEstimate: z.number(),
  staff: z.array(z.string()),
  equipment: z.array(
    z.object({ type: z.string(), count: z.number(), desc: z.string() }),
  ),
  outputs: z.array(z.string()),
});

type StageFormValues = z.infer<typeof stageFormSchema>;

interface StageEditorFormProps extends React.HTMLAttributes<HTMLElement> {
  stage: StageTemplate;
  selectedStagePropertyType: string;
}

export function StageEditorForm({
  stage,
  selectedStagePropertyType,
}: StageEditorFormProps) {
  const people = useRemoteDataStore((state) => state.people);
  const rooms = useRemoteDataStore((state) => state.rooms);
  const hasChanges = useLocalDataStore((state) => state.hasStageChanges);
  const setHasChanges = useLocalDataStore((state) => state.setHasStageChanges);
  const updateStageTemplate = useRemoteDataStore(
    (state) => state.updateStageTemplate,
  );
  const setSelectedStage = useLocalDataStore((state) => state.setSelectedStage);

  const defaultValues: StageFormValues = {
    name: stage.name,
    type: stage.type,
    desc: stage.desc,
    room: stage.required_room,
    durationEstimate: stage.durationEstimate,
    staff: stage.required_staff,
    equipment: stage.required_equipment,
    outputs: stage.outputs,
  };

  const form = useForm<StageFormValues>({
    resolver: zodResolver(stageFormSchema),
    defaultValues,
  });

  useEffect(() => {
    if (stage && form) {
      setHasChanges(false);
      form.setValue('name', stage.name);
      form.setValue('type', stage.type);
      form.setValue('desc', stage.desc);
      form.setValue('staff', stage.required_staff);
      form.setValue('equipment', stage.required_equipment);
      form.setValue('room', stage.required_room);
      form.setValue('durationEstimate', stage.durationEstimate);
      form.setValue('outputs', stage.outputs || []);
    }
  }, [stage]);

  function onSubmit(data: StageFormValues) {
    console.log(data);
    const newStageTemplate: StageTemplate = {
      ...stage,
      name: data.name,
      type: data.type as StageType,
      desc: data.desc,
      required_staff: data.staff,
      required_equipment: data.equipment,
      required_room: data.room,
      durationEstimate: data.durationEstimate,
      outputs: data.outputs as OutputType[],
    };
    updateStageTemplate(newStageTemplate);
    setSelectedStage(newStageTemplate);
  }

  const computeChangedState = () => {
    const formValues = form.getValues();
    const newStageTemplate: StageTemplate = {
      ...stage,
      name: formValues.name,
      type: formValues.type as StageType,
      desc: formValues.desc,
      required_staff: formValues.staff,
      required_equipment: formValues.equipment,
      required_room: formValues.room,
      durationEstimate: formValues.durationEstimate,
      outputs: formValues.outputs as OutputType[],
    };

    const changed = !isEqual(newStageTemplate, stage);
    console.log('changed', changed);
    setHasChanges(changed);
  };

  useEffect(() => {
    computeChangedState();
  }, [form.watch()]);

  return (
    <div className="relative flex flex-grow">
      {hasChanges && (
        <div className="absolute right-4 top-4 flex flex-row items-center rounded-lg bg-red-400 p-2 text-sm text-white">
          <CircleAlert className="mr-2" />
          Not Saved
        </div>
      )}
      {stage && (
        <div className="flex flex-grow flex-row overflow-auto pb-4 pl-1 pr-4 pt-4">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex-grow space-y-8"
            >
              {selectedStagePropertyType === 'information' && (
                <FormField
                  control={form.control}
                  name="name"
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
              {selectedStagePropertyType === 'information' && (
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Stage Category</FormLabel>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
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
              {selectedStagePropertyType === 'information' && (
                <FormField
                  control={form.control}
                  name="room"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Required Room</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger className="w-[180px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>Room</SelectLabel>
                            <SelectItem value="none">None</SelectItem>
                            <Separator className="mb-2 mt-2" />
                            {Array.from(new Set(rooms.map((r) => r.type))).map(
                              (room) => (
                                <SelectItem key={room} value={room}>
                                  {room}
                                </SelectItem>
                              ),
                            )}
                          </SelectGroup>
                        </SelectContent>
                      </Select>

                      <FormDescription>Choose a type of room.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
              {selectedStagePropertyType === 'information' && (
                <FormField
                  control={form.control}
                  name="durationEstimate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Estimated Duration (minutes)</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Estimated duration"
                          {...field}
                          onChange={(e) => {
                            const numberValue = Number(e.target.value);
                            field.onChange(numberValue);
                          }}
                        />
                      </FormControl>
                      <FormDescription>
                        Estimate the duration of the stage for the purpose of
                        scheduling.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
              {selectedStagePropertyType === 'information' && (
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
              {selectedStagePropertyType === 'resources' && (
                <FormField
                  control={form.control}
                  name="staff"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Staff</FormLabel>
                      <StageEditorFormResourceField
                        onChangeResources={(n) => {
                          field.onChange(n.map((n) => n.value));
                        }}
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
              {selectedStagePropertyType === 'resources' && (
                <FormField
                  control={form.control}
                  name="equipment"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Equipment</FormLabel>
                      <StageEditorFormResourceField
                        onChangeResources={(n) => {
                          field.onChange(
                            n.map((n) => {
                              return {
                                type: n.value,
                                count: n.count,
                                desc: n.desc,
                              };
                            }),
                          );
                        }}
                        key={JSON.stringify(field.value)}
                        displayAll={false}
                        displayIndex={false}
                        name="Equipment"
                        count={true}
                        items={field.value.map((v: any) => ({
                          value: v.type,
                          count: v.count,
                          desc: v.desc,
                        }))}
                        resources={rooms
                          .flatMap((r) => r.equipment)
                          .reduce(
                            (
                              acc: {
                                value: string;
                                count: number;
                                desc: string;
                              }[],
                              e,
                            ) => {
                              const foundIndex = acc.findIndex(
                                (a) => a.value === e.type,
                              );
                              if (foundIndex === -1) {
                                acc.push({
                                  value: e.type,
                                  count: 1,
                                  desc: e.desc,
                                });
                              }
                              return acc;
                            },
                            [],
                          )}
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
              {selectedStagePropertyType === 'outputs' && (
                <FormField
                  control={form.control}
                  name="outputs"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Outputs</FormLabel>
                      <StageEditorFormResourceField
                        onChangeResources={(n) => {
                          field.onChange(n.map((n) => n.value));
                        }}
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
