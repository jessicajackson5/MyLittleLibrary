export function RecommendedBooks ({toTitleCase, recommendedBooks}) { 
    return(
        <section className="container" id="list-container" >
            <h2> The Best Books of the Year</h2>
            <div id="list-books">
            {recommendedBooks && recommendedBooks.length > 0 ? (recommendedBooks.map((item,index) => (
                <div key={index} className="book-card">
                    <img src={item.volumeInfo?.imageLinks?.thumbnail 
                        || item.volumeInfo?.imageLinks?.smallThumbnail 
} 
                        alt={toTitleCase(item.volumeInfo.title || "Untitled")}
                    />
                    <h4> {toTitleCase(item.volumeInfo?.title.trim() || 'Untitled')}</h4>
                </div>
            ))):
            ("")}
            </div>
        </section>
    );
}