import {combineReducers} from 'redux';
import courses from './courseReducer';
import authors from './authorReducer';
import ajaxCallsInProgress from "../reducers/ajaxStatusReducer";

const rootReducer = combineReducers({
    courses, //shorthand property names ES6 courses: courses
    authors,
    ajaxCallsInProgress
});

export default rootReducer;
