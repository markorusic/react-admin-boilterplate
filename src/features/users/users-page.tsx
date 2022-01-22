import { Crud } from '@/core/crud'
import { UserCreateForm } from './user-create-form'
import { UserTable } from './user-table'
import { UserUpdateForm } from './user-update-form'
import { userService } from './user-service'

export let UsersPage = () => {
  return (
    <Crud
      name="users-crud"
      entityService={userService}
      initialFetchParams={{ sortBy: 'createdAt,desc' }}
      renderTable={props => <UserTable {...props} />}
      renderCreateForm={props => <UserCreateForm {...props} />}
      renderUpdateForm={props => (
        <UserUpdateForm {...props} initialValues={props.activeRecord} />
      )}
    />
  )
}
