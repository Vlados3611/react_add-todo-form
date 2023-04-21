import { useState } from 'react';
import './App.scss';

import usersFromServer from './api/users';
import todosFromServer from './api/todos';

import { User } from './types/User';
import { TodoList } from './components/TodoList';

const getUserById = (userId: number): User | null => {
  const foundUser = usersFromServer.find(
    (user) => user.id === userId,
  );

  return foundUser || null;
};

export const App = () => {
  const [inputTitle, setInputTitle] = useState('');
  const [selectUser, setSelectUser] = useState('');
  const [isInputChecked, setInputCheck] = useState(true);
  const [isSelectChecked, setSelectCheck] = useState(true);

  const todos = todosFromServer.map(
    (todo) => ({
      ...todo,
      user: getUserById(todo.userId),
    }),
  );

  const [todosCopy, addUserPost] = useState(todos);

  const handleUserPost = () => {
    addUserPost(prevTodo => [
      ...prevTodo,
      {
        id: Math.max(...prevTodo.map((todo) => todo.id)),
        title: inputTitle,
        completed: false,
        userId: Number(selectUser),
        user: getUserById(Number(selectUser)),
      },
    ]);
  };

  const resetChanges = () => {
    setInputTitle('');
    setSelectUser('');
  };

  const checkTodoForm = () => {
    if (!inputTitle) {
      setInputCheck(false);
    } else {
      setInputCheck(true);
    }

    if (!selectUser) {
      setSelectCheck(false);
    } else {
      setSelectCheck(true);
    }

    if (inputTitle && selectUser) {
      handleUserPost();
    }
  };

  return (
    <div className="App">
      <h1>Add todo form</h1>

      <form action="/api/users" method="POST">
        <div className="field">
          <input
            type="text"
            data-cy="titleInput"
            value={inputTitle}
            onChange={(event) => {
              const { value } = event.target;

              setInputTitle(value);
            }}
            placeholder="Enter a title"
          />
          {
            !isInputChecked && (
              <span className="error">Please enter a title</span>
            )
          }
        </div>

        <div className="field">
          <select
            data-cy="userSelect"
            value={selectUser}
            onChange={(event) => {
              const { value } = event.target;

              setSelectUser(value);
            }}
          >
            <option
              value=""
              disabled
              selected
            >
              Choose a user
            </option>
            {usersFromServer.map((user) => (
              <option
                value={user.id}
                key={user.id}
              >
                {user.name}
              </option>
            ))}
          </select>

          {
            !isSelectChecked && (
              <span className="error">Please choose a user</span>
            )
          }
        </div>

        <button
          type="submit"
          data-cy="submitButton"
          onClick={(event) => {
            event.preventDefault();
            checkTodoForm();
            resetChanges();
          }}
        >
          Add
        </button>
      </form>

      <TodoList todos={todosCopy} />
    </div>
  );
};
