import { Subjects } from './Subjects';
import { BookList } from './BookList';
import { RandomBook } from './RandomBook';

export function Main({listBooks, toTitleCase}){
    const IMG_URL = 'https://covers.openlibrary.org/b/id/';
    return (
        <>
        <RandomBook toTitleCase={toTitleCase}/>
            <div className = "listBooks">
            {listBooks ? (listBooks.map((item,index) => (
                <div key={index} className="book-card">
                    <img src={IMG_URL + item.cover_i + "-M.jpg"} alt={item.title}/>
                    <h2> {item.title}</h2>
                </div>
            ))): // make sure the below error message goes away with results
                (<p>No books found.</p>) 
            }
            </div>
        </>
    );
}