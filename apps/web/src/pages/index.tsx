import { useState } from 'react'
import Layout from '@/components/layout'
import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import Head from 'next/head'
import { Textarea, Button, Container, Grid } from '@nextui-org/react'

const Home: NextPage = () => {
  const [pasteContent, setPasteContent] = useState('')
  const router = useRouter()

  const submitPaste = async () => {
    const res = await fetch('/api/paste', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        content: pasteContent,
      }),
    })

    const paste = await res.json()
    router.push(`/paste/${paste.id}`)
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
