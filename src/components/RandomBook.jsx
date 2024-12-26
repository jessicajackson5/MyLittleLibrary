import {useState, useEffect} from 'react';
export function RandomBook ({toTitleCase}) { 
    const [book, setBook] = useState({});
    let setOffset = 333;
    const API_URL = 'https://openlibrary.org/search.json?q=subject_key%3Afiction+language%3Aeng+isbn%3A*+publish_year%3A*+-publisher%3A%22Independently+published%22&mode=everything&editions.sort=new&limit=1&offset=';
    const IMG_URL = 'https://covers.openlibrary.org/b/id/';

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try{
            setOffset = randomInteger(0,800);
            console.log("Offset:" + setOffset);
            const response = await fetch(API_URL + setOffset);
            const data = await response.json();
            setBook(data.docs[0]);
        }catch (error) {console.log("Error Message: " + error);}
    };   

    const randomInteger = (min, max) => {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    };

    return(
        <>
        { book && 
            <article className = "book-detail">
                <img src={IMG_URL + book.cover_i + "-M.jpg"} alt={toTitleCase(book.title || "Untitled")}/>
                <h2>{toTitleCase(book.title || "Untitled")}</h2>
                <p>by {book.author_name}</p>
                <p>First published in {book.first_publish_year}, {book.edition_count} editions</p>
            </article>
        }
        <button onClick = { () =>fetchData() }>See another book</button>
        </>
    );
}