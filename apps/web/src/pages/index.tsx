import { useState } from 'react'
import Layout from '@/components/layout'
import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import Head from 'next/head'
import { Textarea, Button } from '@nextui-org/react'

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

      <Textarea
        labelPlaceholder="write your paste here :)"
        value={pasteContent}
        onChange={(e) => setPasteContent(e.target.value)}
      />

      <Button onClick={submitPaste}>Paste It!</Button>
    </Layout>
  )
}

export default Home
