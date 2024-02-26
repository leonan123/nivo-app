import { zodResolver } from '@hookform/resolvers/zod'
import * as Dialog from '@radix-ui/react-dialog'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Check, Loader2, X } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { getSlugFromString } from '../helpers/get-slug-from-string'
import { Button } from './ui/button'

const createTagSchema = z.object({
  title: z.string().min(3, { message: 'Minimun 3 characters' }),
})

type TCreateTagSchema = z.infer<typeof createTagSchema>

export function CreateTagForm() {
  const queryClient = useQueryClient()

  const {
    register,
    handleSubmit,
    watch,
    resetField,
    formState: { isSubmitting, errors },
  } = useForm<TCreateTagSchema>({
    resolver: zodResolver(createTagSchema),
  })

  const slug = getSlugFromString(watch('title') ?? '')

  const { mutateAsync: createTagFn } = useMutation({
    mutationFn: async ({ title }: TCreateTagSchema) => {
      await new Promise((resolve) => setTimeout(resolve, 2000))

      try {
        fetch('http://localhost:4000/tags', {
          method: 'POST',
          body: JSON.stringify({ title, slug, amountOfVideos: 0 }),
        })

        resetField('title')
      } catch (error) {
        console.error(error)
        alert('Erro no envio')
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['get-tags'],
      })
    },
  })

  async function createTag({ title }: TCreateTagSchema) {
    await createTagFn({ title })
  }

  return (
    <form className="space-y-6" onSubmit={handleSubmit(createTag)}>
      <div className="flex flex-col gap-2">
        <label htmlFor="name" className="text-sm">
          Tag name
        </label>
        <input
          {...register('title')}
          type="text"
          className="rounded-lg border border-zinc-800 bg-zinc-800/50 px-3 py-2.5 text-sm"
        />
        {errors.title && (
          <p className="text-sm text-red-300">{errors.title.message}</p>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="slug" className="text-sm">
          Slug
        </label>
        <input
          value={slug}
          type="text"
          readOnly
          className="rounded-lg border border-zinc-800 bg-zinc-800/50 px-3 py-2.5 text-sm"
        />
      </div>

      <div className="flex items-center justify-end gap-2">
        <Dialog.Close asChild>
          <Button>
            <X className="size-3" />
            Cancel
          </Button>
        </Dialog.Close>

        <Button
          disabled={isSubmitting}
          type="submit"
          className="bg-teal-400 text-teal-950"
        >
          {isSubmitting ? (
            <Loader2 className="size-3 animate-spin" />
          ) : (
            <Check className="size-3" />
          )}
          Save
        </Button>
      </div>
    </form>
  )
}
