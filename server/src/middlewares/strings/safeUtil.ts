import path from 'path'

export function safeParse<Type>(json: string): Type | null {
  let object: Type | null = null
  try {
    object = JSON.parse(json)
  } catch (e) {
  }
  return object
}

export function safeStringify(json: any): string | null {
  let object = null
  try {
    object = JSON.stringify(json)
  } catch (e) {
    throw e
  }
  return object
}
export function safeToString(value: number): string {
  return value ? value.toString() : ''
}

export function safeExceptExtension(fileId: string): string | null {
  const extname = path.extname(fileId)
  if (!extname) {
    return null
  }

  const splited = fileId.split(extname)
  if (splited.length === 0) {
    return null
  }

  return splited[0]
}

// Check the parameters is valid or not
export function safeArguments(...args: any[]): any[] {
  const errors = []
  if (args) {
    for (const arg of args) {
      if (arg === undefined || arg === null) {
        errors.push(arg)
      }
    }
  }
  if (errors.length > 0) {
    console.log({ safeArgumentsError: errors })
  }
  return errors
}
