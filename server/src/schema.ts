/* eslint-disable no-path-concat */
import 'reflect-metadata'

import { AnnotationResolver } from './graphql/annotation'
import { FeedbackCommentResolver } from './graphql/feedbackComment'
import { FeedbackIssueResolver } from './graphql/feedbackIssue'
import { FeedbackNoteResolver } from './graphql/feedbackNote'
import { FeedbackSourceResolver } from './graphql/feedbackSource'
import { FeedbackWorkflowResolver } from './graphql/feedbackWorkflow'
import { FileResolver } from './graphql/file'
import { NoteAccessResolver } from './graphql/noteAccess'
import { NoteActivityResolver } from './graphql/noteActivity'
import { ProjectResolver } from './graphql/project'
import { SampleResolver } from './graphql/sampleresolver'
import { UserResolver } from './graphql/user'
import { buildSchema } from 'type-graphql'

export async function getSchema() {
  const schema = await buildSchema({
  // resolvers: [__dirname + '/graphql/**/*.{ts,js}'],
    resolvers: [
      UserResolver,
      ProjectResolver,
      FeedbackNoteResolver,
      FeedbackIssueResolver,
      FeedbackSourceResolver,
      FeedbackCommentResolver,
      FeedbackWorkflowResolver,
      AnnotationResolver,
      FileResolver,
      SampleResolver,
      NoteActivityResolver,
      NoteAccessResolver,
    ],
    validate: false,
  })
  return schema
}
