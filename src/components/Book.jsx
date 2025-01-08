import { useEffect,useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';


export function Book({toTitleCase}){
    const {id} = useParams();
    const API_URL = "https://www.googleapis.com/books/v1/volumes/";
    const [oneBook, setOneBook] = useState(null);
    const [oneDescription, setOneDescription] = useState(null);
    const [oneTitle, setOneTitle] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
   
    useEffect(() => {
        const getBookDetail = async () => {
            setIsLoading(true); // Show spinner before fetch
            try{
                const response = await axios.get(`${API_URL}${id}`);
                const data = response.data;
                setOneBook(data);

                // Shorten overly long title
                const bookTitle = data.volumeInfo?.title || '';
                setOneTitle(
                    bookTitle.slice(0, 80) + 
                    (bookTitle.length > 80 ? '...' : '')
                );

                // Shorten overly long descriptions
                const bookDescription = data.volumeInfo?.description || '';
                setOneDescription(
                    bookDescription.slice(0, 650) + 
                    (bookDescription.length > 650 ? '...' : '')
                );

            }catch(error) {
                console.error('Error fetching book details:', error);
                setOneBook(null);
                setOneDescription('Failed to fetch book data.');
            }finally{
                setIsLoading(false);
            }
        };
        getBookDetail();
    },[id]);

    return(
        <div className="container one-book">
            <div className = {`book-image ${isLoading ? 'loading' : ''}`}>
               {isLoading ? (
                   <div className="loading-spinner"></div> 
                ) : oneBook && oneBook.volumeInfo?.imageLinks ? (
                    <img 
                    src={oneBook.volumeInfo?.imageLinks?.thumbnail || bookDetail.volumeInfo?.imageLinks?.smallThumbnail} 
                    alt={oneTitle} 
                    onLoad={() => setIsLoading(false)}
                    onError={() => setIsLoading(false)} 
                    />
                ) : (
                <p>No image available</p>
                )}
            </div>
            <div className = 'book-info'>
                {isLoading? (
                <p>Loading book details...</p>
                ) : (
                <>
                    <h3>{oneTitle || 'Untitled'}</h3>
                    <p>by {Array.isArray(oneBook.volumeInfo?.authors) && 
                        oneBook.volumeInfo.authors.length > 0
                        ? toTitleCase(oneBook.volumeInfo.authors.join(', '))
                        : 'Unknown Author'}
                    </p>
                    <p>Publisher : {oneBook.volumeInfo?.publisher || 'Unknown Publisher'}</p>
                    <p>Publication Date: {oneBook.volumeInfo?.publishedDate || 'Publication Date Unknown'}</p>
                    <p>ISBN-13: {oneBook.volumeInfo?.industryIdentifiers?.find(
                        (identifier) => identifier.type === 'ISBN_13'
                        )?.identifier || 'ISBN-13 Not Found'}
                    </p>
                    <br />
                    <p>{oneDescription}</p>
                </>
                )}
            </div>
        </div>
    );
}
// Cuando cargo los detalles de un libro, no detecta cambios en el header como search o click en subject
// Quiero agregar mas libros en scroll
