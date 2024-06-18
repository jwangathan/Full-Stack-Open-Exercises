import { createSlice } from "@reduxjs/toolkit";

const notificationSlice = createSlice({
  name: 'notification',
  initialState: '',
  reducers: {
    setNotification(state, action) {
      return action.payload
    },
   setEmpty(state, action) {
      return ''
    }
  }
})

export const {setNotification, setEmpty} = notificationSlice.actions
export default notificationSlice.reducer