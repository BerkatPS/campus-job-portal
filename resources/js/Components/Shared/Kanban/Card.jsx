import React from 'react';
import { Paper, Box } from '@mui/material';
import { Draggable } from 'react-beautiful-dnd';

const Card = ({
    item,
    index,
    renderItem,
    ...props
}) => {
    const defaultRender = () => (
        <Box className="p-3">
            <div className="font-medium">{item.title}</div>
            {item.description && (
                <div className="text-sm text-gray-600 mt-1">{item.description}</div>
            )}
        </Box>
    );

    return (
        <Draggable draggableId={item.id.toString()} index={index}>
            {(provided, snapshot) => (
                <Paper
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    className={`rounded-lg shadow-sm border ${
                        snapshot.isDragging ? 'shadow-md' : ''
                    }`}
                    elevation={snapshot.isDragging ? 2 : 0}
                    {...props}
                >
                    {renderItem ? renderItem(item) : defaultRender()}
                </Paper>
            )}
        </Draggable>
    );
};

export default Card; 