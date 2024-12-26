import { Routes, Route, Link } from 'react-router-dom';
import { useState, useEffect} from 'react';

import { Header } from './components/Header';
import { Main } from './components/Main';

export default function App() {

  const [search, setSearch] = useState('');
  const [listBooks, setListBooks] = useState([]);

  // sort by readinglog to get trending version
  const API_URL = 'https://openlibrary.org/search.json?q=' + search + '&limit=10&offset=0';
 

  const changeSearch = (value) => { setSearch(value); }

  useEffect(()=> {
    const fetchData = async () => {
      try{
      const response = await fetch(API_URL);
      const data = await response.json();
      const uniqueBooks = removeDuplicateBooks(data.docs);

      setListBooks(uniqueBooks);
      }catch(error){
        console.log("Error msg: "+ error);
      }
    }
    if(search) {fetchData();}
  }, [search]);

  // Change to Title Case and handle "-", "Mc" "O'" and "Mac" and lowercase articles
  const toTitleCase = (str) => {
    const minorWords = ["a", "an", "the", "and", "but", "or", "for", "nor", "on", "at", "to", "by", "of", "in", "with"];

    return str.replace(/\w\S*/g, function(txt, index) {
      // Check if the word is a type of article and not the first word
      if (minorWords.includes(txt.toLowerCase()) && index > 0) {
        return txt.toLowerCase(); // Keep minor words lowercase
      }

      // Handle special cases for "Mc", "Mac", "O'", and hyphenated names
      return txt.replace(/\b(Mac|Mc|O'|[A-Za-z]+-[A-Za-z]+)?\w+'?\w*/g,
        function(subStr) {
          if (subStr.startsWith("Mac")) {
            // Capitalize "Mac" and the following letter (e.g., MacDonald)
            return "Mac" + subStr.charAt(3).toUpperCase() + subStr.substr(4).toLowerCase();
          } else if (subStr.startsWith("Mc")) {
            // Capitalize "Mc" and the following letter (e.g., McMahon)
            return "Mc" + subStr.charAt(2).toUpperCase() + subStr.substr(3).toLowerCase();
          } else if (subStr.startsWith("O'")) {
            // Capitalize "O'" and the following letter (e.g., O'Connor)
            return "O'" + subStr.charAt(2).toUpperCase() + subStr.substr(3).toLowerCase();
          } else if (subStr.includes("'")) {
            // For possessive cases, keep the apostrophe and "s" lowercase (e.g., Mary's)
            let parts = subStr.split("'"); // Split at the apostrophe
            parts[0] = parts[0].charAt(0).toUpperCase() + parts[0].substr(1).toLowerCase();
            return parts.join("'"); // Recombine with apostrophe
          }
          // Default case: capitalize the first letter
          return subStr.charAt(0).toUpperCase() + subStr.substr(1).toLowerCase();
        }
      );
    });
  }

  const removeDuplicateBooks = (listBooks) => {
    const distinctBooks = new Map();

    listBooks.forEach((book) => {
      const title = toTitleCase(book.title || "");
      const hasCover = book.cover_i;

      // Store book title in TitleCase
      book.title = title;
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
      <Header search={search} changeSearch={changeSearch} />

      <Routes>
        <Route index path = "/" element={ <Main listBooks={listBooks} search={search} toTitleCase={toTitleCase} removeDuplicateBooks={removeDuplicateBooks}/>} />
      </Routes>
    </>
  )
}

