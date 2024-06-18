import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { useNavigate } from 'react-router-dom'
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "../ui/textarea"
import FileUploader from "./FileUploader"
import { PostValidation } from "@/lib/validation"
import { Models } from "appwrite"
import { useCreatePost, useUpdatePost } from "@/lib/react-query/queriesAndMutations"
import { useUserContext } from "@/context/AuthContext"
import { useToast } from "../ui/use-toast"
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


type PostFormProps = {
    post?: Models.Document;
    action: 'erstellen' | 'aktualisieren'
}

const PostForm = ({ post, action }: PostFormProps) => {

    const { mutateAsync: createPost, isLoading: isLoadingCreate } = useCreatePost();
    const { mutateAsync: updatePost, isLoading: isLoadingUpdate } = useUpdatePost();
    const { user } = useUserContext();
    const { toast } = useToast();
    const navigate = useNavigate();

    // 1. Define your form.
    const form = useForm<z.infer<typeof PostValidation>>({
        resolver: zodResolver(PostValidation),
        defaultValues: {
            caption: post ? post?.caption : "",
            file: [],
            location: post ? post?.location : "",
            tags: post ? post.tags.join(',') : ''
        },
    })

    // 2. Define a submit handler.
    async function onSubmit(values: z.infer<typeof PostValidation>) {

        if (post && action === 'aktualisieren') {
            const updatedPost = await updatePost({
                ...values,
                postId: post.$id,
                imageId: post?.imageId,
                imageUrl: post.ImageUrl,
                mimeType: post.mimeType,
            })

            if (!updatedPost) {
                toast({ title: 'Maximal 5MB in der Beta!' });
            }

            return navigate(`/posts/${post.$id}`)
        }

        const newPost = await createPost({
            ...values,
            userId: user.id,
            mimeType: post?.mimeType,
        })

        if (!newPost) {
            toast({ title: 'Please try again!' })
        }

        navigate('/');
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-9 w-full max-w-5xl">
                <FormField
                    control={form.control}
                    name="caption"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className='text-dark-4 dark:text-light-1'>Bildunterschrift</FormLabel>
                            <FormControl>
                                <Textarea className='shad-textarea custom-scrollbar' {...field} />
                            </FormControl>
                            <FormMessage className='shad-form_message' />
                        </FormItem>
                    )}
                />
                {action === 'aktualisieren' ? "" :
                    <FormField
                        control={form.control}
                        name="file"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className='text-dark-4  dark:text-light-1'>Bild hinzufügen</FormLabel>
                                <FormControl>
                                    <FileUploader
                                        fieldChange={field.onChange}
                                        mediaUrl={post?.imageUrl}
                                    />
                                </FormControl>
                                <FormMessage className='shad-form_message' />
                            </FormItem>
                        )}
                    />}
                <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className='text-dark-4  dark:text-light-1'>Standort hinzufügen</FormLabel>
                            <FormControl>
                                <Input type='text' className='shad-input' {...field} />
                            </FormControl>
                            <FormMessage className='shad-form_message' />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="tags"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className='text-dark-4 dark:text-light-1'>Tags hinzufügen ( mit einem Komma getrennt: " , " ) </FormLabel>
                            <FormControl>
                                <Input type='text' className='shad-input' placeholder='Heute, Event, Auto' {...field} />
                            </FormControl>
                            <FormMessage className='shad-form_message' />
                        </FormItem>
                    )}
                />
                <div className='flex gap-4 items-center justify-end'>
                    <Dialog>
                        <DialogTrigger><Button type="button" className='shad-button_dark_4'>Zurück</Button></DialogTrigger>
                        <DialogContent className="text-dark-4 dark:text-light-1 bg-ecurie-lightgrey dark:bg-dark-4 h-40 border-4">
                            <DialogHeader className="gap-1">
                                <DialogTitle>Diesen Vorgang wirklich abbrechen?</DialogTitle>
                                <DialogDescription>
                                    Wenn Sie nun zurückkehren gehen alle ihre Änderungen verloren.
                                </DialogDescription>
                            </DialogHeader>
                            <DialogFooter>
                                <DialogFooter className="rounded-lg absolute inset-y-24 right-6">
                                    <DialogClose asChild>
                                    <Button type="button" className='shad-button_lightgrey' onClick={() => { navigate(-1) }}>Zurück</Button>
                                    </DialogClose>
                                </DialogFooter>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                    
                    <Button
                        type="submit"
                        className='shad-button_primary whitespace-nowrap h-12'
                        disabled={isLoadingCreate || isLoadingCreate}
                    >
                        {isLoadingCreate || isLoadingUpdate && 'Loading...'}
                        Beitrag {action}
                    </Button>
                </div>

            </form>
        </Form>
    )
}

export default PostForm