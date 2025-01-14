import { useState } from 'react';
import { HiSearch, HiArrowLeft } from 'react-icons/hi';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import './Header.css';

export function Header ({ changeSearch, resetState }) { 
    const [ prevSearch, setPrevSearch ] = useState('');
    const location = useLocation();
    const navigate = useNavigate();

    const isDetailPage = location.pathname.startsWith('/book/');
    const handleLogoClick = () => {
        resetState();
        setPrevSearch(''); 
    };
    const handleSearch = () => {
        changeSearch( prevSearch ); 
        navigate('/');
    };
    const handleFocus = () => {
        setPrevSearch(''); 
    };
    const handleKeyPress = (event) => {
        if ( event.key === 'Enter' ) {
            handleSearch();
        }
    };
  
    return(
        <>
            <header id = 'header' className = 'container'>
                <div className = 'back-contain'>
                    {isDetailPage && (
                    <button
                            className = 'back-button'
                            onClick={() => navigate(-1)}
                        ><HiArrowLeft /></button>
                    )}
                </div>
                <div className = 'left-content'>
                    <Link to = '/' className = 'logo' onClick = { handleLogoClick } >
                        <img src = '/images/popArtReader.jpg' alt = 'Site logo is a woman reading a book' />
                    </Link>
                    <h1>MyLittleLibrary</h1>
                </div>
                <div className = 'form-data'>
                    <input
                        type = 'text'
                        id = 'search-bar'
                        placeholder = 'Search author, title, subject, etc.'
                        className = 'input'
                        value = { prevSearch }
                        onChange = { (e) => setPrevSearch(e.target.value) } 
                        onFocus = { handleFocus } // Clear search text to prep for new input
                        onKeyDown = { handleKeyPress } // Trigger search by key press Enter
                    />
                    <button className = 'button' onClick = { handleSearch } aria-label = 'Submit Search'><HiSearch /></button>
                </div>

            </header>
        </>
    );
}