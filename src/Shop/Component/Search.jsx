import React, { useCallback, useState } from 'react';
import PropTypes from 'prop-types';

Search.propTypes = {
    handler_Search: PropTypes.func
};

Search.defaultProps = {
    handler_Search: null
}

function Search(props) {

    const { handler_Search } = props

    const [search, set_search] = useState('')

    const onChangeText = (e) => {

        let value = e.target.value;
        set_search(value)
        
        if (!handler_Search){
            return
        }
        
        
    }
    
    const onClick = useCallback( () => {
        console.log("search:", search)
        handler_Search(search)

    }, [search])

    return (
        <form action="#">
            <input type="text" className="li-search-field" placeholder="search here" value={search} onChange={onChangeText} />
            <button type="submit" className="li-search-btn"  onClick={onClick}><i className="fa fa-search"></i></button>
        </form>
    );
}

export default Search;