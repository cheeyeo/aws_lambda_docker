import React, { useState, useEffect } from 'react';
import axios from 'axios';


function App() {
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
  
    axios.post(
      'http://localhost:8000',
      // 'https://lwn4rhibk4.execute-api.eu-west-1.amazonaws.com/repos' ,
      {
        per_page: 10,
        query: 'language:python',
        order: 'desc',
        sort: 'stars'
      },
      {
        headers: {
          "Content-Type": "application/json"
        }
      }
    )
    .then(response => {
      setLoading(false);
      setRepos(response.data.repos);
    })
    .catch(error => {
      setLoading(false);
      setError(error);
    });
  }, []);

  if (error) {
    return (
      <div className="alert alert-danger" role="alert">
          <h4 className="alert-heading">Error loading data from github</h4>
          <p>
            Message: {error.response.data.error_msg}
          </p>
          <p>
            Stack Trace: {error.response.data.stack_trace}
          </p>
      </div>
    )
  }else if (loading) {
    return (
        <div className="d-flex justify-content-center">
          <strong>Loading...</strong>&nbsp;&nbsp;
          <div className="spinner-border ml-auto" role="status" aria-hidden="true"></div>
        </div>
    )
  } else {
    return (
      <div className="col-md-8 mx-auto">
          <h2 className="pb-2">My Top 10s</h2>
          <div className="row row-cols-1 row-cols-md-2 g-4">
            {repos.map(repo => (
              <div className="col" key={repo.name}>
                 <div className="card">
                    <h5 className="card-header">{repo.full_name}</h5>
                    <div className="card-body">
                      <h5 className="card-title">{repo.name}</h5>
                      <p className="card-text">{repo.description}</p>
                      <a href={repo.url} className="btn btn-primary" target="_blank" rel="noreferrer">Visit Repo</a>
                    </div>
                    <div className="card-footer text-body-secondary">
                      <i className="bi bi-stars"></i>{repo.stars}
                    </div>
                </div>
              </div>
            ))}
          </div>
      </div>
    )
  }


}


export default App;
