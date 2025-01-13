import { Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import "./style.css";

import { Header } from "./components/Header";
import { Main } from "./components/Main";
import { Book } from "./components/Book";

export default function App() {
  //const API_KEY = 'AIzaSyDyRTkUq9YuhUSuZsQz77ftIfNLMukP4vc'; //dev
  const API_KEY = "AIzaSyCUKqGdOyqRqN4nmOuZBbFmtNib4758EUY"; //email
  const API_URL = "https://www.googleapis.com/books/v1/volumes";

  const [search, setSearch] = useState("");
  const [subject, setSubject] = useState("");
  const [listSearchBooks, setListSearchBooks] = useState([]);
  const [listSubjectBooks, setListSubjectBooks] = useState([]);
  const [recommendedBooks, setRecommendedBooks] = useState([]);

  const changeSearch = (value) => { setSearch(value); };
  const changeSubject = (value) => { setSubject(value); };

  const [isSubLoading, setIsSubLoading] = useState(true);
  const [isSearchLoading, setIsSearchLoading] = useState(true);
  const [isRecoLoading, setIsRecoLoading] = useState(true);

  const resetState = () => {
    setSearch("");
    setSubject("");
    setListSearchBooks([]);
    setListSubjectBooks([]);
  };

  useEffect(() => {
    const getRecommendedBooks = async () => {
      setIsRecoLoading(true); // Show spinner before fetch
      try {
        const phrase = "new york brains";
        const recoQuery = `subject:fiction ${phrase}`;

        const recoResponse = await axios.get(API_URL, {
          params: {
            q: recoQuery,
            key: API_KEY,
            langRestrict: "en",
          },
        });
        if (recoResponse.data.items && recoResponse.data.items.length > 0) {
          const recoBooks = removeDuplicateBooks(recoResponse.data.items);
          setRecommendedBooks(recoBooks);
        } else {
          setRecommendedBooks([]);
        }
      } catch (error) {
        setRecommendedBooks([]);
        console.error("Error in getting recommended book list:", error);
      } finally {
        setIsRecoLoading(false);
      }
    };

    const getSubjectBooks = async () => {
      setIsSubLoading(true); // Show spinner before fetch
      let query = "";
      if (subject === "Nonfiction") {
        query = "subject:nonfiction";
      } else {
        query = `subject:fiction ${subject}`;
      }
      try {
        const subjResponse = await axios.get(API_URL, {
          params: {
            q: query,
            key: API_KEY,
            langRestrict: "en",
          },
        });
        if (subjResponse.data.items && subjResponse.data.items.length > 0) {
          const subjBooks = removeDuplicateBooks(subjResponse.data.items);
          setListSubjectBooks(subjBooks);
          setListSearchBooks([]);
        } else {
          setListSubjectBooks([]);
        }
      } catch (error) {
        console.error("Error in getting books by subject:", error);
        setListSubjectBooks([]);
      } finally {
        setIsSubLoading(false);
      }
    };

    const getSearchBooks = async () => {
      setIsSearchLoading(true); // Show spinner before fetch
      try {
        const response = await axios.get(API_URL, {
          params: {
            q: search,
            key: API_KEY,
            langRestrict: "en",
          },
        });
        if (response.data.items && response.data.items.length > 0) {
          const uniqueBooks = removeDuplicateBooks(response.data.items);
          setListSearchBooks(uniqueBooks);
          setListSubjectBooks([]);
        } else {
          setListSearchBooks([]);
        }
      } catch (error) {
        console.error("Error fetching books: ", error);
        setListSearchBooks([]);
      } finally {
        setIsSearchLoading(false);
      }
    };

    if (subject) {
      setListSearchBooks([]);
      getSubjectBooks();
    } else if (search) {
      setListSubjectBooks([]);
      getSearchBooks();
    } else {
      getRecommendedBooks();
    }
  }, [search, subject]);

  // Change to Title Case and handle "-", "Mc" "O'" and "Mac" and lowercase articles
  const toTitleCase = (str) => {
    const minorWords = [
      "a",
      "an",
      "the",
      "and",
      "but",
      "or",
      "for",
      "nor",
      "on",
      "at",
      "to",
      "by",
      "of",
      "in",
      "with",
    ];
    const toExclude = [
      "TV",
      "M*A*S*H*",
      "M.A.S.H.",
      "MASH",
      '"M"',
      "HCL",
      "HCl",
      "NASA",
      "N.A.S.A",
      "FBI",
      "F.B.I.",
    ];

    return str
      .split(/\s+/)
      .map((word, index, array) => {
        // Check if the previous word ends with a colon or (
        const isAfterColon = index > 0 && array[index - 1].endsWith(":");

        // Check if word contains a number or *'s and don't change capitalization
        if (/\d/.test(word) || /[*]/.test(word) || RegExp(toExclude.join("|"), "i").test(word)) {
          return word;
        }

        // Split by hyphen(s)
        const parts = word.split("-");

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
          } else if (part.startsWith("(")) {
            // Capitalize the first letter after the parenthesis
            return "(" + part.charAt(1).toUpperCase() + part.slice(2);
          } else if (part.includes("'")) {
            // For possessive cases, keep the apostrophe and "s" lowercase (e.g., Mary's)
            let posParts = part.split("'");
            posParts[0] =
              posParts[0].charAt(0).toUpperCase() + posParts[0].slice(1);
            return posParts.join("'"); // Recombine with apostrophe
          }

          // Capitalize the first letter of the word if it's the first word or after a colon
          if (index === 0 || isAfterColon) {
            return part.charAt(0).toUpperCase() + part.slice(1);
          }

          // Check if the word is a minor word
          if (minorWords.includes(part) && index > 0) {
            return part.toLowerCase(); // Keep minor words lowercase
          }

          // Capitalize normally
          return part.charAt(0).toUpperCase() + part.slice(1);
        });

        // Join the capitalized parts back together with hyphens
        return capitalizedParts.join("-");
      })
      .join(" "); // Join the words back together with spaces
  };

  const removeDuplicateBooks = (listBooks) => {
    const distinctBooks = new Map();

    listBooks.forEach((book) => {
      const title = toTitleCase(book.volumeInfo?.title || "");
      const hasCover = book.volumeInfo?.imageLinks?.thumbnail;

      // Store book title in TitleCase
      book.volumeInfo.title = title;
      // Store or replace unique books with a cover
      if (!distinctBooks.has(title) || hasCover) {
        //title not already stored & replace with a version that has a cover if available
        distinctBooks.set(title, book);
      } 
    });
    return Array.from(distinctBooks.values());
  };

  return (
    <>
      <div className="dotted">
        <Header
          changeSearch = {changeSearch}
          changeSubject = {changeSubject}
          subject = {subject} // Keep or it won't recognize the active subject selection
          resetState = {resetState}
        />
        <Routes>
          <Route 
            index 
            path="/" 
            element={
              <Main
                listSearchBooks = {listSearchBooks}
                search = {search}
                isSearchLoading = {isSearchLoading}
                setIsSearchLoading = {setIsSearchLoading}
                toTitleCase = {toTitleCase}
                subject = {subject}
                isSubLoading = {isSubLoading}
                setIsSubLoading = {setIsSubLoading}
                recommendedBooks = {recommendedBooks}
                isRecoLoading = {isRecoLoading}
                setIsRecoLoading = {setIsRecoLoading}
                listSubjectBooks = {listSubjectBooks}
              />
            }
          />
          <Route
            path="/book/:id"
            element={<Book toTitleCase={toTitleCase} />}
          />
        </Routes>
      </div>
    </>
  );
}
