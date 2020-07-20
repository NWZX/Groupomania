import React, { Component } from "react";
import { RouteComponentProps } from "react-router-dom";
import Container from "react-bootstrap/Container";
import RowFluid from "../global-component/RowFluid";
import Row from "react-bootstrap/Row";
import { Depths } from "@uifabric/fluent-theme/lib/fluent/FluentDepths";
import UIButton from "../global-component/UIButton";
import Col from "react-bootstrap/Col";
import store from "store";
import {
  FeedBlockContentType,
  FeedBlockCategorie,
} from "../../models/FeedBlock";
import Alert from "react-bootstrap/Alert";
import { PostServices } from "../../services/PostServices";
import { AuthService } from "../../services/AuthServices";

enum FormMode {
  edit,
  new,
}
type IParam = {
  postId: string;
};
interface IFeedBlockFromProps extends RouteComponentProps<IParam> {
  mode: FormMode;
}
interface IFeedBlockFromState {
  error?: Error;
  title: string;
  type: FeedBlockContentType;
  categorie: string[];
  file?: File;
  url: string;
  text: string;

  allowedImageType: string[];
  allowedVideoType: string[];

  authorization: number;
}

class FeedBlockFrom extends Component<
  IFeedBlockFromProps,
  IFeedBlockFromState
> {
  /**
   *
   */
  constructor(props: IFeedBlockFromProps) {
    super(props);
    this.state = {
      error: undefined,
      title: "",
      type: FeedBlockContentType.Text,
      categorie: [],
      file: undefined,
      url: "",
      text: "",

      allowedImageType: ["image/png", "image/jpeg", "image/webp", "image/gif"],
      allowedVideoType: ["video/webm"],

      authorization: 0,
    };
    this.handleBack = this.handleBack.bind(this);
    this.handleTitle = this.handleTitle.bind(this);
    this.handleTextArea = this.handleTextArea.bind(this);
    this.handleTypeSelect = this.handleTypeSelect.bind(this);
    this.handleCategorieSelect = this.handleCategorieSelect.bind(this);
    this.handleImageChange = this.handleImageChange.bind(this);
    this.handleVideoChange = this.handleVideoChange.bind(this);
    this.handleSend = this.handleSend.bind(this);
  }
  componentDidMount(): void {
    if (this.props.mode === FormMode.edit && this.props.match.params.postId) {
      document.title = "Edit post - Groupomania";
      this.getAuthorization();
      this.getData(Number.parseFloat(this.props.match.params.postId));
    } else {
      document.title = "New post - Groupomania";
      this.getAuthorization();
    }
  }
  async getAuthorization(): Promise<void> {
    const result = await AuthService.getUser(store.get("user", ""));
    if (result instanceof Error) {
      this.setState({ error: result });
    } else {
      this.setState({ authorization: result.authorization });
    }
  }
  async getData(id: number): Promise<void> {
    const result = await PostServices.getPost(id);
    if (result instanceof Error) {
      this.setState({ error: result });
    } else {
      this.setState({
        title: result.title,
        type: result.type,
        text: result.data,
        categorie: result.categorie.split(","),
      });
      const doc = document.getElementById("file_img");
      if (doc) {
        doc.style.display = "inline";
        (doc as HTMLImageElement).src = result.url;
        this.setState({ url: result.url });
      }
      result.categorie.split(",").forEach((e) => {
        switch (e) {
          case FeedBlockCategorie.Favoris:
            if (this.state.authorization === 1) {
              (document.getElementById(
                "checkbox_favoris"
              ) as HTMLInputElement).checked = true;
            }
            break;
          case FeedBlockCategorie.Media:
            (document.getElementById(
              "checkbox_media"
            ) as HTMLInputElement).checked = true;
            break;
          case FeedBlockCategorie.Talk:
            (document.getElementById(
              "checkbox_talk"
            ) as HTMLInputElement).checked = true;
            break;
          case FeedBlockCategorie.Advert:
            (document.getElementById(
              "checkbox_advert"
            ) as HTMLInputElement).checked = true;
            break;
        }
      });
    }
  }
  renderError(): JSX.Element | null {
    if (this.state.error) {
      return (
        <Row className="justify-content-center">
          <Alert variant="danger">{this.state.error.message}</Alert>
        </Row>
      );
    } else {
      return null;
    }
  }
  handleBack(): void {
    this.props.history.push("/");
  }
  handleTitle(e: React.ChangeEvent<HTMLInputElement>): void {
    this.setState({ title: e.target.value });
  }
  handleTypeSelect(e: React.ChangeEvent<HTMLSelectElement>): void {
    this.setState({ type: Number.parseInt(e.target.value) });
  }
  handleTextArea(e: React.ChangeEvent<HTMLTextAreaElement>): void {
    this.setState({ text: e.target.value });
  }

  renderTypeSelect(
    selection: FeedBlockContentType
  ): JSX.Element | JSX.Element[] | null {
    switch (selection) {
      case FeedBlockContentType.Text:
        if (this.state.categorie.includes(FeedBlockCategorie.Media)) {
          const temp = this.state.categorie;
          temp.splice(temp.indexOf(FeedBlockCategorie.Media), 1);
          this.setState({ categorie: temp });
        }
        return (
          <Row className="justify-content-center" style={{ marginTop: "1vh" }}>
            <Col sm={2}>
              <label
                htmlFor="text"
                className="p-0 m-0 align-vertical font-weight-bolder"
              >
                Texte
              </label>
            </Col>
            <Col>
              <textarea
                id="text"
                className="m-0"
                placeholder="Texte (20 à 1000 charactère)"
                rows={4}
                value={this.state.text}
                onChange={this.handleTextArea}
              ></textarea>
            </Col>
          </Row>
        );
      case FeedBlockContentType.Image:
        if (this.state.categorie.includes(FeedBlockCategorie.Talk)) {
          const temp = this.state.categorie;
          temp.splice(temp.indexOf(FeedBlockCategorie.Talk), 1);
          this.setState({ categorie: temp });
        }
        return [
          <Row
            key="0"
            className="justify-content-center"
            style={{ marginTop: "1vh" }}
          >
            <Col sm={2}>
              <label
                htmlFor="img"
                className="p-0 m-0 align-vertical font-weight-bolder"
              >
                Image/Gif
              </label>
            </Col>
            <Col>
              <input
                type="file"
                accept={this.state.allowedImageType.toString()}
                id="img"
                className="m-0"
                onChange={this.handleImageChange}
              ></input>
            </Col>
          </Row>,
          <Row
            key="1"
            className="justify-content-center"
            style={{ marginTop: "1vh" }}
          >
            <img
              id="file_img"
              alt="Petit aperçu du contenue"
              width={200}
              style={{ display: "none" }}
            />
          </Row>,
        ];
      case FeedBlockContentType.Video:
        return (
          <Row className="justify-content-center" style={{ marginTop: "1vh" }}>
            <Col sm={2}>
              <label
                htmlFor="video"
                className="p-0 m-0 align-vertical font-weight-bolder"
              >
                Vidéo
              </label>
            </Col>
            <Col>
              <input
                type="file"
                accept={this.state.allowedVideoType.toString()}
                id="video"
                className="m-0"
                onChange={this.handleVideoChange}
              ></input>
            </Col>
          </Row>
        );

      default:
        return null;
    }
  }
  handleCategorieSelect(e: React.ChangeEvent<HTMLInputElement>): void {
    const temp = this.state.categorie;
    if (!this.state.categorie.includes(e.target.value)) {
      temp.push(e.target.value);
      this.setState({ categorie: temp });
    } else {
      temp.splice(temp.indexOf(e.target.value), 1);
      this.setState({ categorie: temp });
    }
  }
  handleImageChange(e: React.ChangeEvent<HTMLInputElement>): void {
    if (e.target.files) {
      const file = e.target.files.item(0);
      if (file) {
        if (this.state.allowedImageType.includes(file.type)) {
          if (file.size < 2000000) {
            this.setState({ error: undefined, file: file });
            if (FileReader) {
              const fr = new FileReader();
              fr.onload = function () {
                const img_file = document.getElementById("file_img");
                if (img_file && typeof fr.result === "string") {
                  (img_file as HTMLImageElement).src = fr.result;
                  img_file.style.display = "inline";
                }
              };
              fr.readAsDataURL(file);
            }
          } else {
            this.setState({ error: new Error("Fichier trop volumineux") });
          }
        } else {
          this.setState({ error: new Error("Format de fichier invalide") });
        }
      }
    }
  }
  handleVideoChange(e: React.ChangeEvent<HTMLInputElement>): void {
    if (e.target.files) {
      const file = e.target.files.item(0);
      if (file) {
        if (this.state.allowedVideoType.includes(file.type)) {
          if (file.size < 4000000) {
            this.setState({ error: undefined, file: file });
          } else {
            this.setState({ error: new Error("Fichier trop volumineux") });
          }
        } else {
          this.setState({ error: new Error("Format de fichier invalide") });
        }
      }
    }
  }
  async handleSend(): Promise<void> {
    let result = undefined;
    switch (this.props.mode) {
      case FormMode.new:
        result = await PostServices.addPost(
          store.get("user", ""),
          this.state.type.valueOf(),
          this.state.categorie.toString(),
          this.state.title,
          this.state.text,
          this.state.file
        );
        if (result instanceof Error) {
          this.setState({ error: result });
        } else {
          this.props.history.push("/");
        }
        break;
      case FormMode.edit:
        result = await PostServices.editPost(
          Number.parseFloat(this.props.match.params.postId),
          store.get("user", ""),
          this.state.type.valueOf(),
          this.state.categorie.toString(),
          this.state.title,
          this.state.url,
          this.state.text,
          this.state.file
        );
        if (result instanceof Error) {
          this.setState({ error: result });
        } else {
          this.props.history.push("/");
        }
        break;
      default:
        break;
    }
  }
  renderTitle(mode: FormMode): string {
    switch (mode) {
      case FormMode.edit:
        return "Editer";
      case FormMode.new:
        return "Crée";
      default:
        return "";
    }
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
              <div className="col-4 p-0">
                <UIButton
                  text="Back"
                  onClick={this.handleBack}
                  className="m-0 col-8"
                ></UIButton>
              </div>
              <h1 className="col-8 p-0 text-justify m-0 align-vertical">
                {this.renderTitle(this.props.mode)} un post
              </h1>
            </Row>
          </Container>
        </RowFluid>
        <div style={{ marginTop: "4vh" }}></div>
        <RowFluid>
          <Container
            fluid
            className="ac-block mx-auto my-1 align-middle"
            style={{ boxShadow: Depths.depth8 }}
          >
            {this.renderError()}
            <Row className="justify-content-center">
              <Col sm={2}>
                <label
                  htmlFor="title"
                  className="p-0 m-0 align-vertical font-weight-bolder"
                >
                  Titre
                </label>
              </Col>
              <Col>
                <input
                  type="text"
                  id="title"
                  className="m-0"
                  placeholder="Titre (3 à 200 charactère)"
                  onChange={this.handleTitle}
                  value={this.state.title}
                ></input>
              </Col>
            </Row>
            <Row
              className="justify-content-center"
              style={{ marginTop: "1vh" }}
            >
              <Col sm={2}>
                <label
                  htmlFor="type"
                  className="p-0 m-0 align-vertical font-weight-bolder"
                >
                  Type
                </label>
              </Col>
              <Col>
                <select
                  id="type"
                  className="m-0"
                  onChange={this.handleTypeSelect}
                  value={this.state.type}
                >
                  <option value="0">Texte</option>
                  <option value="1">Image/Gif</option>
                  {/*<option value="2">Video</option>*/}
                </select>
              </Col>
            </Row>
            <Row
              className="justify-content-center"
              style={{ marginTop: "1vh" }}
            >
              <Col sm={2} className="my-auto">
                <span className="font-weight-bolder">Categorie</span>
              </Col>
              {(this.state.authorization === 1 && (
                <Col sm={3}>
                  <div>
                    <input
                      type="checkbox"
                      id="checkbox_favoris"
                      onChange={this.handleCategorieSelect}
                      value={FeedBlockCategorie.Favoris}
                    />
                  </div>
                  <div>{FeedBlockCategorie.Favoris}</div>
                </Col>
              )) ||
                null}
              {(this.state.type === FeedBlockContentType.Image && (
                <Col sm={5 - this.state.authorization * 1}>
                  <div>
                    <input
                      type="checkbox"
                      id="checkbox_media"
                      onChange={this.handleCategorieSelect}
                      value={FeedBlockCategorie.Media}
                    />
                  </div>
                  <div>{FeedBlockCategorie.Media}</div>
                </Col>
              )) ||
                null}
              {(this.state.type === FeedBlockContentType.Text && (
                <Col sm={5 - this.state.authorization * 1}>
                  <div>
                    <input
                      type="checkbox"
                      id="checkbox_talk"
                      onChange={this.handleCategorieSelect}
                      value={FeedBlockCategorie.Talk}
                    />
                  </div>
                  <div>{FeedBlockCategorie.Talk}</div>
                </Col>
              )) ||
                null}
              {((this.state.type === FeedBlockContentType.Text ||
                this.state.type === FeedBlockContentType.Image) && (
                <Col sm={5 - this.state.authorization * 2}>
                  <div>
                    <input
                      type="checkbox"
                      id="checkbox_advert"
                      onChange={this.handleCategorieSelect}
                      value={FeedBlockCategorie.Advert}
                    />
                  </div>
                  <div>{FeedBlockCategorie.Advert}</div>
                </Col>
              )) ||
                null}
            </Row>
            {this.renderTypeSelect(this.state.type)}
          </Container>
        </RowFluid>
        <RowFluid>
          <Container
            fluid
            className="ac-block mx-auto my-1 align-middle"
            style={{ boxShadow: Depths.depth8 }}
          >
            <Row className="justify-content-center">
              <UIButton
                text="Envoyer"
                className="col-8"
                onClick={this.handleSend}
              />
            </Row>
          </Container>
        </RowFluid>
      </Container>
    );
  }
}

export default FeedBlockFrom;
