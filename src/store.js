
import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import thunk from 'redux-thunk'; // Import Redux Thunk middleware
import userReducer from './features/userslice';
import taskReducer from './features/taskslice';
import projectReducer from './features/projectslice';
import taskhistoryslice from './features/taskhistoryslice';
import contactReducer from './features/contactslice';
import invoiceReducer from './features/invoiceSlice';
import billReducer from './features/billslice'
import consolidatedReducer from './features/consolidatedSlice';
import questionReducer from './features/questionslice';
import correspondenceReducer from './features/correspondenceSlice';

const store = configureStore({
  reducer: {
    users: userReducer,
    task: taskReducer,
    taskhistoryslice:taskhistoryslice,
    project:projectReducer,
    contact:contactReducer,
    invoice:invoiceReducer,
    bill:billReducer,
    consolidatedSlice:consolidatedReducer,
    questionSlice:questionReducer,
    correspondence:correspondenceReducer

  },
});


export default store;

