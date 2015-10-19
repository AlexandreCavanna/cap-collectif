import AppDispatcher from '../dispatchers/AppDispatcher';
import Fetcher from '../services/Fetcher';
import {RECEIVE_COUNT, RECEIVE_ELEMENTS, RECEIVE_ELEMENTS_SUCCESS, RECEIVE_ELEMENTS_FAILURE, RECEIVE_ELEMENT, RECEIVE_ELEMENT_SUCCESS, RECEIVE_ELEMENT_FAILURE, EXPAND_NAVBAR_ITEM, SELECT_NAVBAR_ITEM, CREATE_ELEMENT, ARCHIVE_ELEMENT, NOTE_ELEMENT, COMMENT_ELEMENT, NAME_ELEMENT, MOVE_ELEMENT, DIVIDE_ELEMENT, UPDATE_ELEMENT_SUCCESS, UPDATE_ELEMENT_FAILURE, CREATE_ELEMENT_SUCCESS, CREATE_ELEMENT_FAILURE, NAVBAR_DEPTH} from '../constants/SynthesisElementConstants';

const idOf = (val) => {
  if (val === 'root') {
    return null;
  }
  if (typeof val === 'object') {
    if (val.id === 'root') {
      return null;
    }
    return val.id;
  }
  return val;
};

const updateElementFromData = (synthesis, element, data, successMessage = 'common.success.update_success', errorMessage = 'common.errors.update_error') => {
  return Fetcher
    .put(`/syntheses/${synthesis}/elements/${element}`, data)
    .then(() => {
      AppDispatcher.dispatch({
        actionType: UPDATE_ELEMENT_SUCCESS,
        message: successMessage,
      });
      return true;
    })
    .catch(() => {
      AppDispatcher.dispatch({
        actionType: UPDATE_ELEMENT_FAILURE,
        message: errorMessage,
      });
      return false;
    });
};

const createElementFromData = (synthesis, data, successMessage = 'common.success.update_success', errorMessage = 'common.errors.update_error') => {
  return Fetcher
    .post(`/syntheses/${synthesis}/elements`, data)
    .then(() => {
      AppDispatcher.dispatch({
        actionType: CREATE_ELEMENT_SUCCESS,
        element: data,
        message: successMessage,
      });
      return true;
    })
    .catch(() => {
      AppDispatcher.dispatch({
        actionType: CREATE_ELEMENT_FAILURE,
        message: errorMessage,
      });
      return false;
    });
};

const fetchElementById = (synthesis, element) => {
  return Fetcher
    .get(`/syntheses/${synthesis}/elements/${element}`)
    .then((data) => {
      AppDispatcher.dispatch({
        actionType: RECEIVE_ELEMENT_SUCCESS,
        element: data,
      });
      return true;
    })
    .catch(() => {
      AppDispatcher.dispatch({
        actionType: RECEIVE_ELEMENT_FAILURE,
      });
      return false;
    });
};

export default {

  create: (synthesis, data) => {
    AppDispatcher.dispatch({
      actionType: CREATE_ELEMENT,
      element: data,
    });
    if (data.parent) {
      data.parent = idOf(data.parent);
    }
    createElementFromData(synthesis, data, 'common.success.create_success', 'common.errors.create_error');
  },

  loadElementFromServer: (synthesis, element) => {
    AppDispatcher.dispatch({
      actionType: RECEIVE_ELEMENT,
      elementId: element,
    });
    fetchElementById(synthesis, element);
  },

  loadElementsFromServer: (synthesis, type, offset, limit) => {
    Fetcher
      .get(`/syntheses/${synthesis}/elements?type=${type}&offset=${offset}&limit=${limit}`)
      .then((data) => {
        data.actionType = RECEIVE_ELEMENTS_SUCCESS;
        data.type = type;
        AppDispatcher.dispatch(data);
        return true;
      });
  },

  loadElementsTreeFromServer: (synthesis, type, parent = null) => {
    AppDispatcher.dispatch({
      actionType: RECEIVE_ELEMENTS,
      type: type + 'Tree',
    });
    let url = `/syntheses/${synthesis}/elements/tree?type=${type}&depth=${NAVBAR_DEPTH}`;
    url += parent ? `&parent=${parent}` : null;
    Fetcher
      .get(url)
      .then((data) => {
        AppDispatcher.dispatch({
          actionType: RECEIVE_ELEMENTS_SUCCESS,
          type: type + 'Tree',
          elements: data,
          parent: parent,
        });
        return true;
      })
      .catch(() => {
        AppDispatcher.dispatch({
          actionType: RECEIVE_ELEMENTS_FAILURE,
          type: type + 'Tree',
        });
      });
  },

  loadElementsCountFromServer: (synthesis, type) => {
    Fetcher
      .get(`/syntheses/${synthesis}/elements/count?type=${type}`)
      .then((data) => {
        AppDispatcher.dispatch({
          actionType: RECEIVE_COUNT,
          type: type,
          count: data.count,
        });
        return true;
      });
  },

  archive: (synthesis, element, data) => {
    AppDispatcher.dispatch({
      actionType: ARCHIVE_ELEMENT,
      archived: data.archived,
      published: data.published,
    });
    if (data.parent) {
      AppDispatcher.dispatch({
        actionType: MOVE_ELEMENT,
        parent: data.parent,
      });
      data.parent = idOf(data.parent);
    }
    if (data.notation) {
      AppDispatcher.dispatch({
        actionType: NOTE_ELEMENT,
        notation: data.notation,
      });
    }
    if (data.title) {
      AppDispatcher.dispatch({
        actionType: NAME_ELEMENT,
        title: data.title,
      });
    }
    if (data.comment) {
      AppDispatcher.dispatch({
        actionType: COMMENT_ELEMENT,
        comment: data.comment,
      });
    }
    if (data.division) {
      data.division.elements.forEach((el, index) => {
        data.division.elements[index].parent = idOf(el.parent);
      });
      AppDispatcher.dispatch({
        actionType: DIVIDE_ELEMENT,
        division: data.division,
      });
    }
    updateElementFromData(synthesis, element, data, 'common.success.archive_success', 'common.errors.archive_error');
  },

  expandNavbarItem(elementId, expanded) {
    AppDispatcher.dispatch({
      actionType: EXPAND_NAVBAR_ITEM,
      elementId: elementId,
      expanded: expanded,
    });
  },

  selectNavbarItem(elementId) {
    AppDispatcher.dispatch({
      actionType: SELECT_NAVBAR_ITEM,
      elementId: elementId,
    });
  },

};
