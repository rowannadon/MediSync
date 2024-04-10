import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  PaginationState,
  SortingState,
  useReactTable,
} from '@tanstack/react-table';
import { useState } from 'react';
import { Button } from './components/ui/button';
import { Plus, RefreshCcw } from 'lucide-react';
import { Card } from './components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './components/ui/table';
import { Input } from './components/ui/input';
import { ScrollArea } from './components/ui/scroll-area';
import { DataTableFacetedFilter } from './DataTableFacetedFilter';
import { DataTableSingleFilter } from './DataTableSingleFilter';

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  filterColumn: string;
  pages: number;
  uniqueFilterColumns?: { title: string; column: string }[];
  uniqueFilterColumn?: { title: string; column: string }[];
}

export function DataTable<TData, TValue>({
  columns,
  data,
  filterColumn,
  uniqueFilterColumn,
  pages,
  uniqueFilterColumns,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: pages,
  });

  const indexes = data.map((value, index) => {
    return { value: value, index: index };
  });

  const filterSets = uniqueFilterColumns?.map(
    (col: { column: string; title: string }) => {
      const list = Array.from(
        new Set(
          data
            .flatMap((value: any) => value[col.column])
            .map((value: any) => value),
        ),
      );
      return {
        column: col.column,
        list: list,
        title: col.title,
      };
    },
  );

  const filter = uniqueFilterColumn?.map(
    (col: { column: string; title: string }) => {
      const list = Array.from(
        new Set(data.flatMap((value: any) => value[col.column])),
      );
      return {
        column: col.column,
        list: list,
        title: col.title,
      };
    },
  );

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onPaginationChange: setPagination,
    state: {
      sorting,
      columnFilters,
      pagination,
    },
  });

  return (
    <div className="flex flex-grow flex-col p-4">
      <div className="flex items-center justify-between pb-4">
        <div className="flex flex-row items-end space-x-4">
          <Input
            placeholder={`Filter ${filterColumn.replaceAll('_', ' ')}s...`}
            value={
              (table.getColumn(filterColumn)?.getFilterValue() as string) ?? ''
            }
            onChange={(event) =>
              table.getColumn(filterColumn)?.setFilterValue(event.target.value)
            }
            className="w-[200px] max-w-sm"
          />
          {filterSets?.map((filterSet) => {
            return (
              <DataTableFacetedFilter
                key={filterSet.column}
                column={table.getColumn(filterSet.column)}
                title={filterSet.title}
                options={filterSet.list}
              />
            );
          })}
          {filter?.map((filter) => {
            return (
              <DataTableSingleFilter
                key={filter.column}
                column={table.getColumn(filter.column)}
                title={filter.title}
                options={filter.list}
              />
            );
          })}
        </div>
        <div className="space-x-2">
          <Button variant="outline" size="icon">
            <Plus className="h-6 w-6" />
          </Button>
          <Button variant="outline" size="icon">
            <RefreshCcw className="h-6 w-6" />
          </Button>
        </div>
      </div>
      <Card className="flex flex-grow overflow-hidden">
        <ScrollArea className="flex-grow">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext(),
                            )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>

            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && 'selected'}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </ScrollArea>
      </Card>
      <div className="flex items-center justify-center space-x-2 pt-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <span>
          Page {pagination.pageIndex + 1} of {table.getPageCount()}
        </span>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
