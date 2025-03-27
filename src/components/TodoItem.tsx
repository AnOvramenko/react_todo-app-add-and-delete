/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState } from 'react';
import { Todo } from '../types/Todo';
import cn from 'classnames';
import { SubmitForm } from './SubmitForm';

interface Props {
  todo: Todo;
  loading?: boolean;
  OnChangeTodoStatus?: (id: number) => void;
  OnDelete?: (id: number, setIsLoadingTodo: (sts: boolean) => void) => void;
  OnUpdateTodo?: (todo: Todo) => void;
}

export const TodoItem: React.FC<Props> = ({
  todo,
  loading,
  OnChangeTodoStatus = () => {},
  OnDelete = () => {},
  OnUpdateTodo = () => {},
}) => {
  const [isUpdate, setIsUpdate] = useState(false);
  const [isLoadingTodo, setIsLoadingTodo] = useState(loading || false);
  // console.log(isLoadingTodo);
  const handleOnDeleteTodo = () => {
    setIsLoadingTodo(true);
    OnDelete(todo.id, setIsLoadingTodo);
  };

  return (
    <div
      onDoubleClick={() => setIsUpdate(true)}
      key={todo.id}
      data-cy="Todo"
      className={cn('todo', {
        completed: todo.completed,
      })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          onChange={() => OnChangeTodoStatus(todo.id)}
          checked={todo.completed}
        />
      </label>

      {isUpdate ? (
        <SubmitForm
          inputPlaceHolder="Empty todo will be deleted"
          setIsLoadingTodo={setIsLoadingTodo}
          updateTodo={todo}
          setIsUpdate={setIsUpdate}
          OnUpdateTodo={OnUpdateTodo}
          inputClassName="todo__title-field"
          OnDelete={OnDelete}
        />
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            contentEditable={isUpdate}
          >
            {todo.title}
          </span>
          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={handleOnDeleteTodo}
          >
            ×
          </button>
        </>
      )}

      <div
        data-cy="TodoLoader"
        className={cn('modal overlay', {
          'is-active': isLoadingTodo,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
