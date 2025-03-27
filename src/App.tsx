/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ErrorMessage, FilterStatus, Todo } from './types/Todo';
import { deleteTodo, getTodos, updateTodo } from './api/todos';
import { TodoList } from './components/TodoList';
import { HeaderTodoApp } from './components/HeaderTodoApp';
import { FooterTodoApp } from './components/FooterTodoApp';
import { filterTodo, findTodoById } from './utils/helpers';
import { TodoError } from './components/TodoError';

export const App: React.FC = () => {
  // console.log('render app');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState<ErrorMessage>(
    ErrorMessage.DEFAULT,
  );
  const [filterStatus, setFilterStatus] = useState(FilterStatus.DEFAULT);
  // console.log(todos)
  // console.log(errorMessage);
  const isAllChecked = useRef(false);

  //effects
  // const getTodosFromServer = () => {
  //   getTodos()
  //     .then(setTodos)
  //     .catch(() => {
  //       setErrorMessage(ErrorMessage.TODO_LOAD);
  //     });
  // };

  // const getErrorTimerForMessage = () => {
  //   if (errorMessage !== ErrorMessage.DEFAULT) {
  //     const timeOutID = setTimeout(() => {
  //       setErrorMessage(ErrorMessage.DEFAULT);
  //     }, 3000);

  //     return () => {
  //       clearTimeout(timeOutID);
  //     };
  //   }

  //   return;
  // };

  useEffect(() => {
    getTodos()
      .then(setTodos)
      .catch(() => {
        setErrorMessage(ErrorMessage.TODO_LOAD);
      });
  }, []);

  // useEffect(() => {
  //   // if (errorMessage !== ErrorMessage.DEFAULT && timeOut) {
  //   //   timeOut.current = setTimeout(() => {
  //   //     setErrorMessage(ErrorMessage.DEFAULT);
  //   //   }, 3000);
  //   // }

  //   // return () => {
  //   //   clearTimeout(timeOut.current);
  //   // };
  //   const timer = setTimeout(() => {
  //     console.log('+++++')
  //     setErrorMessage(ErrorMessage.DEFAULT);
  //   }, 3000);

  //   return () => {
  //     clearTimeout(timer);
  //   };
  // }, [errorMessage]);

  const filteredTodos = useMemo(() => {
    return filterTodo(todos, filterStatus);
  }, [todos, filterStatus]);

  //handlers
  const handleAddTodo = (newTodo: Todo) => {
    setTodos([...todos, newTodo]);
  };

  const handleUpdateTodo = (updatedTodo: Todo) => {
    updateTodo(updatedTodo)
      .then(updatedTodoFS => {
        setTodos(
          todos.map(todo =>
            todo.id === updatedTodoFS.id ? updatedTodo : todo,
          ),
        );
      })
      .catch(() => {
        setErrorMessage(ErrorMessage.TODO_UPDATE);
      });
  };

  // const handleOnChangeTodoStatus = (id: number) => {
  //   const currentTodo = findTodoById(todos, id);

  //   if (currentTodo) {
  //     currentTodo.completed = !currentTodo.completed;
  //     setTodos(
  //       todos.map(todo => (todo.id === currentTodo.id ? currentTodo : todo)),
  //     );
  //   }
  // };
  //update
  const handleOnChangeTodoStatus = (id: number) => {
    const currentTodo = findTodoById(todos, id);

    if (currentTodo) {
      currentTodo.completed = !currentTodo.completed;
      handleUpdateTodo(currentTodo);
    }
  };

  const handleCheckAll = () => {
    if (todos.every(todo => todo.completed)) {
      isAllChecked.current = false;
    } else {
      isAllChecked.current = true;
    }

    setTodos(todos.map(todo => ({ ...todo, completed: isAllChecked.current })));
  };
  //important to rehash what is going on;

  const handleOnDelete = (
    todoId: number,
    setIsLoadingTodo: (sts: boolean) => void,
  ) => {
    // setIsLoadingTodo(true);
    deleteTodo(todoId)
      .then(() => {
        setTodos(todos.filter(todo => todo.id !== todoId));
      })
      .catch(() => {
        setErrorMessage(ErrorMessage.TODO_DELETE);
      })
      .finally(() => {
        setIsLoadingTodo(false);
      });
  };

  const handleClearAllCompleted = () => {
    setTodos(todos.filter(todo => !todo.completed));
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <HeaderTodoApp
          setTempTodo={setTempTodo}
          onCheckAll={handleCheckAll}
          onAddTodo={handleAddTodo}
          todos={todos}
          setErrorMessage={setErrorMessage}
        />

        <TodoList
          tempTodo={tempTodo}
          todos={filteredTodos}
          OnUpdateTodo={handleUpdateTodo}
          OnChangeTodoStatus={handleOnChangeTodoStatus}
          OnDelete={handleOnDelete}
        />

        {/* Hide the footer if there are no todos */}
        {todos.length > 0 && (
          <FooterTodoApp
            todos={todos}
            setFilterStatus={setFilterStatus}
            filterStatus={filterStatus}
            onClearCompleted={handleClearAllCompleted}
          />
        )}
      </div>

      {/* DON'T use conditional rendering to hide the notification */}
      {/* Add the 'hidden' class to hide the message smoothly */}
      {/* <div
        data-cy="ErrorNotification"
        className={cn(
          'notification is-danger is-light has-text-weight-normal',
          {
            hidden: !errorMessage,
          },
        )}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={() => setErrorMessage(ErrorMessage.DEFAULT)}
        />
        {errorMessage}
      </div> */}
      <TodoError
        errorMessage={errorMessage}
        setErrorMessage={setErrorMessage}
      />
    </div>
  );
};
