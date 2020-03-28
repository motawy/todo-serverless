import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as uuid from 'uuid';
import * as middy from 'middy'
import { cors } from 'middy/middlewares'
import { createLogger } from '../../utils/logger'
import { setAttachmentUrl, getUploadUrl } from '../../businessLogic/todos'
const logger = createLogger('generate-upload-url')


export const handler = middy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const todoId = event.pathParameters.todoId
  logger.info("Getting attachment URL")
  const imageID= uuid.v4()
  try {
    await setAttachmentUrl(todoId, imageID)
    const uploadUrl = getUploadUrl(imageID)
    return {
      statusCode: 201,
      body: JSON.stringify({
        uploadUrl
      })
    }
  } catch (error) {
    logger.error("Failed to generate url.")
    return {
      statusCode: 400,
      body: JSON.stringify({
        "message": "There was an error deleting the todo: " + error
      })
    }
  }
}).use(cors({ credentials: true }))
