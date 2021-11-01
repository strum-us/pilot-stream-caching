export const enum GAFiletalkCategory{
  Feature = 'Feature'
}

export const enum GAFiletalkAction {
  Signup = 'Signup',
  CreateSession = 'CreateSession',
  CreateDemoSession = 'CreateDemoSession',
  FileUpload = 'FileUpload',
  Chatting = 'Chatting',
  Comment = 'Comment',
  Video = 'Video',
  FocusMe = 'FocusMe',
  SlackCreate = 'SlackCreate',
  SlackJoin = 'SlackJoin',
  Invitation = 'Invitation',
  Annotation = 'Annotation',
  CopyLink = 'CopyLink',
}

export const enum GACategory {
  Feature = 'Feature',
  Settlement = 'Settlement',
  Demography = 'Demography',
  Feedback = 'Feedback'
}

export const enum GAFeatureAction {
  ImageSnapshot = 'ImageSnapshot',
  TextSnapshot = 'TextSnapshot',
  Annotation = 'Annotation',
  TrackMemberStart = 'TrackMemberStart',
  TrackMemberEnd = 'TrackMemberEnd',
  Camera = 'Camera',
  Search = 'Search',
  UploadFolder = 'UploadFolder',
  CreateFolder = 'CreateFolder',
  FileUploadSize = 'FileUploadSize',
  FileUploadCount = 'FileUploadCount',
  DeleteFileSize = 'DeleteFileSize',
  DeleteFileCount = 'DeleteFileCount',
  DownloadFile = 'DownloadFile',
  MoveFile = 'MoveFile',
  FileGridView = 'FileGridView',
  FileListView = 'FileListView',
  CopyLink = 'CopyLink',
  InviteMember = 'InviteMember',
  JoinGuest = 'JoinGuest',
  EmailLink = 'EmailLink',
  RequestPermission = 'RequestPermission',
  ChangePermission = 'ChangePermission',
  FocusSnapshot = 'FocusSnapshot',
  FolderUpload = 'FolderUpload',
  InviteMemeber = 'InviteMemeber',
}

export const enum GASettlementAction {
  AlertUpgrade = 'AlertUpgrade',
  StepUpgrade = 'StepUpgrade',
  StepSubscriptNow = 'StepSubscriptNow',
  StepProceed = 'StepProceed',
  StepFinal = 'StepFinal',
  BeginSignup = 'BeginSignup',
  SubmitSignup = 'SumbmitSignup',
}

export const enum GAPlanLabel {
  ProMonth = 'pro-month',
  TeamMonth = 'team-month',
  ProAnnual = 'pro-annual',
  TeamAnnual = 'team-annual',
}

export const enum GATriggerAlertLabel {
  Home = 'home',
  FileLimit = 'file-limit',
  StorageLimit = 'storage-limit',
  RoomLimit = 'room-limit',
  CameraFeature = 'camera-feature',
  PrivateRoomFeature = 'private-room-feature',
}

export const enum GAStepFinal {
  Positive = 'positive',
  Nagative = 'nagative',

}

export const enum DemographyAction {
  JobTitle = 'JobTitle',
  Industry = 'Industry',
  TeamSize = 'TeamSize'
}
