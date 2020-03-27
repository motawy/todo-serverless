import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'
import { createLogger } from '../../utils/logger'
import { getUserId } from '../utils'
import { getTodos } from '../../businessLogic/todos'
const logger = createLogger('get-todos')

export const handler = middy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const userId = getUserId(event)
  logger.info("Calling get todos")
  const todos = getTodos(userId)
  return {
    statusCode: 201,
    body: JSON.stringify({
      items: todos,
    }),
  };
})
  .use(cors({ credentials: true }))
