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

let ALL_FEATURE_ITEM_KEYS: FeatureItemKey[] = [
  'mswMock',
  'createForm',
  'updateForm',
  'page',
  'type',
  'service',
  'table'
]

let FEATURE_ITEM_NAMES: Record<FeatureItemKey, string> = {
  type: 'TypeScript types file',
  service: 'API service file',
  table: 'Table component',
  createForm: 'Create form component',
  updateForm: 'Update form component',
  page: 'Page component',
  mswMock: 'MSW API mocks'
}

function capitalize(word: string) {
  const loweredCase = word.toLowerCase()
  return word[0].toUpperCase() + loweredCase.slice(1)
}

async function getPrettierOptions() {
  let prettierOptions: prettier.Options | undefined = undefined
  try {
    let buffer = fs.readFileSync(join(__dirname, '../.prettierrc'))
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
  prettierOptions
}: TemplateFactoryOptions): Template {
  let capitalizedName = capitalize(name)

  function format(value: string) {
    return prettier.format(value, {
      parser: 'babel-ts',
      ...prettierOptions
    })
  }

  let type = format(`
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

        export let ${capitalizedName}MutationRequest = z.object({
          id: z.number().or(z.string()).optional(),
          name: z.string(zMessage.required),
        })

        export type ${capitalizedName}MutationRequest = z.infer<typeof ${capitalizedName}MutationRequest>
    `)

  let service = format(`
      import { http } from '@/core/http-client'
      import { Page, ID } from '@/core/types'
      import { ${capitalizedName}Request, ${capitalizedName}Response, ${capitalizedName}MutationRequest } from './${name}-types'

      let fetchPage = async (params: ${capitalizedName}Request): Promise<Page<${capitalizedName}Response>> => {
        let { data } = await http.get<Page<${capitalizedName}Response>>('/api/${name}s', { params })
        return data
      }

      let fetchById = async (id: ID): Promise<${capitalizedName}Response> => {
        let { data } = await http.get<${capitalizedName}Response>(\`/api/${name}s/\${id}\`)
        return data
      }

      let create = async (data: ${capitalizedName}MutationRequest) => {
        let res = await http.post('/api/${name}s', data)
        return res.data
      }

      let update = async (data: ${capitalizedName}MutationRequest) => {
        let res = await http.put('/api/${name}s', data)
        return res.data
      }

      export let ${name}Service = {
        create,
        update,
        fetchPage,
        fetchById
      }   
    `)

  let createForm = format(`
        import {
          CreateFormProps,
          Form,
          SubmitButton,
          TextInput
        } from '@/core/form'
        import { ${capitalizedName}MutationRequest } from './${name}-types'
        
        export type ${capitalizedName}CreateFormProps = CreateFormProps<${capitalizedName}MutationRequest>
        
        export let ${capitalizedName}CreateForm = (props: ${capitalizedName}CreateFormProps) => {
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

  let updateForm = format(`
        import {
          Form,
          FormProps,
          SubmitButton,
          TextInput
        } from '@/core/form'
        import { ${capitalizedName}MutationRequest } from './${name}-types'
        
        export type ${capitalizedName}UpdateFormProps = FormProps<${capitalizedName}MutationRequest>
        
        export let ${capitalizedName}UpdateForm = (props: ${capitalizedName}UpdateFormProps) => {
          return (
            <Form {...props} zValidationSchema={${capitalizedName}MutationRequest}>
              <TextInput name="name" label="common.name" />
              <SubmitButton />
            </Form>
          )
        }    
    `)

  let table = format(`
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
      
      export let ${name}Columns: TableColumn<${capitalizedName}Response>[] = [
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
      
      export let ${capitalizedName}Table = (props: ${capitalizedName}TableProps) => {
        return <PageableTable {...props} columns={${name}Columns} />
      }
    
    `)

  let page = format(`
        import { Crud } from '@/core/crud'
        import { ${capitalizedName}CreateForm } from './${name}-create-form'
        import { ${capitalizedName}Table } from './${name}-table'
        import { ${capitalizedName}UpdateForm } from './${name}-update-form'
        import { ${name}Service } from './${name}-service'

        export let ${capitalizedName}Page = () => {
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

  let mswMock = format(`
      import { rest } from 'msw'
      import { createPage } from '@/core/utils/create-page'
      import { ${capitalizedName}Response } from '@/features/${name}/${name}-types'
      
      let ${name}DataFactory = () => {
        let total = 100
        let data: ${capitalizedName}Response[] = []
      
        for (let id = 1; id < total + 1; id++) {
          data.push({
            id,
            name: \`${name} \${id}\`,
            createdAt: new Date().toString(),
            updatedAt: new Date().toString()
          })
        }
      
        return data
      }
      
      let ${name}Data = ${name}DataFactory()
      
      export let ${name}Handlers = [
        rest.get('/api/${name}s', (req, res, ctx) => {
          let params = Object.fromEntries(req.url.searchParams)
          return res(ctx.json(createPage(${name}Data, params)))
        }),
        rest.get('/api/${name}s/:id', (req, res, ctx) => {
          let { id } = req.params
          let ${name} = ${name}Data.find(${name} => ${name}.id == id)
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
    let result = await inquirer.prompt<{ name: string }>([
      {
        type: 'input',
        name: 'name',
        message: 'What is the name of your feature?'
      }
    ])
    name = result.name
  }
  return name
}

async function getSelectedFeatureKeys() {
  let result = await inquirer.prompt<{ features: FeatureItemKey[] }>([
    {
      type: 'checkbox',
      name: 'features',
      message: 'Select items that you need',
      choices: ALL_FEATURE_ITEM_KEYS.map(key => ({
        name: FEATURE_ITEM_NAMES[key],
        value: key,
        checked: true
      }))
    }
  ])

  return result.features
}

async function main() {
  try {
    let prettierOptions = await getPrettierOptions()
    let name = await getFeatureName()
    let selectedFeatureKeys = await getSelectedFeatureKeys()

    let mockDir = join(__dirname, '../src/mocks/handlers')
    let featureDir = join(__dirname, `../src/features/${name}`)

    if (!fs.existsSync(featureDir)) {
      fs.mkdirSync(featureDir)
    }

    type FeatureItemPaths = Record<FeatureItemKey, string>

    let paths: FeatureItemPaths = {
      type: join(featureDir, `${name}-types.ts`),
      service: join(featureDir, `${name}-service.ts`),
      createForm: join(featureDir, `${name}-create-form.tsx`),
      updateForm: join(featureDir, `${name}-update-form.tsx`),
      table: join(featureDir, `${name}-table.tsx`),
      page: join(featureDir, `${name}-page.tsx`),
      mswMock: join(mockDir, `${name}.mock.ts`)
    }

    let templates = templateFactory({ name, prettierOptions })

    selectedFeatureKeys.forEach(key => {
      let path = paths[key]
      let template = templates[key]
      createFile(path, template())
    })
  } catch (error) {
    console.error('An error occured', error)
  }
}

main()
