import React from 'react'
import { UserCreateButtonModal } from './user-create-form'
import { UserTable } from './user-table'

export let UsersPage = () => {
  return (
    <div>
      <div style={{ marginBottom: '8px' }}>
        <UserCreateButtonModal />
      </div>
      <div>
        <UserTable />
      </div>
    </div>
  )
}
