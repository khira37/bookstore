import { createClient } from 'next-sanity'

import { apiVersion, dataset, projectId } from '../env'


export const writeClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: '2024-01-01',
  useCdn: false, // Must be false for write operations
  token: process.env.SANITY_API_TOKEN, // Auth token with write permissions
});