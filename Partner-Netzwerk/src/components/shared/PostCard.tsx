import { Models } from "appwrite"; // Import models interface from Appwrite
import { Link } from "react-router-dom";
import PostStats from "@/components/shared/PostStats"; // Import PostStats component
import { multiFormatDateString, getNameColor } from "@/lib/utils"; // Import date formatting function
import { useUserContext } from "@/context/AuthContext"; // Import user context hook

// Define props interface for PostCard component
type PostCardProps = {
  post: Models.Document; // Type the post prop as an Appwrite Document
};

const PostCard = ({ post }: PostCardProps) => {
  const { user } = useUserContext(); // Get user data from context

  // Exit if there's no creator data
  if (!post.creator) return null;

  // Extract the role, ensuring it's a string
  const role = post.creator.role && post.creator.role.length > 0 ? post.creator.role[0] : '';

  const nameColor = getNameColor(role);

  // Filter out empty strings from tags
  const filteredTags = post.tags.filter((tag: string) => tag.trim() !== '');

  // Get the file URL and mimeType from the post
  const fileUrl = post.imageUrl;
  const mimeType = post.mimeType;

  // Determine the file type from the mimeType
  const isImage = mimeType && mimeType.startsWith('image/');
  const isVideo = mimeType && (mimeType.startsWith('video/mp4') || mimeType.startsWith('video/quicktime')); // Adjusted for .mov
  const isPDF = mimeType && mimeType === 'application/pdf';

  return (
    <div className="post-card">
      <div className="flex-between">
        {/* User Info Section */}
        <div className="flex items-center gap-3">
          <Link to={`/profile/${post.creator.$id}`}>
            <img
              src={post.creator.imageUrl || "/assets/icons/profile-placeholder.svg"}
              alt="creator"
              className="w-14 lg:h-14 rounded-full object-cover"
            />
          </Link>

          <div className="flex flex-col">
            <p className="base-medium lg:body-bold dark:text-light-1 font-Univers_LT_Std_57">
              {post.creator.name}
            </p>
            <p className={`base-medium ${nameColor}`}>
              @{post.creator.username}
            </p>
            <div className="flex-center gap-2 text-ecurie-white">
              <p className="subtle-semibold lg:small-regular">
                {multiFormatDateString(post.$createdAt)}
              </p>
              •
              <p className="subtle-semibold lg:small-regular text-left">
                {post.location}
              </p>
            </div>
          </div>
        </div>

        {/* Edit Button (hidden if not current user's post) */}
        {user.id === post.creator.$id && (
          <Link to={`/update-post/${post.$id}`}>
            <img
              src={"/assets/icons/edit.svg"}
              alt="edit"
              width={20}
              height={20}
            />
          </Link>
        )}
      </div>

      {/* Post Content Section */}
      <Link to={`/posts/${post.$id}`}>
        <div className="small-medium lg:base-medium py-5">
          <p>{post.caption}</p>
          {filteredTags.length > 0 && (
            <ul className="flex gap-1 mt-2">
              {filteredTags.map((tag: string, index: number) => (
                <li key={`${tag}${index}`} className="text-ecurie-blue small-regular">
                  #{tag}
                </li>
              ))}
            </ul>
          )}
        </div>
      </Link>

      {/* Render content based on mimeType */}
      {isImage && (
        <img
          src={fileUrl}
          alt="post image"
          className="post-card_img"
        />
      )}
      {isVideo && (
        <video controls className="post-card_img"> 
          <source src={fileUrl} type={mimeType} /> {/* Use mimeType directly */}
          Dieser Datei-Typ wird von deinem Browser leider nicht unterstützt.
        </video>
      )}
      {isPDF && (
        <embed
          src={fileUrl}
          type="application/pdf"
          className="post-card_img"
        />
      )}
      {/* Default fallback for other file types */}
      {!isImage && !isVideo && !isPDF && (
        <div className="post-card_fallback">
          <p>Dieser Datei-Typ wird leider nicht unterstützt.</p>
        </div>
      )}

      {/* Post Stats Section */}
      <PostStats post={post} userId={user.id} />
    </div>
  );
};

export default PostCard;
