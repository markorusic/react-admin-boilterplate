import { Crud } from '../../core/crud'
import { UserCreateForm } from './user-create-form'
import { UserTable } from './user-table'
import { UserUpdateForm } from './user-update-form'
import { userService } from './user-service'
import { Button } from 'antd'

export let UsersPage = () => {
  return (
    <Crud
      name="users-crud"
      entityService={userService}
      initialFetchParams={{ sortBy: 'createdAt,asc', name: 'test' }}
      renderTable={props => <UserTable {...props} />}
      renderCreateForm={props => <UserCreateForm {...props} />}
      renderUpdateForm={props => (
        <UserUpdateForm {...props} initialValues={props.activeRecord} />
      )}
      renderHeader={table => (
        <div style={{ display: 'flex', flex: 1, border: '1px solid' }}>
          <Button
            onClick={() => {
              table.setQueryParams(params => ({
                ...params,
                sortBy: 'name,asc'
              }))
            }}
          >
            name,asc
          </Button>
          <div>
            <div>Search name by: {table.queryParams.name}</div>
            <input
              placeholder="Search by name"
              type="text"
              // value={table.queryParams.name}
              onChange={e => {
                table.setQueryParams(params => ({
                  ...params,
                  name: e.target.value
                }))
              }}
            />
          </div>
        </div>
      )}
    />
  )
}
