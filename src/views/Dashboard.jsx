import React, { useEffect, useState } from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import {Box, Heading} from "@chakra-ui/react";
import useWindowDimensions from "../components/Dashboard/WindowSize";
import {useColorModeValue} from "@chakra-ui/react";
import ResizeEvent from "../components/Dashboard/ResizeEvent";

const onDragEnd = (result, columns, setColumns) => {
  if (!result.destination) return;
  const { source, destination } = result;

  if (source.droppableId !== destination.droppableId) {
    const sourceColumn = columns[source.droppableId];
    const destColumn = columns[destination.droppableId];
    const sourceItems = [...sourceColumn.items];
    const destItems = [...destColumn.items];
    const [removed] = sourceItems.splice(source.index, 1);
    destItems.splice(destination.index, 0, removed);
    setColumns({
      ...columns,
      [source.droppableId]: {
        ...sourceColumn,
        items: sourceItems
      },
      [destination.droppableId]: {
        ...destColumn,
        items: destItems
      }
    });
  } else {
    const column = columns[source.droppableId];
    const copiedItems = [...column.items];
    const [removed] = copiedItems.splice(source.index, 1);
    copiedItems.splice(destination.index, 0, removed);
    setColumns({
      ...columns,
      [source.droppableId]: {
        ...column,
        items: copiedItems
      }
    });
  }
};

function Dashboard() {
  const {height, width} = useWindowDimensions(); //get window size
  const backroundColor = useColorModeValue("#f0e7db","#202023"); //colors day/nightmode
  const switchColor = useColorModeValue("#ffcccc","#263B4A");
  const boxColor = useColorModeValue("lightyellow","#333"); 

  var columnsFromBackend = ResizeEvent(width);

  /*
  var [columns, setColumns] = useState(columnsFromBackend);
  React.useEffect(() => {
    function resize(){
      columnsFromBackend = ResizeEvent(width);
      [columns, setColumns] = useState(columnsFromBackend);
    }
    window.addEventListener("resize", resize);
  }) --> NOT WOKRING
  */

  var [columns, setColumns] = useState(columnsFromBackend);

  //Dynamische Boxgröße
  var boxSize = (width < 1250) ? width/1.3 : width/2.5;

  return (
    //TODO: Breite verändern bei verschiedener Fenstergröße
    <Box>
    <Heading textAlign="center">Dashboard</Heading> 
    <div style={{ display: "flex", justifyContent: "center", height: "100%" }}>
      <DragDropContext
        onDragEnd={result => onDragEnd(result, columns, setColumns)}
      >
        {Object.entries(columns).map(([columnId, column], index) => {
          return (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center"
              }}
              key={columnId}
            >
              <h2>{column.name}</h2>
              <div style={{ margin: 8 }}>
                <Droppable droppableId={columnId} key={columnId}>
                  {(provided, snapshot) => {
                    return (
                      <div
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        style={{
                          background: snapshot.isDraggingOver
                            ? boxColor
                            : backroundColor,
                          //padding: 4,
                          width: boxSize+"px", //width/2.4+"px", 
                          minHeight: 100  
                        }}
                      >
                        {column.items.map((item, index) => {
                          return (
                            <Draggable
                              key={item.id}
                              draggableId={item.id}
                              index={index}
                            >
                              {(provided, snapshot) => {
                                return (
                                  <div
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                    style={{
                                      userSelect: "none",
                                      padding: 16, //Oben unten Abstand 
                                      //margin: "0 0 8px 0", //Abstand zum nächsten Element
                                      //minHeight: "50px",
                                      backgroundColor: snapshot.isDragging
                                        ? switchColor
                                        : backroundColor, 
                                      color: "white", //does nothing
                                      ...provided.draggableProps.style
                                    }}
                                  >
                                    {item.content}
                                  </div>
                                );
                              }}
                            </Draggable>
                          );
                        })}
                        {provided.placeholder}
                      </div>
                    );
                  }}
                </Droppable>
              </div>
            </div>
          );
        })}
      </DragDropContext>
    </div>
    </Box>
  );
}

export default Dashboard;
