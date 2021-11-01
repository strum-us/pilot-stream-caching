import { useFileDropContext } from '.'

export function useFileDrop() {
  const { dropedFiles, clearDropedFiles, setOnDropFiles, onDrop } = useFileDropContext()
  return {
    onDrop,
    dropedFiles,
    clearDropedFiles,
    setOnDropFiles,
  }
}
