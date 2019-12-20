import { persistStore } from 'redux-persist';
import createSagaMiddleware from 'redux-saga';

import createStore from '~/store/createStore';
import persistReducers from '~/store/persistReducers';

import rootReducer from '~/store/modules/rootReducer';
import rootSaga from '~/store/modules/rootSaga';

const sagaMonitor = __DEV__ ? console.tron.createSagaMonitor() : null;

const sagaMiddleware = createSagaMiddleware({ sagaMonitor });

const middlewares = [sagaMiddleware];

const store = createStore(persistReducers(rootReducer), middlewares);
const persistor = persistStore(store);

sagaMiddleware.run(rootSaga);

export { store, persistor };
