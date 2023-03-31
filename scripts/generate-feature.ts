import prettier from 'prettier'
import fsp from 'fs/promises'
import { join } from 'path'
import fs from 'fs'
import inquirer from 'inquirer'

type FeatureItemKey =
  | 'mswMock'
  | 'createForm'
  | 'updateForm'
  | 'page'
  | 'type'
  | 'service'
  | 'table'

const ALL_FEATURE_ITEM_KEYS: FeatureItemKey[] = [
  'mswMock',
  'createForm',
  'updateForm',
  'page',
  'type',
  'service',
  'table',
]

const FEATURE_ITEM_NAMES: Record<FeatureItemKey, string> = {
  type: 'TypeScript types file',
  service: 'API service file',
  table: 'Table component',
  createForm: 'Create form component',
  updateForm: 'Update form component',
  page: 'Page component',
  mswMock: 'MSW API mocks',
}

function capitalize(word: string) {
  const loweredCase = word.toLowerCase()
  return word[0].toUpperCase() + loweredCase.slice(1)
}

async function getPrettierOptions() {
  let prettierOptions: prettier.Options | undefined = undefined
  try {
    const buffer = fs.readFileSync(join(__dirname, '../.prettierrc'))
    prettierOptions = JSON.parse(buffer.toString())
  } catch (error) {}
  return prettierOptions
}

async function createFile(path: string, content: string) {
  await fsp.writeFile(path, content)
  console.log(`${path} generated!`)
}

type TemplateFactoryOptions = {
  name: string
  prettierOptions?: prettier.Options | undefined
}
type Template = Record<FeatureItemKey, string>

function templateFactory({
  name,
  prettierOptions,
}: TemplateFactoryOptions): Template {
  const capitalizedName = capitalize(name)

  function format(value: string) {
    return prettier.format(value, {
      parser: 'babel-ts',
      ...prettierOptions,
    })
  }

  const type = format(`
        import { z } from 'zod'
        import { ID, Record, Sortable, RecordSearch } from '@/core/types'
        import { zMessage } from '@/core/validation'

        type Sortable${capitalizedName}Fields = 'id' | 'name' | 'createdAt'

        export type ${capitalizedName}Request = RecordSearch &
        Sortable<Sortable${capitalizedName}Fields> & {
            id?: ID
            name?: string
        }

        export type ${capitalizedName}Response = Record & {
          name: string
        }

        export const ${capitalizedName}MutationRequest = z.object({
          id: z.number().or(z.string()).optional(),
          name: z.string(zMessage.required),
        })

        export type ${capitalizedName}MutationRequest = z.infer<typeof ${capitalizedName}MutationRequest>
    `)

  const service = format(`
      import { http } from '@/core/http-client'
      import { Page, ID } from '@/core/types'
      import { ${capitalizedName}Request, ${capitalizedName}Response, ${capitalizedName}MutationRequest } from './${name}-types'

      const fetchPage = async (params: ${capitalizedName}Request): Promise<Page<${capitalizedName}Response>> => {
        const { data } = await http.get<Page<${capitalizedName}Response>>('/api/${name}s', { params })
        return data
      }

      const fetchById = async (id: ID): Promise<${capitalizedName}Response> => {
        const { data } = await http.get<${capitalizedName}Response>(\`/api/${name}s/\${id}\`)
        return data
      }

      const create = async (data: ${capitalizedName}MutationRequest) => {
        const res = await http.post('/api/${name}s', data)
        return res.data
      }

      const update = async (data: ${capitalizedName}MutationRequest) => {
        const res = await http.put('/api/${name}s', data)
        return res.data
      }

      export const ${name}Service = {
        create,
        update,
        fetchPage,
        fetchById
      }   
    `)

  const createForm = format(`
        import {
          CreateFormProps,
          Form,
          SubmitButton,
          TextInput
        } from '@/core/form'
        import { ${capitalizedName}MutationRequest } from './${name}-types'
        
        export type ${capitalizedName}CreateFormProps = CreateFormProps<${capitalizedName}MutationRequest>
        
        export const ${capitalizedName}CreateForm = (props: ${capitalizedName}CreateFormProps) => {
          return (
            <Form
              {...props}
              zValidationSchema={${capitalizedName}MutationRequest}
              initialValues={{ name: '' }}
            >
              <TextInput name="name" label="common.name" />
              <SubmitButton />
            </Form>
          )
        }    
    `)

  const updateForm = format(`
        import {
          Form,
          FormProps,
          SubmitButton,
          TextInput
        } from '@/core/form'
        import { ${capitalizedName}MutationRequest } from './${name}-types'
        
        export type ${capitalizedName}UpdateFormProps = FormProps<${capitalizedName}MutationRequest>
        
        export const ${capitalizedName}UpdateForm = (props: ${capitalizedName}UpdateFormProps) => {
          return (
            <Form {...props} zValidationSchema={${capitalizedName}MutationRequest}>
              <TextInput name="name" label="common.name" />
              <SubmitButton />
            </Form>
          )
        }    
    `)

  const table = format(`
      import {
        dateRangeFilterColumn,
        textFilterColumn,
        PageableTableProps,
        PageableTable,
        TableColumn
      } from '@/core/table'
      import { formatDate } from '@/core/utils/date'
      import { ${capitalizedName}Request, ${capitalizedName}Response } from './${name}-types'
      
      export type ${capitalizedName}TableProps = PageableTableProps<${capitalizedName}Response, ${capitalizedName}Request>
      
      export const ${name}Columns: TableColumn<${capitalizedName}Response>[] = [
        textFilterColumn({
          name: 'id',
          title: 'common.id',
          sorter: true,
          width: 100
        }),
        textFilterColumn({
          name: 'name',
          title: 'common.name',
          sorter: true
        }),
        dateRangeFilterColumn({
          name: 'createdAt',
          title: 'common.createdAt',
          sorter: true,
          render: formatDate
        })
      ]
      
      export const ${capitalizedName}Table = (props: ${capitalizedName}TableProps) => {
        return <PageableTable {...props} columns={${name}Columns} />
      }
    
    `)

  const page = format(`
        import { Crud } from '@/core/crud'
        import { ${capitalizedName}CreateForm } from './${name}-create-form'
        import { ${capitalizedName}Table } from './${name}-table'
        import { ${capitalizedName}UpdateForm } from './${name}-update-form'
        import { ${name}Service } from './${name}-service'

        export const ${capitalizedName}Page = () => {
          return (
            <Crud
              name="${name}-crud"
              entityService={${name}Service}
              initialFetchParams={{ sortBy: 'createdAt,desc' }}
              renderTable={props => <${capitalizedName}Table {...props} />}
              renderCreateForm={props => <${capitalizedName}CreateForm {...props} />}
              renderUpdateForm={props => (
                <${capitalizedName}UpdateForm {...props} initialValues={props.activeRecord} />
              )}
            />
          )
        }

    `)

  const mswMock = format(`
      import { rest } from 'msw'
      import { createPage } from '@/core/utils/create-page'
      import { ${capitalizedName}Response } from '@/features/${name}/${name}-types'
      
      const ${name}DataFactory = () => {
        const total = 100
        const data: ${capitalizedName}Response[] = []
      
        for (const id = 1; id < total + 1; id++) {
          data.push({
            id,
            name: \`${name} \${id}\`,
            createdAt: new Date().toString(),
            updatedAt: new Date().toString()
          })
        }
      
        return data
      }
      
      const ${name}Data = ${name}DataFactory()
      
      export const ${name}Handlers = [
        rest.get('/api/${name}s', (req, res, ctx) => {
          const params = Object.fromEntries(req.url.searchParams)
          return res(ctx.json(createPage(${name}Data, params)))
        }),
        rest.get('/api/${name}s/:id', (req, res, ctx) => {
          const { id } = req.params
          const ${name} = ${name}Data.find(${name} => ${name}.id == id)
          if (!${name}) {
            return res(ctx.status(404))
          }
          return res(ctx.json(${name}))
        }),
        rest.post('/api/${name}s', (req, res, ctx) => {
          return res(ctx.json(req.body))
        }),
        rest.put('/api/${name}s', (req, res, ctx) => {
          return res(ctx.json(req.body))
        })
      ]    
    `)

  return { type, service, createForm, updateForm, table, page, mswMock }
}

async function getFeatureName() {
  let [, , name] = process.argv
  if (!name) {
    const result = await inquirer.prompt<{ name: string }>([
      {
        type: 'input',
        name: 'name',
        message: 'What is the name of your feature?',
      },
    ])
    name = result.name
  }
  return name
}

async function getSelectedFeatureKeys() {
  const result = await inquirer.prompt<{ features: FeatureItemKey[] }>([
    {
      type: 'checkbox',
      name: 'features',
      message: 'Select items that you need',
      choices: ALL_FEATURE_ITEM_KEYS.map((key) => ({
        name: FEATURE_ITEM_NAMES[key],
        value: key,
        checked: true,
      })),
    },
  ])

  return result.features
}

async function main() {
  try {
    const prettierOptions = await getPrettierOptions()
    const name = await getFeatureName()
    const selectedFeatureKeys = await getSelectedFeatureKeys()

    const mockDir = join(__dirname, '../src/mocks/handlers')
    const featureDir = join(__dirname, `../src/features/${name}`)

    if (!fs.existsSync(featureDir)) {
      fs.mkdirSync(featureDir)
    }

    type FeatureItemPaths = Record<FeatureItemKey, string>

    const paths: FeatureItemPaths = {
      type: join(featureDir, `${name}-types.ts`),
      service: join(featureDir, `${name}-service.ts`),
      createForm: join(featureDir, `${name}-create-form.tsx`),
      updateForm: join(featureDir, `${name}-update-form.tsx`),
      table: join(featureDir, `${name}-table.tsx`),
      page: join(featureDir, `${name}-page.tsx`),
      mswMock: join(mockDir, `${name}.mock.ts`),
    }

    const templates = templateFactory({ name, prettierOptions })

    selectedFeatureKeys.forEach((key) => {
      const path = paths[key]
      const template = templates[key]
      createFile(path, template)
    })
  } catch (error) {
    console.error('An error occured', error)
  }
}

main()
