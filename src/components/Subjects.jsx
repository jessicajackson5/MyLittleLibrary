export function Subjects ({subject, changeSubject, toTitleCase}) {
    const bookSubjects = [
        'Romance',
        'Nonfiction',
        'Science Fiction',
        'Thriller',
        'Magical Realism',
        'Fantasy',
        'Horror',
        'Dystopian',
        'Realist',
        'Adventure',
        'Graphic Novel',
        'Poetry',
        'Mystery',
        'Young Adult'
    ];
    const handleSubject = (subject) => {
        changeSubject(subject);
    };

    return(
        <section id='book-nav' className="container">
            {bookSubjects.map((item,index) => (
                    <div 
                        key = {index}
                        className = 'book'
                        onClick={()=>handleSubject(item)} 
                        aria-label ={`Find ${item} books`}
                    >
                    <span>{item}</span>
                    </div>
            ))}
            {/*<div className = 'book'><span>{bookGenre[1]}</span></div>*/}
        </section>
    );
}