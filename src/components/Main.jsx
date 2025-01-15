import { RandomBook } from './RandomBook';
import { Subjects } from './Subjects.jsx';
import { Link } from 'react-router-dom';


export function Main({
    currentList,
    isLoading,
    search, 
    subject,
    changeSubject, 
    toTitleCase, 
  }){
    
    let title = "";
    let errorMessage = "No results. Please enter an alternate search term or select a different subject.";

    if (subject) {
        title = `The Best ${toTitleCase(subject)} Books`;
        errorMessage = 'No results. Please enter select another subject.';
    } else if (search) {
        title = `Results for "${search}"`;
        errorMessage = 'No results. Please enter alternate search term(s).';
    } else { 
        title = 'The Best Books of the Year';
        errorMessage = 'No results. Please enter select a subject or search term(s).';
    }
    
    return (
        <>
            <Subjects subject = {subject} changeSubject = {changeSubject}/>
            {/* Show RandomBook */}
            {!search && !subject &&(
                <>
                    <RandomBook toTitleCase = {toTitleCase}/>
                </>
            )}
            {/* Show books */}
            <section className = "container" id = "list-container">
                <div className = "title-container">
                    <h2>{title}</h2>
                </div>
                <div id="list-books">
                    {isLoading || !currentList.length ? (
                        // Show loading spinner for each book card while loading
                        Array.from({ length: 10 }).map((_, index) => (
                            <div key = {index} className="book-card">
                                <div className="load">
                                    <div className="load-spin"></div>
                                </div>
                            </div>
                        ))
                    ): currentList.length > 0 ? 
                        (currentList.map((item,index) => (
                            <Link key={index} className="book-card" to={`/book/${item.id}`}>
                                {item.volumeInfo?.imageLinks ? (
                                    <img 
                                        src={ item.volumeInfo?.imageLinks?.thumbnail || item.volumeInfo?.imageLinks?.smallThumbnail} 
                                        alt={toTitleCase(item.volumeInfo?.title.trim() || 'Untitled')}
                                    />
                                ) : (
                                    <div className="no-image">
                                        <p>No image available</p>
                                    </div>
                                    )}
                                    <h4> {toTitleCase(item.volumeInfo?.title.trim() || 'Untitled')}</h4>
                            </Link>
                        ))): (
                            <p>{errorMessage}</p>
                    )}
                </div>
            </section>
        </>
    );
}
