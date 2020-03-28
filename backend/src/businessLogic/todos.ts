import * as uuid from 'uuid';
import { TodoItem } from '../models/TodoItem';
import { TodoAccess } from '../dataLayer/todosAccess';
import { CreateTodoRequest } from '../requests/CreateTodoRequest';
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest';
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

export async function deleteTodo(todoID: string): Promise<void> {
    return await todoAccess.deleteTodo(todoID)
}

export async function updateTodo(todoID: string, updateTodoRequest: UpdateTodoRequest): Promise<void> {
    return await todoAccess.updateTodo(updateTodoRequest, todoID)
}
