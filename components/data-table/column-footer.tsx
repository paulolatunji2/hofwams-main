import { moveColumnsDown, moveColumnsUp } from "@/lib/utils";
import { Column, Table } from "@tanstack/react-table";
import React from "react";
import {
  HiOutlineArrowLeftCircle,
  HiOutlineArrowRightCircle,
} from "react-icons/hi2";

export interface DataTableColumnFooterProps<TData, TValue>
  extends React.HTMLAttributes<HTMLDivElement> {
  column: Column<TData, TValue>;
  table: Table<TData>;
}

export function DataTableColumnFooter<TData, TValue>({
  column,
  table,
}: DataTableColumnFooterProps<TData, TValue>) {
  return (
    <div className="flex flex-row gap-4">
      <HiOutlineArrowLeftCircle
        className="w-4 h-4 ml-2 cursor-pointer"
        onClick={() =>
          table.setColumnOrder(
            moveColumnsUp(table.getAllLeafColumns(), column.id)
          )
        }
      />
      <HiOutlineArrowRightCircle
        className="w-4 h-4 mr-2 cursor-pointer"
        onClick={() =>
          table.setColumnOrder(
            moveColumnsDown(table.getAllLeafColumns(), column.id)
          )
        }
      />
    </div>
  );
}
