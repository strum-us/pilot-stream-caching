import { GraphQLResolveInfo, GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type RequireFields<T, K extends keyof T> = { [X in Exclude<keyof T, K>]?: T[X] } & { [P in K]-?: NonNullable<T[P]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /** The javascript `Date` as string. Type represents date and time as the ISO Date string. */
  DateTime: any;
};

/** Type of activity action */
export enum ActionEnum {
  Created = 'created',
  Updated = 'updated',
  Deleted = 'deleted',
  Moved = 'moved',
  Completed = 'completed',
  Added = 'added'
}

/** Type of activity target */
export enum ActivityTargetEnum {
  Note = 'note',
  Source = 'source',
  Issue = 'issue'
}

export type Annotation = {
  __typename?: 'Annotation';
  id: Scalars['String'];
  data: Scalars['String'];
  sourceId: Scalars['String'];
  version: UnitStripVersion;
  updatedAt: Scalars['Float'];
};

export type AnnotationListingOptions = {
  offset?: Maybe<Scalars['Float']>;
  limit?: Maybe<Scalars['Float']>;
  sourceId: Scalars['String'];
};

export type AnnotationsInput = {
  id: Scalars['String'];
  data: Scalars['String'];
  version: Scalars['String'];
};

export type Count = {
  __typename?: 'Count';
  count: Scalars['Int'];
};

export type CreateAnnotationOptions = {
  sourceId: Scalars['String'];
  data: Scalars['String'];
  version: Scalars['String'];
};

export type CreateFeedbackCommentOptions = {
  noteId: Scalars['String'];
  issueId: Scalars['Float'];
  title?: Maybe<Scalars['String']>;
  thumbnail?: Maybe<Scalars['String']>;
};

export type CreateFeedbackNoteOptions = {
  projectId?: Maybe<Scalars['Int']>;
};

export type CreateFeedbackWorkflowOptions = {
  settings: Scalars['String'];
};

export type CreateProjectOptions = {
  userId?: Maybe<Scalars['String']>;
  title: Scalars['String'];
};


export type FeedbackActionRecord = {
  __typename?: 'FeedbackActionRecord';
  id: Scalars['Int'];
  issueId: Scalars['Int'];
  content?: Maybe<Scalars['String']>;
  title?: Maybe<Scalars['String']>;
  key: Scalars['String'];
  createdAt: Scalars['DateTime'];
  updatedAt: Scalars['DateTime'];
  issue: FeedbackIssue;
};

export type FeedbackCommentListingOptions = {
  offset?: Maybe<Scalars['Float']>;
  limit?: Maybe<Scalars['Float']>;
  issueId: Scalars['Float'];
};

export type FeedbackCommnent = {
  __typename?: 'FeedbackCommnent';
  id: Scalars['Int'];
  creatorId: Scalars['Int'];
  issueId: Scalars['Int'];
  content: Scalars['String'];
  type: Scalars['String'];
  createdAt: Scalars['DateTime'];
  updatedAt: Scalars['DateTime'];
  creator: User;
};

export type FeedbackIssue = {
  __typename?: 'FeedbackIssue';
  id: Scalars['Int'];
  creatorId: Scalars['String'];
  sourceId: Scalars['Int'];
  noteId: Scalars['String'];
  content?: Maybe<Scalars['String']>;
  thumbnail?: Maybe<Scalars['String']>;
  imageUrl?: Maybe<Scalars['String']>;
  markerId?: Maybe<Scalars['String']>;
  type?: Maybe<Scalars['String']>;
  order: Scalars['Float'];
  createdAt: Scalars['DateTime'];
  updatedAt: Scalars['DateTime'];
  creator?: Maybe<User>;
  note: FeedbackNote;
  source: FeedbackSource;
  comments?: Maybe<FeedbackCommnent>;
  snapshot?: Maybe<FeedbackSnapshot>;
  actionRecord?: Maybe<FeedbackActionRecord>;
};

export type FeedbackIssueDetailOptions = {
  id: Scalars['Float'];
  includeActionRecord?: Maybe<Scalars['Boolean']>;
  includeSnapshot?: Maybe<Scalars['Boolean']>;
};

export type FeedbackIssueInput = {
  /** Only use for creation */
  noteId?: Maybe<Scalars['String']>;
  /** Only use for creation */
  sourceId?: Maybe<Scalars['Int']>;
  type?: Maybe<Scalars['String']>;
  markerId?: Maybe<Scalars['String']>;
  content?: Maybe<Scalars['String']>;
  thumbnail?: Maybe<Scalars['String']>;
  imageUrl?: Maybe<Scalars['String']>;
  order?: Maybe<Scalars['Float']>;
  position?: Maybe<Scalars['String']>;
  snapshotOptions?: Maybe<UpdateFeedbackSnapshotOptions>;
};

export type FeedbackIssueListingOptions = {
  offset?: Maybe<Scalars['Float']>;
  limit?: Maybe<Scalars['Float']>;
  order?: Maybe<Scalars['String']>;
  orderBy?: Maybe<Scalars['String']>;
  noteId?: Maybe<Scalars['String']>;
  sourceId?: Maybe<Scalars['Float']>;
  includeActionRecord?: Maybe<Scalars['Boolean']>;
  includeSnapshot?: Maybe<Scalars['Boolean']>;
};

export type FeedbackNote = {
  __typename?: 'FeedbackNote';
  id: Scalars['String'];
  creatorId?: Maybe<Scalars['String']>;
  projectId?: Maybe<Scalars['Int']>;
  creator?: Maybe<User>;
  title?: Maybe<Scalars['String']>;
  thumbnail?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
  progress?: Maybe<NoteProgress>;
  publishedAt?: Maybe<Scalars['DateTime']>;
  createdAt: Scalars['DateTime'];
  updatedAt: Scalars['DateTime'];
  /** will be calcuated when querying */
  numberOfIssues?: Maybe<Scalars['Float']>;
  /** will be calcuated when querying */
  numberOfSources?: Maybe<Scalars['Float']>;
  /** will be calcuated when querying */
  lastSourceId?: Maybe<Scalars['Float']>;
};

export type FeedbackNoteDetailOptions = {
  id?: Maybe<Scalars['String']>;
  includeLastSource?: Maybe<Scalars['Boolean']>;
  includeNumberOfSources?: Maybe<Scalars['Boolean']>;
};

export type FeedbackNoteInput = {
  title?: Maybe<Scalars['String']>;
  thumbnail?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
  progress?: Maybe<NoteProgress>;
  publishedAt?: Maybe<Scalars['DateTime']>;
};

export type FeedbackNoteListingOptions = {
  offset?: Maybe<Scalars['Float']>;
  limit?: Maybe<Scalars['Float']>;
  order?: Maybe<Scalars['String']>;
  orderBy?: Maybe<Scalars['String']>;
  projectId?: Maybe<Scalars['Int']>;
  includeLastSource?: Maybe<Scalars['Boolean']>;
  includeNumberOfSources?: Maybe<Scalars['Boolean']>;
};

export type FeedbackSnapshot = {
  __typename?: 'FeedbackSnapshot';
  id: Scalars['Int'];
  issueId: Scalars['Int'];
  position?: Maybe<Scalars['String']>;
  createdAt: Scalars['DateTime'];
  updatedAt: Scalars['DateTime'];
};

export type FeedbackSource = {
  __typename?: 'FeedbackSource';
  id: Scalars['Int'];
  creatorId: Scalars['String'];
  noteId: Scalars['String'];
  /** Original source that it replies from */
  referenceSourceId?: Maybe<Scalars['Int']>;
  thumbnail?: Maybe<Scalars['String']>;
  imageUrl?: Maybe<Scalars['String']>;
  title?: Maybe<Scalars['String']>;
  url?: Maybe<Scalars['String']>;
  fileSize?: Maybe<Scalars['Int']>;
  label?: Maybe<Scalars['String']>;
  taskStatus?: Maybe<TaskStatus>;
  type?: Maybe<SourceType>;
  order: Scalars['Float'];
  createdAt: Scalars['DateTime'];
  updatedAt: Scalars['DateTime'];
  creator?: Maybe<User>;
  note?: Maybe<FeedbackNote>;
  issues?: Maybe<Array<FeedbackIssue>>;
};

export type FeedbackSourceInput = {
  /** either noteId or referenceSourceId should be given for creation */
  noteId?: Maybe<Scalars['String']>;
  /** either noteId or referenceSourceId should be given for creation */
  referenceSourceId?: Maybe<Scalars['Int']>;
  title?: Maybe<Scalars['String']>;
  thumbnail?: Maybe<Scalars['String']>;
  url?: Maybe<Scalars['String']>;
  imageUrl?: Maybe<Scalars['String']>;
  fileSize?: Maybe<Scalars['Int']>;
  label?: Maybe<Scalars['String']>;
  taskStatus?: Maybe<TaskStatus>;
  order?: Maybe<Scalars['Float']>;
};

export type FeedbackSourceListingOptions = {
  noteId?: Maybe<Scalars['String']>;
  referenceSourceId?: Maybe<Scalars['Int']>;
  /** for detail */
  id?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  limit?: Maybe<Scalars['Int']>;
  order?: Maybe<Scalars['String']>;
  orderBy?: Maybe<Scalars['String']>;
  includeIssues?: Maybe<Scalars['Boolean']>;
  includeCreator?: Maybe<Scalars['Boolean']>;
};

export type FeedbackWorkflow = {
  __typename?: 'FeedbackWorkflow';
  id: Scalars['Int'];
  creatorId: Scalars['String'];
  settings: Scalars['String'];
  createdAt: Scalars['DateTime'];
  creator: User;
};

export type File = {
  __typename?: 'File';
  id: Scalars['Float'];
  displayName: Scalars['String'];
  url?: Maybe<Scalars['String']>;
  originUrl?: Maybe<Scalars['String']>;
  fileKey?: Maybe<Scalars['String']>;
  thumbnail?: Maybe<Scalars['String']>;
  sizeByte?: Maybe<Scalars['Float']>;
  userId: Scalars['String'];
  createdAt: Scalars['DateTime'];
  updatedAt: Scalars['DateTime'];
};

export type FileInputDescription = {
  fileKey: Scalars['String'];
  url: Scalars['String'];
  displayName?: Maybe<Scalars['String']>;
  thumbnail?: Maybe<Scalars['String']>;
  sizeByte?: Maybe<Scalars['Float']>;
};

export type FileListingOptions = {
  offset?: Maybe<Scalars['Float']>;
  limit?: Maybe<Scalars['Float']>;
  ownerId: Scalars['String'];
};

export type GoogleSignInOptions = {
  email: Scalars['String'];
  uid: Scalars['String'];
  firstName?: Maybe<Scalars['String']>;
  lastName?: Maybe<Scalars['String']>;
  accessToken?: Maybe<Scalars['String']>;
  photo?: Maybe<Scalars['String']>;
  language?: Maybe<Scalars['String']>;
};

export type ListingOptions = {
  userId: Scalars['String'];
  offset: Scalars['Int'];
  limit: Scalars['Int'];
};

export type Mutation = {
  __typename?: 'Mutation';
  createAnnotation: Annotation;
  setAnnotations: Scalars['Boolean'];
  updateAnnotation: Annotation;
  deleteAnnotations: Count;
  createFeedbackComment: FeedbackCommnent;
  updateFeedbackComment: FeedbackCommnent;
  deleteFeedbackComments: Count;
  createFeedbackIssue: FeedbackIssue;
  updateFeedbackIssue: FeedbackIssue;
  deleteFeedbackIssues: Count;
  createFeedbackNote: FeedbackNote;
  updateFeedbackNote?: Maybe<FeedbackNote>;
  deleteFeedbackNotes: Count;
  createFeedbackSource: FeedbackSource;
  updateFeedbackSource: FeedbackSource;
  deleteFeedbackSources: Count;
  createFeedbackWorkflow: FeedbackWorkflow;
  deleteFeedbackWorkflows: Count;
  addFiles: File;
  setFileUploaded: File;
  updateFile: File;
  deleteFiles: Count;
  createNoteAccess: NoteAccess;
  updateNoteAccess?: Maybe<NoteAccess>;
  deleteNoteAccesss: Count;
  updateNoteActivity: NoteActivity;
  deleteNoteActivitys: Count;
  createProject: Project;
  deleteProjects: Count;
  pubSubMutation: Scalars['Boolean'];
  publisherMutation: Scalars['Boolean'];
  pubSubMutationToDynamicTopic: Scalars['Boolean'];
  createUser: User;
  updateUser: Count;
  deleteUsers: Count;
  signIn: User;
  logout: User;
  resetPassword: User;
  googleSignIn: User;
};


export type MutationCreateAnnotationArgs = {
  input: CreateAnnotationOptions;
};


export type MutationSetAnnotationsArgs = {
  input: SetAnnotationsOptions;
};


export type MutationUpdateAnnotationArgs = {
  options: UpdateAnnotationOptions;
};


export type MutationDeleteAnnotationsArgs = {
  ids: Array<Scalars['String']>;
};


export type MutationCreateFeedbackCommentArgs = {
  input: CreateFeedbackCommentOptions;
};


export type MutationUpdateFeedbackCommentArgs = {
  options: UpdateFeedbackCommentOptions;
};


export type MutationDeleteFeedbackCommentsArgs = {
  ids: Array<Scalars['String']>;
};


export type MutationCreateFeedbackIssueArgs = {
  input: FeedbackIssueInput;
};


export type MutationUpdateFeedbackIssueArgs = {
  input: FeedbackIssueInput;
  id: Scalars['Int'];
};


export type MutationDeleteFeedbackIssuesArgs = {
  ids: Array<Scalars['Int']>;
};


export type MutationCreateFeedbackNoteArgs = {
  options: CreateFeedbackNoteOptions;
  input: FeedbackNoteInput;
};


export type MutationUpdateFeedbackNoteArgs = {
  input: FeedbackNoteInput;
  id: Scalars['String'];
};


export type MutationDeleteFeedbackNotesArgs = {
  ids: Array<Scalars['String']>;
};


export type MutationCreateFeedbackSourceArgs = {
  input: FeedbackSourceInput;
};


export type MutationUpdateFeedbackSourceArgs = {
  input: FeedbackSourceInput;
  id: Scalars['Int'];
};


export type MutationDeleteFeedbackSourcesArgs = {
  ids: Array<Scalars['Int']>;
};


export type MutationCreateFeedbackWorkflowArgs = {
  input: CreateFeedbackWorkflowOptions;
};


export type MutationDeleteFeedbackWorkflowsArgs = {
  ids: Array<Scalars['Int']>;
};


export type MutationAddFilesArgs = {
  inputs: Array<FileInputDescription>;
};


export type MutationSetFileUploadedArgs = {
  url: Scalars['String'];
  fileKey: Scalars['String'];
};


export type MutationUpdateFileArgs = {
  options: UpdateFileOptions;
};


export type MutationDeleteFilesArgs = {
  ids: Array<Scalars['String']>;
};


export type MutationCreateNoteAccessArgs = {
  input: NoteAccessInput;
};


export type MutationUpdateNoteAccessArgs = {
  input: NoteAccessInput;
  id: Scalars['Int'];
};


export type MutationDeleteNoteAccesssArgs = {
  ids: Array<Scalars['Int']>;
};


export type MutationUpdateNoteActivityArgs = {
  input: NoteActivityInput;
  id: Scalars['Int'];
};


export type MutationDeleteNoteActivitysArgs = {
  ids: Array<Scalars['Int']>;
};


export type MutationCreateProjectArgs = {
  options: CreateProjectOptions;
};


export type MutationDeleteProjectsArgs = {
  ids: Array<Scalars['Int']>;
};


export type MutationPubSubMutationArgs = {
  message?: Maybe<Scalars['String']>;
};


export type MutationPublisherMutationArgs = {
  message?: Maybe<Scalars['String']>;
};


export type MutationPubSubMutationToDynamicTopicArgs = {
  message?: Maybe<Scalars['String']>;
  topic: Scalars['String'];
};


export type MutationCreateUserArgs = {
  input: UserInput;
};


export type MutationUpdateUserArgs = {
  options: UpdateUserOptions;
};


export type MutationDeleteUsersArgs = {
  ids: Array<Scalars['String']>;
};


export type MutationSignInArgs = {
  options: SingInUserOptions;
};


export type MutationResetPasswordArgs = {
  email: Scalars['String'];
};


export type MutationGoogleSignInArgs = {
  options: GoogleSignInOptions;
};

export type NoteAccess = {
  __typename?: 'NoteAccess';
  id: Scalars['Int'];
  noteId?: Maybe<Scalars['String']>;
  userId?: Maybe<Scalars['String']>;
  email?: Maybe<Scalars['String']>;
  passcode?: Maybe<Scalars['String']>;
  accessToken?: Maybe<Scalars['String']>;
  permission?: Maybe<NoteAccessPermission>;
  createdAt: Scalars['DateTime'];
  updatedAt: Scalars['DateTime'];
  note?: Maybe<FeedbackNote>;
  user?: Maybe<User>;
};

export type NoteAccessInput = {
  noteId?: Maybe<Scalars['String']>;
  permission?: Maybe<NoteAccessPermission>;
  updatedAt?: Maybe<Scalars['DateTime']>;
  email?: Maybe<Scalars['String']>;
  accessToken?: Maybe<Scalars['String']>;
  passcode?: Maybe<Scalars['String']>;
};

export type NoteAccessListingOptions = {
  id?: Maybe<Scalars['Float']>;
  noteId?: Maybe<Scalars['String']>;
  offset?: Maybe<Scalars['Float']>;
  limit?: Maybe<Scalars['Float']>;
  order?: Maybe<Scalars['String']>;
  orderBy?: Maybe<Scalars['String']>;
};

/** member type with permission */
export enum NoteAccessPermission {
  None = 'none',
  Creator = 'creator',
  Collaborator = 'collaborator',
  Assignee = 'assignee'
}

export type NoteAccessVerifyOptions = {
  noteId: Scalars['String'];
  email: Scalars['String'];
};

export type NoteActivity = {
  __typename?: 'NoteActivity';
  id: Scalars['Int'];
  userId: Scalars['String'];
  noteId: Scalars['String'];
  sourceId?: Maybe<Scalars['Float']>;
  issueId?: Maybe<Scalars['Float']>;
  thumbnail?: Maybe<Scalars['String']>;
  comment?: Maybe<Scalars['String']>;
  label?: Maybe<Scalars['String']>;
  action?: Maybe<ActionEnum>;
  activityTarget?: Maybe<ActivityTargetEnum>;
  createdAt: Scalars['DateTime'];
  updatedAt: Scalars['DateTime'];
  user?: Maybe<User>;
  note?: Maybe<FeedbackNote>;
};

export type NoteActivityInput = {
  thumbnail?: Maybe<Scalars['String']>;
};

export type NoteActivityListingOptions = {
  noteId: Scalars['String'];
  offset?: Maybe<Scalars['Int']>;
  limit?: Maybe<Scalars['Int']>;
  order?: Maybe<Scalars['String']>;
  orderBy?: Maybe<Scalars['String']>;
  includeUser?: Maybe<Scalars['Boolean']>;
};

/** Type of source file */
export enum NoteProgress {
  Draft = 'draft',
  Published = 'published',
  Working = 'working',
  Done = 'done',
  Archived = 'archived'
}

export type Notification = {
  __typename?: 'Notification';
  id: Scalars['ID'];
  message?: Maybe<Scalars['String']>;
  date: Scalars['DateTime'];
};

export type NotificationFeedbackIssue = {
  __typename?: 'NotificationFeedbackIssue';
  id: Scalars['String'];
  userId: Scalars['String'];
  item?: Maybe<FeedbackIssue>;
  date: Scalars['DateTime'];
};

export type NotificationFeedbackIssueListing = {
  __typename?: 'NotificationFeedbackIssueListing';
  ids: Array<Scalars['String']>;
  userId: Scalars['String'];
  date: Scalars['DateTime'];
  items?: Maybe<Array<FeedbackIssue>>;
  type: NotificationUpdateTypes;
};

export type NotificationFeedbackNote = {
  __typename?: 'NotificationFeedbackNote';
  id: Scalars['String'];
  userId: Scalars['String'];
  item?: Maybe<FeedbackNote>;
  date: Scalars['DateTime'];
};

export type NotificationFeedbackNoteListing = {
  __typename?: 'NotificationFeedbackNoteListing';
  ids: Array<Scalars['String']>;
  userId: Scalars['String'];
  date: Scalars['DateTime'];
  items?: Maybe<Array<FeedbackNote>>;
  type: NotificationUpdateTypes;
};

export type NotificationFeedbackSource = {
  __typename?: 'NotificationFeedbackSource';
  ids: Array<Scalars['String']>;
  userId: Scalars['String'];
  date: Scalars['DateTime'];
  type: NotificationUpdateTypes;
  items?: Maybe<Array<FeedbackSource>>;
};

export type NotificationNoteAccess = {
  __typename?: 'NotificationNoteAccess';
  ids: Array<Scalars['Int']>;
  userId: Scalars['String'];
  date: Scalars['DateTime'];
  type: NotificationUpdateTypes;
  items?: Maybe<Array<NoteAccess>>;
};

export enum NotificationUpdateTypes {
  Created = 'created',
  Deleted = 'deleted',
  Updated = 'updated'
}

export type Project = {
  __typename?: 'Project';
  id: Scalars['Int'];
  creatorId: Scalars['String'];
  title?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
  numberOfComments?: Maybe<Scalars['Int']>;
  createdAt: Scalars['DateTime'];
  updatedAt: Scalars['DateTime'];
};

export type Query = {
  __typename?: 'Query';
  annotationsList: Array<Annotation>;
  annotationDetail: Annotation;
  annotationsCount: Count;
  feedbackCommentsList: Array<FeedbackCommnent>;
  feedbackCommentDetail: FeedbackCommnent;
  feedbackCommentsCount: Count;
  feedbackIssuesList: Array<FeedbackIssue>;
  feedbackIssueDetail?: Maybe<FeedbackIssue>;
  feedbackIssuesCount: Count;
  feedbackNotesList: Array<FeedbackNote>;
  feedbackNoteDetail?: Maybe<FeedbackNote>;
  feedbackNotesCount: Count;
  feedbackNoteLastOne: FeedbackNote;
  feedbackSourcesList?: Maybe<Array<FeedbackSource>>;
  feedbackSourceDetail?: Maybe<FeedbackSource>;
  feedbackSourcesCount: Count;
  currentFeedbackWorkflow: FeedbackWorkflow;
  feedbackWorkflowsCount: Count;
  filesList: Array<File>;
  fileDetail: File;
  filesCount: Count;
  noteAccesssList: Array<NoteAccess>;
  verifyNoteAccess?: Maybe<NoteAccess>;
  noteAccessDetail?: Maybe<NoteAccess>;
  noteAccesssCount: Count;
  noteActivityList?: Maybe<Array<NoteActivity>>;
  projectsList: Array<Project>;
  projectsCount: Count;
  currentDate: Scalars['DateTime'];
  userList: Array<User>;
  userDetail?: Maybe<User>;
  userCount: Count;
  findUserByAllKeyword: Array<User>;
  findByAccountIdKeyword: Array<User>;
  findUserByFullnameKeyword: Array<User>;
  findByEmail: User;
};


export type QueryAnnotationsListArgs = {
  options: AnnotationListingOptions;
};


export type QueryAnnotationDetailArgs = {
  id: Scalars['Float'];
};


export type QueryAnnotationsCountArgs = {
  sourceId: Scalars['Float'];
};


export type QueryFeedbackCommentsListArgs = {
  options: FeedbackCommentListingOptions;
};


export type QueryFeedbackCommentDetailArgs = {
  id: Scalars['Float'];
};


export type QueryFeedbackCommentsCountArgs = {
  issueId: Scalars['Float'];
};


export type QueryFeedbackIssuesListArgs = {
  options: FeedbackIssueListingOptions;
};


export type QueryFeedbackIssueDetailArgs = {
  options: FeedbackIssueDetailOptions;
};


export type QueryFeedbackIssuesCountArgs = {
  sourceId: Scalars['Int'];
};


export type QueryFeedbackNotesListArgs = {
  options: FeedbackNoteListingOptions;
};


export type QueryFeedbackNoteDetailArgs = {
  options: FeedbackNoteDetailOptions;
};


export type QueryFeedbackNotesCountArgs = {
  projectId: Scalars['Int'];
};


export type QueryFeedbackSourcesListArgs = {
  options: FeedbackSourceListingOptions;
};


export type QueryFeedbackSourceDetailArgs = {
  options: FeedbackSourceListingOptions;
};


export type QueryFeedbackSourcesCountArgs = {
  noteId: Scalars['String'];
};


export type QueryFilesListArgs = {
  options: FileListingOptions;
};


export type QueryFileDetailArgs = {
  id: Scalars['Float'];
};


export type QueryFilesCountArgs = {
  sourceId: Scalars['Float'];
};


export type QueryNoteAccesssListArgs = {
  options: NoteAccessListingOptions;
};


export type QueryVerifyNoteAccessArgs = {
  options: NoteAccessVerifyOptions;
};


export type QueryNoteAccessDetailArgs = {
  options: NoteAccessListingOptions;
};


export type QueryNoteAccesssCountArgs = {
  noteId: Scalars['String'];
};


export type QueryNoteActivityListArgs = {
  options: NoteActivityListingOptions;
};


export type QueryProjectsListArgs = {
  options: ListingOptions;
};


export type QueryUserListArgs = {
  options: UserListingOptions;
};


export type QueryUserDetailArgs = {
  options: UserDetailOptions;
};


export type QueryFindUserByAllKeywordArgs = {
  options: SearchOptions;
};


export type QueryFindByAccountIdKeywordArgs = {
  accountId: Scalars['String'];
};


export type QueryFindUserByFullnameKeywordArgs = {
  keyword: Scalars['String'];
};


export type QueryFindByEmailArgs = {
  email: Scalars['String'];
};

export type SearchOptions = {
  keyword: Scalars['String'];
  offset?: Maybe<Scalars['Int']>;
  limit?: Maybe<Scalars['Int']>;
};

export type SetAnnotationsOptions = {
  sourceId: Scalars['String'];
  updatedAt: Scalars['Float'];
  annotations: Array<AnnotationsInput>;
};

export type SingInUserOptions = {
  accountId?: Maybe<Scalars['String']>;
  password?: Maybe<Scalars['String']>;
  oAuthToken?: Maybe<Scalars['String']>;
  invitedToken?: Maybe<Scalars['String']>;
};

/** Type of source file */
export enum SourceType {
  Video = 'video',
  File = 'file',
  Image = 'image',
  Board = 'board'
}

export enum SubItemUpdateType {
  Upsert = 'upsert',
  Delete = 'delete'
}

export type Subscription = {
  __typename?: 'Subscription';
  annotationChanged: Notification;
  feedbackCommentChanged: Notification;
  feedbackIssueChanged: NotificationFeedbackIssue;
  feedbackIssueListingChanged: NotificationFeedbackIssueListing;
  feedbackNoteChanged: NotificationFeedbackNote;
  feedbackNoteListingChanged: NotificationFeedbackNoteListing;
  feedbackSourceChanged: NotificationFeedbackSource;
  fileChanged: Notification;
  noteAccessChanged: NotificationNoteAccess;
  projectChanged: Notification;
  normalSubscription: Notification;
  subscriptionWithFilter: Notification;
  subscriptionWithFilterToDynamicTopic: Notification;
};


export type SubscriptionAnnotationChangedArgs = {
  title: Scalars['String'];
};


export type SubscriptionFeedbackCommentChangedArgs = {
  title: Scalars['String'];
};


export type SubscriptionFeedbackIssueChangedArgs = {
  token: Scalars['String'];
};


export type SubscriptionFeedbackIssueListingChangedArgs = {
  token: Scalars['String'];
};


export type SubscriptionFeedbackNoteChangedArgs = {
  token: Scalars['String'];
};


export type SubscriptionFeedbackNoteListingChangedArgs = {
  token: Scalars['String'];
};


export type SubscriptionFeedbackSourceChangedArgs = {
  token: Scalars['String'];
};


export type SubscriptionFileChangedArgs = {
  title: Scalars['String'];
};


export type SubscriptionNoteAccessChangedArgs = {
  token: Scalars['String'];
};


export type SubscriptionProjectChangedArgs = {
  title: Scalars['String'];
};


export type SubscriptionSubscriptionWithFilterToDynamicTopicArgs = {
  topic: Scalars['String'];
};

/** task status */
export enum TaskStatus {
  RequestTask = 'requestTask',
  Todo = 'todo',
  InProgress = 'inProgress',
  RequestApproval = 'requestApproval',
  ApprovedCompletion = 'approvedCompletion',
  DeclineTask = 'declineTask',
  ApprovedDeclination = 'approvedDeclination'
}

export enum UnitStripVersion {
  NotSpecified = 'NotSpecified',
  V1_0 = 'V1_0'
}

export type UpdateAnnotationOptions = {
  id: Scalars['Float'];
  data: Scalars['String'];
};

export type UpdateFeedbackCommentOptions = {
  id: Scalars['Float'];
  title?: Maybe<Scalars['String']>;
  thumbnail?: Maybe<Scalars['String']>;
};

export type UpdateFeedbackSnapshotOptions = {
  position?: Maybe<Scalars['String']>;
  type: SubItemUpdateType;
};

export type UpdateFileOptions = {
  fileKey: Scalars['String'];
  displayName?: Maybe<Scalars['String']>;
};

export type UpdateUserOptions = {
  id: Scalars['String'];
  email?: Maybe<Scalars['String']>;
  password?: Maybe<Scalars['String']>;
  firstName?: Maybe<Scalars['String']>;
  lastName?: Maybe<Scalars['String']>;
  photo?: Maybe<Scalars['String']>;
  onboarding?: Maybe<Scalars['String']>;
};

export type User = {
  __typename?: 'User';
  id: Scalars['String'];
  /** User account unique */
  accountId: Scalars['String'];
  email?: Maybe<Scalars['String']>;
  photo?: Maybe<Scalars['String']>;
  firstName?: Maybe<Scalars['String']>;
  lastName?: Maybe<Scalars['String']>;
  oauthToken?: Maybe<Scalars['String']>;
  /** Provide like google or facebook */
  oauthProvider?: Maybe<Scalars['String']>;
  /** Token for authentication */
  token?: Maybe<Scalars['String']>;
  language?: Maybe<Scalars['String']>;
  onboarding?: Maybe<Scalars['String']>;
  userStatus?: Maybe<Scalars['String']>;
  createdAt: Scalars['DateTime'];
  updatedAt: Scalars['DateTime'];
};

export type UserDetailOptions = {
  id?: Maybe<Scalars['String']>;
};

export type UserInput = {
  email: Scalars['String'];
  password: Scalars['String'];
  firstName?: Maybe<Scalars['String']>;
  lastName?: Maybe<Scalars['String']>;
  photo?: Maybe<Scalars['String']>;
  language?: Maybe<Scalars['String']>;
  token?: Maybe<Scalars['String']>;
  oauthToken?: Maybe<Scalars['String']>;
  oauthProvider?: Maybe<Scalars['String']>;
  onboarding?: Maybe<Scalars['String']>;
  userStatus?: Maybe<UserStatus>;
};

export type UserListingOptions = {
  adminId: Scalars['String'];
  offset?: Maybe<Scalars['Int']>;
  limit?: Maybe<Scalars['Int']>;
  order?: Maybe<Scalars['String']>;
  orderBy?: Maybe<Scalars['String']>;
};

export enum UserStatus {
  Visitor = 'visitor',
  Alive = 'alive',
  Inactive = 'inactive',
  Paused = 'paused',
  Blocked = 'blocked',
  Deleted = 'deleted'
}



export type ResolverTypeWrapper<T> = Promise<T> | T;


export type LegacyStitchingResolver<TResult, TParent, TContext, TArgs> = {
  fragment: string;
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};

export type NewStitchingResolver<TResult, TParent, TContext, TArgs> = {
  selectionSet: string;
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type StitchingResolver<TResult, TParent, TContext, TArgs> = LegacyStitchingResolver<TResult, TParent, TContext, TArgs> | NewStitchingResolver<TResult, TParent, TContext, TArgs>;
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> =
  | ResolverFn<TResult, TParent, TContext, TArgs>
  | StitchingResolver<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterator<TResult> | Promise<AsyncIterator<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = {}, TContext = {}, TArgs = {}> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}> = (obj: T, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = {
  ActionEnum: ActionEnum;
  ActivityTargetEnum: ActivityTargetEnum;
  Annotation: ResolverTypeWrapper<Annotation>;
  String: ResolverTypeWrapper<Scalars['String']>;
  Float: ResolverTypeWrapper<Scalars['Float']>;
  AnnotationListingOptions: AnnotationListingOptions;
  AnnotationsInput: AnnotationsInput;
  Count: ResolverTypeWrapper<Count>;
  Int: ResolverTypeWrapper<Scalars['Int']>;
  CreateAnnotationOptions: CreateAnnotationOptions;
  CreateFeedbackCommentOptions: CreateFeedbackCommentOptions;
  CreateFeedbackNoteOptions: CreateFeedbackNoteOptions;
  CreateFeedbackWorkflowOptions: CreateFeedbackWorkflowOptions;
  CreateProjectOptions: CreateProjectOptions;
  DateTime: ResolverTypeWrapper<Scalars['DateTime']>;
  FeedbackActionRecord: ResolverTypeWrapper<FeedbackActionRecord>;
  FeedbackCommentListingOptions: FeedbackCommentListingOptions;
  FeedbackCommnent: ResolverTypeWrapper<FeedbackCommnent>;
  FeedbackIssue: ResolverTypeWrapper<FeedbackIssue>;
  FeedbackIssueDetailOptions: FeedbackIssueDetailOptions;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']>;
  FeedbackIssueInput: FeedbackIssueInput;
  FeedbackIssueListingOptions: FeedbackIssueListingOptions;
  FeedbackNote: ResolverTypeWrapper<FeedbackNote>;
  FeedbackNoteDetailOptions: FeedbackNoteDetailOptions;
  FeedbackNoteInput: FeedbackNoteInput;
  FeedbackNoteListingOptions: FeedbackNoteListingOptions;
  FeedbackSnapshot: ResolverTypeWrapper<FeedbackSnapshot>;
  FeedbackSource: ResolverTypeWrapper<FeedbackSource>;
  FeedbackSourceInput: FeedbackSourceInput;
  FeedbackSourceListingOptions: FeedbackSourceListingOptions;
  FeedbackWorkflow: ResolverTypeWrapper<FeedbackWorkflow>;
  File: ResolverTypeWrapper<File>;
  FileInputDescription: FileInputDescription;
  FileListingOptions: FileListingOptions;
  GoogleSignInOptions: GoogleSignInOptions;
  ListingOptions: ListingOptions;
  Mutation: ResolverTypeWrapper<{}>;
  NoteAccess: ResolverTypeWrapper<NoteAccess>;
  NoteAccessInput: NoteAccessInput;
  NoteAccessListingOptions: NoteAccessListingOptions;
  NoteAccessPermission: NoteAccessPermission;
  NoteAccessVerifyOptions: NoteAccessVerifyOptions;
  NoteActivity: ResolverTypeWrapper<NoteActivity>;
  NoteActivityInput: NoteActivityInput;
  NoteActivityListingOptions: NoteActivityListingOptions;
  NoteProgress: NoteProgress;
  Notification: ResolverTypeWrapper<Notification>;
  ID: ResolverTypeWrapper<Scalars['ID']>;
  NotificationFeedbackIssue: ResolverTypeWrapper<NotificationFeedbackIssue>;
  NotificationFeedbackIssueListing: ResolverTypeWrapper<NotificationFeedbackIssueListing>;
  NotificationFeedbackNote: ResolverTypeWrapper<NotificationFeedbackNote>;
  NotificationFeedbackNoteListing: ResolverTypeWrapper<NotificationFeedbackNoteListing>;
  NotificationFeedbackSource: ResolverTypeWrapper<NotificationFeedbackSource>;
  NotificationNoteAccess: ResolverTypeWrapper<NotificationNoteAccess>;
  NotificationUpdateTypes: NotificationUpdateTypes;
  Project: ResolverTypeWrapper<Project>;
  Query: ResolverTypeWrapper<{}>;
  SearchOptions: SearchOptions;
  SetAnnotationsOptions: SetAnnotationsOptions;
  SingInUserOptions: SingInUserOptions;
  SourceType: SourceType;
  SubItemUpdateType: SubItemUpdateType;
  Subscription: ResolverTypeWrapper<{}>;
  TaskStatus: TaskStatus;
  UnitStripVersion: UnitStripVersion;
  UpdateAnnotationOptions: UpdateAnnotationOptions;
  UpdateFeedbackCommentOptions: UpdateFeedbackCommentOptions;
  UpdateFeedbackSnapshotOptions: UpdateFeedbackSnapshotOptions;
  UpdateFileOptions: UpdateFileOptions;
  UpdateUserOptions: UpdateUserOptions;
  User: ResolverTypeWrapper<User>;
  UserDetailOptions: UserDetailOptions;
  UserInput: UserInput;
  UserListingOptions: UserListingOptions;
  UserStatus: UserStatus;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  Annotation: Annotation;
  String: Scalars['String'];
  Float: Scalars['Float'];
  AnnotationListingOptions: AnnotationListingOptions;
  AnnotationsInput: AnnotationsInput;
  Count: Count;
  Int: Scalars['Int'];
  CreateAnnotationOptions: CreateAnnotationOptions;
  CreateFeedbackCommentOptions: CreateFeedbackCommentOptions;
  CreateFeedbackNoteOptions: CreateFeedbackNoteOptions;
  CreateFeedbackWorkflowOptions: CreateFeedbackWorkflowOptions;
  CreateProjectOptions: CreateProjectOptions;
  DateTime: Scalars['DateTime'];
  FeedbackActionRecord: FeedbackActionRecord;
  FeedbackCommentListingOptions: FeedbackCommentListingOptions;
  FeedbackCommnent: FeedbackCommnent;
  FeedbackIssue: FeedbackIssue;
  FeedbackIssueDetailOptions: FeedbackIssueDetailOptions;
  Boolean: Scalars['Boolean'];
  FeedbackIssueInput: FeedbackIssueInput;
  FeedbackIssueListingOptions: FeedbackIssueListingOptions;
  FeedbackNote: FeedbackNote;
  FeedbackNoteDetailOptions: FeedbackNoteDetailOptions;
  FeedbackNoteInput: FeedbackNoteInput;
  FeedbackNoteListingOptions: FeedbackNoteListingOptions;
  FeedbackSnapshot: FeedbackSnapshot;
  FeedbackSource: FeedbackSource;
  FeedbackSourceInput: FeedbackSourceInput;
  FeedbackSourceListingOptions: FeedbackSourceListingOptions;
  FeedbackWorkflow: FeedbackWorkflow;
  File: File;
  FileInputDescription: FileInputDescription;
  FileListingOptions: FileListingOptions;
  GoogleSignInOptions: GoogleSignInOptions;
  ListingOptions: ListingOptions;
  Mutation: {};
  NoteAccess: NoteAccess;
  NoteAccessInput: NoteAccessInput;
  NoteAccessListingOptions: NoteAccessListingOptions;
  NoteAccessVerifyOptions: NoteAccessVerifyOptions;
  NoteActivity: NoteActivity;
  NoteActivityInput: NoteActivityInput;
  NoteActivityListingOptions: NoteActivityListingOptions;
  Notification: Notification;
  ID: Scalars['ID'];
  NotificationFeedbackIssue: NotificationFeedbackIssue;
  NotificationFeedbackIssueListing: NotificationFeedbackIssueListing;
  NotificationFeedbackNote: NotificationFeedbackNote;
  NotificationFeedbackNoteListing: NotificationFeedbackNoteListing;
  NotificationFeedbackSource: NotificationFeedbackSource;
  NotificationNoteAccess: NotificationNoteAccess;
  Project: Project;
  Query: {};
  SearchOptions: SearchOptions;
  SetAnnotationsOptions: SetAnnotationsOptions;
  SingInUserOptions: SingInUserOptions;
  Subscription: {};
  UpdateAnnotationOptions: UpdateAnnotationOptions;
  UpdateFeedbackCommentOptions: UpdateFeedbackCommentOptions;
  UpdateFeedbackSnapshotOptions: UpdateFeedbackSnapshotOptions;
  UpdateFileOptions: UpdateFileOptions;
  UpdateUserOptions: UpdateUserOptions;
  User: User;
  UserDetailOptions: UserDetailOptions;
  UserInput: UserInput;
  UserListingOptions: UserListingOptions;
};

export type AnnotationResolvers<ContextType = any, ParentType extends ResolversParentTypes['Annotation'] = ResolversParentTypes['Annotation']> = {
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  data?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  sourceId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  version?: Resolver<ResolversTypes['UnitStripVersion'], ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType>;
};

export type CountResolvers<ContextType = any, ParentType extends ResolversParentTypes['Count'] = ResolversParentTypes['Count']> = {
  count?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType>;
};

export interface DateTimeScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['DateTime'], any> {
  name: 'DateTime';
}

export type FeedbackActionRecordResolvers<ContextType = any, ParentType extends ResolversParentTypes['FeedbackActionRecord'] = ResolversParentTypes['FeedbackActionRecord']> = {
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  issueId?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  content?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  title?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  key?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  issue?: Resolver<ResolversTypes['FeedbackIssue'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType>;
};

export type FeedbackCommnentResolvers<ContextType = any, ParentType extends ResolversParentTypes['FeedbackCommnent'] = ResolversParentTypes['FeedbackCommnent']> = {
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  creatorId?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  issueId?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  content?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  type?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  creator?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType>;
};

export type FeedbackIssueResolvers<ContextType = any, ParentType extends ResolversParentTypes['FeedbackIssue'] = ResolversParentTypes['FeedbackIssue']> = {
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  creatorId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  sourceId?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  noteId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  content?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  thumbnail?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  imageUrl?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  markerId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  type?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  order?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  creator?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  note?: Resolver<ResolversTypes['FeedbackNote'], ParentType, ContextType>;
  source?: Resolver<ResolversTypes['FeedbackSource'], ParentType, ContextType>;
  comments?: Resolver<Maybe<ResolversTypes['FeedbackCommnent']>, ParentType, ContextType>;
  snapshot?: Resolver<Maybe<ResolversTypes['FeedbackSnapshot']>, ParentType, ContextType>;
  actionRecord?: Resolver<Maybe<ResolversTypes['FeedbackActionRecord']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType>;
};

export type FeedbackNoteResolvers<ContextType = any, ParentType extends ResolversParentTypes['FeedbackNote'] = ResolversParentTypes['FeedbackNote']> = {
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  creatorId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  projectId?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  creator?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  title?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  thumbnail?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  description?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  progress?: Resolver<Maybe<ResolversTypes['NoteProgress']>, ParentType, ContextType>;
  publishedAt?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  numberOfIssues?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  numberOfSources?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  lastSourceId?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType>;
};

export type FeedbackSnapshotResolvers<ContextType = any, ParentType extends ResolversParentTypes['FeedbackSnapshot'] = ResolversParentTypes['FeedbackSnapshot']> = {
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  issueId?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  position?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType>;
};

export type FeedbackSourceResolvers<ContextType = any, ParentType extends ResolversParentTypes['FeedbackSource'] = ResolversParentTypes['FeedbackSource']> = {
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  creatorId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  noteId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  referenceSourceId?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  thumbnail?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  imageUrl?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  title?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  url?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  fileSize?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  label?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  taskStatus?: Resolver<Maybe<ResolversTypes['TaskStatus']>, ParentType, ContextType>;
  type?: Resolver<Maybe<ResolversTypes['SourceType']>, ParentType, ContextType>;
  order?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  creator?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  note?: Resolver<Maybe<ResolversTypes['FeedbackNote']>, ParentType, ContextType>;
  issues?: Resolver<Maybe<Array<ResolversTypes['FeedbackIssue']>>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType>;
};

export type FeedbackWorkflowResolvers<ContextType = any, ParentType extends ResolversParentTypes['FeedbackWorkflow'] = ResolversParentTypes['FeedbackWorkflow']> = {
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  creatorId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  settings?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  creator?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType>;
};

export type FileResolvers<ContextType = any, ParentType extends ResolversParentTypes['File'] = ResolversParentTypes['File']> = {
  id?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  displayName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  url?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  originUrl?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  fileKey?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  thumbnail?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  sizeByte?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  userId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType>;
};

export type MutationResolvers<ContextType = any, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = {
  createAnnotation?: Resolver<ResolversTypes['Annotation'], ParentType, ContextType, RequireFields<MutationCreateAnnotationArgs, 'input'>>;
  setAnnotations?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationSetAnnotationsArgs, 'input'>>;
  updateAnnotation?: Resolver<ResolversTypes['Annotation'], ParentType, ContextType, RequireFields<MutationUpdateAnnotationArgs, 'options'>>;
  deleteAnnotations?: Resolver<ResolversTypes['Count'], ParentType, ContextType, RequireFields<MutationDeleteAnnotationsArgs, 'ids'>>;
  createFeedbackComment?: Resolver<ResolversTypes['FeedbackCommnent'], ParentType, ContextType, RequireFields<MutationCreateFeedbackCommentArgs, 'input'>>;
  updateFeedbackComment?: Resolver<ResolversTypes['FeedbackCommnent'], ParentType, ContextType, RequireFields<MutationUpdateFeedbackCommentArgs, 'options'>>;
  deleteFeedbackComments?: Resolver<ResolversTypes['Count'], ParentType, ContextType, RequireFields<MutationDeleteFeedbackCommentsArgs, 'ids'>>;
  createFeedbackIssue?: Resolver<ResolversTypes['FeedbackIssue'], ParentType, ContextType, RequireFields<MutationCreateFeedbackIssueArgs, 'input'>>;
  updateFeedbackIssue?: Resolver<ResolversTypes['FeedbackIssue'], ParentType, ContextType, RequireFields<MutationUpdateFeedbackIssueArgs, 'input' | 'id'>>;
  deleteFeedbackIssues?: Resolver<ResolversTypes['Count'], ParentType, ContextType, RequireFields<MutationDeleteFeedbackIssuesArgs, 'ids'>>;
  createFeedbackNote?: Resolver<ResolversTypes['FeedbackNote'], ParentType, ContextType, RequireFields<MutationCreateFeedbackNoteArgs, 'options' | 'input'>>;
  updateFeedbackNote?: Resolver<Maybe<ResolversTypes['FeedbackNote']>, ParentType, ContextType, RequireFields<MutationUpdateFeedbackNoteArgs, 'input' | 'id'>>;
  deleteFeedbackNotes?: Resolver<ResolversTypes['Count'], ParentType, ContextType, RequireFields<MutationDeleteFeedbackNotesArgs, 'ids'>>;
  createFeedbackSource?: Resolver<ResolversTypes['FeedbackSource'], ParentType, ContextType, RequireFields<MutationCreateFeedbackSourceArgs, 'input'>>;
  updateFeedbackSource?: Resolver<ResolversTypes['FeedbackSource'], ParentType, ContextType, RequireFields<MutationUpdateFeedbackSourceArgs, 'input' | 'id'>>;
  deleteFeedbackSources?: Resolver<ResolversTypes['Count'], ParentType, ContextType, RequireFields<MutationDeleteFeedbackSourcesArgs, 'ids'>>;
  createFeedbackWorkflow?: Resolver<ResolversTypes['FeedbackWorkflow'], ParentType, ContextType, RequireFields<MutationCreateFeedbackWorkflowArgs, 'input'>>;
  deleteFeedbackWorkflows?: Resolver<ResolversTypes['Count'], ParentType, ContextType, RequireFields<MutationDeleteFeedbackWorkflowsArgs, 'ids'>>;
  addFiles?: Resolver<ResolversTypes['File'], ParentType, ContextType, RequireFields<MutationAddFilesArgs, 'inputs'>>;
  setFileUploaded?: Resolver<ResolversTypes['File'], ParentType, ContextType, RequireFields<MutationSetFileUploadedArgs, 'url' | 'fileKey'>>;
  updateFile?: Resolver<ResolversTypes['File'], ParentType, ContextType, RequireFields<MutationUpdateFileArgs, 'options'>>;
  deleteFiles?: Resolver<ResolversTypes['Count'], ParentType, ContextType, RequireFields<MutationDeleteFilesArgs, 'ids'>>;
  createNoteAccess?: Resolver<ResolversTypes['NoteAccess'], ParentType, ContextType, RequireFields<MutationCreateNoteAccessArgs, 'input'>>;
  updateNoteAccess?: Resolver<Maybe<ResolversTypes['NoteAccess']>, ParentType, ContextType, RequireFields<MutationUpdateNoteAccessArgs, 'input' | 'id'>>;
  deleteNoteAccesss?: Resolver<ResolversTypes['Count'], ParentType, ContextType, RequireFields<MutationDeleteNoteAccesssArgs, 'ids'>>;
  updateNoteActivity?: Resolver<ResolversTypes['NoteActivity'], ParentType, ContextType, RequireFields<MutationUpdateNoteActivityArgs, 'input' | 'id'>>;
  deleteNoteActivitys?: Resolver<ResolversTypes['Count'], ParentType, ContextType, RequireFields<MutationDeleteNoteActivitysArgs, 'ids'>>;
  createProject?: Resolver<ResolversTypes['Project'], ParentType, ContextType, RequireFields<MutationCreateProjectArgs, 'options'>>;
  deleteProjects?: Resolver<ResolversTypes['Count'], ParentType, ContextType, RequireFields<MutationDeleteProjectsArgs, 'ids'>>;
  pubSubMutation?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationPubSubMutationArgs, never>>;
  publisherMutation?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationPublisherMutationArgs, never>>;
  pubSubMutationToDynamicTopic?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationPubSubMutationToDynamicTopicArgs, 'topic'>>;
  createUser?: Resolver<ResolversTypes['User'], ParentType, ContextType, RequireFields<MutationCreateUserArgs, 'input'>>;
  updateUser?: Resolver<ResolversTypes['Count'], ParentType, ContextType, RequireFields<MutationUpdateUserArgs, 'options'>>;
  deleteUsers?: Resolver<ResolversTypes['Count'], ParentType, ContextType, RequireFields<MutationDeleteUsersArgs, 'ids'>>;
  signIn?: Resolver<ResolversTypes['User'], ParentType, ContextType, RequireFields<MutationSignInArgs, 'options'>>;
  logout?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  resetPassword?: Resolver<ResolversTypes['User'], ParentType, ContextType, RequireFields<MutationResetPasswordArgs, 'email'>>;
  googleSignIn?: Resolver<ResolversTypes['User'], ParentType, ContextType, RequireFields<MutationGoogleSignInArgs, 'options'>>;
};

export type NoteAccessResolvers<ContextType = any, ParentType extends ResolversParentTypes['NoteAccess'] = ResolversParentTypes['NoteAccess']> = {
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  noteId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  userId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  email?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  passcode?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  accessToken?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  permission?: Resolver<Maybe<ResolversTypes['NoteAccessPermission']>, ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  note?: Resolver<Maybe<ResolversTypes['FeedbackNote']>, ParentType, ContextType>;
  user?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType>;
};

export type NoteActivityResolvers<ContextType = any, ParentType extends ResolversParentTypes['NoteActivity'] = ResolversParentTypes['NoteActivity']> = {
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  userId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  noteId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  sourceId?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  issueId?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  thumbnail?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  comment?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  label?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  action?: Resolver<Maybe<ResolversTypes['ActionEnum']>, ParentType, ContextType>;
  activityTarget?: Resolver<Maybe<ResolversTypes['ActivityTargetEnum']>, ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  user?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  note?: Resolver<Maybe<ResolversTypes['FeedbackNote']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType>;
};

export type NotificationResolvers<ContextType = any, ParentType extends ResolversParentTypes['Notification'] = ResolversParentTypes['Notification']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  message?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  date?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType>;
};

export type NotificationFeedbackIssueResolvers<ContextType = any, ParentType extends ResolversParentTypes['NotificationFeedbackIssue'] = ResolversParentTypes['NotificationFeedbackIssue']> = {
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  userId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  item?: Resolver<Maybe<ResolversTypes['FeedbackIssue']>, ParentType, ContextType>;
  date?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType>;
};

export type NotificationFeedbackIssueListingResolvers<ContextType = any, ParentType extends ResolversParentTypes['NotificationFeedbackIssueListing'] = ResolversParentTypes['NotificationFeedbackIssueListing']> = {
  ids?: Resolver<Array<ResolversTypes['String']>, ParentType, ContextType>;
  userId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  date?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  items?: Resolver<Maybe<Array<ResolversTypes['FeedbackIssue']>>, ParentType, ContextType>;
  type?: Resolver<ResolversTypes['NotificationUpdateTypes'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType>;
};

export type NotificationFeedbackNoteResolvers<ContextType = any, ParentType extends ResolversParentTypes['NotificationFeedbackNote'] = ResolversParentTypes['NotificationFeedbackNote']> = {
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  userId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  item?: Resolver<Maybe<ResolversTypes['FeedbackNote']>, ParentType, ContextType>;
  date?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType>;
};

export type NotificationFeedbackNoteListingResolvers<ContextType = any, ParentType extends ResolversParentTypes['NotificationFeedbackNoteListing'] = ResolversParentTypes['NotificationFeedbackNoteListing']> = {
  ids?: Resolver<Array<ResolversTypes['String']>, ParentType, ContextType>;
  userId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  date?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  items?: Resolver<Maybe<Array<ResolversTypes['FeedbackNote']>>, ParentType, ContextType>;
  type?: Resolver<ResolversTypes['NotificationUpdateTypes'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType>;
};

export type NotificationFeedbackSourceResolvers<ContextType = any, ParentType extends ResolversParentTypes['NotificationFeedbackSource'] = ResolversParentTypes['NotificationFeedbackSource']> = {
  ids?: Resolver<Array<ResolversTypes['String']>, ParentType, ContextType>;
  userId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  date?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  type?: Resolver<ResolversTypes['NotificationUpdateTypes'], ParentType, ContextType>;
  items?: Resolver<Maybe<Array<ResolversTypes['FeedbackSource']>>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType>;
};

export type NotificationNoteAccessResolvers<ContextType = any, ParentType extends ResolversParentTypes['NotificationNoteAccess'] = ResolversParentTypes['NotificationNoteAccess']> = {
  ids?: Resolver<Array<ResolversTypes['Int']>, ParentType, ContextType>;
  userId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  date?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  type?: Resolver<ResolversTypes['NotificationUpdateTypes'], ParentType, ContextType>;
  items?: Resolver<Maybe<Array<ResolversTypes['NoteAccess']>>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType>;
};

export type ProjectResolvers<ContextType = any, ParentType extends ResolversParentTypes['Project'] = ResolversParentTypes['Project']> = {
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  creatorId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  title?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  description?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  numberOfComments?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType>;
};

export type QueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = {
  annotationsList?: Resolver<Array<ResolversTypes['Annotation']>, ParentType, ContextType, RequireFields<QueryAnnotationsListArgs, 'options'>>;
  annotationDetail?: Resolver<ResolversTypes['Annotation'], ParentType, ContextType, RequireFields<QueryAnnotationDetailArgs, 'id'>>;
  annotationsCount?: Resolver<ResolversTypes['Count'], ParentType, ContextType, RequireFields<QueryAnnotationsCountArgs, 'sourceId'>>;
  feedbackCommentsList?: Resolver<Array<ResolversTypes['FeedbackCommnent']>, ParentType, ContextType, RequireFields<QueryFeedbackCommentsListArgs, 'options'>>;
  feedbackCommentDetail?: Resolver<ResolversTypes['FeedbackCommnent'], ParentType, ContextType, RequireFields<QueryFeedbackCommentDetailArgs, 'id'>>;
  feedbackCommentsCount?: Resolver<ResolversTypes['Count'], ParentType, ContextType, RequireFields<QueryFeedbackCommentsCountArgs, 'issueId'>>;
  feedbackIssuesList?: Resolver<Array<ResolversTypes['FeedbackIssue']>, ParentType, ContextType, RequireFields<QueryFeedbackIssuesListArgs, 'options'>>;
  feedbackIssueDetail?: Resolver<Maybe<ResolversTypes['FeedbackIssue']>, ParentType, ContextType, RequireFields<QueryFeedbackIssueDetailArgs, 'options'>>;
  feedbackIssuesCount?: Resolver<ResolversTypes['Count'], ParentType, ContextType, RequireFields<QueryFeedbackIssuesCountArgs, 'sourceId'>>;
  feedbackNotesList?: Resolver<Array<ResolversTypes['FeedbackNote']>, ParentType, ContextType, RequireFields<QueryFeedbackNotesListArgs, 'options'>>;
  feedbackNoteDetail?: Resolver<Maybe<ResolversTypes['FeedbackNote']>, ParentType, ContextType, RequireFields<QueryFeedbackNoteDetailArgs, 'options'>>;
  feedbackNotesCount?: Resolver<ResolversTypes['Count'], ParentType, ContextType, RequireFields<QueryFeedbackNotesCountArgs, 'projectId'>>;
  feedbackNoteLastOne?: Resolver<ResolversTypes['FeedbackNote'], ParentType, ContextType>;
  feedbackSourcesList?: Resolver<Maybe<Array<ResolversTypes['FeedbackSource']>>, ParentType, ContextType, RequireFields<QueryFeedbackSourcesListArgs, 'options'>>;
  feedbackSourceDetail?: Resolver<Maybe<ResolversTypes['FeedbackSource']>, ParentType, ContextType, RequireFields<QueryFeedbackSourceDetailArgs, 'options'>>;
  feedbackSourcesCount?: Resolver<ResolversTypes['Count'], ParentType, ContextType, RequireFields<QueryFeedbackSourcesCountArgs, 'noteId'>>;
  currentFeedbackWorkflow?: Resolver<ResolversTypes['FeedbackWorkflow'], ParentType, ContextType>;
  feedbackWorkflowsCount?: Resolver<ResolversTypes['Count'], ParentType, ContextType>;
  filesList?: Resolver<Array<ResolversTypes['File']>, ParentType, ContextType, RequireFields<QueryFilesListArgs, 'options'>>;
  fileDetail?: Resolver<ResolversTypes['File'], ParentType, ContextType, RequireFields<QueryFileDetailArgs, 'id'>>;
  filesCount?: Resolver<ResolversTypes['Count'], ParentType, ContextType, RequireFields<QueryFilesCountArgs, 'sourceId'>>;
  noteAccesssList?: Resolver<Array<ResolversTypes['NoteAccess']>, ParentType, ContextType, RequireFields<QueryNoteAccesssListArgs, 'options'>>;
  verifyNoteAccess?: Resolver<Maybe<ResolversTypes['NoteAccess']>, ParentType, ContextType, RequireFields<QueryVerifyNoteAccessArgs, 'options'>>;
  noteAccessDetail?: Resolver<Maybe<ResolversTypes['NoteAccess']>, ParentType, ContextType, RequireFields<QueryNoteAccessDetailArgs, 'options'>>;
  noteAccesssCount?: Resolver<ResolversTypes['Count'], ParentType, ContextType, RequireFields<QueryNoteAccesssCountArgs, 'noteId'>>;
  noteActivityList?: Resolver<Maybe<Array<ResolversTypes['NoteActivity']>>, ParentType, ContextType, RequireFields<QueryNoteActivityListArgs, 'options'>>;
  projectsList?: Resolver<Array<ResolversTypes['Project']>, ParentType, ContextType, RequireFields<QueryProjectsListArgs, 'options'>>;
  projectsCount?: Resolver<ResolversTypes['Count'], ParentType, ContextType>;
  currentDate?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  userList?: Resolver<Array<ResolversTypes['User']>, ParentType, ContextType, RequireFields<QueryUserListArgs, 'options'>>;
  userDetail?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType, RequireFields<QueryUserDetailArgs, 'options'>>;
  userCount?: Resolver<ResolversTypes['Count'], ParentType, ContextType>;
  findUserByAllKeyword?: Resolver<Array<ResolversTypes['User']>, ParentType, ContextType, RequireFields<QueryFindUserByAllKeywordArgs, 'options'>>;
  findByAccountIdKeyword?: Resolver<Array<ResolversTypes['User']>, ParentType, ContextType, RequireFields<QueryFindByAccountIdKeywordArgs, 'accountId'>>;
  findUserByFullnameKeyword?: Resolver<Array<ResolversTypes['User']>, ParentType, ContextType, RequireFields<QueryFindUserByFullnameKeywordArgs, 'keyword'>>;
  findByEmail?: Resolver<ResolversTypes['User'], ParentType, ContextType, RequireFields<QueryFindByEmailArgs, 'email'>>;
};

export type SubscriptionResolvers<ContextType = any, ParentType extends ResolversParentTypes['Subscription'] = ResolversParentTypes['Subscription']> = {
  annotationChanged?: SubscriptionResolver<ResolversTypes['Notification'], "annotationChanged", ParentType, ContextType, RequireFields<SubscriptionAnnotationChangedArgs, 'title'>>;
  feedbackCommentChanged?: SubscriptionResolver<ResolversTypes['Notification'], "feedbackCommentChanged", ParentType, ContextType, RequireFields<SubscriptionFeedbackCommentChangedArgs, 'title'>>;
  feedbackIssueChanged?: SubscriptionResolver<ResolversTypes['NotificationFeedbackIssue'], "feedbackIssueChanged", ParentType, ContextType, RequireFields<SubscriptionFeedbackIssueChangedArgs, 'token'>>;
  feedbackIssueListingChanged?: SubscriptionResolver<ResolversTypes['NotificationFeedbackIssueListing'], "feedbackIssueListingChanged", ParentType, ContextType, RequireFields<SubscriptionFeedbackIssueListingChangedArgs, 'token'>>;
  feedbackNoteChanged?: SubscriptionResolver<ResolversTypes['NotificationFeedbackNote'], "feedbackNoteChanged", ParentType, ContextType, RequireFields<SubscriptionFeedbackNoteChangedArgs, 'token'>>;
  feedbackNoteListingChanged?: SubscriptionResolver<ResolversTypes['NotificationFeedbackNoteListing'], "feedbackNoteListingChanged", ParentType, ContextType, RequireFields<SubscriptionFeedbackNoteListingChangedArgs, 'token'>>;
  feedbackSourceChanged?: SubscriptionResolver<ResolversTypes['NotificationFeedbackSource'], "feedbackSourceChanged", ParentType, ContextType, RequireFields<SubscriptionFeedbackSourceChangedArgs, 'token'>>;
  fileChanged?: SubscriptionResolver<ResolversTypes['Notification'], "fileChanged", ParentType, ContextType, RequireFields<SubscriptionFileChangedArgs, 'title'>>;
  noteAccessChanged?: SubscriptionResolver<ResolversTypes['NotificationNoteAccess'], "noteAccessChanged", ParentType, ContextType, RequireFields<SubscriptionNoteAccessChangedArgs, 'token'>>;
  projectChanged?: SubscriptionResolver<ResolversTypes['Notification'], "projectChanged", ParentType, ContextType, RequireFields<SubscriptionProjectChangedArgs, 'title'>>;
  normalSubscription?: SubscriptionResolver<ResolversTypes['Notification'], "normalSubscription", ParentType, ContextType>;
  subscriptionWithFilter?: SubscriptionResolver<ResolversTypes['Notification'], "subscriptionWithFilter", ParentType, ContextType>;
  subscriptionWithFilterToDynamicTopic?: SubscriptionResolver<ResolversTypes['Notification'], "subscriptionWithFilterToDynamicTopic", ParentType, ContextType, RequireFields<SubscriptionSubscriptionWithFilterToDynamicTopicArgs, 'topic'>>;
};

export type UserResolvers<ContextType = any, ParentType extends ResolversParentTypes['User'] = ResolversParentTypes['User']> = {
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  accountId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  email?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  photo?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  firstName?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  lastName?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  oauthToken?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  oauthProvider?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  token?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  language?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  onboarding?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  userStatus?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType>;
};

export type Resolvers<ContextType = any> = {
  Annotation?: AnnotationResolvers<ContextType>;
  Count?: CountResolvers<ContextType>;
  DateTime?: GraphQLScalarType;
  FeedbackActionRecord?: FeedbackActionRecordResolvers<ContextType>;
  FeedbackCommnent?: FeedbackCommnentResolvers<ContextType>;
  FeedbackIssue?: FeedbackIssueResolvers<ContextType>;
  FeedbackNote?: FeedbackNoteResolvers<ContextType>;
  FeedbackSnapshot?: FeedbackSnapshotResolvers<ContextType>;
  FeedbackSource?: FeedbackSourceResolvers<ContextType>;
  FeedbackWorkflow?: FeedbackWorkflowResolvers<ContextType>;
  File?: FileResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  NoteAccess?: NoteAccessResolvers<ContextType>;
  NoteActivity?: NoteActivityResolvers<ContextType>;
  Notification?: NotificationResolvers<ContextType>;
  NotificationFeedbackIssue?: NotificationFeedbackIssueResolvers<ContextType>;
  NotificationFeedbackIssueListing?: NotificationFeedbackIssueListingResolvers<ContextType>;
  NotificationFeedbackNote?: NotificationFeedbackNoteResolvers<ContextType>;
  NotificationFeedbackNoteListing?: NotificationFeedbackNoteListingResolvers<ContextType>;
  NotificationFeedbackSource?: NotificationFeedbackSourceResolvers<ContextType>;
  NotificationNoteAccess?: NotificationNoteAccessResolvers<ContextType>;
  Project?: ProjectResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  Subscription?: SubscriptionResolvers<ContextType>;
  User?: UserResolvers<ContextType>;
};


/**
 * @deprecated
 * Use "Resolvers" root object instead. If you wish to get "IResolvers", add "typesPrefix: I" to your config.
 */
export type IResolvers<ContextType = any> = Resolvers<ContextType>;
