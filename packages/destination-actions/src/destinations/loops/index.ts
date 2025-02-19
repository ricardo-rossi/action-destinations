import type { DestinationDefinition } from '@segment/actions-core'
import type { Settings } from './generated-types'

import createContact from './createContact'

const destination: DestinationDefinition<Settings> = {
  name: 'Loops (Actions)',
  slug: 'actions-loops',
  mode: 'cloud',

  extendRequest: ({ settings }) => {
    return {
      headers: { Authorization: `Bearer ${settings.apiKey}`, 'Content-Type': 'application/json' }
    }
  },

  authentication: {
    scheme: 'custom',
    fields: {
      apiKey: {
        label: 'API Key',
        description: 'Your Loops API Key',
        type: 'string',
        required: true
      }
    },
    testAuthentication: (request) => {
      return request('https://app.loops.so/api/v1/api-key', { method: 'GET' })
    }
  },

  actions: {
    createContact
  }
}

export default destination
