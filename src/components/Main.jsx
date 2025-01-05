import { RandomBook } from './RandomBook';
import { RecommendedBooks } from './RecommendedBooks';
import { Link} from 'react-router-dom';

export function Main({listSearchBooks, search, subject, listSubjectBooks, toTitleCase, recommendedBooks }){
    
    return (
        <>
            {/* Case 1: Show RandomBook & Recommended*/}
            {!search && !subject &&(
                <>
                    <RandomBook toTitleCase={toTitleCase}/>
                    <RecommendedBooks toTitleCase={toTitleCase} recommendedBooks={recommendedBooks} />
                </>
            )}
            {/* Case 2: Show Search Results only*/}
            {search && listSearchBooks.length > 0 && (
                <section className = "container" id="list-container">
                    <h2>Books about "{search}"</h2>
                    <div id = "list-books">
                        {listSearchBooks && listSearchBooks.length > 0 ? 
                            (listSearchBooks.map((item,index) => (
                                <Link key={index} className="book-card" to={`/book/id:${item.id}`}>
                                    <img src={
                                        item.volumeInfo?.imageLinks?.thumbnail ||
                                        item.volumeInfo?.imageLinks?.smallThumbnail 
                                    } 
                                    alt={toTitleCase(item.volumeInfo?.title.trim() || 'Untitled')}
                                />
                                <h4> {toTitleCase(item.volumeInfo?.title.trim() || 'Untitled')}</h4>
                                </Link>
                            ))):(
                                <p>No results. Please enter alternate search term(s).</p>
                            )}
                    </div>
                </section>
            )}
            {/* Case 3: Show books by Subject only*/}
            {subject && (
                <section className = "container" id="list-container">
                    <h2>The Best {toTitleCase(subject)} Books</h2>
                    <div id = "list-books">
                    {listSubjectBooks && listSubjectBooks.length > 0 ? (listSubjectBooks.map((item,index) => (
                        <div key={index} className="book-card">
                        <img src={ item.volumeInfo?.imageLinks?.thumbnail 
                                || item.volumeInfo?.imageLinks?.smallThumbnaill 
                                } 
                             alt={toTitleCase(item.volumeInfo.title || "Untitled")}
                        />
                        <h4> {toTitleCase(item.volumeInfo?.title.trim() || 'Untitled')}</h4>
                        </div>
                    ))):(
                        <p>No results. Please select another subject.</p>
                    )
                    }
                    </div>
                </section>
            )}
        </>
    );
}