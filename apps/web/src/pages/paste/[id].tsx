import Layout from '@/components/layout'
import { Paste } from '@prisma/client'
import prisma from '@/utils/prisma'
import type { GetServerSideProps, NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
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
        paste: {
          ...paste,
          lastViewedAt: paste?.lastViewedAt.toString(),
          createdAt: paste?.createdAt.toString(),
          updatedAt: paste?.updatedAt.toString(),
        },
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
