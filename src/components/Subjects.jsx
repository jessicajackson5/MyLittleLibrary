import './Subjects.css';
import { useNavigate } from 'react-router-dom';

export function Subjects ({ subject, changeSubject }) {
    const navigate = useNavigate();
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

    const handleSubject = ( subject ) => {
        changeSubject(subject);
        navigate('/');
    };

    return(
        <section id = 'book-nav' className = "container">
            {bookSubjects.map(( item, index ) => (
                 <div 
                    key = { index }
                    className = { `book ${subject === item ? 'subj-active' : ''}` }
                    onClick = { ()=> handleSubject(item) }
                    aria-label = { `Display ${item} books` }
                >
                <span>{item}</span>                   
                </div>
            ))}
        </section>
    );
}