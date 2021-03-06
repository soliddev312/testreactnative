import * as API from "../api";
import {AsyncStorage} from 'react-native'
import {GET_TASKS_REQUEST_END, GET_TASKS_REQUEST_START, SET_TASK_NAMES, SET_TASKS} from "../utils/constants";
import AsyncStorageQueue from "../utils/AsyncStorageQueue";

export const initTasks = () => async (dispatch, getState) => {
    const pin = getState().auth.pin;
    const tasks = JSON.parse(await AsyncStorage.getItem(`@${pin}_tasks`)) || [];
    dispatch({type: SET_TASKS, payload: tasks});
    const taskNames = JSON.parse(await AsyncStorage.getItem(`@${pin}_task_names`)) || {};
    dispatch({type: SET_TASK_NAMES, payload: taskNames});
};

export const getTasksList = () => async (dispatch, getState) => {
    dispatch({type: GET_TASKS_REQUEST_START});
    const response = await API.getTasks();

    if (!response) {
        return dispatch({type: GET_TASKS_REQUEST_END});
    }
    const pin = getState().auth.pin;

    let data = response.data;
    if (typeof response.data === "string") {
        try {
            data = JSON.parse(response.data);
        } catch (e) {
            try {
                data = await API.getTasksFetch().then(data => data.json());
            } catch (er) {
                return dispatch({type: GET_TASKS_REQUEST_END});
            }
        }
    }

    if (data.results) {
        dispatch({type: SET_TASKS, payload: data.results});
        await AsyncStorageQueue.push(`@${pin}_tasks`, JSON.stringify(data.results));
    }
    dispatch({type: GET_TASKS_REQUEST_END})
};