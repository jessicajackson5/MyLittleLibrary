import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './RandomBook.css';

export function RandomBook ({toTitleCase}) { 
    const [book, setBook] = useState(null);
    const [description, setDescription] = useState(null);
    const [title, setTitle] = useState(null);
    const [isLoading,setIsLoading] = useState(true);

    const API_KEY = 'AIzaSyDyRTkUq9YuhUSuZsQz77ftIfNLMukP4vc';
    const API_URL = 'https://www.googleapis.com/books/v1/volumes';
    const WORD_URL = 'https://random-word-api.vercel.app/api?words=1';


    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setIsLoading(true); // Show spinner before fetch
        try {
            const randomWord = await axios.get(WORD_URL);
            const randQuery = `subject:fiction ${randomWord.data[0]}`;
            
            const response = await axios.get(API_URL, {
                params: {
                    q: randQuery,                    
                    key: API_KEY,
                    langRestrict: 'en',
                    maxResults: 1
                },
            });
                if (response.data.items && response.data.items.length > 0) {
                    const fetchedBook = response.data.items[0];
                    setBook(fetchedBook);

                    // Shorten overly long title
                    const bookTitle = fetchedBook.volumeInfo?.title || '';
                    setTitle(
                        bookTitle.slice(0, 80) + 
                        (bookTitle.length > 80 ? '...' : '')
                    );
    
                    // Shorten overly long descriptions
                    const bookDescription = fetchedBook.volumeInfo?.description || '';
                    setDescription(
                        bookDescription.slice(0, 650) + 
                        (bookDescription.length > 650 ? '...' : '')
                    );
                } else {
                    setBook(null);
                    setTitle('');
                    setDescription('No book data available');
                }
        } catch (error) {
            console.error("Error Message: " + error);
            setBook(null);
            setDescription('Failed to fetch book data.');
        } finally {
            setIsLoading(false);
        }
    };

    return(
        <>
        { <article className = 'container'>
            <div className = 'book-generator'>
                <h2>Book of the day</h2>
                <button className = 'again' onClick = { () => fetchData() }>
                <img src = './images/againIcon.png' 
                alt = 'Load another random book' />
                </button>
            </div>
            {isLoading ? (
                 <div className = 'loading-section'>
                    <div className = 'book-image loading'>
                        <div className = 'loading-spinner'></div>
                    </div>
                    <div className = 'loading-info'>
                        <p>Loading book details...</p>
                    </div>            
                </div>
            ) : book ? (
                <Link className = 'book-detail' to = { `/book/${book.id}` }>
                    <div className = 'book-image'>
                        {book.volumeInfo?.imageLinks ? (
                            <img 
                                src={book.volumeInfo?.imageLinks?.thumbnail || book.volumeInfo?.imageLinks?.smallThumbnail} 
                                alt={toTitleCase((book.volumeInfo?.title || 'Untitled').trim())} 
                            />
                        ) : (
                            <div className = 'img-not-available'>
                                <p>No image available</p>
                            </div>
                        )}
                    </div>
                    <div className = 'book-info'>
                        <h3>{ title || 'Untitled' }</h3>
                        <p>by { Array.isArray(book.volumeInfo?.authors) && 
                            book.volumeInfo.authors.length > 0
                            ? toTitleCase(book.volumeInfo.authors.join(', '))
                            : 'Unknown Author' }
                        </p>
                        <p>{ description }</p>
                    </div>
                </Link>
               ) : (
                <div className = 'book-info'>
                    <p>No book data vailable.</p>
                </div>
            )}
        </article>
        }
        </>
    );
}