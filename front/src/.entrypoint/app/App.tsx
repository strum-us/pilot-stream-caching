import './App.css';
import '../../styles/tailwind.css';

import { ApolloProvider } from '@apollo/client';
import React from 'react';
import { UserPreferenceProvider } from '@controllers/userPreference';
import { client } from '../../apollo';

type Props = {
  children: React.ReactNode
}

export function ApolloApp({ children }: Props) {
  return (
    <ApolloProvider client={client}>
      <UserPreferenceProvider>
        {/* <div className=""> */}
          {children}
        {/* </div> */}
      </UserPreferenceProvider>
    </ApolloProvider>
  )
}

