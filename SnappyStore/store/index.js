import { persistStore, persistReducer } from 'redux-persist'
import { createStore, applyMiddleware } from 'redux'
import createSagaMiddleware from 'redux-saga'
import { createLogger } from 'redux-logger'
import { compact } from 'lodash'

import persistConfig from './persistConfig'

export default ({ reducers, sagas, persist }) => {
	const sagaMiddleware = createSagaMiddleware()

	const middlewares = compact([
		sagaMiddleware,
		__DEV__ ? createLogger() : null
	])

	const persistedReducer = persistReducer(persistConfig(persist), reducers)

	const store = createStore(
		persistedReducer,
		applyMiddleware(...middlewares)
	)

	const persistor = persistStore(store)

	sagaMiddleware.run(sagas)

	return { store, persistor }
}
