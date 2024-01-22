import React, { useState, useEffect } from 'react';
import { Link, useParams,useNavigate } from 'react-router-dom';
const serverUrl = process.env.REACT_APP_SERVER_URL;

const Search = () => {
    const [searchResult, setSearchResult] = useState();

    const {searchcategory} = useParams();

    const nav = useNavigate();
    const handleSubmit = (lecturID)=>{

        nav(`/lectureDetail/${lecturID}`);
    }

    useEffect(() => {
        // 값이 있는지 확인
        if (searchcategory) {
          // 값이 있다면 서버에서 searchcategory를 이용해 검색 데이터를 가져오는 코드 작성
          fetch(`${serverUrl}/search?category=${searchcategory}`)
            .then((response) => response.json())
            .then((data) => {
              if (data.success) {
                setSearchResult(data.category);
              } else {
                console.error('강의 정보를 가져오는데 실패했습니다.');
              }
            })
            .catch((error) => {
              console.error('강의 정보를 가져오는데 실패했습니다.', error);
            });
        } else {
          // 값이 없다면 처리할 로직 작성
          console.log('searchcategory가 없습니다.');
        }
      }, [searchcategory]);
    return (
        <div className='frhome'>
            <div className="home">
                <div className="card-container">
                    {searchResult && searchResult.length > 0 ? (
                        searchResult.map((result, index) => (
                            <div className="card" key={index}>
                                <img className="card-image" src={result.LECTUREIMAGE} alt="Course Image" />
                                <div className="card-content">
                                    <h2 className="card-title">{result.TITLE}</h2>
                                    <p className="card-description">{result.CATEGORYNAME}</p>
                                    <button className="card-button" onClick={() => handleSubmit(result.LECTUREID)}>Learn More</button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div>
                            <p>No results found</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Search;
