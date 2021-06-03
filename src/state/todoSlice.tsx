import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "./store";

interface Todo {
  id: string;
  name: string;
  description: string;
  deleted: boolean;
}
interface TodoState {
  deletePending: boolean;
  pendingTodo: Todo;
}

const initialState: TodoState = {
  deletePending: false,
  pendingTodo: { id: "", name: "", description: "", deleted: false },
};

export const todoSlice = createSlice({
  name: "undo delete",
  initialState,
  reducers: {
    setDeletePending: (state, action: PayloadAction<boolean>) => {
      state.deletePending = action.payload;
      console.log('action.payload :', action.payload);
    },
    setDeleteTodo: (state, action: PayloadAction<Todo>) => {
      state.pendingTodo = action.payload;
    },
  },
});

export const { setDeletePending, setDeleteTodo } = todoSlice.actions;
export const selectTodo = (state: RootState) => state.todo;

export default todoSlice.reducer;
