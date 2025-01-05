import {useState, useEffect} from 'react';

export function Subjects ({subject, changeSubject}) {
    const [activeSubj, setActiveSubj] = useState(null);
    console.log('Initial Render - subject fprop:', subject, 'activeSubj state:', activeSubj);

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
        'Young Adults',
        'Kids'
    ];
    useEffect(() => {
        console.log('Prop subject changed:', subject);
        setActiveSubj(subject); // Sync activeSubj with the subject prop
    }, [subject]);

    const handleSubject = (subject) => {
        console.log('Subject clicked:', subject);
        changeSubject(subject);
        setActiveSubj(subject);
    };

    return(
        <section id='book-nav' className="container">
            {bookSubjects.map((item,index) => (
                    <div 
                        key = {index}
                        className={`book ${activeSubj === item ? 'subj-active' : ''}`}
                        onClick={()=>handleSubject(item)} 
                        aria-label ={`Display ${item} books`}
                    >
                    <span>{item}</span>
                    </div>
            ))}
        </section>
    );
}