import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { UpdateTodoRequest } from '../../requests/UpdateTodoRequest'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'
import { createLogger } from '../../utils/logger'
import { updateTodo } from '../../businessLogic/todos'
const logger = createLogger('update-todo')

export const handler = middy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const todoId = event.pathParameters.todoId
  const updatedTodo: UpdateTodoRequest = JSON.parse(event.body)
  logger.info("Update todo requested.")
  try {
    await updateTodo(todoId, updatedTodo)
    return {
      statusCode: 201,
      body: JSON.stringify({
        "message": "Todo updated successfully."
      })
    }
  } catch (error) {
    logger.error("Update function failed. " + error)
    return {
      statusCode: 400,
      body: JSON.stringify({
        "message": "There was an error updating the todo."
      })
    }
  }
}).use(cors({ credentials: true }))
