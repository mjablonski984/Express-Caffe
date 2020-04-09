import React from 'react';
import { Link, HashRouter as Router, Route, browserHistory } from 'react-router-dom';

import Menu from './Menu';
import Landing from './Landing';
import Employee from './Employee';
import Footer from './Footer';

function App() {
  return (
    <Router history={browserHistory}>
      <div className="App">
        <header>
          <Link to="/">
            <h2>Express Caffe</h2>
          </Link>
        </header>
        <div className="container">
          <Route exact path="/" component={Landing} />
          <Route path="/menus/:id" component={Menu} />
          <Route path="/employees/:id" component={Employee} />
        </div>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
