import React from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import RowFluid from "../global-component/RowFluid";
import { Depths } from "@uifabric/fluent-theme/lib/fluent/FluentDepths";
import "./Home.scss";

import { FeedBlockCategorie } from "../../models/FeedBlock";
import { PostServices, IPost } from "../../services/PostServices";

import logo from "../../ressource/logo_128.png";
import userIcon from "../../ressource/user-solid.svg";
import TabPicker from "../global-component/tab-picker/tabPicker";
import FeedBlock from "../global-component/feed-block/FeedBlock";
import UIButton from "../global-component/UIButton";
import { RouteComponentProps } from "react-router-dom";
import store from "store";
import { IUser, AuthService } from "../../services/AuthServices";

interface IHomeProp extends RouteComponentProps {
  setDefaultTab: FeedBlockCategorie;
}
interface IHomeStates {
  search: string;
  categorieList: string[];
  categorieFocused: FeedBlockCategorie;
  loadItemLimit: number;
  lastTimestamp: number;
  data: IPost[];
  error?: Error;
  user?: IUser;
}

class Home extends React.Component<IHomeProp, IHomeStates> {
  constructor(props: IHomeProp) {
    super(props);
    this.state = {
      search: "",
      categorieList: [
        FeedBlockCategorie.Favoris,
        FeedBlockCategorie.Media,
        FeedBlockCategorie.Talk,
        FeedBlockCategorie.Advert,
      ],
      categorieFocused: props.setDefaultTab,
      loadItemLimit: 10,
      lastTimestamp: 0,
      data: [],
      error: undefined,
      user: undefined,
    };

    this.handleSearch = this.handleSearch.bind(this);
    this.handleTabChange = this.handleTabChange.bind(this);
    this.handleNewPost = this.handleNewPost.bind(this);
    this.handleProfile = this.handleProfile.bind(this);
    this.getUser = this.getUser.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
  }

  componentDidMount(): void {
    document.title = "Feed - Groupomania";
    this.getUser();
    this.getData(10, 0).then((val) => {
      this.setState({ data: val });
    });
  }

  handleSearch(e: React.ChangeEvent<HTMLInputElement>): void {
    this.setState({ search: e.target.value });
  }
  handleTabChange(id: number): void {
    this.setState({
      categorieFocused: this.state.categorieList[id] as FeedBlockCategorie,
    });
  }
  handleNewPost(): void {
    this.props.history.push("/newPost");
  }
  handleProfile(e: React.MouseEvent<HTMLAnchorElement, MouseEvent>): void {
    e.preventDefault();
    this.props.history.push("/profile/" + store.get("user", ""));
  }
  handleDelete(id: number): void {
    const temp = this.state.data;
    console.log({ temp });
    temp.splice(
      temp.findIndex((n) => n.id === id),
      1
    );
    console.log({ temp });
    this.setState({ data: temp });
  }

  async getData(limit: number, lastTimestamp: number): Promise<IPost[]> {
    const result = await PostServices.getPosts(limit, lastTimestamp);
    if (result instanceof Error) {
      this.setState({ error: result });
      return [];
    } else {
      return result;
    }
  }
  async getUser(): Promise<void> {
    const result = await AuthService.getUser(store.get("user", ""));
    if (result instanceof Error) {
      this.setState({ error: result });
    } else {
      this.setState({ user: result });
    }
  }

  renderData(filter: FeedBlockCategorie): JSX.Element[] {
    const result: JSX.Element[] = [];
    for (let i = 0; i < this.state.data.length; i++) {
      const e = this.state.data[i];
      const check =
        typeof this.state.user !== "undefined" &&
        (this.state.user.authorization === 1 ||
          this.state.user.username === e.user.username);
      if (e.categorie.includes(filter)) {
        result.push(
          <FeedBlock
            history={this.props.history}
            showButton={{
              edit: check,
              comment: true,
              delete: check,
            }}
            key={i}
            id={e.id}
            user={e.user}
            title={e.title}
            data={e.data}
            url={e.url}
            type={e.type}
            categorie={e.categorie}
            timestamp={e.timestamp}
            commentsNumber={e.commentsNumber}
            onDelete={this.handleDelete}
          />
        );
      }
    }
    return result;
  }

  render(): JSX.Element {
    return (
      <Container fluid className="p-0">
        <RowFluid>
          <Container
            fluid
            className="ac-block align-middle"
            style={{ boxShadow: Depths.depth8 }}
          >
            <Row className="justify-content-center">
              <div className="col-10">
                <img src={logo} alt="" className="img-fluid logo" />
                <h1 className="d-inline-block m-0 align-vertical">
                  Groupomania
                </h1>
              </div>
              <div className="col-2 p-0 d-flex my-auto text-center">
                <a
                  href={`/profile/${store.get("user", "")}`}
                  onClick={this.handleProfile}
                >
                  <img src={userIcon} alt="" className="img-fluid user-icon" />
                </a>
              </div>
            </Row>
          </Container>
        </RowFluid>
        <RowFluid>
          <Container
            fluid
            className="ac-block mx-auto my-1 align-middle"
            style={{ boxShadow: Depths.depth8 }}
          >
            <div className="row-fluid justify-content-center">
              <input
                type="search"
                placeholder="🔍Rechercher"
                value={this.state.search}
                onChange={this.handleSearch}
              />
            </div>
            <TabPicker
              elementList={this.state.categorieList}
              onChange={this.handleTabChange}
              ClassName="row justify-content-center"
            />
          </Container>
        </RowFluid>
        <RowFluid>
          <RowFluid>
            <Container
              fluid
              className="ac-block mx-auto my-1 align-middle"
              style={{ boxShadow: Depths.depth8 }}
            >
              <UIButton
                text="Crée un post"
                className="col-8"
                onClick={this.handleNewPost}
              />
            </Container>
          </RowFluid>
        </RowFluid>
        {this.renderData(this.state.categorieFocused)}
      </Container>
    );
  }
}

export default Home;
