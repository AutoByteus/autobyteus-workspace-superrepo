export type RuntimeModelConfigSchemaState = Readonly<{
  status: 'loading' | 'ready' | 'invalid' | 'unavailable'
  message: string | null
}>
