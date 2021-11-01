import { Mutation, Query, QueryUserListArgs, User } from '../../graphql-types'
import React, { useEffect, useState } from 'react'
import { gql, useMutation, useQuery } from '@apollo/client'

import Highlighter from 'react-highlight-words'
import { UserDetails } from './userDetails'
import { client } from 'src/apollo'
// import * as dayjs from 'dayjs'
import dayjs from 'dayjs'
import faker from 'faker'

const LIST_USERS = gql`
  query userListForAdmin($options: UserListingOptions!) {
    userList(options: $options) {
      id
      email
      photo
      firstName
      lastName
      createdAt
      updatedAt
    }
}`

const USER_COUNT = gql`query userCount { userCount { count }}`

const SEARCH_USERS = gql`
  query findUserByAllKeyword($options: SearchOptions!) {
    findUserByAllKeyword(options: $options) {
      id
      email
      photo
      firstName
      lastName
      createdAt
      updatedAt
    }
}`

export function Users() {
  const [offset, setOffset] = useState(0)
  const [pageLimit, setPageLimit] = useState(32)
  const [keyword, setKeyword] = useState('')
  const [currentPage, setCurrentPage] = useState(0)
  const [selected, setSelected] = useState<User[]>([])
  const [adminId, setAdminId] = useState(null)

  const users = useQuery<Query, QueryUserListArgs>(LIST_USERS, { variables: { options: { adminId, offset, limit: pageLimit } } })
  const userCountRes = useQuery<Query>(USER_COUNT)
  const usersSearchedRes = useQuery<Query>(SEARCH_USERS, { variables: { options: { keyword, limit: 40 } } })

  const [mutRegister] = useMutation<Mutation>(gql`
    mutation createUserForAdminView($input: UserInput!) {
      createUser(input: $input) {
        id
        email
        photo
        firstName
        lastName
        createdAt
        updatedAt
      }
    }
  `)
  const [mutDelete] = useMutation<Mutation>(gql`
    mutation deleteUsersForAdminView($ids: [String!]!) { deleteUsers(ids: $ids) { count }}
  `)

  const addUser = () => {
    const firstName = faker.name.firstName()
    const lastName = faker.name.lastName()
    const photo = faker.image.avatar()
    mutRegister({
      variables: { input: { email: `${firstName.toLowerCase()}@${lastName.toLowerCase()}.com`, password: 'pw1', firstName, lastName, photo } },
      update(_, { data }) {
        console.log('update', data.createUser)
        client.writeQuery({
          query: LIST_USERS,
          variables: { options: { offset, limit: pageLimit } },
          data: { userList: [data.createUser, ...users.data.userList] },
        })
      },
    })
  }

  const deleteUsers = (delUsers: User[]) => {
    mutDelete({
      variables: { ids: delUsers.map((u) => u.id) },
      update(_, { data }) {
        if (data.deleteUsers.count > 0) {
          const filtered = users.data.userList.filter((u) => delUsers.findIndex((d) => d.id === u.id) > 0)
          console.log({ filtered })
          client.writeQuery({
            query: LIST_USERS,
            data: { userList: [...filtered] },
          })
        }
      },
    })
  }

  const navigatePage = (idx: number) => {
    setOffset(idx * pageLimit)
    setCurrentPage(currentPage)
  }

  // second values
  const userCount = userCountRes?.data?.userCount?.count
  const pages = Math.ceil((userCount - currentPage) / pageLimit)
  const usersSearched = usersSearchedRes?.data?.findUserByAllKeyword
  const searching = keyword.trim().length !== 0
  const selectedOne = selected[0]

  if (selectedOne) {
    Object.getOwnPropertyNames(selectedOne)
  }

  const searchKeyword = (keyword: string) => {
    setKeyword(keyword.trim())
  }

  const itemClicked = (user: User, idx: number) => {
    setSelected([user])
  }

  // if (!adminId) {
  //   return (
  //     <div>
  //       <div>Access not permitted</div>
  //       <div>Input Admin ID</div>
  //     </div>
  //   )
  // }

  return (
    <div className='flex flex-row h-full'>

      {/* User list Section */}
      <section className='flex flex-col justify-between h-full'>
        {/* Search */}
        <div className='relative flex flex-row w-10/12 gap-8 p-1 m-8'>
          <input
            placeholder='Search'
            type='search'
            id='search'
            name='search'
            onChange={(e) => searchKeyword(e.target.value)}
            className='w-full px-3 py-1 text-base leading-8 text-gray-700 transition-colors duration-200 ease-in-out bg-white border border-gray-300 rounded outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200'/>
          <button onClick={addUser} className='w-48 px-8 py-2 text-lg text-white bg-indigo-500 border-0 rounded focus:outline-none hover:bg-indigo-600'>Add User</button>
        </div>

        {/* Content area (Scrollable) */}
        <div className='flex flex-col flex-shrink w-full h-full ml-8 mr-8 overflow-y-auto text-sm'>
          {/* List header */}
          <h2 className='text-xl'>{userCount} Users</h2>
          <div className='flex flex-row gap-4 pb-2'>
            <input type='checkbox' className='self-center w-4 rounded form-checkbox' title='chk'/>
            <div className='w-8'>Photo</div>
            <div className='w-32'>ID</div>
            <div className='w-36'>Email</div>
            <div className='w-32'>First name</div>
            <div className='w-32'>Last name</div>
            <div className='w-32'>Created</div>
            <div className='w-32'>Updated</div>
          </div>

          {/* User list */}
          <section className='flex flex-col'>
            { users?.error?.message }
            { users?.error?.graphQLErrors }
            { users?.error?.extraInfo }
            {
              !searching
              // user list
                ? users?.data?.userList?.map((user, idx) => (
                  <div key={idx} className='flex flex-row gap-4 pt-1 pb-1 cursor-default select-none hover:bg-gray-200' onClick={() => itemClicked(user, idx)}>
                    {/* <div className='w-4'>{idx + offset + 1}</div> */}
                    <input type='checkbox' className={'form-checkbox rounded self-center '} checked={selected.findIndex((s) => s.id === user.id) >= 0 ? true : false} title='chk'/>
                    { user.photo ? <img src={user.photo} className='w-6 h-6 rounded-full' title='photo'/> : <div className='w-6 h-6 text-sm text-center bg-gray-200 rounded-full'>N/A</div>}
                    <div className='w-32'>{user.id}</div>
                    <div className='w-36'>{user.email}</div>
                    <div className='w-32'>{user.firstName}</div>
                    <div className='w-32'>{user.lastName}</div>
                    <div className='w-42'>{dayjs(user.createdAt).format('YYYY-MM-DD HH:MM')}</div>
                    <div className='w-42'>{dayjs(user.updatedAt).format('YYYY-MM-DD HH:MM')}</div>
                  </div>
                ))
                : (
                  // search results
                  usersSearched?.map((user, idx) => (
                    <div key={idx} className='flex flex-row gap-4 cursor-default select-none hover:bg-gray-200' onClick={() => itemClicked(user, idx)}>
                      <input type='checkbox' className={'form-checkbox rounded self-center '} checked={selected.findIndex((s) => s.id === user.id) >= 0 ? true : false} title='chk'/>
                      { user.photo ? <img src={user.photo} className='w-6 h-6 rounded-full' title='photo'/> : <div className='w-6 h-6 text-sm text-center bg-gray-200 rounded-full'>N/A</div>}
                      <Highlighter textToHighlight={user.id} className='w-32' highlightClassName='bg-yellow-500' searchWords={[keyword]} autoEscape={true}/>
                      <Highlighter textToHighlight={user.email} className='w-36' highlightClassName='bg-yellow-500' searchWords={[keyword]} autoEscape={true}/>
                      { user.firstName ? <Highlighter textToHighlight={user.firstName} className='w-32' highlightClassName='bg-yellow-500' searchWords={[keyword]} autoEscape={true}/> : <></> }
                      { user.firstName ? <Highlighter textToHighlight={user.lastName} className='w-32' highlightClassName='bg-yellow-500' searchWords={[keyword]} autoEscape={true}/> : <></> }
                      <div className='w-42'>{dayjs(user.createdAt).format('YYYY-MM-DD HH:MM')}</div>
                      <div className='w-42'>{dayjs(user.updatedAt).format('YYYY-MM-DD HH:MM')}</div>
                    </div>
                  ))
                )
            }
          </section>
        </div>

        {/* page navigation */}
        <div className='flex flex-col flex-shrink-0 h-10 p-6 mb-8'>
          <ul className='flex border-t'>
            <li className='mr-1 -mb-px'>
              <a className='inline-block px-4 py-2 font-semibold text-blue-700 bg-white border rounded-b cursor-pointer' href='#' onClick={() => setCurrentPage(Math.max(currentPage - 15, 0))}>Prev</a>
            </li>
            {
              pages > 0 ? [...Array(Math.min(pages, 15)).keys()].map((i) => {
                const idx = i + currentPage
                if (idx === offset / pageLimit) {
                  return <li className='mr-1 -mb-px text-center'>
                    <a className='inline-block w-12 py-2 font-semibold text-blue-700 bg-white border-b border-l border-r rounded-b' href='#'>{idx + 1}</a>
                  </li>
                } else {
                  return <li className='mr-1 -mb-px text-center'>
                    <a className='inline-block w-12 py-2 font-normal text-gray-400 border-b border-l border-r rounded-b cursor-pointer hover:bg-white' onClick={() => navigatePage(idx)}>{idx + 1}</a>
                  </li>
                }
              }) : null
            }
            <li className='mr-1 -mb-px'>
              <a className='inline-block px-4 py-2 font-semibold text-blue-700 bg-white border rounded-b cursor-pointer' href='#' onClick={() => setCurrentPage(Math.min(currentPage + 15, userCount))}>Next</a>
            </li>
          </ul>
        </div>
      </section>

      {/* User Details */}
      {
        selected.length > 0 ? (
          <UserDetails user={selectedOne}/>
        // <div className='absolute top-0 bottom-0 left-0 right-0 flex flex-row bg-black bg-opacity-25' onClick={() => setSelected([])}>
        // </div>
        ) : <></>
      }

    </div>
  )
}
