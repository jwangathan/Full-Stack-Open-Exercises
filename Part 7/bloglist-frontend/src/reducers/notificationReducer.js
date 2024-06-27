import { createSlice } from '@reduxjs/toolkit'

const notificationSlice = createSlice({
	name: 'notification',
	initialState: { message: null, type: null },
	reducers: {
		setNotification(state, action) {
			return { message: action.payload.text, type: action.payload.type }
		},
		setEmpty(state, action) {
			return { message: null, type: null }
		},
	},
})

export const displayNotification = (text, type, time) => {
	return async (dispatch) => {
		dispatch(setNotification({ text, type }))
		setTimeout(() => {
			dispatch(setEmpty())
		}, time * 1000)
	}
}

export const { setNotification, setEmpty } = notificationSlice.actions
export default notificationSlice.reducer
