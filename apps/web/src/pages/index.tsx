import Layout from '@/components/layout'
import { trpc } from '@/utils/trpc'
import { addPasteSchema } from '@/validators/paste'
import {
  Button,
  Container,
  FormControl,
  FormErrorMessage,
  Grid,
  GridItem,
  Select,
} from '@chakra-ui/react'
import { zodResolver } from '@hookform/resolvers/zod'
import Editor from '@monaco-editor/react'
import type { NextPage } from 'next'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { z } from 'zod'
import { LanguageList } from '../lib/language-list'

const Home: NextPage = () => {
  const router = useRouter()
  const addPaste = trpc.useMutation('paste.add')
  const [selectedLanguage, setSelectedLanguage] = useState('plaintext')

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
        <Grid>
          <GridItem>
            <Select
              placeholder="Select option"
              defaultValue={selectedLanguage}
              onChange={(e) => {
                setSelectedLanguage(e.target.value)
              }}
            >
              {LanguageList.map((language) => (
                <option value={language} key={language}>
                  {language}
                </option>
              ))}
            </Select>
          </GridItem>
          <GridItem></GridItem>
        </Grid>
        <Grid templateColumns="3fr 1fr" gap={6}>
          <GridItem>
            <div>
              <form
                onSubmit={handleSubmit(async (values) => {
                  const paste = await addPaste.mutateAsync({
                    ...values,
                    language: selectedLanguage,
                  })
                  router.push(`/paste/${paste.id}`)
                })}
              >
                <FormControl isInvalid={!!formState.errors.content}>
                  <Controller
                    control={control}
                    name="content"
                    render={({ field }) => (
                      <Editor
                        height="75vh"
                        width="100%"
                        theme="vs-dark"
                        defaultLanguage="plaintext"
                        language={selectedLanguage}
                        onChange={(code) => field.onChange(code)}
                        value={field.value}
                        options={{
                          minimap: {
                            enabled: false,
                          },
                          lineNumbers: selectedLanguage === 'plaintext' ? 'off' : 'on',
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
