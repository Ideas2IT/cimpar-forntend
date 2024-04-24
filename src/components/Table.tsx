import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  PaginationState,
  useReactTable,
} from "@tanstack/react-table";
import { useState } from "react";
import ArrowRight from "../assets/icons/arrowright.svg?react";
import ArrowLeft from "../assets/icons/arrowleft.svg?react";

interface TableProps {
  columns: ColumnDef<any, any>[];
  rowData: any[];
}

const Table: React.FC<TableProps> = ({ rowData, columns }) => {
  const [data, _setData] = useState(() => [...rowData]);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onPaginationChange: setPagination,
    state: {
      pagination,
    },
  });

  return (
    <div className="flex flex-col h-full">
      <table className="w-full text-sm text-left flex-grow rtl:text-right text-gray-800 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase border-b">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th key={header.id} className="px-6 py-3">
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr
              key={row.id}
              className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
            >
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className="px-6 py-4">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex items-center justify-center gap-2 my-4">
        <button
          className={"p-1 " + (!table.getCanPreviousPage() ? "opacity-25" : "")}
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          <ArrowLeft className="stroke-gray-500" />
        </button>
        <span className="flex items-center gap-1">
          {table.getState().pagination.pageIndex + 1}{" "}
          <span className="text-sm">of</span>{" "}
          {table.getPageCount().toLocaleString()}
          <p className="text-sm">pages</p>
        </span>
        <button
          className={"p-1 " + (!table.getCanNextPage() ? "opacity-50" : "")}
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          <ArrowRight className="stroke-gray-700" />
        </button>
      </div>
    </div>
  );
};

export default Table;
