import React from 'react';
import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

interface Props {
  todos: Todo[];
  tempTodo: Todo | null;
  OnChangeTodoStatus: (id: number) => void;
  OnDelete: (id: number, setIsLoadingTodo: (sts: boolean) => void) => void;
  OnUpdateTodo: (todo: Todo) => void;
}

export const TodoList: React.FC<Props> = ({
  todos,
  tempTodo,
  OnChangeTodoStatus,
  OnDelete,
  OnUpdateTodo,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => {
        return (
          <TodoItem
            todo={todo}
            key={todo.id}
            OnChangeTodoStatus={OnChangeTodoStatus}
            OnDelete={OnDelete}
            OnUpdateTodo={OnUpdateTodo}
          />
        );
      })}
      {tempTodo && <TodoItem todo={tempTodo} loading={true} />}
    </section>
  );
};
