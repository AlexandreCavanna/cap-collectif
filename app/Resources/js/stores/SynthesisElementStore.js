import {RECEIVE_COUNT, RECEIVE_ELEMENTS, RECEIVE_ELEMENT, EXPAND_NAVBAR_ITEM, SELECT_NAVBAR_ITEM, CREATE_ELEMENT, ARCHIVE_ELEMENT, NOTE_ELEMENT, COMMENT_ELEMENT, MOVE_ELEMENT, DIVIDE_ELEMENT, UPDATE_ELEMENT_SUCCESS, UPDATE_ELEMENT_FAILURE, CREATE_ELEMENT_SUCCESS, CREATE_ELEMENT_FAILURE} from '../constants/SynthesisElementConstants';
import BaseStore from './BaseStore';
import ArrayHelper from '../services/ArrayHelper';

class SynthesisElementStore extends BaseStore {

  constructor() {
    super();
    this.register(this._registerToActions.bind(this));
    this._element = null;
    this._elements = {
      'new': [],
      'archived': [],
      'published': [],
      'unpublished': [],
      'all': [],
      'publishedTree': [],
      'allTree': [],
      'fromDivision': [],
    };
    this._counts = {
      'new': 0,
      'archived': 0,
      'published': 0,
      'unpublished': 0,
      'all': 0,
      'publishedTree': 0,
      'allTree': 0,
      'fromDivision': 0,
    };
    this._expandedNavbarItems = {
      root: true,
    };
    this._selectedNavbarItem = 'root';
    this._isProcessing = false;
    this._isElementSync = false;
    this._isCountSync = false;
    this._isInboxSync = {
      'new': false,
      'archived': false,
      'published': false,
      'unpublished': false,
      'all': false,
      'publishedTree': false,
      'allTree': false,
      'fromDivision': false,
    };
    this._messages = {
      errors: [],
      success: [],
    };
  }

  _registerToActions(action) {
    switch (action.actionType) {
      case RECEIVE_COUNT:
        this._counts[action.type] = action.count;
        this._isCountSync = true;
        this.emitChange();
        break;
      case RECEIVE_ELEMENT:
        this._element = action.element;
        this._isElementSync = true;
        this.updateSelectedId(action.element.id);
        this.emitChange();
        break;
      case RECEIVE_ELEMENTS:
        this._elements[action.type] = action.elements;
        this._isInboxSync[action.type] = true;
        this._counts[action.type] = action.count;
        this.emitChange();
        break;
      case EXPAND_NAVBAR_ITEM:
        this._expandedNavbarItems[action.elementId] = action.expanded;
        this.emitChange();
        break;
      case SELECT_NAVBAR_ITEM:
        this.updateSelectedId(action.elementId);
        this.emitChange();
        break;
      case CREATE_ELEMENT:
        this._resetInboxSync();
        this._isProcessing = true;
        this._resetMessages();
        this.emitChange();
        break;
      case ARCHIVE_ELEMENT:
        this._resetMessages();
        // Update data
        // If we ignored an element, lists are not synced anymore
        if (!action.published) {
          this._isProcessing = true;
          this._resetInboxSync();
        } else {
          this._elements.new = ArrayHelper.removeElementFromArray(this._elements.new, this._element);
          this._counts['new'] = this._elements.new.length;
          this.elements.archived = ArrayHelper.addElementToArray(this._elements.archived, this._element);
          this._elements.published = ArrayHelper.addElementToArray(this._elements.published, this._element);
          this._elements.unpublished = ArrayHelper.removeElementFromArray(this._elements.unpublished, this._element);
        }
        // Apply changes to element
        this._element.archived = action.archived;
        this._element.published = action.published;
        this.emitChange();
        break;
      case NOTE_ELEMENT:
        this._element.notation = action.notation;
        this._resetInboxSync();
        this._isProcessing = true;
        this._resetMessages();
        this.emitChange();
        break;
      case COMMENT_ELEMENT:
        this._element.comment = action.comment;
        this._resetInboxSync();
        this._isProcessing = true;
        this._resetMessages();
        this.emitChange();
        break;
      case MOVE_ELEMENT:
        this._element.parent = action.parent;
        this._resetInboxSync();
        this._isProcessing = true;
        this._resetMessages();
        this.emitChange();
        break;
      case DIVIDE_ELEMENT:
        this._element.division = action.division;
        this._resetInboxSync();
        this._isProcessing = true;
        this._resetMessages();
        this.emitChange();
        break;
      case UPDATE_ELEMENT_SUCCESS:
        this._resetMessages();
        this._messages.success.push(action.message);
        this._isProcessing = false;
        this.emitChange();
        break;
      case UPDATE_ELEMENT_FAILURE:
        this._messages.errors.push(action.message);
        this._messages.success = [];
        this._isProcessing = false;
        this._isElementSync = false;
        this._resetInboxSync();
        this.emitChange();
        break;
      case CREATE_ELEMENT_SUCCESS:
        this._resetMessages();
        this._messages.success.push(action.message);
        this._isProcessing = false;
        this.emitChange();
        break;
      case CREATE_ELEMENT_FAILURE:
        this._messages.errors.push(action.message);
        this._messages.success = [];
        this._isProcessing = false;
        this._isElementSync = false;
        this._resetInboxSync();
        this.emitChange();
        break;
      default: break;
    }
  }

  get isProcessing() {
    return this._isProcessing;
  }

  get isElementSync() {
    return this._isElementSync;
  }

  get isCountSync() {
    return this._isCountSync;
  }

  get isInboxSync() {
    return this._isInboxSync;
  }

  get element() {
    return this._element;
  }

  get elements() {
    return this._elements;
  }

  get expandedNavbarItems() {
    return this._expandedNavbarItems;
  }

  get selectedNavbarItem() {
    return this._selectedNavbarItem;
  }

  get counts() {
    return this._counts;
  }

  get messages() {
    return this._messages;
  }

  _resetMessages() {
    this._messages.errors = [];
    this._messages.success = [];
  }

  _resetInboxSync() {
    this._isInboxSync.new = false;
    this._isInboxSync.archived = false;
    this._isInboxSync.published = false;
    this._isInboxSync.unpublished = false;
    this._isInboxSync.publishedTree = false;
    this._isInboxSync.allTree = false;
    this._isInboxSync.fromDivision = false;
    this._isCountSync = false;
  }

  updateSelectedId(selected) {
    this._selectedNavbarItem = selected;
    const expanded = this._expandedNavbarItems;
    expanded[selected] = true;
    const element = this.getElementInTreeById(this._elements.allTree, selected);
    if (element) {
      element.parents_ids.map((id) => {
        expanded[id] = true;
      });
    }
    this._expandedNavbarItems = expanded;
  }

  getElementInTreeById(elements, id) {
    for (let i = 0; i < elements.length; i++) {
      const element = elements[i];
      if (element.id === id) {
        return element;
      }
      if (element.children.length > 0) {
        const found = this.getElementInTreeById(element.children, id);
        if (found) {
          return found;
        }
      }
    }
    return null;
  }

}

export default new SynthesisElementStore();
