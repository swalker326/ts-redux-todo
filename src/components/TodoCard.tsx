import React, { useState } from "react";
import { Container } from "react-bootstrap";
import * as Icon from "react-bootstrap-icons";
import { useAppDispatch, useAppSelector } from "../state/hooks";
import API, { graphqlOperation } from "@aws-amplify/api";
import { deleteTodo, updateTodo } from "../graphql/mutations";
import { setDeletePending, setDeleteTodo } from "../state/todoSlice";

interface Todo {
  id: string;
  name: string;
  description: string;
  deleted: boolean;
  fetchTodos: () => void;
}

export const TodoCard = (todo: Todo) => {
  const TODO = useAppSelector((state) => state.todo);
  const [isEditing, setIsEditing] = useState(false);
  const { id, name, description, deleted } = todo;
  const dispatch = useAppDispatch();

  const handleDeleteClick = async () => {
    try {
      await API.graphql(
        graphqlOperation(updateTodo, {
          input: { id, deleted: true },
        })
      );
    } catch (err) {
      console.log(err);
    }
    dispatch(setDeletePending(true));
    dispatch(
      setDeleteTodo({
        id: todo.id,
        name: todo.name,
        description: todo.description,
        deleted: todo.deleted,
      })
    );
    setTimeout(() => {
      console.log(`Delete Timeout fired ${TODO.deletePending}`);
      if (TODO.deletePending) {
        console.log(`Delete Pending ${TODO.deletePending}`);
        dispatch(setDeletePending(false));
        TODO.deletePending
          ? handleDeleteTodo()
          : dispatch(
              setDeleteTodo({
                id: "",
                name: "",
                description: "",
                deleted: false,
              })
            );
      }
    }, 10000);
  };
  const handleDeleteTodo = async () => {
    try {
      await API.graphql(
        graphqlOperation(deleteTodo, {
          input: { id },
        })
      );
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <Container className="TodoCard" style={styles.card}>
      <Container
        onClick={(event: any) =>
          handleDeleteClick().then((resp) => todo.fetchTodos())
        }
      >
        <Icon.XLg style={styles.controlStyles} color="#3a3a3a" />
      </Container>
      <h5>{name}</h5>
      <span>{description}</span>
    </Container>
  );
};

export default TodoCard;

const styles = {
  header: {
    fontSize: 24,
  },
  card: {
    marginTop: 10,
    marginBottom: 10,
    backgroundColor: "#f7f7f7",
    padding: 20,
    borderRadius: 8,
    position: "relative",
  } as React.CSSProperties,
  controlStyles: {
    position: "absolute",
    right: 10,
  } as React.CSSProperties,
};
