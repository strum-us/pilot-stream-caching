
// How to convert Base64 String to javascript file object
// https://stackoverflow.com/questions/35940290/how-to-convert-base64-string-to-javascript-file-object-like-as-from-file-input-f/38935990
export async function dataUrlToFile(dataUrl: string, fileName: string): Promise<File> {
  const res: Response = await fetch(dataUrl)
  const blob: Blob = await res.blob()
  return new File([blob], fileName, { type: 'image/png' })
}

// Base64 String -> Blob -> File
// export function dataUrlToImage(url: string, fileName:string) {
//   fetch(url)
//     .then((res) => res.blob())
//     .then((blob) => {
//       const file = new File([blob], fileName, { type: 'image/png' })
//       console.log(file)
//     })
// }

// export function dataUrlToFile(url: string, fileName: string) {
//   const arr = url.split(',')
//   const mime = arr[0] && arr[0].match(/:(.*?);/)?.[1]
//   const bstr = atob(arr[1])
//   let n = bstr.length
//   const u8arr = new Uint8Array(n)
//   while (n--) {
//     u8arr[n] = bstr.charCodeAt(n)
//   }
//   return new File([u8arr], fileName, { type: mime })
// }
