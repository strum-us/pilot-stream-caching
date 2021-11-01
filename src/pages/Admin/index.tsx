import React, { useEffect, useState } from 'react'

import { Projects } from './projects'
import { Users } from './users'

enum Tab {
  user,
  project
}

export function Admin() {
  const [tab, setTab] = useState(Tab.user)
  return (
    <div className='spa flex flex-row bg-white'>
      {/* header */}
      <div className='h-full w-32 flex flex-col m-2'>
        <div className='mt-4 mb-2 p-2 font-semibold'>Quda</div>
        <div className='hover:bg-gray-200 select-none p-2' onClick={() => setTab(Tab.user)}>User</div>
        <div className='hover:bg-gray-200 select-none p-2' onClick={() => setTab(Tab.project)}>Project</div>
      </div>

      { tab === Tab.user ? <Users/> : <></> }
      { tab === Tab.project ? <Projects/> : <></> }
    </div>
  )
}

