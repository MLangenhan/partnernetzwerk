import { useUserContext } from '@/context/AuthContext' // Import the  useUserContext hook from the AuthContext

import { Models } from 'appwrite' // Import Models interface (likely from Appwrite)

import React from 'react' // Import React library

import { Link } from 'react-router-dom' // Import Link component for routing

import PostStats from './PostStats' // Import PostStats component for displaying post stats

// Define interface for GridPostList props
type GridPostListProps = {
  posts: Models.Document[] // An array of Appwrite Documents representing posts
  showUser?: boolean; // Optional prop to control displaying the user info (defaults to true)
  showStats?: boolean; // Optional prop to control displaying post stats (defaults to true)
}

const GridPostList = ({ posts, showUser = true, showStats = true }: GridPostListProps) => {
  // Destructure user object from the useUserContext hook
  const { user } = useUserContext();

  return (
    <ul className='grid-container'>
      {posts.map((post) => (
        <li key={post.$id} className='relative min-w-8- h-80'>
          <Link to={`/posts/${post.$id}`} className='grid-post_link'>
            {post.mimeType.startsWith('image/') && ( // Check if MIME type starts with 'image/'
              <img
                src={post.imageUrl}
                alt="post image"
                className="h-full w-full object-cover"
              />
            )}
            {post.mimeType.startsWith('video/') && ( // Check if MIME type starts with 'video/'
              <video controls className="file_uploader-img">
                <source src={post.imageUrl} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            )}
            {post.mimeType === 'application/pdf' && ( // Check if MIME type is 'application/pdf'
              <a href={`/posts/${post.$id}`} target="_blank" rel="noopener noreferrer">
                <embed
                  src={post.imageUrl}
                  width="100%"
                  height="500px"
                  type="application/pdf"
                  className="file_uploader-img"
                />
              </a>
            )}
          </Link>

          <div className='grid-post_user'>
            {/* Conditionally render user info based on showUser prop */}
            {showUser && (
              <div className='flex items-center justify-start gap-2 flex-1'>
                <img
                  src={post.creator.imageUrl}
                  alt='creator'
                  className='h-8 w-8 rounded-full object-cover'
                />
                <p className='line-clamp-1'> {/* Truncate username to one line */} </p>
              </div>
            )}
            {/* Conditionally render PostStats component based on showStats prop */}
            {showStats && <PostStats post={post} userId={user.id} />}
          </div>
        </li>
      ))}
    </ul>
  )
}

export default GridPostList
