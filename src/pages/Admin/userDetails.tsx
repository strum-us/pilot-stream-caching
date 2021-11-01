import { Mutation, Query, User } from '../../graphql-types'
import React, { useState } from 'react'
import { gql, useMutation, useQuery } from '@apollo/client'

import { client } from 'src/apollo'
import dayjs from 'dayjs'
import faker from 'faker'

type Props = {
  user: User
}

const PROJECT_LIST = gql`
  query projectsListForUser($options: ListingOptions!) {
    projectsList(options: $options) {
      id
      title
      description
      numberOfComments
      createdAt
      updatedAt
    }
  }
`

enum Tab {
  BasicInfo,
  Stats,
  Onboarding,
  Activities,
  Payments
}

export function UserDetails(props: Props) {
  const { user } = props
  // const users = useQuery<Query, QueryListUsersArgs>(LIST_USERS, { variables: { option: { offset, limit: pageLimit }}})
  const [tab, setTab] = useState(Tab.BasicInfo)
  const projects = useQuery<Query>(PROJECT_LIST, { variables: { options: { offset: 0, limit: 100, userId: user.id } } })

  const [mutUpdate] = useMutation<Mutation>(gql`
    mutation updateUserForUserDetails($options: UpdateUserOptions!) {
      updateUser(options: $options) {
        count
      }
    }
  `)
  const [mutDelete] = useMutation<Mutation>(gql`
    mutation deleteUsersForUserDetails($ids: [String!]!) { deleteUsers(ids: $ids) { count }}
  `)

  const updateUser = () => {

  }

  const deleteUsers = (delUsers: User[]) => {
    mutDelete({
      variables: { ids: delUsers.map((u) => u.id) },
      update(_, { data }) {
        // if (data.deleteUsers.count > 0) {
        //   const filtered = users.data.listUsers.filter(u => delUsers.findIndex(d => d.id === u.id) > 0)
        //   console.log({ filtered })
        //   client.writeQuery({
        //     query: LIST_USERS,
        //     data: { listUsers: [...filtered] },
        //   })
        // }
      },
    })
  }

  const [createProject, projectCreated] = useMutation(gql`
    mutation createProjectForUserDetails($options: CreateProjectOptions!) {
      createProject(options: $options) {
        id
        title
        description
        numberOfComments
        createdAt
        updatedAt
      }
    }
  `)
  const handleCreateProject = () => {
    createProject({
      variables: { options: { userId: user.id, title: faker.commerce.productName() } },
      update(_, { data }) {
        console.log({ new: [...projects.data.projectsList, data.createProject] })
        client.writeQuery({
          query: PROJECT_LIST,
          data: { projectsList: [...projects.data.projectsList, data.createProject] },
        })
      },
    })
  }

  return (
    <section className='absolute right-0 flex flex-col w-8/12 h-full p-8 m-8 mt-10 bg-white rounded-lg shadow-lg lg:w-2/6 md:w-1/2 md:mt-0'>
      <div className='flex mb-4'>
        <a className={`flex-grow border-b-2 py-2 text-lg px-1 text-center cursor-pointer ${tab === Tab.BasicInfo ? 'text-indigo-500 border-indigo-500' : 'border-gray-300'}`} onClick={() => setTab(Tab.BasicInfo)}>BasicInfo</a>
        <a className={`flex-grow border-b-2 py-2 text-lg px-1 text-center cursor-pointer ${tab === Tab.Activities ? 'text-indigo-500 border-indigo-500' : 'border-gray-300'}`} onClick={() => setTab(Tab.Activities)}>Activities</a>
        <a className={`flex-grow border-b-2 py-2 text-lg px-1 text-center cursor-pointer ${tab === Tab.Stats ? 'text-indigo-500 border-indigo-500' : 'border-gray-300'}`} onClick={() => setTab(Tab.Stats)}>Stats</a>
        <a className={`flex-grow border-b-2 py-2 text-lg px-1 text-center cursor-pointer ${tab === Tab.Onboarding ? 'text-indigo-500 border-indigo-500' : 'border-gray-300'}`} onClick={() => setTab(Tab.Onboarding)}>Onboarding</a>
        <a className={`flex-grow border-b-2 py-2 text-lg px-1 text-center cursor-pointer ${tab === Tab.Payments ? 'text-indigo-500 border-indigo-500' : 'border-gray-300'}`} onClick={() => setTab(Tab.Payments)}>Payments</a>
      </div>

      {/* basic info */}
      {
        tab === Tab.BasicInfo
          ? <section className='flex flex-col'>
            <h2 className='mb-5 text-lg font-medium text-gray-900 title-font'>User details</h2>
            <div className='flex flex-col w-full'>
              {/* fields */}
              { user.photo ? <img src={user.photo} className='self-center w-32 h-32 rounded-full' title='photo'/> : <div className='self-center w-32 h-32 text-sm text-center bg-gray-200 rounded-full'>Change</div>}
              <div className='self-center'>{user.id}</div>

              <div className='relative mb-4'>
                <label htmlFor='first-name' className='text-sm leading-7 text-gray-600'>First Name</label>
                <input type='text' value={user.firstName} id='first-name' placeholder='first-name' className='w-full px-3 py-1 text-base leading-8 text-gray-700 transition-colors duration-200 ease-in-out bg-white border border-gray-300 rounded outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200'/>
              </div>
              <div className='relative mb-4'>
                <label htmlFor='last-name' className='text-sm leading-7 text-gray-600'>Last Name</label>
                <input type='text' value={user.lastName} id='last-name' placeholder='last-name' className='w-full px-3 py-1 text-base leading-8 text-gray-700 transition-colors duration-200 ease-in-out bg-white border border-gray-300 rounded outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200'/>
              </div>
              <div className='relative mb-4'>
                <label htmlFor='email' className='text-sm leading-7 text-gray-600'>Email</label>
                <input type='text' value={user.email} id='email' placeholder='email' className='w-full px-3 py-1 text-base leading-8 text-gray-700 transition-colors duration-200 ease-in-out bg-white border border-gray-300 rounded outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200'/>
              </div>

              {/* forms */}
              <form className='flex flex-col w-full gap-2'>
                <button onClick={() => updateUser()} className='text-white bg-indigo-500 border-0= py-2 px-8 focus:outline-none hover:bg-indigo-600 rounded text-lg'>Save</button>
                <button onClick={() => deleteUsers([user])} className='px-8 py-2 text-lg text-indigo-500 border border-indigo-500 rounded focus:outline-none hover:bg-indigo-600'>Delete</button>
                <button onClick={() => {}} className='px-8 py-2 text-lg text-indigo-500 border border-indigo-500 rounded focus:outline-none hover:bg-indigo-600'>Reset Password</button>
                <p className='mt-3 text-sm text-gray-500'>Immediately save to database</p>

                <button className='px-8 py-2 text-lg text-indigo-500 border border-indigo-500 rounded focus:outline-none hover:bg-indigo-600'>Send email</button>
              </form>
            </div>
          </section>
          : <></>
      }

      {
        tab === Tab.Stats
          ? <section className='flex flex-col'>
            <h2 className='mb-5 text-lg font-medium text-gray-900 title-font'>Stats</h2>
            <div className='flex flex-col w-full'>
              {/* fields */}
              <div className='self-center'>{user.firstName + ' ' + user.lastName}</div>

              {/* Project section */}
              <p className='mt-3 text-sm text-gray-500'>VISIBILITY</p>

              {/* Project section */}
              <p className='mt-3 text-sm text-gray-500'>PROJECT</p>
              { projects?.error?.message }
              {
                projects?.data?.projectsList.map((p, idx) => (
                  <div key={'tab' + idx} className='flex flex-row gap-4'>
                    <div>{idx}</div>
                    <div>{p.title}</div>
                    <div>{dayjs(p.createdAt).format('YYYY-MM-DD HH:MM')}</div>
                  </div>
                ))
              }
              { projectCreated?.error?.message}
              <button onClick={() => handleCreateProject()} className='text-white bg-indigo-500 border-0= py-2 px-8 focus:outline-none hover:bg-indigo-600 rounded text-lg'>Create Project</button>
            </div>
          </section>
          : <></>
      }
    </section>
  )
}
