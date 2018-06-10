import * as types from "./actionTypes";
import courseApi from "../api/mockCourseApi";
import { beginAjaxCall, ajaxCallError } from "./ajaxStatusActions";
import expect from 'expect';
import * as courseActions from './courseActions';

import thunk from 'redux-thunk';
import nock from 'nock';
import configureMockStore from 'redux-mock-store';

export function loadCoursesSuccess(courses) {
    return { type: types.LOAD_COURSES_SUCCESS, courses };
}
export function createCourseSuccess(course) {
    return { type: types.CREATE_COURSES_SUCCESS, course };
}
export function updateCourseSuccess(course) {
    return { type: types.UPDATE_COURSES_SUCCESS, course };
}

export function loadCourses(){
    return function(dispatch){
        dispatch(beginAjaxCall());
        return courseApi.getAllCourses().then(courses=>{
            dispatch(loadCoursesSuccess(courses));
        }).catch(error=>{
            throw(error);        
        });
    };
}

export function saveCourse(course){
    return function(dispatch, getState){ //optional parameter to get out of the store pieces of state that you need to update your thunk
        dispatch(beginAjaxCall());
        return courseApi.saveCourse(course).then(savedCourse=>{
            course.id ? dispatch(updateCourseSuccess(savedCourse)) :
            dispatch(createCourseSuccess(savedCourse));
        }).catch(error=>{
            dispatch(ajaxCallError(error));
            throw(error);        
        });
    };
}

const middleware = [thunk];
const mockStore = configureMockStore(middleware);

describe('Async Actions', () => {
  afterEach(() => {
    nock.cleanAll();
  });

  it('should create BEGIN_AJAX_CALL and LOAD_COURSES_SUCCESS when loading courses', (done) => {
    // Here's an example call to nock.
    // nock('http://example.com/')
    //   .get('/courses')
    //   .reply(200, { body: { course: [{ id: 1, firstName: 'Cory', lastName: 'House'}] }});

    const expectedActions = [
      {type: types.BEGIN_AJAX_CALL},
      {type: types.LOAD_COURSES_SUCCESS, body: {courses: [{id: 'clean-code', title: 'Clean Code'}]}}
    ];

    const store = mockStore({courses: []}, expectedActions, done);
    store.dispatch(courseActions.loadCourses()).then(() => {
      const actions = store.getActions();
      expect(actions[0].type).toEqual(types.BEGIN_AJAX_CALL);
      expect(actions[1].type).toEqual(types.LOAD_COURSES_SUCCESS);
      done();
    });
  });
});