import React from 'react';
import { Box, Paper, Typography } from '@mui/material';
import { Droppable } from 'react-beautiful-dnd';
import Card from './Card';

const Column = ({
    column,
    items = [],
    className,
    titleClassName,
    emptyColumnText,
    renderItem,
    onHeaderClick,
    ...props
}) => {
    return (
        <Box
            className={`w-72 flex-shrink-0 flex flex-col max-h-full ${className || ''}`}
            {...props}
        >
            <Paper 
                elevation={0} 
                className="rounded-t-lg border-t border-l border-r p-3 bg-gray-50"
                onClick={onHeaderClick}
                sx={onHeaderClick ? { cursor: 'pointer' } : {}}
            >
                <Box className="flex justify-between items-center">
                    <Typography 
                        variant="subtitle1" 
                        className={`font-medium flex items-center ${titleClassName || ''}`}
                    >
                        {column.title}
                        
                        {column.itemCount !== undefined && (
                            <span className="ml-2 bg-gray-200 text-gray-700 text-xs px-2 py-0.5 rounded-full">
                                {column.itemCount}
                            </span>
                        )}
                    </Typography>
                    
                    {column.headerAction && (
                        <div onClick={(e) => e.stopPropagation()}>
                            {column.headerAction}
                        </div>
                    )}
                </Box>
            </Paper>
            
            <Droppable droppableId={column.id} type={column.type || 'DEFAULT'}>
                {(provided, snapshot) => (
                    <Box
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className={`flex-grow overflow-y-auto p-2 min-h-[200px] border rounded-b-lg ${
                            snapshot.isDraggingOver ? 'bg-blue-50' : 'bg-white'
                        }`}
                    >
                        {items.length === 0 ? (
                            <Box className="h-full flex items-center justify-center text-gray-400 text-sm p-4 text-center">
                                {emptyColumnText}
                            </Box>
                        ) : (
                            <Box className="space-y-2">
                                {items.map((item, index) => (
                                    <Card
                                        key={item.id}
                                        item={item}
                                        index={index}
                                        renderItem={renderItem}
                                    />
                                ))}
                            </Box>
                        )}
                        {provided.placeholder}
                    </Box>
                )}
            </Droppable>
        </Box>
    );
};

export default Column; 