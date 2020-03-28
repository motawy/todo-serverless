import * as AWS from 'aws-sdk'
//import * as AWSXRay from 'aws-xray-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
// const XAWS = AWSXRay.captureAWS(AWS)
import { TodoItem } from '../models/TodoItem'
import { createLogger } from '../utils/logger'
const logger = createLogger('todos-access')

export class TodoAccess {
    constructor(
        private readonly docClient: DocumentClient = createDynamoDBClient(),
        private readonly todosTable = process.env.TODOS_TABLE,
        private readonly userIDIndex = process.env.INDEX_NAME
    ) { }

    async getTodos(userID: string): Promise<TodoItem[]> {
        logger.info("Querying table.")
        const result = await this.docClient.scan({
            TableName: this.todosTable,
            FilterExpression: 'userId = :userId',
            ExpressionAttributeValues: {
                ':userId': userID
            }
        }).promise()
        const items = result.Items
        return items as TodoItem[]
    }

    async createTodo(todo: TodoItem): Promise<TodoItem> {
        await this.docClient.put({
            TableName: this.todosTable,
            Item: todo
        }).promise()
        return todo
    }

    async getTodo(todoID: string, userID: string): Promise<TodoItem> {
        const result = await this.docClient
            .query({
                TableName: this.todosTable,
                IndexName: this.userIDIndex,
                KeyConditionExpression: 'todoId = :todoId and userId = :userId',
                ExpressionAttributeValues: {
                    ':todoId': todoID,
                    ':userId': userID,
                },
            })
            .promise();
        const item = result.Items[0];
        return item as TodoItem;
    }

    async deleteTodo(todoId: string, createdAt: string): Promise<void> {
        this.docClient
            .delete({
                TableName: this.todosTable,
                Key: {
                    todoId,
                    createdAt
                },
            })
            .promise();
    }
}

function createDynamoDBClient() {
    if (process.env.IS_OFFLINE) {
        console.log('Creating a local DynamoDB instance')
        return new DocumentClient({
            region: 'localhost',
            endpoint: 'http://localhost:8000'
        })
    }
    return new AWS.DynamoDB.DocumentClient()
}
