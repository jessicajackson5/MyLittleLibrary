import {useEffect,useState} from 'react';
import {useParams, Link} from 'react-router-dom';
import axios from 'axios';

export function Book(){
    const {id} = useParams();
    const API_URL = "https://www.googleapis.com/books/v1/volumes/";
    const [bookDetail, setBookDetail] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
   
    useEffect(() => {
        const getBookDetail = async () => {
            setIsLoading(true); // Show spinner before fetch
            try{
                const response = await axios.get(`${API_URL}${id}`);
                setBookDetail(response.data);
            }catch(error) {
                console.error('Error fectching book details:', error);
            }finally{
                setIsLoading(false);
            }
        };
        getBookDetail();
    },[id]);

    return(
        <div className="container one-book">
            {isLoading ? (
                <p> Loading book details...</p>
            ) : bookDetail ? (
                <div className="item">
                    <h2 className="title">{bookDetail.volumeInfo?.title}</h2>
                </div>
            ): (
                <p>Book not found</p>
            )}
        </div>
    );
}