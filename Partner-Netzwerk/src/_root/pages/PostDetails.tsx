import { useParams, Link, useNavigate } from "react-router-dom";
import { useState } from 'react';

import { Button } from "@/components/ui/button";
import Loader from "@/components/shared/Loader";
import GridPostList from "@/components/shared/GridPostList";
import PostStats from "@/components/shared/PostStats";


import {
  useGetPostById,
  useGetUserPosts,
  useDeletePost,
  useDeleteSavedPost,
  useGetCurrentUser,
} from "@/lib/react-query/queriesAndMutations";
import { multiFormatDateString, getNameColor } from "@/lib/utils";
import { useUserContext } from "@/context/AuthContext";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Models } from "appwrite";

import { useToast } from "@/components/ui/use-toast";

const PostDetails = () => {
  const { toast } = useToast();
  const deletePostMutation = useDeletePost();
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useUserContext();
  const [isDeleting, setIsDeleting] = useState(false);
  const { data: post, isLoading } = useGetPostById(id);
  const { data: userPosts, isLoading: isUserPostLoading } = useGetUserPosts(
    post?.creator.$id
  );

  const relatedPosts = userPosts?.documents.filter(
    (userPost) => userPost.$id !== id
  );


  const handleDeletePost = async () => {
    if (!id || !post?.imageId) {
      toast({ title: "Invalid post or image ID." });
      return;
    }
  
    setIsDeleting(true);
    try {
      await deletePostMutation.mutateAsync({ postId: id, imageId: post.imageId });
      navigate(-1);
    } catch (error) {
      toast({ title: "Failed to delete post. Please try again." });
    } finally {
      setIsDeleting(false);
    }
  };

  const role = post?.creator.role && post.creator.role.length > 0 ? post.creator.role[0] : '';

  const nameColor = getNameColor(role);

  const fileUrl = post?.imageUrl;
  const mimeType = post?.mimeType;

  // Determine the file type from the mimeType
  const isImage = mimeType && mimeType.startsWith('image/');
  const isVideo = mimeType && mimeType.startsWith('video/');
  const isPDF = mimeType && mimeType === 'application/pdf';

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
            {isImage && (
              <img
                src={fileUrl}
                alt="post image"
                className="file_uploader-img"
              />
            )}
            {isVideo && (
              <video controls className="file_uploader-img">
                <source src={fileUrl} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            )}
            {isPDF && (
              <embed
                src={fileUrl}
                width="100%"
                height="500px"
                type="application/pdf"
                className="file_uploader-img"
              />
            )}
            {/* Default fallback for other file types */}
            {!isImage && !isVideo && !isPDF && (
              <div className="post-card_fallback">
                <p>Unsupported file type</p>
              </div>
            )}
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
                  <p className="base-medium lg:body-bold dark:text-light-1 font-Univers_LT_Std_57">
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

                <Dialog>
                  <DialogTrigger><img
                    src={"/assets/icons/delete.svg"}
                    alt="delete"
                    width={24}
                    height={24}
                  /></DialogTrigger>
                  <DialogContent className="text-light-1 bg-dark-4 dark:bg-transparent h-40 border-4">
                    <DialogHeader className="gap-1">
                      <DialogTitle>Diesen Beitrag wirklich löschen?</DialogTitle>
                      <DialogDescription>
                        Dieser Vorgang kann nicht mehr rückgängig gemacht werden.
                      </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                      <DialogFooter className="rounded-lg absolute inset-y-24 right-6">
                      <DialogClose asChild>
                        <Button
                          onClick={handleDeletePost}
                          variant="ghost"
                          disabled={isDeleting}
                          className={`ost_details-delete_btn bg-ecurie-red ${user.id !== post?.creator.$id && "hidden" }` }>Löschen
                        </Button>
                        </DialogClose>
                      </DialogFooter>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>



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