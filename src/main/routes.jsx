import React from 'react'
import { Router, Route, Redirect, hashHistory } from 'react-router'

import Jogo from '../jogo/pais'

export default props => (
    <Router history={hashHistory}>
        <Route path='/pais' component={Jogo} />
        <Redirect from='*' to='/pais' />
    </Router>
)