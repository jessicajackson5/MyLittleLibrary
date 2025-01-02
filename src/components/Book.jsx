import {useParams} from 'react-router-dom';

export function Book(){
    const {id} = useParams();
    return(
        <p>test page id: {id}</p>
    );
}