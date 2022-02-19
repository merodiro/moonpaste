import Layout from '@/components/layout'
import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import Head from 'next/head'
import { trpc } from '@/utils/trpc'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { addPasteSchema } from '@/validators/paste'
import { z } from 'zod'
import {
  Grid, GridItem,
  Textarea,
  Box,
  Button,
  Container,
  Flex,
  FormControl,
  FormErrorMessage,
} from '@chakra-ui/react'
import Editor from "@monaco-editor/react";

const Home: NextPage = () => {
  const router = useRouter()
  const addPaste = trpc.useMutation('paste.add')

  const { control, handleSubmit, formState } = useForm<z.TypeOf<typeof addPasteSchema>>({
    resolver: zodResolver(addPasteSchema),
    reValidateMode: 'onChange',
  })

  return (
    <Layout>
      <Head>
        <title>Moon Paste</title>
      </Head>

      <Container maxW="container.xl" mt="6">
        <Grid templateColumns='3fr 1fr' gap={6}>
          <GridItem>
            <div>
              <form
                onSubmit={handleSubmit(async (values) => {
                  const paste = await addPaste.mutateAsync(values)
                  router.push(`/paste/${paste.id}`)
                })}
              >
                <FormControl isInvalid={!!formState.errors.content}>

                  <Controller
                    control={control}
                    name="content"
                    render={
                      ({ field }) => (
                        <Editor
                          height="500px"
                          width="100%"
                          theme='vs-dark'
                          defaultLanguage="javascript"
                          onChange={(code) => field.onChange(code)}
                          value={field.value}
                          options={{
                            minimap: {
                              enabled: false
                            }
                          }}
                        />
                      )}
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
          </GridItem>
          <GridItem></GridItem>
        </Grid>
      </Container>
    </Layout>
  )
}

export default Home
