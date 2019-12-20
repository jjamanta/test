import { combineReducers } from 'redux';

import auth from '~/store/modules/auth/reducer';
import user from '~/store/modules/user/reducer';

export default combineReducers({
  auth,
  user,
});
