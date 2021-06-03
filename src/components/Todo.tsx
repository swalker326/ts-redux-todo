import { useEffect, useState } from "react";
import Auth from "@aws-amplify/auth";
import { useAppDispatch, useAppSelector } from "../state/hooks";
import { Row, Col, Button, Form, Container } from "react-bootstrap";
import { listTodos } from "../graphql/queries";
import { createTodo, updateTodo } from "../graphql/mutations";
import { TodoCard } from "./TodoCard";
import API, { graphqlOperation } from "@aws-amplify/api";
import { toggleAuthState } from "../state/authSlice";
import { setDeletePending } from "../state/todoSlice";

interface Todo {
  id: string;
  name: string;
  description: string;
  deleted: boolean;
}

export const Todo = () => {
  const TODO = useAppSelector((state) => state.todo);
  console.log("TODO :", TODO.deletePending);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });
  const [todos, setTodos] = useState([
    { id: "", name: "", description: "", deleted: false },
  ]);
  const dispatch = useAppDispatch();
  const signUserOut = () => {
    Auth.signOut().then(() => {
      dispatch(toggleAuthState());
    });
  };
  const handleAddToDo = async () => {
    setFormData({ name: "", description: "" });
    if (formData.name && formData.description) {
      try {
        const newTodo = await API.graphql(
          graphqlOperation(createTodo, {
            input: { ...formData, deleted: false },
          })
        );
        console.log(newTodo);
      } catch (err) {
        console.log("Error creating todo: ", err);
      }
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) =>
    setFormData({ ...formData, [event.target.name]: event.target.value });

  useEffect(() => {
    fetchTodos();
  }, []);
  const fetchTodos = async () => {
    try {
      const todoData: any = await API.graphql(graphqlOperation(listTodos));
      setTodos(todoData.data?.listTodos.items);
    } catch (err) {
      console.log("Error fetching todos: ", err);
    }
  };
  const undoTodoDelete = async () => {
    try {
      await API.graphql(
        graphqlOperation(updateTodo, {
          input: { id: TODO.pendingTodo.id, deleted: false },
        })
      );
    } catch (err) {
      console.log(err);
    }
    dispatch(setDeletePending(false));
    fetchTodos();
  };
  return (
    <Container style={styles.container}>
      <Form>
        <Row>
          <Container>
            <Col>
              <Button
                style={styles.signoutButton}
                onClick={() => signUserOut()}
              >
                Sign Out
              </Button>
              <Form.Control
                name="name"
                style={styles.todoInput}
                placeholder={"To Do Name..."}
                onChange={(e) => handleInputChange(e as any)}
                value={formData.name}
              />
              <Form.Control
                name="description"
                style={styles.todoInput}
                as="textarea"
                rows={5}
                placeholder={"To Do Description..."}
                onChange={(e) => handleInputChange(e as any)}
                value={formData.description}
              />
              <Button onClick={() => handleAddToDo().then(() => fetchTodos())}>
                Add To Do
              </Button>
            </Col>
          </Container>
        </Row>
      </Form>
      <Container style={styles.todoList}>
        {TODO.deletePending ? (
          <Container style={styles.undoContainer}>
            <button style={styles.undoButton} onClick={() => undoTodoDelete()}>
              Undo
            </button>{" "}
            Todo Delete?
          </Container>
        ) : (
          <Container style={styles.undoContainer}></Container>
        )}
        {todos ? (
          todos
            .filter((td) => !td.deleted)
            .map(
              (
                todo: {
                  id: string;
                  name: string;
                  description: string;
                  deleted: boolean;
                },
                index: number
              ) => (
                <TodoCard
                  key={index}
                  id={todo.id}
                  name={todo.name}
                  description={todo.description}
                  deleted={todo.deleted}
                  fetchTodos={fetchTodos}
                />
              )
            )
        ) : (
          <Container>
            <h4>Add some to dos to see them</h4>
          </Container>
        )}
      </Container>
    </Container>
  );
};

const styles = {
  container: {
    marginTop: 30,
  },
  undoContainer: {
    height: 50,
  },
  undoButton: {
    border: "none",
    backgroundColor: "transparent",
    color: "blue",
    margin: 0,
    padding: 0,
  },
  todoInput: {
    padding: 8,
    marginTop: 8,
    marginBottom: 8,
    resize: "none",
  } as React.CSSProperties,
  todoList: {
    borderRadius: 8,
    paddingTop: 40,
  },
  signoutButton: {
    float: "right",
    marginBottom: 10,
  } as React.CSSProperties,
};
