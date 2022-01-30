import { useState } from 'react'
import Layout from '@/components/layout'
import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import Head from 'next/head'
import { Textarea, Button, Container, Grid } from '@nextui-org/react'
import { trpc } from '@/utils/trpc'

const Home: NextPage = () => {
  const [pasteContent, setPasteContent] = useState('')
  const router = useRouter()

  const addPaste = trpc.useMutation('paste.add')

  const submitPaste = async () => {
    try {
      const paste = await addPaste.mutateAsync({
        content: pasteContent,
      })
      router.push(`/paste/${paste.id}`)
    } catch (e) {
      console.error(e)
    }
  }

  return (
    <Layout>
      <Head>
        <title>Moon Paste</title>
      </Head>

      <Grid.Container gap={2} justify="center">
        <Grid xs={6}>
          <div className="flex flex-col items-end">
            <Textarea
              rows={30}
              cols={70}
              placeholder="your paste here :)"
              value={pasteContent}
              onChange={(e) => setPasteContent(e.target.value)}
            />

            <Button css={{ mt: '$2' }} size="sm" auto ghost onClick={submitPaste}>
              create paste
            </Button>
          </div>
        </Grid>
        <Grid xs={4}></Grid>
      </Grid.Container>
    </Layout>
  )
}

export default Home
