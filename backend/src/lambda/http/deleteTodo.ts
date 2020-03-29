import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { createLogger } from '../../utils/logger'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'
import { deleteTodo } from '../../businessLogic/todos'
import { TodoAccess } from '../../dataLayer/todosAccess'
import { getUserId } from '../utils'

const logger = createLogger('delete-todo')
const todoAccess = new TodoAccess();

export const handler = middy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  logger.info("Delete function called")
  const todoId = event.pathParameters.todoId
  const userId = getUserId(event)
  const todo = await todoAccess.getTodo(todoId, userId);
  try {
    await deleteTodo(todoId, todo.createdAt)
    return {
      statusCode: 201,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({
        "message": "Todo deleted successfully."
      })
    }
  } catch (error) {
    logger.error("Delete function failed.")
    return {
      statusCode: 400,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({
        "message": "There was an error deleting the todo."
      })
    }
  }

}).use(cors({ credentials: true }))
