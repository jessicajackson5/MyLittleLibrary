// import { Subjects } from './Subjects';
// import { BookList } from './BookList';
import { RandomBook } from './RandomBook';


export function Main({listBooks, toTitleCase, showRandomBook }){
    
    return (
        <>
            {showRandomBook && <RandomBook toTitleCase={toTitleCase}/>}
            <div className = "listBooks">
            {listBooks ? (listBooks.map((item,index) => (
                <div key={index} className="book-card">
                    <img src={item.volumeInfo?.imageLinks?.thumbnail || item.volumeInfo?.imageLinks?.smallThumbnail || "https://via.placeholder.com/150"} alt={toTitleCase(item.volumeInfo.title || "Untitled")}/>
                    <h2> {item.volumeInfo.title}</h2>
                </div>
            ))): 
                (<p>No results. Please enter alternate search term(s).</p>) 
            }
            </div>
        </>
    );
}