// Component declaration
import { SearchPage } from "components/search-page";
import { mapStateToProps, mapDispatchToProps } from "containers/search/selectors";
import { connect } from "react-redux";

export const SearchContainer = connect(mapStateToProps, mapDispatchToProps)(SearchPage);
export default SearchContainer; 