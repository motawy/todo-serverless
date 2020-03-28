import * as AWS from 'aws-sdk'
import * as uuid from 'uuid';
import { TodoItem } from '../models/TodoItem';
import { TodoAccess } from '../dataLayer/todosAccess';
import { CreateTodoRequest } from '../requests/CreateTodoRequest';
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest';

const AWSXRay = require('aws-xray-sdk')
const XAWS = AWSXRay.captureAWS(AWS)
const todoAccess = new TodoAccess();

const bucketName = process.env.S3_BUCKET
const urlExpiration = process.env.SIGNED_URL_EXPIRATION
const s3 = new XAWS.S3({
    signatureVersion: 'v4'
})

export async function getTodos(userId: string): Promise<TodoItem[]> {
    return await todoAccess.getTodos(userId);
}

export async function createTodo(todoReq: CreateTodoRequest, userID: string, ): Promise<TodoItem> {
    const todo = {
        userId: userID,
        todoId: uuid.v4(),
        createdAt: new Date().toISOString(),
        name: todoReq.name,
        dueDate: todoReq.dueDate,
        done: false
    }
    return await todoAccess.createTodo(todo);
}

export async function deleteTodo(todoID: string): Promise<void> {
    return await todoAccess.deleteTodo(todoID)
}

export async function updateTodo(todoID: string, updateTodoRequest: UpdateTodoRequest): Promise<void> {
    return await todoAccess.updateTodo(updateTodoRequest, todoID)
}

export async function setAttachmentUrl(todoId: string, imageId: string): Promise<void> {
    const imageUrl = `https://${bucketName}.s3.amazonaws.com/${imageId}`
    return await todoAccess.setAttachmentUrl(todoId, imageUrl)
}

export function getUploadUrl(imageId: string): string {
    const attachmentUrl = s3.getSignedUrl('putObject', {
        Bucket: bucketName,
        Key: imageId,
        Expires: parseInt(urlExpiration)
    })
    return attachmentUrl;
}

