import { useEffect, useCallback } from 'react'
import { trpc } from '@/utils/trpc'
import { useRouter } from 'next/router'
import Layout from '@/components/layout'
import Editor from '@monaco-editor/react'
import { Container } from '@chakra-ui/react'

function PastePage() {
  const router = useRouter()
  const paste = trpc.useQuery(['paste.byId', { id: router.query.id as string }])
  const updatePasteViewsMutation = trpc.useMutation('paste.updateViews').mutate

  useEffect(() => {
    updatePasteViewsMutation({ id: router.query.id as string })
  }, [router.query.id, updatePasteViewsMutation])

  if (!paste) {
    return <pre>Paste not found</pre>
  }
  return (
    <Layout>
      <Container maxW="container.xl" mt="6">
        <Editor
          language={paste.data?.language}
          theme="vs-dark"
          value={paste.data?.content}
          height="500px"
          width="100%"
          options={{
            minimap: {
              enabled: false,
            },
            readOnly: true,
          }}
        />
      </Container>
    </Layout>
  )
}

export default PastePage
