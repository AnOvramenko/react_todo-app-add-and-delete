import React, { useEffect, useRef, useState } from 'react';
import { ErrorMessage, Todo } from '../types/Todo';
import { addTodo, USER_ID } from '../api/todos';
interface Props {
  inputPlaceHolder: string;
  inputClassName: string;
  setErrorMessage?: (msg: ErrorMessage) => void;

  todos?: Todo[];
  onAddTodo?: (todo: Todo) => void;
  setTempTodo?: (tempTodo: Todo | null) => void;

  updateTodo?: Todo;
  setIsUpdate?: (val: boolean) => void;
  OnUpdateTodo?: (todo: Todo) => void;
  OnDelete?: (id: number, setIsLoadingTodo: (sts: boolean) => void) => void;
  setIsLoadingTodo?: (state: boolean) => void;
}

export const SubmitForm: React.FC<Props> = ({
  inputPlaceHolder,
  todos,
  onAddTodo,
  setErrorMessage = () => {},
  updateTodo,
  setIsUpdate,
  OnUpdateTodo,
  inputClassName,
  OnDelete,
  setIsLoadingTodo,
  setTempTodo,
}) => {
  const [inputQuery, setInputQuery] = useState(updateTodo?.title || '');
  const [isDisableInput, setIsDisableInput] = useState(false);

  const focusInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    focusInput.current?.focus();
  }, [isDisableInput]);
  // const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  const isAdd = todos && onAddTodo && /*setErrorMessage &&*/ setTempTodo;
  const isUpdate =
    updateTodo && setIsUpdate && OnUpdateTodo && OnDelete && setIsLoadingTodo;

  const handleOnSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    // console.log('hello');
    if (!inputQuery.trim()) {
      setErrorMessage(ErrorMessage.TODO_ADD);

      return;
    }
    // setErrorMessage(ErrorMessage.DEFAULT);
    // console.log(setErrorMessage);

    if (isUpdate) {
      if (inputQuery.trim()) {
        const updatedTodo = {
          id: updateTodo.id,
          userId: USER_ID,
          title: inputQuery,
          completed: updateTodo.completed,
        };

        OnUpdateTodo(updatedTodo);
      } else {
        setInputQuery('');
        OnDelete(updateTodo.id, setIsLoadingTodo);
      }

      setIsUpdate(false);
    }

    if (isAdd) {
      const newTodo = {
        id: isFinite(Math.max(...todos.map(todo => todo.id)) + 1)
          ? Math.max(...todos.map(todo => todo.id)) + 1
          : +Math.random().toFixed(16).slice(2),
        userId: USER_ID,
        title: inputQuery.trim(),
        completed: false,
      };
      // console.log(newTodo)

      setIsDisableInput(true);
      setTempTodo(newTodo);
      addTodo(newTodo)
        .then(newTodoFS => {
          // setErrorMessage(ErrorMessage.DEFAULT); // ????

          // console.log(newTodoFS);
          onAddTodo(newTodoFS);
          setInputQuery(''); //???
        })
        .catch(() => {
          setErrorMessage(ErrorMessage.TODO_ADD);
        })
        .finally(() => {
          setTempTodo(null);
          setIsDisableInput(false);
        });
    }
  };

  const handleOnBlur = () => {
    if (isUpdate) {
      // setIsUpdate(false);

      if (inputQuery.trim()) {
        const updatedTodo = {
          id: updateTodo.id,
          userId: USER_ID,
          title: inputQuery,
          completed: updateTodo.completed,
        };

        OnUpdateTodo(updatedTodo);
      } else {
        OnDelete(updateTodo.id, setIsLoadingTodo);
      }

      setIsUpdate(false);
    }
  };

  return (
    <form onSubmit={handleOnSubmit}>
      <input
        onBlur={handleOnBlur}
        data-cy="NewTodoField"
        type="text"
        value={inputQuery}
        onChange={event => setInputQuery(event.target.value)}
        className={inputClassName}
        placeholder={inputPlaceHolder}
        disabled={isDisableInput}
        ref={focusInput}
      />
    </form>
  );
};
