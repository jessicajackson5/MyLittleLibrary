import {useState, useEffect} from 'react';
import axios from 'axios';

export function RandomBook ({toTitleCase}) { 
    const [book, setBook] = useState(null);
    const [description, setDescription] = useState(null);
   
    const[isLoading,setIsLoading] = useState(true);

    const API_KEY = 'AIzaSyDyRTkUq9YuhUSuZsQz77ftIfNLMukP4vc';
    const API_URL = 'https://www.googleapis.com/books/v1/volumes';
    const WORD_URL = 'https://random-word-api.vercel.app/api?words=1';


    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const randomWord = await axios.get(WORD_URL);
            
            const response = await axios.get(API_URL, {
                params: {
                    q: randomWord.data[0],
                    key: API_KEY,
                    langRestrict: 'en',
                    maxResults: 1
                },
            });
                if (response.data.items && response.data.items.length > 0) {
                    const fetchedBook = response.data.items[0];
                    setBook(fetchedBook);
    
                    // Process overly long descriptions
                    const bookDescription = fetchedBook.volumeInfo?.description || '';
                    setDescription(
                        bookDescription.slice(0, 800) + 
                        (bookDescription.length > 800 ? '...' : '')
                    );
                } else {
                    setBook(null);
                    setDescription('');
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
        { book && 
            <article className = 'container'>
                <div className = 'book-generator'>
                    <h2>Book of the day</h2>
                    <button className = 'again' onClick = { () =>fetchData() }><img src = './images/againIcon.png' alt='Load another random book' />
                    </button>
                </div>
                <div className = 'book-detail'>
                    <div className = {`book-image ${isLoading ? 'loading' : ''}`}>
                        {isLoading ? (
                            <div className="loading-spinner"></div> 
                        ) : book && book.volumeInfo?.imageLinks ? (
                            <img 
                                src={book.volumeInfo?.imageLinks?.thumbnail || book.volumeInfo?.imageLinks?.smallThumbnail} 
                                alt={toTitleCase((book.volumeInfo?.title || 'Untitled').trim())} 
                                onLoad={() => setIsLoading(false)}
                            />
                        ) : (
                            <p>No image available</p>
                        )}
                    </div>
                    <div className = 'book-info'>
                        <h3>{toTitleCase(book.volumeInfo?.title || 'Untitled').trim()}</h3>
                        <p>by {Array.isArray(book.volumeInfo?.authors) && book.volumeInfo.authors.length > 0
                            ? toTitleCase(book.volumeInfo.authors.join(', '))
                            : 'Unknown Author'}
                        </p>
                        <p>{description}</p>
                    </div>
                </div>
            </article>
        }
        </>
    );
}