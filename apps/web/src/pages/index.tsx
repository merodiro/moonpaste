import Layout from '@/components/layout'
import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import Head from 'next/head'
import { trpc } from '@/utils/trpc'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { addPasteSchema } from '@/validators/paste'
import { z } from 'zod'
import {
  Textarea,
  Box,
  Button,
  Container,
  Flex,
  FormControl,
  FormErrorMessage,
} from '@chakra-ui/react'

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

      <Container maxW="container.xl" mt="6">
        <Flex>
          <Box>
            <div className="flex flex-col items-end">
              <form
                onSubmit={handleSubmit(async (values) => {
                  const paste = await addPaste.mutateAsync(values)
                  router.push(`/paste/${paste.id}`)
                })}
              >
                <FormControl isInvalid={!!formState.errors.content}>
                  <Textarea
                    rows={30}
                    cols={70}
                    placeholder="your paste here :)"
                    {...register('content')}
                  />

                  {!!formState.errors.content && (
                    <FormErrorMessage>{formState.errors.content.message}</FormErrorMessage>
                  )}
                </FormControl>

                <Button
                  isLoading={addPaste.isLoading}
                  mt="6"
                  colorScheme="blue"
                  variant="outline"
                  type="submit"
                >
                  Create paste
                </Button>
              </form>
            </div>
          </Box>
          <Box></Box>
        </Flex>
      </Container>
    </Layout>
  )
}

export default Home
