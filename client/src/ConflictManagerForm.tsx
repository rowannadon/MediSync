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
import { useRemoteDataStore } from './RemoteDataStore';
import { useLocalDataStore } from './LocalDataStore';
import {
  OutputType,
  outputTypes,
  Conflict,
} from './TempData';
import { useEffect, useState } from 'react';

const conflictFormSchema = z.object({
  pathway: z.string({
    required_error: 'Please select a type.',
  }),
  time: z.string({
    required_error: 'Please select a new time.',
  }),
  outputs: z.array(z.object({ pathway: z.string(), time: z.string() })),
});

type conflictManagerFormValues = z.infer<typeof conflictFormSchema>;

interface ConflictManagerFormProps extends React.HTMLAttributes<HTMLElement> {
  conflict: Conflict;
}

export function ConflictManagerForm({conflict}: ConflictManagerFormProps) {
  const addConflict = useRemoteDataStore(
    (state) => state.addConflict,
  );

  const pathways = ['pathway1', 'pathway2'];

  const defaultValues: conflictManagerFormValues = {
    pathway: 'pathway1',
    time: '',
    outputs: [{ pathway: 'defaultOutput', time: 'Default Output' }],
  };

  const form = useForm<conflictManagerFormValues>({
    resolver: zodResolver(conflictFormSchema),
    defaultValues,
  });

  useEffect(() => {
    if (conflict && form) {
      form.setValue('pathway', conflict.pathway);
      form.setValue('time', conflict.time);
    }
  }, [conflict]);

  function onSubmit(data: conflictManagerFormValues) {
    const newConflict: Conflict = {
      pathway: data.pathway,
      time: data.time,
    };
    console.log(data);
    addConflict(newConflict);
  }

  function onSubmit2(data: conflictManagerFormValues) {
    console.log(data);
  }
  

  return (
    <div className="flex-grow ">
      {(
        <div className="flex flex-grow flex-row p-2">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex-grow space-y-8"
            >
              <h1 className="  text-lg font-bold">Warning!!!</h1>
              <h2>
                There is a time conflict with the pathway you are trying to add
                and a previous spathway. Fix the issue by changing the time the
                pathway occurs or manually override the conflict
              </h2>
              {
                <FormField
                  control={form.control}
                  name="pathway"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Pathways</FormLabel>
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger className="w-[180px]">
                          {field.value}
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            {pathways.map((pathway) => (
                              <SelectItem key={pathway} value={pathway}>
                                {pathway}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>

                      <FormDescription>
                        Select a pathway to move
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              }
              {
                <FormField
                  name=""
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>New Time</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Please enter a new time for the pathway you are moving"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              }
              <Button type="submit">Save Changes</Button>
            </form>
          </Form>
        </div>
      )}
      <div className="flex flex-grow flex-row p-2">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit2)}
            className="flex-grow space-y-8"
          >
            {
              <FormField
                name=""
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Reasoning</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Please state your reason for performing an override"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            }
            <Button type="submit">Override Conflict</Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
