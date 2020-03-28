import * as uuid from 'uuid';
import { TodoItem } from '../models/TodoItem';
import { TodoAccess } from '../dataLayer/todosAccess';
import { CreateTodoRequest } from '../requests/CreateTodoRequest';
import { createLogger } from '../utils/logger';
const logger = createLogger('business-logic')
const todoAccess = new TodoAccess();

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

export async function deleteTodo(todoID: string, userID: string): Promise<void> {
    const todo = await todoAccess.getTodo(todoID, userID)
    if (todo === undefined || todo === null) {
        logger.error("Todo not found")
        return
    }
    return await todoAccess.deleteTodo(todo.todoId, todo.createdAt)
}
