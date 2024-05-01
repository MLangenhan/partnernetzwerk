import { Models } from "appwrite"; // Import models interface from Appwrite

// Import Link from react-router-dom for navigation
import { Link } from "react-router-dom";

import PostStats from "@/components/shared/PostStats"; // Import PostStats component
import { multiFormatDateString } from "@/lib/utils"; // Import date formatting function
import { useUserContext } from "@/context/AuthContext"; // Import user context hook

// Define props interface for PostCard component
type PostCardProps = {
  post: Models.Document; // Type the post prop as an Appwrite Document
};

const PostCard = ({ post }: PostCardProps) => {
  const { user } = useUserContext(); // Get user data from context

  // Exit if there's no creator data
  if (!post.creator) return;

  return (
    <div className="post-card">
      <div className="flex-between">
        {/* User Info Section */}
        <div className="flex items-center gap-3">
          <Link to={`/profile/${post.creator.$id}`}>
            <img
              src={
                post.creator?.imageUrl ||
                "/assets/icons/profile-placeholder.svg"
              }
              alt="creator"
              className="w-14 lg:h-14 rounded-full"
            />
          </Link>

          <div className="flex flex-col">
            <p className="base-medium lg:body-bold text-light-1">
              {post.creator.name}
            </p>
            <p className="base-medium text-ecurie-lightblue">
              @{post.creator.username}
            </p>
            <div className="flex-center gap-2 text-ecurie-white">
              <p className="subtle-semibold lg:small-regular ">
                {multiFormatDateString(post.$createdAt)}
              </p>
              •
              <p className="subtle-semibold lg:small-regular">
                {post.location}
              </p>
            </div>
          </div>
        </div>

        {/* Edit Button (hidden if not current user's post) */}
        <Link
          to={`/update-post/${post.$id}`}
          className={`${user.id !== post.creator.$id && "hidden"}`}>
          <img
            src={"/assets/icons/edit.svg"}
            alt="edit"
            width={20}
            height={20}
          />
        </Link>
      </div>

      {/* Post Content Section */}
      <Link to={`/posts/${post.$id}`}>
        <div className="small-medium lg:base-medium py-5">
          <p>{post.caption}</p>
          <ul className="flex gap-1 mt-2">
            {post.tags.map((tag: string, index: string) => (
              <li key={`${tag}${index}`} className="text-ecurie-blue small-regular">
                #{tag}
              </li>
            ))}
          </ul>
        </div>

        <img
          src={post.imageUrl || "/assets/icons/profile-placeholder.svg"}
          alt="post image"
          className="post-card_img"
        />
      </Link>

      {/* Post Stats Section */}
      <PostStats post={post} userId={user.id} />
    </div>
  );
};

export default PostCard;
