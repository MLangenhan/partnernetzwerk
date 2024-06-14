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
            <div className="pb-4">
                <div className="bg-ecurie-lightgrey dark:bg-dark-4 py-2 pl-2 pr-8 gap-3 flex justify-between rounded-lg hover:bg-ecurie-babyblue hover:text-white align-baseline">
                    <div className="flex items-center">
                        <p className="text-white font-bold text-lg pl-2 break-words w-44">{summary}</p>
                    </div>
                    <div className="flex items-center">
                        <div className="flex items-center">
                            <img className='pb-0.5'
                                src={"/assets/icons/calendar-icon.svg"}
                                alt="calendar"
                                width={20}
                                height={20}
                            />
                            <p className="text-white text-sm pl-2 pt-0.5">{eventDate}</p>
                        </div>
                        <div className="flex items-center pl-4">
                            <img className='pb-0.25'
                                src={"/assets/icons/clock-icon.svg"}
                                alt="clock"
                                width={20}
                                height={20}
                            />
                            <p className="text-white text-sm pl-2 pt-0.5">{eventTime}</p>
                        </div>
                        <a href={googleCalendarLink} target="_blank" rel="noopener noreferrer" className="text-blue-500 text-xl font-bold ml-4 no-underline pb-1 pl-2">
                        <img className='pt-1'
                                src={"/assets/icons/calendaradd-icon.svg"}
                                alt="calendaradd"
                                width={25}
                                height={20}
                            />
                        </a>
                    </div>
                </div>
            </div>


    );
};

export default Event;
