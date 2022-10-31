import React, { useState, useEffect } from 'react';
import 'materialize-css/dist/css/materialize.min.css';
import './App.css';
import csvDownload from "json-to-csv-export";
import { getData, storeData } from './components/helpers/localStorage';
import QueryForm from './components/QueryFom/QueryForm';

const App = () => {
  const initialState = () => getData('data') || [];
  const [state, setState] = useState(initialState);
  const [setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [items, setItems] = useState([]);

  useEffect(() => {
    storeData('data', state);
  }, [state]);

  const handleChange = val => {
    fetch(`https://bie-ws.ala.org.au/ws/search?q=` + val.query + `&pageSize=1000`)
        .then(res => res.json())
        .then(
            (result) => {
              setIsLoaded(true);
              setItems(result);
              setState(result.searchResults);
            },
            (error) => {
              setIsLoaded(true);
              setError(error);
            }
        );
  };

  const handleCSVSubmit = () => {
    const dataToConvert = {
      data: convertResultDataToCSVData(items.searchResults.results),
      filename: 'speciesSearch',
      delimiter: ',',
      headers: ['Id', "quid", "Kingdom", "Kingdom guid", "Scientific Name", "Author", "Image url"]
    }

    csvDownload(dataToConvert)
  };

  return (
      <div className='container'>
        <div className='row center'>
          <h1 className='black-text'> Species search </h1>
        </div>
        <div className='row'>
          <div className='col m12 s12'>
            <QueryForm change={handleChange} />
          </div>
          <div className='col m12 s12'>
            <button
                id="csv-btn"
                className="csv-btn"
                type="button"
                disabled={items.searchResults === undefined}
                onClick={handleCSVSubmit}
            >
              Export to CSV
            </button>
          </div>
          {isLoaded &&
              <div>
                <ul>
                  {items.searchResults.results
                      .map(item => (
                          <li key={item.id} className='search-result clearfix'>
                              {item.thumbnailUrl &&
                                  <div className='result-image'>
                                      <img src={item.thumbnailUrl} alt="image" className={'result-image'}/>
                                  </div>}
                              <h4>Scientific name:
                                <span className='scientific-name'> {item.scientificName}</span>
                              </h4>
                              <p>Common Name: {item.commonNameSingle}</p>
                          </li>
                      ))}
                </ul>
              </div>}
        </div>
      </div>
  );
};

export default App;

function convertResultDataToCSVData(results) {
    const response = results.map(result => ({
        id: result.id,
        guid: result.guid,
        kingdom: result.kingdom,
        kingdomGuid: result.kingdomGuid,
        scientificName: result.scientificName,
        author: result.author,
        imageUrl: result.imageUrl
    })).splice(0, 100)

    return response;
}