import { CHANGE_SEARCH_FIELD } from "../constants/constants.js";

const initialState = {
	input: "",
	imageUrl: "",
};

export const searchImage = (state = initialState, action = {}) => {
	switch (action.type) {
		case CHANGE_SEARCH_FIELD:
			return Object.assign({}, state, { input: action.payload });
		default:
			return state;
	}
};
