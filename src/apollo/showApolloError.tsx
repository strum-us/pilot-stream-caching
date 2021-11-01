import React, { useEffect, useState } from 'react'

import { ApolloError } from '@apollo/client'
import JSONPretty from 'react-json-pretty'

export function showApolloError(title: string, result) {
  // const [show, setShow] = useState(true)
  // useEffect(() => {
  //   setShow(true)
  // }, [result?.error])
  // if (!show) return <></>
  if (process.env.NODE_ENV === 'production') {
    return <></>
  }
  if (result?.error) {
    console.log('apolloError', JSON.stringify(result.error))
    return (
      <div className='absolute top-0 bottom-0 left-0 right-0 z-50 overflow-y-auto bg-white spa'>
        <pre className='text-sm leading-3 break-all whitespace-pre-wrap'>
          <h4>{title}</h4>
          <JSONPretty data={result.variables}></JSONPretty>
          <JSONPretty data={result.error}></JSONPretty>
        </pre>

        <div
          // onClick={() => setShow(false)}
          className={'absolute right-4 top-4 cursor-pointer hover:bg-dim-light rounded-lg p-1 w-6 h-6'}>
          <svg width='14' height='14' viewBox='0 0 14 14' fill='none' xmlns='http://www.w3.org/2000/svg'>
            <path fillRule='evenodd' clipRule='evenodd' d='M5.6002 7L0 1.3998L1.3998 0L7 5.6002L12.6002 0L14 1.3998L8.3998 7L14 12.6002L12.6002 14L7 8.3998L1.3998 14L0 12.6002L5.6002 7Z' fill='black' />
          </svg>
        </div>
      </div>
    )
  }
  return null
}
