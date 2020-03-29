import * as AWS from 'aws-sdk'
import { TodoItem } from '../models/TodoItem'
import { createLogger } from '../utils/logger'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'
const AWSXRay = require('aws-xray-sdk')
const XAWS = AWSXRay.captureAWS(AWS)
const logger = createLogger('todos-access')

export class TodoAccess {
    constructor(
        private readonly docClient: AWS.DynamoDB.DocumentClient = new XAWS.DynamoDB.DocumentClient(),
        private readonly userIdIndex: string = process.env.INDEX_NAME,
        private readonly todosTable: string = process.env.TODOS_TABLE
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
        return result.Items as TodoItem[]
    }

    async createTodo(todo: TodoItem): Promise<TodoItem> {
        await this.docClient.put({
            TableName: this.todosTable,
            Item: todo
        }).promise()
        return todo
    }

    async getTodo(todoId: string, userId: string): Promise<TodoItem> {
        const result = await this.docClient
            .query({
                TableName: this.todosTable,
                IndexName: this.userIdIndex,
                KeyConditionExpression: 'todoId = :todoId and userId = :userId',
                ExpressionAttributeValues: {
                    ':todoId': todoId,
                    ':userId': userId,
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
                    "todoId": todoId,
                    "createdAt": createdAt
                },
            })
            .promise();
    }

    async updateTodo(updatedTodo: UpdateTodoRequest, todoID: string, createdAt: string): Promise<void> {
        await this.docClient.update({
            TableName: this.todosTable,
            Key: {
                "todoId": todoID,
                "createdAt": createdAt
            },
            UpdateExpression: 'set #n = :t, dueDate = :d, done = :n',
            ExpressionAttributeValues: {
                ':t': updatedTodo.name,
                ':d': updatedTodo.dueDate,
                ':n': updatedTodo.done
            },
            ExpressionAttributeNames: {
                "#n": "name"
            },
            ReturnValues: 'UPDATED_NEW',
        }).promise()
    }

    async setAttachmentUrl(todoId: string, attachmentUrl: string, createdAt: string): Promise<void> {
        this.docClient
            .update({
                TableName: this.todosTable,
                Key: {
                    "todoId": todoId,
                    "createdAt": createdAt
                },
                UpdateExpression: 'set attachmentUrl = :attachmentUrl',
                ExpressionAttributeValues: {
                    ':attachmentUrl': attachmentUrl,
                },
                ReturnValues: 'UPDATED_NEW',
            })
            .promise();
    }
}

