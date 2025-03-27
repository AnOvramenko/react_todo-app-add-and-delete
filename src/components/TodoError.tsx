import { FC, useEffect } from 'react';
import { ErrorMessage } from '../types/Todo';
import cn from 'classnames';

interface Props {
  errorMessage: ErrorMessage;
  setErrorMessage: (msg: ErrorMessage) => void;
}

export const TodoError: FC<Props> = ({ errorMessage, setErrorMessage }) => {
  // useEffect(() => {
  //   if (errorMessage !== ErrorMessage.DEFAULT) {
  //     const timer = setTimeout(() => {
  //       console.log('+++++');
  //       setErrorMessage(ErrorMessage.DEFAULT);
  //     }, 3000);

  //     return () => {
  //       clearTimeout(timer);
  //     };
  //   }

  //   return;
  // }, [errorMessage]);
  useEffect(() => {
    const timer = setTimeout(() => {
      // console.log('+++++');
      setErrorMessage(ErrorMessage.DEFAULT);
    }, 3000);

    return () => {
      clearTimeout(timer);
    };
  }, [errorMessage]);

  return (
    <div
      data-cy="ErrorNotification"
      className={cn('notification is-danger is-light has-text-weight-normal', {
        hidden: !errorMessage,
      })}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => setErrorMessage(ErrorMessage.DEFAULT)}
      />
      {errorMessage}
    </div>
  );
};
