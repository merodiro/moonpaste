import prisma from '@/utils/prisma'
import { Paste } from '@prisma/client'
import type { GetServerSideProps } from 'next'
import { ParsedUrlQuery } from 'querystring'

interface IPageParams extends ParsedUrlQuery {
  id: string
}

type Props = {
  paste: Paste
}

function PastePage({ paste }: Props) {
  if (!paste) {
    return <pre>Paste not found</pre>
  }
  return <pre>{JSON.stringify(paste, null, 4)}</pre>
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id } = context?.params as IPageParams

  try {
    const paste = await prisma.paste.update({
      where: {
        id,
      },
      data: {
        views: {
          increment: 1,
        },
        lastViewedAt: new Date(),
      },
      include: {
        user: true,
      },
    })

    return {
      props: {
        paste,
      },
    }
  } catch (e) {
    return {
      props: {
        paste: null,
      },
    }
  }
}

export default PastePage
