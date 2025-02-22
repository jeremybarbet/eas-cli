import assert from 'assert';
import { print } from 'graphql';
import gql from 'graphql-tag';

import { graphqlClient, withErrorHandlingAsync } from '../client';
import { AppByFullNameQuery, AppFragment } from '../generated';
import { AppFragmentNode } from '../types/App';

export const AppQuery = {
  async byFullNameAsync(fullName: string): Promise<AppFragment> {
    const data = await withErrorHandlingAsync(
      graphqlClient
        .query<AppByFullNameQuery>(
          gql`
            query AppByFullNameQuery($fullName: String!) {
              app {
                byFullName(fullName: $fullName) {
                  id
                  ...AppFragment
                }
              }
            }
            ${print(AppFragmentNode)}
          `,
          { fullName },
          {
            additionalTypenames: ['App'],
          }
        )
        .toPromise()
    );

    assert(data.app, 'GraphQL: `app` not defined in server response');
    return data.app.byFullName;
  },
};
