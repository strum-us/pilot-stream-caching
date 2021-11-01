import { useImageDropContext } from '.'

export function useFileDrop() {
  const { dropedFiles, clearDropedFiles, setOnDropFiles } = useImageDropContext()
  return {
    dropedFiles,
    clearDropedFiles,
    setOnDropFiles,
  }
}
