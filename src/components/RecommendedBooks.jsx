export function RecommendedBooks ({toTitleCase, recommendedBooks, setIsRecoLoading, isRecoLoading}) { 
    return(
        <section className="container" id="list-container" >
            <h2> The Best Books of the Year</h2>
            <div id="list-books">
            {recommendedBooks && recommendedBooks.length > 0 ? (recommendedBooks.map((item,index) => (
                <div key={index} className="book-card">
                    {isRecoLoading ? (
                        <div className="loading-spinner"></div> 
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
                </div>
            ))):
            ("")}
            </div>
        </section>
    );
}