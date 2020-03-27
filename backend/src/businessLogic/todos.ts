import * as uuid from 'uuid';
import { TodoItem } from '../models/TodoItem';
import { TodoAccess } from '../dataLayer/todosAccess';
import { CreateTodoRequest } from '../requests/CreateTodoRequest';

const todoAccess = new TodoAccess();

export async function getTodos(userId: string): Promise<TodoItem[]> {
    return todoAccess.getTodos(userId);
}

export async function createTodo(req: CreateTodoRequest, userID: string, ): Promise<TodoItem> {
    const todo = {
        userId: userID,
        todoId: uuid.v4(),
        createdAt: new Date().toISOString(),
        name: req.name,
        dueDate: req.dueDate,
        done: false
    }
    return todoAccess.createTodo(todo);
}

