import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { createLogger } from '../../utils/logger'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'
import { deleteTodo } from '../../businessLogic/todos'
const logger = createLogger('delete-todo')

export const handler = middy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  logger.info("Delete function called")
  const todoId = event.pathParameters.todoId
  try {
    await deleteTodo(todoId)
    return {
      statusCode: 201,
      body: JSON.stringify({
        "message": "Todo deleted successfully."
      })
    }
  } catch (error) {
    logger.error("Delete function failed.")
    return {
      statusCode: 400,
      body: JSON.stringify({
        "message": "There was an error deleting the todo."
      })
    }
  }

}).use(cors({ credentials: true }))
