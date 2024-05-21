import { useParams, Link, useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import Loader from "@/components/shared/Loader";
import GridPostList from "@/components/shared/GridPostList";
import PostStats from "@/components/shared/PostStats";


import {
  useGetPostById,
  useGetUserPosts,
  useDeletePost,
} from "@/lib/react-query/queriesAndMutations";
import { multiFormatDateString, getNameColor } from "@/lib/utils";
import { useUserContext } from "@/context/AuthContext";

const PostDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useUserContext();

  const { data: post, isLoading } = useGetPostById(id);
  const { data: userPosts, isLoading: isUserPostLoading } = useGetUserPosts(
    post?.creator.$id
  );
  const { mutate: deletePost } = useDeletePost();

  const relatedPosts = userPosts?.documents.filter(
    (userPost) => userPost.$id !== id
  );

  const handleDeletePost = () => {
    deletePost({ postId: id, imageId: post?.imageId });
    navigate(-1);
  };

  const role = post?.creator.role && post.creator.role.length > 0 ? post.creator.role[0] : '';

  const nameColor = getNameColor(role);

  // Filter out empty strings from tags
  const filteredTags = post?.tags.filter((tag: string) => tag.trim() !== '');

  return (
    <div className="post_details-container">
      <div className="hidden md:flex max-w-5xl w-full">
        <Button
          onClick={() => navigate(-1)}
          variant="ghost"
          className="shad-button_ghost">
          <img
            src={"/assets/icons/back.svg"}
            alt="back"
            width={24}
            height={24}
          />
          <p className="small-medium lg:base-medium">Zurück</p>
        </Button>
      </div>

      {isLoading || !post ? (
        <Loader />
      ) : (
        <div className="post_details-card">
          <a href={post?.imageUrl} target="_blank" className="w-1/2">
            <img
              src={post?.imageUrl}
              alt="creator"
              className="file_uploader-img"
            />
          </a>
          <div className="post_details-info">
            <div className="flex-between w-full">
              <Link
                to={`/profile/${post?.creator.$id}`}
                className="flex items-center gap-3">
                <img
                  src={
                    post?.creator.imageUrl ||
                    "/assets/icons/profile-placeholder.svg"
                  }
                  alt="creator"
                  className="w-8 h-8 lg:w-16 lg:h-16 rounded-full object-cover"
                />
                <div className="flex gap-1 flex-col">
                  <p className="base-medium lg:body-bold text-light-1 font-Univers_LT_Std_57">
                    {post?.creator.name}
                  </p>
                  <p className={`base-medium ${nameColor}`}>
                    @{post.creator.username}
                  </p>
                  <div className="flex-center gap-2 text-ecurie-white">
                    <p className="subtle-semibold lg:small-regular ">
                      {multiFormatDateString(post?.$createdAt)}
                    </p>
                    •
                    <p className="subtle-semibold lg:small-regular">
                      {post?.location}
                    </p>
                  </div>
                </div>
              </Link>

              <div className="flex-center gap-4">
                <Link
                  to={`/update-post/${post?.$id}`}
                  className={`${user.id !== post?.creator.$id && "hidden"}`}>
                  <img
                    src={"/assets/icons/edit.svg"}
                    alt="edit"
                    width={24}
                    height={24}
                  />
                </Link>

                <Button
                  onClick={handleDeletePost}
                  variant="ghost"
                  className={`ost_details-delete_btn ${user.id !== post?.creator.$id && "hidden"
                    }`}>
                  <img
                    src={"/assets/icons/delete.svg"}
                    alt="delete"
                    width={24}
                    height={24}
                  />
                </Button>
              </div>
            </div>

            <hr className="border w-full border-dark-4/80" />

            {/* Post Content Section */}
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

              <div className="w-full">
                <PostStats post={post} userId={user.id} />
              </div>
          </div>
        </div>
      )}

      <div className="w-full max-w-5xl">
        <hr className="border w-full border-dark-4/80" />

        <h3 className="body-bold md:h3-bold w-full my-10">
          Ähnliche Beiträge
        </h3>
        {isUserPostLoading || !relatedPosts ? (
          <Loader />
        ) : (
          <GridPostList posts={relatedPosts} />
        )}
      </div>
    </div>
  );
};

export default PostDetails;