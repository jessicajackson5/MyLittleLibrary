import { useState } from 'react';
import { HiSearch } from 'react-icons/hi';
import { Subjects } from './Subjects.jsx'

export function Header ({subject, changeSearch, changeSubject, toTitleCase, resetState}) { 
    const [prevSearch, setPrevSearch] = useState('');

    const handleLogoClick = () => {
        resetState();
    };
    const handleSearch = () => {
        changeSearch(prevSearch); //Update the parent search state
        changeSubject(''); // Clear subject if search term entered
    };
    const handleFocus = () => {
        setPrevSearch(''); //Clear the input field
    };
    const handleKeyPress = (event) => {
        if (event.key==='Enter') {
            handleSearch();
        }
    };
  
    return(
        <>
            <header id='header' className='container'>
                <div className='left-content'>
                    {/*Logo and title*/}
                    <div className='logo' onClick={handleLogoClick}>
                        <img src='./images/popArtReader.jpg' alt='Site logo is a woman reading a book'/>
                    </div>
                    <h1>MyLittleLibrary</h1>
                </div>
                <div className = 'form-data'>
                    <input
                        type = 'text'
                        id='search-bar'
                        placeholder = 'Search author, title, subject, etc.'
                        className = 'input'
                        value = {prevSearch}
                        onChange={ (e) => setPrevSearch(e.target.value) } // Update local input state
                        onFocus={handleFocus} // Clear field
                        onKeyDown={handleKeyPress} // Trigger search by key press Enter
                    />
                    <button className = 'button' onClick={handleSearch} aria-label = 'Submit Search'><HiSearch /></button>
                </div>

            </header>
            <Subjects subject={subject} changeSubject={changeSubject} toTitleCase={toTitleCase}/>
        </>
    );
}