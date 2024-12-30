import {useState, useEffect} from 'react';
import axios from 'axios';

export function RandomBook ({toTitleCase}) { 
    const [book, setBook] = useState(null);
   
    const API_KEY = 'AIzaSyDyRTkUq9YuhUSuZsQz77ftIfNLMukP4vc';
    const API_URL = 'https://www.googleapis.com/books/v1/volumes';
    const WORD_URL = 'https://random-word-api.vercel.app/api?words=1';


    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try{
            const randomWord = await axios.get(WORD_URL);

            try{
                const response = await axios.get(API_URL, {
                    params: {
                        q: randomWord.data[0],
                        key: API_KEY,
                        langRestrict: 'en',
                        projection: 'full',
                        maxResults: 1
                    },
                });
                if(response.data.items && response.data.items.length>0){
                    setBook(response.data.items[0]);
                } else {
                    setListBooks([]);
                }
            }catch (error) {console.error("Error Message: " + error);}
        } catch(error) {console.error("Error Message: " + error); } 
    };

    return(
        <>
        { book && 
            <article className = 'book-detail'>
                <h2>{toTitleCase(book.volumeInfo?.title || 'Untitled')}</h2>
                <img src= { book.volumeInfo?.imageLinks?.thumbnail || 
                            book.volumeInfo?.imageLinks?.smallThumbnail || 
                            'https://via.placeholder.com/150'} 
                     alt={toTitleCase(book.title || 'Untitled')}
                />
                <p>by {book.volumeInfo?.authors?.join(', ') || 'Unknown Author'}</p>
                <p>{book.volumeInfo?.description || ''}</p>
            </article>
        }
        <button onClick = { () =>fetchData() }>See another book</button>
        </>
    );
}