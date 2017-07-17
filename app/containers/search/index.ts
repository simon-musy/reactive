// Component declaration
import { SearchPage } from "components/search-page";
import { mapStateToProps, mapDispatchToProps } from "containers/search/selector";
import { connect } from "react-redux";

export const SearchContainer = connect(mapStateToProps, mapDispatchToProps)(SearchPage);
export default SearchContainer; 