import Layout from '@/components/layout'
import { trpc } from '@/utils/trpc'
import { addPasteSchema } from '@/validators/paste'
import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  Grid,
  GridItem,
  Icon,
  Tooltip,
} from '@chakra-ui/react'
import { zodResolver } from '@hookform/resolvers/zod'
import Editor from '@monaco-editor/react'
import type { NextPage } from 'next'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { Controller, useForm } from 'react-hook-form'
import { z } from 'zod'
import { LanguageList } from '../lib/language-list'
import { SiJavascript, SiHtml5, SiTypescript } from 'react-icons/si'
import { Select } from 'chakra-react-select'

const langOptions = LanguageList.map((lang) => ({ label: lang, value: lang }))

const Home: NextPage = () => {
  const router = useRouter()
  const addPaste = trpc.useMutation('paste.add')

  const { control, handleSubmit, formState, watch, setValue } = useForm<
    z.TypeOf<typeof addPasteSchema>
  >({
    resolver: zodResolver(addPasteSchema),
    reValidateMode: 'onChange',
    defaultValues: {
      language: 'plaintext',
    },
  })

  return (
    <Layout>
      <Head>
        <title>Moon Paste</title>
      </Head>

      <Box
        mt="6"
        mx="6"
        as="form"
        onSubmit={handleSubmit(async (values) => {
          const paste = await addPaste.mutateAsync(values)
          router.push(`/paste/${paste.id}`)
        })}
      >
        <Grid templateColumns="5fr 1fr" gap={6}>
          <GridItem>
            <div>
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
                      language={watch('language')}
                      onChange={(code) => field.onChange(code)}
                      value={field.value}
                      options={{
                        minimap: {
                          enabled: false,
                        },
                        lineNumbers: watch('language') === 'plaintext' ? 'off' : 'on',
                      }}
                    />
                  )}
                />

                {!!formState.errors.content && (
                  <FormErrorMessage>{formState.errors.content.message}</FormErrorMessage>
                )}
              </FormControl>
            </div>
          </GridItem>
          <GridItem display="flex" flexDir="column">
            <Box>
              <Box
                as="button"
                display="inline-flex"
                mr="4"
                type="button"
                onClick={() => setValue('language', 'javascript')}
              >
                <Tooltip label="JavaScript" placement="top">
                  <span>
                    <Icon as={SiJavascript} w={8} h={8} color="yellow.500" />
                  </span>
                </Tooltip>
              </Box>
              <Box
                as="button"
                display="inline-flex"
                mr="4"
                type="button"
                onClick={() => setValue('language', 'html')}
              >
                <Tooltip label="HTML" placement="top">
                  <span>
                    <Icon as={SiHtml5} w={8} h={8} color="red.500" />
                  </span>
                </Tooltip>
              </Box>
              <Box
                as="button"
                display="inline-flex"
                mr="4"
                type="button"
                onClick={() => setValue('language', 'typescript')}
              >
                <Tooltip label="TypeScript" placement="top">
                  <span>
                    <Icon as={SiTypescript} w={8} h={8} color="blue.500" />
                  </span>
                </Tooltip>
              </Box>
            </Box>
            <Box flex={1} mt={6}>
              <Controller
                name="language"
                control={control}
                render={({ field }) => (
                  <Select
                    options={langOptions}
                    ref={field.ref}
                    name={field.name}
                    onBlur={field.onBlur}
                    value={{ value: field.value, label: field.value }}
                    onChange={(e) => field.onChange(e?.value)}
                  />
                )}
              />
            </Box>

            <Button
              isLoading={addPaste.isLoading}
              mt="6"
              colorScheme="blue"
              variant="outline"
              type="submit"
            >
              Create paste
            </Button>
          </GridItem>
        </Grid>
      </Box>
    </Layout>
  )
}

export default Home
