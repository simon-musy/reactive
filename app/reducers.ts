import * as Redux from "redux";
import { searchReducer} from "containers/search/reducers";
export const rootReducer =  Redux.combineReducers({search: searchReducer})