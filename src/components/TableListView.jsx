import React, { memo, useState } from "react";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel, getSortedRowModel,
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
  Td, Text,
  Th,
  Thead,
  Tr,
  useColorModeValue
} from "@chakra-ui/react";


const TableList = ({ data, columns, updatedAt }) => {
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
    getSortedRowModel: getSortedRowModel(),
    state: {
      pagination
    },
    onPaginationChange: setPagination
  });

  console.log(table.getCanNextPage(), table.getCanNextPage());


  return (
      <Flex flexDir={"column"} h={"92%"} boxShadow={"rgba(0, 0, 0, 0.35) 0px 5px 15px"} mt={3} borderRadius={"5px"}  borderWidth={1}>
        <Box
          flex={1}
          h={"90%"} overflowY={"auto"}>
          <Table>
            <Thead
              bg={useColorModeValue('#fff', '#202023')}
              style={{
                position: "sticky",
                top: "-3px",
                margin: "0",
                zIndex: "5"
              }}
            >
              {table.getHeaderGroups().map(headerGroup => (
                <Tr key={headerGroup.id}>
                  {headerGroup.headers.map(header => {
                    return (
                      <Th key={header.id} colSpan={header.colSpan}>
                        {header.isPlaceholder ? null : (
                          <Box
                            onClick={header.column.getToggleSortingHandler()}
                            style={header.column.getCanSort() ? { cursor: "pointer", userSelect: "none" } : {}}
                          >
                            {flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                            {{
                              asc: " 🔼",
                              desc: " 🔽"
                            }[header.column.getIsSorted()] ?? null}
                          </Box>
                        )}
                      </Th>
                    );
                  })}
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
        <Flex justifyContent={"space-between"} m={2} ml={5} mr={5} alignItems={"center"}>
          {updatedAt && <Text fontSize={{
            base: "xs",
            md: "sm"
          }}
                              display={{ base: "none", md: "block" }}>
            Last updated: {new Date(updatedAt).toLocaleTimeString()}</Text>}
          <Flex gap={{ base: 1, md: 5 }} alignItems={"center"} flex={2} justifyContent={"flex-end"}>
            <Button
              size={["xs", "sm"]}
              onClick={() => table.setPageIndex(0)}
              isDisabled={!table.getCanPreviousPage()}
            >
              {"<<"}
            </Button>
            <Button
              size={["xs", "sm"]}
              onClick={() => table.previousPage()}
              isDisabled={!table.getCanPreviousPage()}
            >
              {"<"}
            </Button>
            <Button
              size={["xs", "sm"]}
              onClick={() => table.nextPage()}
              isDisabled={!table.getCanNextPage()}
            >
              >
            </Button>
            <Button
              size={["xs", "sm"]}
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              isDisabled={!table.getCanNextPage()}
            >
              {">>"}
            </Button>
            <Box>
              <Text fontSize={{
                base: "xs",
                md: "sm"
              }} display={{ base: "none", md: "block" }}>
                Page{" "}
              </Text>
              <Text fontSize={{
                base: "xs",
                md: "sm"
              }}>
                <strong>
                  {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
                </strong>
              </Text>
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
      </Flex>
  );
};

export const TableListView = memo(TableList);