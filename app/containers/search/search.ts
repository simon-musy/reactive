// Component declaration
import { SearchInput } from "components/search-input";
import { mapStateToProps, mapDispatchToProps } from "containers/search/selectors";
import { connect } from "react-redux";

export const SearchContainer = connect(mapStateToProps, mapDispatchToProps)(SearchInput);
export default SearchContainer; 