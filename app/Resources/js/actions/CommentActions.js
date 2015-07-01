'use strict';

import AppDispatcher from '../dispatchers/AppDispatcher';
import Fetcher from '../services/Fetcher';
import {CREATE_COMMENT, RECEIVE_COMMENTS} from '../constants/CommentConstants';

export default {

  create: (uri, object, data) => {

    Fetcher
    .post('/' + uri + '/' + object + '/comments', data)
    .then(() => {
      AppDispatcher.dispatch({
        actionType: CREATE_COMMENT
      });
      return true;
    });

  },

  loadFromServer: (uri, object, offset, limit, filter) => {

    Fetcher
    .get('/' + uri + '/' + object +
         '/comments?offset=' + offset +
         '&limit=' + limit +
         '&filter=' + filter
    )
    .then((data) => {
        AppDispatcher.dispatch({
          actionType: RECEIVE_COMMENTS,
          'comments_total': data.total_count,
          'comments': data.comments,
        });
        return true;
    });

  }



}
