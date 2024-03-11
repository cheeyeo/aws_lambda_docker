import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';


const APIGATEWAYURL = 'http://localhost:8000';

const FormX = () => {
  const [formValues, setFormValues] = useState({
    per_page: 10,
    query: "language:python",
    order: "desc",
    sort: "stars"
  });

  const [isSubmitted, setIsSubmitted] = useState(false);

  const callAPI = (data, loadingCallback, errCallback, reposCallback) => {
    console.log('CALL API: ', data);
    loadingCallback(true);

    axios.post(
      APIGATEWAYURL,
      data,
      {
        headers: {
          "Content-Type": "application/json"
        }
      }
    )
    .then(response => {
      loadingCallback(false);
      reposCallback(response.data.repos);
    })
    .catch(error => {
      console.log(error)
      loadingCallback(false);
      errCallback(error);
    });
  };

  const handleChange = (event) => {
      const { name, value } = event.target;
      // console.log(name, value);
      setFormValues({ ...formValues, [name]: value });
  };

  const handleSubmit = (e) => {
      e.preventDefault();
      console.log(formValues);
      setIsSubmitted(true);
  };

  // Prevent from re-rendering on every form change
  const list = useMemo(() => <View data={formValues} onSubmit={setIsSubmitted} fetchRepos={callAPI} />, [isSubmitted]);

  return (
      <div>
        <form id="formu" onSubmit={handleSubmit} className="row gy-2 gx-3 align-items-center">
          <div className="col-auto">
            <label htmlFor='query' className='sr-only'>Query:</label>
            <input id="query" type="text" className="form-control" placeholder="Language query" name="query" value={formValues.query} onChange={handleChange} />
          </div>

          <div className="col-auto">
            <label htmlFor='order' className='sr-only'>Order:</label>
            <select id='order' name="order" className="form-select" onChange={handleChange}>
              <option value="desc">desc</option>
              <option value="asc">asc</option>
            </select>
          </div>

          <div className="col-auto">
            <label htmlFor='sort' className='sr-only'>Sort By:</label>
            <select id='sort' name="sort" className="form-select" onChange={handleChange}>
              <option value="stars">stars</option>
              <option value="forks">forks</option>
              <option value="help-wanted-issues">help-wanted-issues</option>
              <option value="updated">updated</option>
            </select>
          </div>

          <div className="col-auto">
            <label htmlFor='per_page' className='sr-only'>Per Page:</label>
            <input id="per_page" type="number" className="form-control" name="per_page" value={formValues.per_page} onChange={handleChange} />
          </div>

          <div className="col-auto">
            <button type="submit" className="btn btn-primary">Save</button>
          </div>
        </form>

        <hr/>
        {list}
      </div>
  );
}


const View = ({ data, onSubmit, fetchRepos }) => {
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
      // Pass the setIsSubmit handler here to change state to cause the view to re-render
      onSubmit(false);

      // TODO: CALL API FROM HERE...
      fetchRepos(data, setLoading, setError, setRepos);
      // console.log('INSIDE VIEW: ', data);
  }, [data, onSubmit]);


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
  } else if(loading) {
    return (
      <div className="d-flex justify-content-center">
        <strong>Loading...</strong>&nbsp;&nbsp;
        <div className="spinner-border ml-auto" role="status" aria-hidden="true"></div>
      </div>
    )
  } else {
    return (
      <div className="mx-auto">
          <div className="row row-cols-1 row-cols-md-3 g-4">
            {repos.map(repo => (
              <div className="col" key={repo.name}>
                 <div className="card h100">
                    <h5 className="card-header">{repo.full_name}</h5>
                    <div className="card-body">
                      <h5 className="card-title">{repo.name}</h5>
                      <p className="card-text">{repo.description}</p>
                      <p>
                      <i className="bi bi-stars"></i>Stars: {repo.stars}&nbsp;&nbsp;
                      <i className="bi bi-arrow-90deg-right"></i>Forks: {repo.forks}&nbsp;&nbsp;
                      <i className="bi bi-card-list"></i>&nbsp;Open Issues: {repo.open_issues}
                      </p>
                      <a href={repo.url} className="btn btn-primary" target="_blank" rel="noreferrer">Visit Repo</a>
                    </div>
                    <div className="card-footer">
                      <small className='text-body-secondary'><i className="bi bi-calendar"></i>&nbsp;Last Updated: {repo.updated_at}</small>
                    </div>
                </div>
              </div>
            ))}
          </div>
      </div>
    )
  }
};


function App() {
  return (
     <FormX />
  )
}


export default App;
