import {useParams, Link} from 'react-router-dom';

export function Book(){
    const {id} = useParams();
    console.log(id);
    return(
        <div className="book">
    );
}