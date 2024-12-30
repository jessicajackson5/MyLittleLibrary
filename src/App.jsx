import { Routes, Route} from 'react-router-dom';
import { useState, useEffect} from 'react';
import axios from 'axios';

import { Header } from './components/Header';
import { Main } from './components/Main';

const API_KEY = 'AIzaSyDyRTkUq9YuhUSuZsQz77ftIfNLMukP4vc';
const API_URL = 'https://www.googleapis.com/books/v1/volumes';

export default function App() {

  const [search, setSearch] = useState('');
  const [listBooks, setListBooks] = useState([]);

  const changeSearch = (value) => { setSearch(value); }

  useEffect(()=> {
    const fetchData = async () => {
      try {
        const response = await axios.get(API_URL, {
            params: {
                q: search,
                key: API_KEY,
                langRestrict: 'en',
            },
        });
        console.log("API Response:", response.data);
        if(response.data.items && response.data.items.length > 0) {
          const uniqueBooks = removeDuplicateBooks(response.data.items);
          setListBooks(uniqueBooks);
        } else {
          setListBooks([]);
        }
      }catch(error){
        console.log("Error fetching books: "+ error);
        setListBooks([]);
      }
    }
    if(search) {fetchData();}
  }, [search]);

  // Change to Title Case and handle "-", "Mc" "O'" and "Mac" and lowercase articles
  const toTitleCase = (str) => {
    const minorWords = ["a", "an", "the", "and", "but", "or", "for", "nor", "on", "at", "to", "by", "of", "in", "with"];
    const toExclude = ['TV', 'M*A*S*H*', 'M.A.S.H.', 'MASH','"M"', 'HCL','HCl','NASA', 'N.A.S.A', 'FBI', 'F.B.I.'];
  
    // Create a regex pattern from the toExclude list
    const excludePattern = new RegExp(toExclude.join('|'), 'i');

    return str.split(/\s+/).map((word, index, array) =>  {
      
      // Check if the previous word ends with a colon or (
      const isAfterColon = index > 0 && array[index - 1].endsWith(':');

      // Check if word contains a number or *'s and don't change capitalization
      if(/\d/.test(word) || /[*]/.test(word) ) {
        return word;
      } 
    
      // Check if the word matches the exclude pattern
      if(excludePattern.test(word)) {
        return word;
      }

      // Split by hyphen(s)
      const parts = word.split('-');

      // Capitalize sub-strings after processing as lower case
      const capitalizedParts = parts.map((part) => {
        part = part.toLowerCase();
      
        //Handle special cases for "Mc", "Mac", "O'", following a parentehsis and hyphenated names
        if (part.startsWith("mac")) {
          // Capitalize "Mac" and the following letter (e.g., MacDonald)
          return "Mac" + part.charAt(3).toUpperCase() + part.slice(4);
        } else if (part.startsWith("mc")) {
          // Capitalize "Mc" and the following letter (e.g., McMahon)
          return "Mc" + part.charAt(2).toUpperCase() + part.slice(3);
        } else if (part.startsWith("o'")) {
          // Capitalize "O'" and the following letter (e.g., O'Connor)
          return "O'" + part.charAt(2).toUpperCase() + part.slice(3);
        } else if(part.startsWith("(")){
          // Capitalize the first letter after the parenthesis
          return "(" + part.charAt(1).toUpperCase() + part.slice(2);
        } else if (part.includes("'")) {
          // For possessive cases, keep the apostrophe and "s" lowercase (e.g., Mary's)
          let posParts = part.split("'"); 
          posParts[0] = posParts[0].charAt(0).toUpperCase() + posParts[0].slice(1);
          return posParts.join("'"); // Recombine with apostrophe
        }

        // Capitalize the first letter of the word if it's the first word or after a colon
        if(index ===0 || isAfterColon) {
          return part.charAt(0).toUpperCase() + part.slice(1);
        }

        // Check if the word is a minor word
        if (minorWords.includes(part) && index>0) {
          return part.toLowerCase(); // Keep minor words lowercase
        }
        
        // Capitalize normally
        return part.charAt(0).toUpperCase() + part.slice(1);
      });
 
      // Join the capitalized parts back together with hyphens
      return capitalizedParts.join('-');
      
    }).join(' '); // Join the words back together with spaces    
    
  }
  
  const removeDuplicateBooks = (listBooks) => {
    const distinctBooks = new Map();

    listBooks.forEach((book) => {
      const title = toTitleCase(book.volumeInfo?.title || '');
      const hasCover = book.volumeInfo?.imageLinks?.thumbnail;

      // Store book title in TitleCase
      book.volumeInfo.title = title;
      // Store or replace unique books with a cover
      if(!distinctBooks.has(title)){
        //title not already stored
          distinctBooks.set(title, book);
        } else if (hasCover) {
          // Replace with a version that has a cover if available
          distinctBooks.set(title, book);
        }
    });
    return Array.from(distinctBooks.values());
  }
  
  return (
    <>
      <Header changeSearch={changeSearch} />
   
      <Routes>
        <Route index path = "/" element={ 
          <Main listBooks={listBooks} 
                search={search} 
                toTitleCase={toTitleCase} 
                removeDuplicateBooks={removeDuplicateBooks}
                showRandomBook={!search || listBooks.length === 0}/>} />
      </Routes>
    </>
  );
}

