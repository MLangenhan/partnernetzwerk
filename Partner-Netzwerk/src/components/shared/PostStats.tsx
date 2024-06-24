import { useDeleteSavedPost, useGetCurrentUser, useLikePost, useSavePost } from "@/lib/react-query/queriesAndMutations";
import { checkIsLiked } from "@/lib/utils";
import { Models } from "appwrite";
import React, { useState, useEffect } from "react";
import Loader from "./Loader";

type PostStatsProps = {
    post?: Models.Document; // Optional post data from Appwrite
    userId: string; // User's id for like/save functionality
}

const PostStats = ({ post, userId }: PostStatsProps) => {

    // State to hold the current list of likes on the post (derived from post.likes)
    const likesList = post?.likes.map((user: Models.Document) => user.$id) || [];
    const [likes, setLikes] = useState(likesList);

    // State to track if the post is currently saved by the user
    const [isSaved, setIsSaved] = useState(false);

    // Get like/save/delete post mutation functions from React Query
    const { mutate: likePost } = useLikePost();
    const { mutate: savePost, isLoading: isSavingPost } = useSavePost();
    const { mutate: deleteSavedPost, isLoading: isDeletingSaved } = useDeleteSavedPost();

    // Get current user data from React Query
    const { data: currentUser } = useGetCurrentUser();

    // Find the saved post record for the current user (if it exists)
    const savedPostRecord = currentUser?.save.find((record: Models.Document) => record.post.$id === post?.$id);

    // Update isSaved state based on presence of savedPostRecord on initial render and currentUser changes
    useEffect(() => {
        setIsSaved(!!savedPostRecord); // Shorthand for 'savedPostRecord? true : false'
    }, [currentUser]);

    const handleLikePost = (e: React.MouseEvent) => {
        e.stopPropagation();

        // Copy the current likes array to avoid mutation
        let newLikes = [...likes];

        // Check if the user has already liked the post
        const hasLiked = newLikes.includes(userId);

        // Update likes state based on like/unlike action
        if (hasLiked) {
            newLikes = newLikes.filter((id) => id !== userId);
        } else {
            newLikes.push(userId);
        }

        setLikes(newLikes);

        // Call the likePost mutation with updated likes array
        likePost({ postId: post?.$id || '', likesArray: newLikes })
    }

    const handleSavePost = (e: React.MouseEvent) => {
        e.stopPropagation();

        // Check if the post is already saved
        if (savedPostRecord) {
            setIsSaved(false);
            deleteSavedPost(savedPostRecord.$id);
        } else {
            // Call the savePost mutation with post id and user id
            savePost({ postId: post?.$id || '', userId })
            setIsSaved(true);
        }
    }

    return (
        <div className='flex justify-between items-center z-20'>
            <div className='flex gap-2 mr-5'>
                <img
                    src={`${checkIsLiked(likes, userId)
                        ? '/assets/icons/liked.svg'
                        : '/assets/icons/like.svg'}
                            `}
                    alt='like'
                    width={20}
                    height={20}
                    onClick={handleLikePost}
                    className='cursor-pointer'
                />
                <p className='small-medium lg:base-medium'>
                    {likes.length}
                </p>
            </div>
            <div className='flex gap-2'>
                {isSavingPost || isDeletingSaved ? <Loader /> :
                    <img
                        src={`${isSaved
                            ? '/assets/icons/saved.svg'
                            : '/assets/icons/save.svg'
                            }
                         `}
                        alt='save'
                        width={20}
                        height={20}
                        onClick={handleSavePost}
                        className='cursor-pointer'
                    />
                }
            </div>
        </div>
    )
}

export default PostStats
