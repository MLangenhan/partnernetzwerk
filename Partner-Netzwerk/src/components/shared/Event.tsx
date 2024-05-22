import React from 'react';

interface EventProps {
    summary: string;
    start: {
        dateTime: string;
    };
}

const Event: React.FC<EventProps> = ({ summary, start }) => {
    // Format the date and time
    const eventDate = new Date(start.dateTime).toLocaleDateString();
    const eventTime = new Date(start.dateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // Generate Google Calendar event creation link
    const googleCalendarLink = `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURI(summary)}&dates=${encodeURI(start.dateTime)}/${encodeURI(start.dateTime)}&details=${encodeURI(summary)}`;

    return (
        <div className="pb-2">
            <div className="flex bg-dark-4 p-2 gap-3 flex-center rounded-lg">
                <div className="flex flex-col">
                    <p className="text-white text-lg">{summary}</p>
                    <p className="text-white text-sm">Datum: {eventDate}</p>
                    <p className="text-white text-sm">Uhrzeit: {eventTime}</p>
                    <a href={googleCalendarLink} target="_blank" rel="noopener noreferrer" className="text-blue-500 text-sm underline">Zum Kalender hinzufügen</a>
                </div>
            </div>
        </div>
    );
};

export default Event;
