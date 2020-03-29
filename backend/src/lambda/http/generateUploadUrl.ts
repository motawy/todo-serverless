import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as uuid from 'uuid';
import * as middy from 'middy'
import { cors } from 'middy/middlewares'
import { createLogger } from '../../utils/logger'
import { setAttachmentUrl, getUploadUrl } from '../../businessLogic/todos'
import { getUserId } from '../utils'
import { TodoAccess } from '../../dataLayer/todosAccess'

const logger = createLogger('generate-upload-url')
const todoAccess = new TodoAccess();

export const handler = middy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const todoId = event.pathParameters.todoId
  logger.info("Getting attachment URL")
  const imageID = uuid.v4()
  const userId = getUserId(event)
  const todo = await todoAccess.getTodo(todoId, userId);
  try {
    await setAttachmentUrl(todoId, imageID, todo.createdAt)
    const uploadUrl = await getUploadUrl(imageID)
    return {
      statusCode: 201,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({
        uploadUrl
      })
    }
  } catch (error) {
    logger.error("Failed to generate url.")
    return {
      statusCode: 400,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({
        "message": "There was an error deleting the todo: " + error
      })
    }
  }
}).use(cors({ credentials: true }))
