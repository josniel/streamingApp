import React from 'react'
// import React, { Component } from 'react'
import './App.css'
import { Route, Switch } from 'react-router-dom'
import Login from './pages/login'
import Register from './pages/register'
import Meeting from './pages/meeting'
import Index from './pages/index'
import SettingsCard from './pages/index/settings-card'
import { BrowserRouterHook } from './utils/use-router'
function App () {
  return (
    <BrowserRouterHook>
      <Switch>
        <Route exact path="/meeting/:name" component={Meeting}></Route>
        <Route path="/index" component={Index}></Route>
        <Route path="/index/setting" component={SettingsCard}></Route>
        <Route path="/register" component={Register}></Route>
        <Route path="/" component={Login}></Route>
      </Switch>
    </BrowserRouterHook>
  )
}

export default App
