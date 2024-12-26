import {useState} from 'react';
import {HiSearch} from 'react-icons/hi';

export function Header ({ changeSearch }) { 
    const [prevSearch, setPrevSearch] = useState('');

    return(
        <div className = "form-data">
            <input
                type = "text"
                placeholder = "Search author, title, subject, etc."
                value = {prevSearch}
                onChange={ (e) => setPrevSearch(e.target.value) }
            />
            <button onClick={ () => changeSearch(prevSearch) }><HiSearch /> Search </button>
        </div>
    );
}