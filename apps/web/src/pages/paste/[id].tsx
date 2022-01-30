import { trpc } from '@/utils/trpc'
import { useRouter } from 'next/router'

function PastePage() {
  const router = useRouter()
  const paste = trpc.useQuery(['paste.byId', { id: router.query.id as string }])

  if (!paste) {
    return <pre>Paste not found</pre>
  }
  return <pre>{JSON.stringify(paste.data, null, 4)}</pre>
}

export default PastePage
