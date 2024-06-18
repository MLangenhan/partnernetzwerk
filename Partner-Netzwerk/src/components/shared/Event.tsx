import React from 'react';

interface EventProps {
    summary: string;
    start: {
        date: string;
    };
}

const Event: React.FC<EventProps> = ({ summary, start }) => {
    // Format the date and time
    const eventDate = new Date(start.date).toLocaleDateString();
    const eventTime = new Date(start.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // Generate Google Calendar event creation link
    const googleCalendarLink = `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURI(summary)}&dates=${encodeURI(start.date)}/${encodeURI(start.date)}&details=${encodeURI(summary)}`;

    return (
        <div className="pb-4">
            <div className="bg-ecurie-lightgrey dark:bg-dark-4 py-2 pl-2 pr-8 gap-3 flex justify-between rounded-lg hover:bg-ecurie-babyblue hover:text-white align-baseline">
                <div className="flex items-center">
                    <p className="text-dark-4 dark:text-white font-bold text-lg pl-2 break-words w-44">{summary}</p>
                </div>
                <div className="flex items-center">
                    <div className="flex items-center">
                        <img
                            src="/assets/icons/calendar-icon-black.svg"
                            alt="hide password"
                            width={20}
                            height={20}
                            className="block dark:hidden pb-0.5"
                        />
                        <img
                            src="/assets/icons/calendar-icon.svg"
                            alt="hide password"
                            width={20}
                            height={20}
                            className="hidden dark:block pb-0.5"
                        />
                        <p className="text-dark-4 dark:text-white text-sm pl-2 pt-0.5">{eventDate}</p>
                    </div>
                    <div className="flex items-center pl-4">
                        <img
                            src="/assets/icons/clock-icon-black.svg"
                            alt="hide password"
                            width={20}
                            height={20}
                            className="block dark:hidden pb-0.25"
                        />
                        <img
                            src="/assets/icons/clock-icon.svg"
                            alt="hide password"
                            width={20}
                            height={20}
                            className="hidden dark:block pb-0.25"
                        />
                        <p className="text-dark-4 dark:text-white text-sm pl-2 pt-0.5">{eventTime}</p>
                    </div>
                    <a href={googleCalendarLink} target="_blank" rel="noopener noreferrer" className="text-blue-500 text-xl font-bold ml-4 no-underline pb-1 pl-2">
                        <img
                            src="/assets/icons/calendaradd-icon-black.svg"
                            alt="hide password"
                            width={25}
                            height={20}
                            className="block dark:hidden pt-1.5"
                        />
                        <img
                            src="/assets/icons/calendaradd-icon.svg"
                            alt="hide password"
                            width={25}
                            height={20}
                            className="hidden dark:block pt-1.5"
                        />
                    </a>
                </div>
            </div>
        </div>


    );
};

export default Event;
