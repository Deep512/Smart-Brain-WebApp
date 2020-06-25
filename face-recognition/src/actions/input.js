import { CHANGE_SEARCH_FIELD } from "../constants/constants";

export const setInputField = (text) => ({
	type: CHANGE_SEARCH_FIELD,
	payload: text,
});
