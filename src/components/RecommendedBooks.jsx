import {Link} from 'react-router-dom';

export function RecommendedBooks ({toTitleCase, recommendedBooks, setIsRecoLoading, isRecoLoading}) { 
    return(
        <section className="container" id="list-container" >
            <h2> The Best Books of the Year</h2>
            <div id="list-books">
            {recommendedBooks && recommendedBooks.length > 0 ? (recommendedBooks.map((item,index) => (
                <Link key={index} className="book-card" to={`/book/${item.id}`}>
                    {isRecoLoading ? (
                        <div className="load">
                           <div className="load-spin"></div>
                        </div>
                    ) : item.volumeInfo?.imageLinks ? (
                        <img 
                            src={item.volumeInfo?.imageLinks?.thumbnail || item.volumeInfo?.imageLinks?.smallThumbnail }
                            alt={toTitleCase((item.volumeInfo.title || "Untitled").trim())}
                            onLoad={() => setIsRecoLoading(false)}
                            onError={() => setIsRecoLoading(false)} 
                        />
                    ) : (
                        <div className="no-image">
                            <p>No image available</p>
                        </div>
                    )}
                    <h4> {toTitleCase(item.volumeInfo?.title || 'Untitled').trim()}</h4>
                </Link>
            ))):
            ("")}
            </div>
        </section>
    );
}