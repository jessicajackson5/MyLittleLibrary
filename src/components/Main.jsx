import { RandomBook } from './RandomBook';
import { RecommendedBooks } from './RecommendedBooks';
import { Link} from 'react-router-dom';

export function Main({
    listSearchBooks, 
    search, 
    subject, 
    listSubjectBooks, 
    toTitleCase, 
    recommendedBooks,
    isRecoLoading, 
    setIsRecoLoading, 
    isSearchLoading, 
    isSubLoading, 
  }){
    
    return (
        <>
            {/* Case 1: Show RandomBook & Recommended*/}
            {!search && !subject &&(
                <>
                    <RandomBook toTitleCase={toTitleCase}/>
                    <RecommendedBooks 
                        toTitleCase={toTitleCase} 
                        recommendedBooks={recommendedBooks} 
                        isRecoLoading={isRecoLoading} 
                        setIsRecoLoading={setIsRecoLoading}  
                    />
                </>
            )}
            {/* Case 2: Show books by Subject only*/}
            {search && listSubjectBooks.length > 0 &&(
                <section className = "container" id="list-container">
                    <div className="title-container">
                        <h2>The Best {toTitleCase(subject)} Books</h2>
                    </div>
                    <div id="list-books">
                        {isSubLoading || !listSubjectBooks ? (
                            // Show loading spinner for each book card while loading
                            Array.from({ length: 10 }).map((_, index) => (
                                <div key={index} className="book-card">
                                    <div className="load">
                                        <div className="load-spin"></div>
                                    </div>
                                </div>
                            ))
                        ): listSubjectBooks.length > 0 ? 
                            (listSubjectBooks.map((item,index) => (
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
                                <p>No results. Please enter alternate search term(s).</p>
                              )}
                        </div>
                </section>
            )}
            {/* Case 3: Show Search Results only*/}
            {search && listSearchBooks.length > 0 && (
                <section className = "container" id="list-container">
                    <div className="title-container">
                        <h2>Results for "{search}"</h2>
                    </div>
                    <div id="list-books">
                        {isSearchLoading || !listSearchBooks ? (
                            // Show loading spinner for each book card while loading
                            Array.from({ length: 10 }).map((_, index) => (
                                <div key={index} className="book-card">
                                    <div className="load">
                                        <div className="load-spin"></div>
                                    </div>
                                </div>
                            ))
                        ): listSearchBooks.length > 0 ? 
                            (listSearchBooks.map((item,index) => (
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
                                <p>No results. Please enter alternate search term(s).</p>
                              )}
                    </div>
                </section>
            )}
            
        </>
    );
}