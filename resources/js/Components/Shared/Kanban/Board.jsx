import React, { useState } from 'react';
import { Box, Typography, Paper } from '@mui/material';
import { DragDropContext } from 'react-beautiful-dnd';
import Column from './Column';

const Board = ({
    columns = [],
    items = {},
    onDragEnd,
    boardTitle,
    className,
    columnClassName,
    renderItem,
    emptyColumnText = 'Tidak ada item',
    columnTitleClassName,
    onColumnHeaderClick,
    ...props
}) => {
    const handleDragEnd = (result) => {
        const { destination, source, draggableId } = result;
        
        // Dropped outside the list
        if (!destination) {
            return;
        }
        
        // Dropped in the same position
        if (
            destination.droppableId === source.droppableId &&
            destination.index === source.index
        ) {
            return;
        }
        
        // Call provided drag end handler
        if (typeof onDragEnd === 'function') {
            onDragEnd(result);
        }
    };
    
    return (
        <Paper 
            elevation={0}
            className={`overflow-hidden ${className || ''}`}
            {...props}
        >
            {boardTitle && (
                <Typography variant="h6" className="px-4 py-3 border-b">
                    {boardTitle}
                </Typography>
            )}
            
            <DragDropContext onDragEnd={handleDragEnd}>
                <Box className="flex space-x-4 overflow-x-auto py-4 px-4 min-h-[70vh]">
                    {columns.map((column, index) => (
                        <Column
                            key={column.id}
                            column={column}
                            items={items[column.id] || []}
                            className={columnClassName}
                            titleClassName={columnTitleClassName}
                            renderItem={renderItem}
                            emptyColumnText={emptyColumnText}
                            onHeaderClick={
                                onColumnHeaderClick 
                                    ? () => onColumnHeaderClick(column) 
                                    : undefined
                            }
                        />
                    ))}
                </Box>
            </DragDropContext>
        </Paper>
    );
};

export default Board; 