import {useState} from 'react';
import {HiSearch} from 'react-icons/hi';

export function Header ({ changeSearch }) { 
    const [prevSearch, setPrevSearch] = useState('');

    const handleSearch = () => {
        changeSearch(prevSearch); //Update the parent search state
    };
    const handleFocus = () => {
        setPrevSearch(''); //Clear input field
    }

    return(
        <div className = "form-data">
            <input
                type = "text"
                placeholder = "Search author, title, subject, etc."
                value = {prevSearch}
                onChange={ (e) => setPrevSearch(e.target.value) } // Update local input state
                onFocus={handleFocus} // Clear field
            />
            <button onClick={handleSearch}><HiSearch /> Search </button>
        </div>
    );
}