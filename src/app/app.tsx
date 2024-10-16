import { Login } from "../modules/auth/login";
import { LogoutButton } from "../modules/auth/logout-button";
import { useUser } from "../modules/auth/use-user";
import { TodoList } from "../modules/todo-list/todo-list";

export function App() {
  const user = useUser();

  if (user.isLoading) {
    return <div>Loading</div>;
  }

  if (user.data) {
    return (
      <>
        <LogoutButton /> <TodoList />
      </>
    );
  }

  return <Login />;
}
