import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { CreateTodoRequest } from '../../requests/CreateTodoRequest'
import { createLogger } from '../../utils/logger'
import { getUserId } from '../utils'
import { createTodo } from '../../businessLogic/todos'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'

const logger = createLogger('create-todo')

export const handler = middy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const newTodo: CreateTodoRequest = JSON.parse(event.body)
  const userID = getUserId(event)
  if (!userID) logger.error("Error with the User ID")
  const todo = await createTodo(newTodo, userID)
  if (!todo) logger.error("Error with the todo")
  return {
    statusCode: 201,
    body: JSON.stringify({
      todo
    })
  }

}).use(cors({ credentials: true }))
