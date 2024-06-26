// Import Loader, PostCard, useGetRecentPosts, useGetUsers, Models, React, gapi, Event, and googleConfig
import Loader from '@/components/shared/Loader';
import PostCard from '@/components/shared/PostCard';
import { useGetRecentPosts } from '@/lib/react-query/queriesAndMutations';
import { Models } from 'appwrite';
import React, { useEffect, useState } from 'react';
import { gapi } from 'gapi-script';
import Event from '@/components/shared/Event';
import { googleConfig } from "@/lib/appwrite/config";
import { Brightness } from '@/components/shared/Brightness';
import { BetaDisclaimer } from '@/components/shared/BetaDisclaimer';

// Define EventProps interface
interface EventProps {
  id: string;
  summary: string;
  start: {
    date: string;
  };
}

// Define Home component
const Home: React.FC = () => {
  const {
    data: posts,
    isLoading: isPostLoading,
  } = useGetRecentPosts();

  const [events, setEvents] = useState<EventProps[]>([]);

  const calendarID = googleConfig.calendarId;
  const apiKey = googleConfig.apiKey;

  const getEvents = (calendarID: string, apiKey: string): void => {
    function initiate() {
      gapi.client
        .init({
          apiKey: apiKey,
        })
        .then(() => {
          return gapi.client.request({
            path: `https://www.googleapis.com/calendar/v3/calendars/${calendarID}/events`,
          });
        })
        .then(
          (response: any) => {
            const events = response.result.items;
            setEvents(events);
          },
          (err: any) => {
            console.error("Error fetching events:", err);  // Log any errors
          }
        );
    }
    gapi.load('client:auth2', initiate);
  };

  useEffect(() => {
    if (calendarID && apiKey) {
      getEvents(calendarID, apiKey);
    } else {
      console.error("Missing required environment variables");
    }
  }, [calendarID, apiKey]);

  // Filter out events that are past the current date and sort them by date
  const filteredEvents = events
    .filter((event) => {
      const eventDate = new Date(event.start.date);
      return eventDate >= new Date(); // Only include events that are after the current date
    })
    .sort((a, b) => {
      const dateA = new Date(a.start.date).getTime();
      const dateB = new Date(b.start.date).getTime();
      return dateA - dateB; // Sort by date in ascending order
    });

  return (
    <div className="flex flex-1">
  <div className="home-container flex-grow relative">
    <div className="home-posts">
      <div className="flex justify-between items-center w-full">
        <h2 className="h3-bold md:h2-bold text-left">Home Feed</h2>
        <div className="">
          <BetaDisclaimer />
        </div>
        <Brightness />
      </div>
      {isPostLoading && !posts ? (
        <Loader />
      ) : (
        <ul className="flex flex-col flex-1 gap-9 w-full">
          {posts?.documents.map((post: Models.Document) => (
            <li key={post.$id} className="flex justify-center w-full">
              {/* Pass the media type to PostCard */}
              <PostCard post={post} />
            </li>
          ))}
        </ul>
      )}
    </div>
    
  </div>

      <div className="home-creators relative">
        <h2 className="h3-bold md:h2-bold text-left w-full">Anstehende Events</h2>
        {filteredEvents.length === 0 ? (
          <p className="text-dark-4 dark:text-light-1">Bisher stehen keine Events an.</p>
        ) : (
          <ul>
            {filteredEvents.map((event) => (
              <li key={event.id} className="">
                {/* Pass summary and start props to Event component */}
                <Event summary={event.summary} start={event.start} />
              </li>
            ))}
          </ul>
        )}
        {/* Apply Tailwind classes for absolute positioning */}

      </div>
    </div>
  );
};

export default Home;
