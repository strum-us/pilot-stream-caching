// import { Folder, File as GraphqlFile } from '@protocols/graphql-types'
// // import fileActions from 'app/providers/WorkspaceActions/fileActions'
// // import { downloadFile, downloadFilesAndFolders } from '@states/redux/api/file.api'

// // import { getState } from '@states/redux/modules'

// export const sortItems = (files: GraphqlFile[], folders: Folder[], by: string, orderBy: 'asc' | 'desc') => {
//   let sortedFiles = []
//   if (files) {
//     files.sort((a, b) => {
//       let currentBy = 'createdAt'
//       if (by === 'name' || a[currentBy] === b[currentBy]) {
//         currentBy = 'displayName'
//       }

//       if (orderBy === 'asc') {
//         return a[currentBy] < b[currentBy] ? -1 : a[currentBy] > b[currentBy] ? 1 : 0
//       } else {
//         return a[currentBy] > b[currentBy] ? -1 : a[currentBy] < b[currentBy] ? 1 : 0
//       }
//     })
//     sortedFiles = files
//   }

//   let sortedFolders = []
//   if (folders) {
//     folders.sort((a, b) => {
//       let currentBy = 'createdAt'
//       if (by === 'name') {
//         currentBy = 'name'
//       }

//       if (orderBy === 'asc') {
//         return a[currentBy] < b[currentBy] ? -1 : a[currentBy] > b[currentBy] ? 1 : 0
//       } else {
//         return a[currentBy] > b[currentBy] ? -1 : a[currentBy] < b[currentBy] ? 1 : 0
//       }
//     })
//     sortedFolders = folders
//   }

//   return [...sortedFolders, ...sortedFiles]
// }

// export const fileDownload = (itemId: number, isFile: boolean, fileId?: string) => {
//   // const state = getState()
//   // const workspace = state.workspaces.workspaces[state.workspaces.currentId]
//   // if (isFile) {
//   //   const targetFile = workspace.files.find((file) => file.id === itemId)
//   //   if (targetFile) {
//   //     downloadFile(workspace.id, fileId, targetFile.displayName)
//   //     // fileActions.downloadFileOnWeb(workspace.id, fileId)
//   //   }
//   // } else {
//   //   const targetFolder = workspace.folders.find((folder) => folder.id === itemId)
//   //   if (targetFolder) {
//   //     downloadFilesAndFolders(workspace.id, [], [targetFolder], targetFolder.name + '.zip')
//   //     // fileActions.downloadFilesAndFolders(workspace.id, [], [targetFolder], targetFolder.name + '.zip')
//   //   }
//   // }
// }

// // export const isNewFile = (file: GraphqlFile, openHistory: FileOpenHistory) => {
// //   if (file) {
// //     if (openHistory) {
// //       return file.updatedAt && file.updatedAt > openHistory.openedAt
// //     } else {
// //       return true
// //     }
// //   } else {
// //     return false
// //   }
// // }
