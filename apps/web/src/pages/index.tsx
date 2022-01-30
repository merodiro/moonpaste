import { useState } from 'react'
import Layout from '@/components/layout'
import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import Head from 'next/head'
import { Textarea, Button, Grid, Loading } from '@nextui-org/react'
import { trpc } from '@/utils/trpc'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { addPasteSchema } from '@/validators/paste'
import { z } from 'zod'

const Home: NextPage = () => {
  const router = useRouter()
  const addPaste = trpc.useMutation('paste.add')

  const { register, handleSubmit, formState } = useForm<z.TypeOf<typeof addPasteSchema>>({
    resolver: zodResolver(addPasteSchema),
    reValidateMode: 'onChange',
  })

  return (
    <Layout>
      <Head>
        <title>Moon Paste</title>
      </Head>

      <Grid.Container gap={2} justify="center">
        <Grid xs={6}>
          <div className="flex flex-col items-end">
            <form
              onSubmit={handleSubmit(async (values) => {
                const paste = await addPaste.mutateAsync(values)
                router.push(`/paste/${paste.id}`)
              })}
            >
              <Textarea
                rows={30}
                cols={70}
                placeholder="your paste here :)"
                color={formState.errors.content ? 'error' : 'default'}
                status={formState.errors.content ? 'error' : 'default'}
                helperColor={formState.errors.content ? 'error' : 'default'}
                helperText={formState.errors.content?.message}
                {...register('content')}
              />

              <Button className="mt-6" size="sm" auto ghost type="submit">
                {addPaste.isLoading ? <Loading color="white" size="sm" /> : 'Create paste'}
              </Button>
            </form>
          </div>
        </Grid>
        <Grid xs={4}></Grid>
      </Grid.Container>
    </Layout>
  )
}

export default Home
