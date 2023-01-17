import React, { memo, useState } from "react";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable
} from "@tanstack/react-table";
import {
  Box,
  Button,
  Divider,
  Flex,
  Select,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  useColorModeValue
} from "@chakra-ui/react";


const TableList = ({ data, columns, AddDialog }) => {
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 15
  });

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: {
      pagination
    },
    onPaginationChange: setPagination
  });


  return (
    <Box p={3} h={"100%"}>
      <Flex justifyContent={"flex-end"} h={"5%"} boxShadow={"rgba(0, 0, 0, 0.35) 0px 5px 15px"} borderRadius={"5px"}
            alignItems={"center"}>
        {AddDialog && <AddDialog />}
      </Flex>
      <Flex flexDir={"column"} h={"94%"} boxShadow={"rgba(0, 0, 0, 0.35) 0px 5px 15px"} mt={3} borderRadius={"5px"}>
        <Box
          flex={1}
          h={"90%"} overflowY={"auto"}>
          <Table>
            <Thead
              bg={useColorModeValue('#f0e7db', '#202023')}
              style={{
                position: "sticky",
                top: "-3px",
                margin: "0",
                zIndex: "5",
              }}
            >
              {table.getHeaderGroups().map(headerGroup => (
                <Tr key={headerGroup.id}>
                  {headerGroup.headers.map(header => (
                    <Th key={header.id} align={"center"}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                    </Th>
                  ))}
                </Tr>
              ))}
            </Thead>
            <Tbody>
              {table.getRowModel().rows.map(row => (
                <Tr key={row.id}>
                  {row.getVisibleCells().map(cell => (
                    <Td key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </Td>
                  ))}
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>
        <Divider />
        <Flex justifyContent={"flex-end"} gap={5} m={2} mr={5} alignItems={"center"}>
          <Button
            size={"sm"}
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
          >
            {"<<"}
          </Button>
          <Button
            size={"sm"}
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            {"<"}
          </Button>
          <Button
            size={"sm"}
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            {">"}
          </Button>
          <Button
            size={"sm"}
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
          >
            {">>"}
          </Button>
          <Box>
            <div>Page</div>
            <strong>
              {table.getState().pagination.pageIndex + 1} of{" "}
              {table.getPageCount()}
            </strong>
          </Box>
          <Select
            size={"sm"}
            w={"65px"}
            value={table.getState().pagination.pageSize}
            onChange={e => {
              table.setPageSize(Number(e.target.value));
            }}
          >
            {[15, 20, 30, 40, 50].map(pageSize => (
              <option key={pageSize} value={pageSize}>
                {pageSize}
              </option>
            ))}
          </Select>
        </Flex>
      </Flex>

    </Box>
  );
};

export const TableListView = memo(TableList);