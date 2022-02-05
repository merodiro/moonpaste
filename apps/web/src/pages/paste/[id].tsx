import { useEffect, useCallback } from 'react'
import { trpc } from '@/utils/trpc'
import { useRouter } from 'next/router'

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
  return <pre>{JSON.stringify(paste.data, null, 4)}</pre>
}

export default PastePage
