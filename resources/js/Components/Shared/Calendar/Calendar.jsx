import React, { useState, useEffect, useRef } from 'react';
import { Box, Paper, Typography, Tooltip, alpha } from '@mui/material';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';
import idLocale from '@fullcalendar/core/locales/id';

const Calendar = ({
                      events = [],
                      initialView = 'dayGridMonth',
                      headerToolbar = {
                          left: 'prev,next today',
                          center: 'title',
                          right: 'dayGridMonth,timeGridWeek,timeGridDay,listMonth'
                      },
                      eventClick,
                      dateClick,
                      eventDrop,
                      eventResize,
                      height = 'auto',
                      className,
                      loading,
                      datesSet,
                      ...props
                  }) => {
    const calendarRef = useRef(null);

    // Fungsi kustom untuk render acara dengan lebih informatif
    const eventContent = (eventInfo) => {
        const event = eventInfo.event;
        const backgroundColor = event.backgroundColor || '#14B8A6';
        const textColor = event.textColor || '#FFFFFF';

        return (
            <Tooltip
                title={
                    <Box>
                        <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                            {event.title}
                        </Typography>
                        {event.extendedProps?.type && (
                            <Typography variant="caption" display="block">
                                Tipe: {event.extendedProps.type === 'interview' ? 'Wawancara' :
                                event.extendedProps.type === 'test' ? 'Tes' :
                                    event.extendedProps.type === 'meeting' ? 'Rapat' : 'Lainnya'}
                            </Typography>
                        )}
                        {event.extendedProps?.job && (
                            <Typography variant="caption" display="block">
                                Lowongan: {event.extendedProps.job.title}
                            </Typography>
                        )}
                        <Typography variant="caption" display="block" sx={{ mt: 0.5 }}>
                            {new Date(event.start).toLocaleTimeString('id-ID', {hour: '2-digit', minute:'2-digit'})} -
                            {new Date(event.end).toLocaleTimeString('id-ID', {hour: '2-digit', minute:'2-digit'})}
                        </Typography>
                        {event.extendedProps?.location && (
                            <Typography variant="caption" display="block">
                                Lokasi: {event.extendedProps.location}
                            </Typography>
                        )}
                    </Box>
                }
                arrow
                placement="top"
            >
                <Box
                    sx={{
                        overflow: 'hidden',
                        width: '100%',
                        height: '100%',
                        p: '2px 4px',
                        backgroundColor,
                        color: textColor,
                        borderRadius: '4px',
                        border: `1px solid ${alpha(backgroundColor, 0.7)}`,
                        '&:hover': {
                            filter: 'brightness(90%)',
                        },
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                    }}
                >
                    <Typography
                        variant="caption"
                        sx={{
                            fontWeight: 'bold',
                            fontSize: '0.8rem',
                            lineHeight: 1.2,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap'
                        }}
                    >
                        {event.title}
                    </Typography>
                    {!eventInfo.view.type.includes('list') && eventInfo.timeText && (
                        <Typography
                            variant="caption"
                            sx={{
                                fontSize: '0.7rem',
                                opacity: 0.9,
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap'
                            }}
                        >
                            {eventInfo.timeText}
                        </Typography>
                    )}
                </Box>
            </Tooltip>
        );
    };

    // Meningkatkan tampilan acara pada tampilan daftar
    const eventDidMount = (info) => {
        const statusColors = {
            scheduled: '#14B8A6', // Primary color
            completed: '#4CAF50', // Success color
            cancelled: '#F44336', // Error color
            rescheduled: '#FF9800' // Warning color
        };

        // Tambahkan indikator status dan jenis acara pada tampilan daftar
        if (info.view.type.includes('list')) {
            const dotEl = document.createElement('span');
            const status = info.event.extendedProps?.status || 'scheduled';
            const type = info.event.extendedProps?.type || 'other';

            // Terjemahkan tipe acara
            const typeLabels = {
                interview: 'Wawancara',
                test: 'Tes',
                meeting: 'Rapat',
                other: 'Lainnya'
            };

            // Terjemahkan status
            const statusLabels = {
                scheduled: 'Terjadwal',
                completed: 'Selesai',
                cancelled: 'Dibatalkan',
                rescheduled: 'Dijadwalkan Ulang'
            };

            // Buat elemen status
            const statusEl = document.createElement('span');
            statusEl.innerHTML = statusLabels[status] || status;
            statusEl.style.marginLeft = '8px';
            statusEl.style.fontSize = '11px';
            statusEl.style.padding = '2px 6px';
            statusEl.style.borderRadius = '10px';
            statusEl.style.backgroundColor = alpha(statusColors[status] || '#9E9E9E', 0.1);
            statusEl.style.color = statusColors[status] || '#9E9E9E';
            statusEl.style.fontWeight = 'bold';

            // Buat elemen tipe
            const typeEl = document.createElement('span');
            typeEl.innerHTML = typeLabels[type] || type;
            typeEl.style.marginLeft = '8px';
            typeEl.style.fontSize = '11px';
            typeEl.style.padding = '2px 6px';
            typeEl.style.borderRadius = '10px';
            typeEl.style.backgroundColor = alpha(info.event.backgroundColor, 0.1);
            typeEl.style.color = info.event.backgroundColor;
            typeEl.style.fontWeight = 'bold';

            // Tambahkan ke tampilan
            const titleEl = info.el.querySelector('.fc-list-event-title');
            if (titleEl) {
                titleEl.appendChild(typeEl);
                titleEl.appendChild(statusEl);
            }
        }
    };

    return (
        <Paper
            elevation={0}
            variant="outlined"
            sx={{
                borderRadius: '1rem',
                overflow: 'hidden',
                border: '1px solid',
                borderColor: 'divider',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.03)',
                '& .fc-toolbar': {
                    p: 2,
                    borderBottom: '1px solid',
                    borderColor: 'divider',
                    backgroundColor: (theme) => alpha(theme.palette.primary.main, 0.04),
                },
                '& .fc-toolbar-title': {
                    fontSize: '1.25rem !important',
                    fontWeight: 'bold'
                },
                '& .fc-header-toolbar': {
                    mb: 0,
                    p: 2
                },
                '& .fc-view-harness': {
                    p: { xs: 1, sm: 2 },
                },
                '& .fc-list': {
                    borderRadius: '0.5rem',
                    overflow: 'hidden',
                    border: 'none'
                },
                '& .fc-day-today': {
                    backgroundColor: (theme) => alpha(theme.palette.primary.main, 0.05)
                },
                '& .fc-button': {
                    textTransform: 'capitalize',
                    borderRadius: '0.5rem',
                },
                '& .fc-button-primary': {
                    backgroundColor: (theme) => theme.palette.primary.main,
                    borderColor: (theme) => theme.palette.primary.main,
                },
                '& .fc-button-primary:not(:disabled):hover': {
                    backgroundColor: (theme) => theme.palette.primary.dark,
                },
                '& .fc-button-primary:not(:disabled).fc-button-active': {
                    backgroundColor: (theme) => theme.palette.primary.dark,
                    borderColor: (theme) => theme.palette.primary.dark,
                },
                '& .fc-list-event:hover': {
                    backgroundColor: (theme) => alpha(theme.palette.primary.main, 0.05),
                },
                '& .fc-list-day-cushion': {
                    backgroundColor: (theme) => alpha(theme.palette.primary.main, 0.1),
                },
                '& .fc-list-event-dot': {
                    display: 'none'
                },
                '& .fc-list-table tbody tr:hover': {
                    backgroundColor: (theme) => alpha(theme.palette.primary.main, 0.05)
                }
            }}
            className={className}
        >
            <Box>
                <FullCalendar
                    ref={calendarRef}
                    plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin]}
                    initialView={initialView}
                    headerToolbar={headerToolbar}
                    events={events}
                    eventClick={eventClick}
                    dateClick={dateClick}
                    editable={!!eventDrop || !!eventResize}
                    eventDrop={eventDrop}
                    eventResize={eventResize}
                    height={height}
                    locale={idLocale}
                    loading={loading}
                    datesSet={datesSet}
                    firstDay={1} // Senin sebagai hari pertama dalam minggu
                    buttonText={{
                        today: 'Hari Ini',
                        month: 'Bulan',
                        week: 'Minggu',
                        day: 'Hari',
                        list: 'Daftar'
                    }}
                    eventTimeFormat={{
                        hour: '2-digit',
                        minute: '2-digit',
                        meridiem: false,
                        hour12: false
                    }}
                    eventContent={eventContent}
                    eventDidMount={eventDidMount}
                    dayMaxEvents={3} // Batasi jumlah acara yang ditampilkan per hari, yang lain akan dijadikan "+more"
                    moreLinkText="+ lainnya" // Teks untuk "+more"
                    noEventsContent={
                        <Box sx={{ textAlign: 'center', py: 4 }}>
                            <Typography color="text.secondary">
                                Tidak ada acara yang terjadwal
                            </Typography>
                        </Box>
                    }
                    viewDidMount={(info) => {
                        // Tambahkan kelas untuk styling khusus berdasarkan jenis tampilan
                        const viewClassName = `calendar-view-${info.view.type}`;
                        info.el.classList.add(viewClassName);
                    }}
                    {...props}
                />
            </Box>
        </Paper>
    );
};

export default Calendar;
