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
import { SidebarNav } from './StageEditorSidebarNav';
import { Textarea } from './components/ui/textarea';

const stageFormSchema = z.object({
  title: z
    .string()
    .min(2, {
      message: 'Name must be at least 2 characters.',
    })
    .max(30, {
      message: 'Name must not be longer than 30 characters.',
    }),
  type: z.string({
    required_error: 'Please select a type.',
  }),
  desc: z.string({
    required_error: 'Please add a description.',
  }),
});

type StageFormValues = z.infer<typeof stageFormSchema>;

export function StageEditorForm(props: any) {
  const stageTypes = [
    { label: 'Pre-Operative', value: 'pre-operative' },
    { label: 'Peri-Operative', value: 'peri-operative' },
    { label: 'Post-Operative', value: 'post-operative' },
  ];

  const stagePropertyTypes = [
    { title: 'Information', id: 'information' },
    { title: 'Resources', id: 'resources' },
    { title: 'Scheduling', id: 'schedule' },
    { title: 'Outputs', id: 'outputs' },
  ];

  const [selectedStagePropertyType, setSelectedStagePropertyType] =
    useState('information');

  const defaultValues: Partial<StageFormValues> = {
    title: props.stage?.title || '',
    type: props.stage?.type || '',
    desc: props.stage?.desc || '',
  };

  const form = useForm<StageFormValues>({
    resolver: zodResolver(stageFormSchema),
    defaultValues,
  });

  useEffect(() => {
    console.log(props.stage);
    form.setValue('title', props.stage?.name);
    form.setValue('type', props.stage?.type);
    form.setValue('desc', props.stage?.desc);
    setSelectedStagePropertyType('information');
  }, [props.stage]);

  function onSubmit(data: StageFormValues) {
    console.log(data);
  }

  return (
    <div>
      {props.stage && (
        <div className="flex flex-row space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
          <SidebarNav
            items={stagePropertyTypes}
            selected={selectedStagePropertyType}
            setSelected={setSelectedStagePropertyType}
          />
          <div>
            {selectedStagePropertyType === 'information' && (
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-8"
                >
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
                          in the stage library and pathway editor.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
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

                  <Button type="submit">Save Changes</Button>
                </form>
              </Form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
