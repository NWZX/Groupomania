import React from "react";
import "./App.css";
import Auth from "./component/auth/Auth";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from "react-router-dom";
import Home from "./component/feed/Home";
import { FeedBlockCategorie } from "./models/FeedBlock";
import ProtectedRoute from "./component/global-component/protected-route/ProtectedRoute";
import store from "store";
import { IAuthServiceResponse } from "./services/AuthServices";
import Single from "./component/feed/single/Single";
import Profile from "./component/profile/Profile";
import FeedBlockFrom from "./component/feed-block-form/FeedBlockForm";
import Page404 from "./component/404/404";
import {
  ApolloClient,
  NormalizedCacheObject,
  InMemoryCache,
  ApolloProvider,
} from "@apollo/client";

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface IAppProps {}
interface IAppStates {
  token: string;
  isAuth: boolean;
  username: string;
  client: ApolloClient<NormalizedCacheObject>;
}

class App extends React.Component<IAppProps, IAppStates> {
  constructor(props: IAppProps) {
    super(props);
    this.state = {
      //TEMP FIX
      token: store.get("token", ""),
      isAuth: store.get("isAuth", false),
      username: store.get("user", ""),
      client: new ApolloClient<NormalizedCacheObject>({
        uri: "http://localhost:4000/graphql",
        cache: new InMemoryCache(),
      }),
    };
    this.handleAuth = this.handleAuth.bind(this);
  }
  handleAuth(response: IAuthServiceResponse): void {
    //TEMP FIX
    store.set("token", response.token);
    store.set("isAuth", true);
    store.set("user", response.username);
    this.setState({
      token: response.token,
      isAuth: true,
      username: response.username,
    });
    window.location.replace("/");
  }
  render(): JSX.Element {
    return (
      <ApolloProvider client={this.state.client}>
        <Router>
          <Switch>
            <Route
              exact
              path="/auth"
              render={(props) => <Auth {...props} onAuth={this.handleAuth} />}
            ></Route>
            <Route
              exact
              path="/"
              render={(props) => (
                <ProtectedRoute isAuth={this.state.isAuth} path="/auth">
                  <Home
                    {...props}
                    setDefaultTab={FeedBlockCategorie.Favoris}
                  ></Home>
                </ProtectedRoute>
              )}
            ></Route>
            <Route
              path="/post/:postId"
              render={(props) => (
                <ProtectedRoute isAuth={this.state.isAuth} path="/auth">
                  <Single {...props} />
                </ProtectedRoute>
              )}
            ></Route>
            <Route
              exact
              path="/newPost"
              render={(props) => (
                <ProtectedRoute isAuth={this.state.isAuth} path="/auth">
                  <FeedBlockFrom mode={1} {...props} />
                </ProtectedRoute>
              )}
            ></Route>
            <Route
              exact
              path="/editPost/:postId"
              render={(props) => (
                <ProtectedRoute isAuth={this.state.isAuth} path="/auth">
                  <FeedBlockFrom mode={0} {...props} />
                </ProtectedRoute>
              )}
            ></Route>
            <Route path="/profile/:username" component={Profile}></Route>
            <Route path="/404" component={Page404}></Route>
            <Redirect to="/404" />
          </Switch>
        </Router>
      </ApolloProvider>
    );
  }
}

export default App;
