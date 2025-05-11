import React, { useState } from 'react';
import { router } from '@inertiajs/react';
import { usePage, Link } from '@inertiajs/react';
import {
  Box,
  Typography,
  Grid,
  IconButton,
  Paper,
  Divider,
  Chip,
  Avatar,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  alpha
} from '@mui/material';
import {
  KeyboardArrowLeft,
  Event,
  Person,
  BusinessCenter,
  LocationOn,
  VideoCall,
  AccessTime,
  CalendarMonth,
  Edit,
  Delete,
  CheckCircle,
  CancelOutlined,
  Send
} from '@mui/icons-material';

// Custom Components
import Card from '@/Components/Shared/Card';
import Button from '@/Components/Shared/Button';

import Modal from '@/Components/Shared/Modal';
import TextArea from '@/Components/Shared/TextArea';

const EventShow = () => {
  const { event = {}, flash = {} } = usePage().props;
  const [openCancelModal, setOpenCancelModal] = useState(false);
  const [openCompleteModal, setOpenCompleteModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [openRescheduleModal, setOpenRescheduleModal] = useState(false);
  const [notes, setNotes] = useState('');

  // Mark event as completed
  const completeEvent = () => {
    router.post(route('manager.events.update-status-post', event?.id), {
      status: 'completed',
      notes: notes
    }, {
      preserveScroll: true,
      onSuccess: () => setOpenCompleteModal(false)
    });
  };

  // Cancel event
  const cancelEvent = () => {
    router.post(route('manager.events.update-status-post', event?.id), {
      status: 'cancelled',
      notes: notes
    }, {
      preserveScroll: true,
      onSuccess: () => setOpenCancelModal(false)
    });
  };

  // Delete event
  const deleteEvent = () => {
    router.delete(route('manager.events.destroy', event?.id), {
      onSuccess: () => setOpenDeleteModal(false)
    });
  };

  // Send reminder
  const sendReminder = () => {
    router.post(route('manager.events.send-reminder', event?.id), {}, {
      preserveScroll: true
    });
  };

  return (
    <Box>
      

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Link href={route('manager.events.index')}>
            <IconButton sx={{ mr: 2 }}>
              <KeyboardArrowLeft />
            </IconButton>
          </Link>
          <Box>
            <Typography variant="h5" fontWeight="600">
              {event?.title || 'Event Details'}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {event?.type ? event.type.charAt(0).toUpperCase() + event.type.slice(1) : 'Event'} · {event?.start_time ? new Date(event.start_time).toLocaleDateString() : '-'}
            </Typography>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', gap: 2 }}>
          {event?.status === 'scheduled' && (
            <>
              <Button
                variant="outlined"
                startIcon={<Send />}
                onClick={sendReminder}
              >
                Send Reminder
              </Button>
              <Button
                variant="contained"
                startIcon={<Edit />}
                onClick={() => router.visit(route('manager.events.edit', event.id))}
              >
                Edit Event
              </Button>
            </>
          )}
        </Box>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card
            variant="outlined"
            title="Event Details"
            icon={<Event />}
            sx={{ mb: 3 }}
          >
            <Box sx={{ mb: 3 }}>
              <Chip
                label={event?.status || 'Status Unknown'}
                size="medium"
                color={
                  event?.status === 'scheduled' ? 'primary' :
                  event?.status === 'completed' ? 'success' :
                  event?.status === 'cancelled' ? 'error' : 'default'
                }
                sx={{ fontWeight: 500, borderRadius: 2 }}
              />
            </Box>

            {event?.description && (
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle1" fontWeight="600" gutterBottom>
                  Description
                </Typography>
                <Typography variant="body2" paragraph>
                  {event.description}
                </Typography>
              </Box>
            )}

            <Divider sx={{ my: 3 }} />

            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle1" fontWeight="600" gutterBottom>
                  Date & Time
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                  <CalendarMonth sx={{ color: 'primary.main', mr: 1.5 }} />
                  <Box>
                    <Typography variant="body2" fontWeight="500">
                      {event?.start_time ? new Date(event.start_time).toLocaleDateString() : '-'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {event?.start_time ? new Date(event.start_time).toLocaleTimeString() : '-'} - {event?.end_time ? new Date(event.end_time).toLocaleTimeString() : '-'}
                    </Typography>
                  </Box>
                </Box>
              </Grid>

              <Grid item xs={12} md={6}>
                <Typography variant="subtitle1" fontWeight="600" gutterBottom>
                  Event Type
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Chip
                    icon={event?.type && event.type === 'interview' ? <Person fontSize="small" /> : <Event fontSize="small" />}
                    label={event?.type ? event.type.charAt(0).toUpperCase() + event.type.slice(1) : 'Event'}
                    size="medium"
                    sx={{
                      bgcolor: event?.type && event.type === 'interview' ? 'primary.main' : 'secondary.main',
                      color: 'white',
                      fontWeight: 500
                    }}
                  />
                </Box>
              </Grid>
            </Grid>
            
            <Divider sx={{ my: 3 }} />

            {event?.location && (
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle1" fontWeight="600" gutterBottom>
                  Location
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                  <LocationOn sx={{ color: 'primary.main', mr: 1.5 }} />
                  <Typography variant="body2">
                    {event.location}
                  </Typography>
                </Box>
              </Box>
            )}

            {event?.meeting_link && (
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle1" fontWeight="600" gutterBottom>
                  Meeting Link
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                  <VideoCall sx={{ color: 'primary.main', mr: 1.5 }} />
                  <Box>
                    <Link href={event.meeting_link} target="_blank">
                      <Button
                        variant="outlined"
                        size="small"
                        startIcon={<VideoCall />}
                      >
                        Join Meeting
                      </Button>
                    </Link>
                    <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                      {event.meeting_link}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            )}
            
            <Divider sx={{ my: 3 }} />

            <Typography variant="subtitle1" fontWeight="600" gutterBottom>
              Attendees
            </Typography>
            {event?.attendees && event.attendees.length > 0 ? (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {event.attendees.map((attendee, index) => (
                  <Chip
                    key={index}
                    avatar={<Avatar><Person fontSize="small" /></Avatar>}
                    label={attendee}
                    size="medium"
                    variant="outlined"
                  />
                ))}
              </Box>
            ) : (
              <Typography variant="body2" color="text.secondary">
                No specific attendees listed
              </Typography>
            )}
          </Card>
          
          {event?.notes && event.notes.length > 0 && (
            <Card
              variant="outlined"
              title="Event Notes"
              icon={<Edit />}
              sx={{ mb: 3 }}
            >
              <List sx={{ p: 0 }}>
                {event.notes.map((note, index) => (
                  <Paper
                    key={index}
                    variant="outlined"
                    sx={{
                      p: 2,
                      mb: 2,
                      borderRadius: 2,
                      bgcolor: theme => alpha(theme.palette.primary.main, 0.03)
                    }}
                  >
                    <Typography variant="body2" sx={{ whiteSpace: 'pre-line' }}>
                      {note?.content}
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                      <Typography variant="caption" color="text.secondary">
                        Added by {note?.user?.name || 'User'}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {note?.created_at ? new Date(note.created_at).toLocaleString() : '-'}
                      </Typography>
                    </Box>
                  </Paper>
                ))}
              </List>
            </Card>
          )}
        </Grid>

        <Grid item xs={12} md={4}>
          {/* Candidate Info Card */}
          {event?.job_application && (
            <Card
              variant="outlined"
              title="Candidate Information"
              icon={<Person />}
              sx={{ mb: 3 }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Avatar
                  src={event.job_application?.user?.avatar || '/images/avatars/default.png'}
                  sx={{ width: 56, height: 56, mr: 2 }}
                />
                <Box>
                  <Typography variant="h6" fontWeight="600">
                    {event.job_application?.user?.name || 'Candidate'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {event.job_application?.user?.email || '-'}
                  </Typography>
                </Box>
              </Box>

              <Button
                variant="outlined"
                fullWidth
                startIcon={<Person />}
                onClick={() => router.visit(route('manager.applications.show', event.job_application?.id))}
                sx={{ mb: 2 }}
              >
                View Application
              </Button>
              
              <Button
                variant="outlined"
                fullWidth
                startIcon={<Send />}
                onClick={() => window.open(`mailto:${event.job_application?.user?.email}`)}
              >
                Email Candidate
              </Button>
              
              {event.job_application?.user?.profile?.phone && (
                <Box sx={{ mt: 3 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Phone
                  </Typography>
                  <Typography variant="body2">
                    {event.job_application.user.profile.phone}
                  </Typography>
                </Box>
              )}
            </Card>
          )}

          {/* Job Info Card */}
          {event?.job && (
            <Card
              variant="outlined"
              title="Job Position"
              icon={<BusinessCenter />}
              sx={{ mb: 3 }}
            >
              <Typography variant="h6" fontWeight="600">
                {event.job?.title || 'Job Title'}
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                {event.job?.company?.name || 'Company'} · {event.job?.location || 'Location'}
              </Typography>
              
              <Box sx={{ mt: 2, mb: 2, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {event.job?.job_type && (
                  <Chip
                    label={event.job.job_type}
                    size="small"
                    color="primary"
                    variant="outlined"
                  />
                )}
                {event.job?.category && (
                  <Chip
                    label={event.job.category.name}
                    size="small"
                    color="primary"
                    variant="outlined"
                  />
                )}
              </Box>
              
              <Button
                variant="outlined"
                fullWidth
                startIcon={<BusinessCenter />}
                onClick={() => router.visit(route('manager.jobs.show', event.job?.id))}
                sx={{ mt: 2 }}
              >
                View Job Details
              </Button>
            </Card>
          )}

          {/* Action Card */}
          <Card
            variant="outlined"
            title="Actions"
            icon={<Edit />}
          >
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {event?.status === 'scheduled' && (
                <>
                  <Button
                    variant="contained"
                    color="success"
                    startIcon={<CheckCircle />}
                    fullWidth
                    onClick={() => setOpenCompleteModal(true)}
                  >
                    Mark as Completed
                  </Button>
                  
                  <Button
                    variant="outlined"
                    color="error"
                    startIcon={<CancelOutlined />}
                    fullWidth
                    onClick={() => setOpenCancelModal(true)}
                  >
                    Cancel Event
                  </Button>
                </>
              )}
              
              <Button
                variant="outlined"
                startIcon={<Edit />}
                fullWidth
                onClick={() => router.visit(route('manager.events.edit', event?.id))}
                disabled={event?.status === 'cancelled'}
              >
                Edit Event
              </Button>
              
              <Button
                variant="outlined"
                color="error"
                startIcon={<Delete />}
                fullWidth
                onClick={() => setOpenDeleteModal(true)}
              >
                Delete Event
              </Button>
            </Box>
          </Card>
        </Grid>
      </Grid>

      {/* Complete Event Modal */}
      <Modal
        open={openCompleteModal}
        onClose={() => setOpenCompleteModal(false)}
        title="Mark Event as Completed"
        confirmButton
        confirmText="Mark as Completed"
        confirmColor="success"
        cancelButton
        onConfirm={completeEvent}
        maxWidth="sm"
      >
        <Typography variant="body2" paragraph>
          Are you sure you want to mark this event as completed?
        </Typography>
        <TextArea
          rows={4}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Add notes about the event outcome (optional)"
          fullWidth
        />
      </Modal>

      {/* Cancel Event Modal */}
      <Modal
        open={openCancelModal}
        onClose={() => setOpenCancelModal(false)}
        title="Cancel Event"
        confirmButton
        confirmText="Cancel Event"
        confirmColor="error"
        cancelButton
        onConfirm={cancelEvent}
        maxWidth="sm"
      >
        <Typography variant="body2" paragraph>
          Are you sure you want to cancel this event? All attendees will be notified.
        </Typography>
        <TextArea
          rows={4}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Add a reason for cancellation (optional)"
          fullWidth
        />
      </Modal>

      {/* Delete Event Modal */}
      <Modal
        open={openDeleteModal}
        onClose={() => setOpenDeleteModal(false)}
        title="Delete Event"
        confirmButton
        confirmText="Delete Event"
        confirmColor="error"
        cancelButton
        onConfirm={deleteEvent}
        maxWidth="sm"
      >
        <Typography variant="body2" paragraph>
          Are you sure you want to delete this event? This action cannot be undone.
        </Typography>
      </Modal>
    </Box>
  );
};

export default EventShow;