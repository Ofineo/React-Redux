import {combineReducers} from 'redux';
import courses from './courseReducer';

const rootReducer = combineReducers({
    courses //shorthand property names ES6 courses: courses
});

export default rootReducer;
