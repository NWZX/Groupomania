import React, { Component } from 'react'
import { RouteComponentProps } from 'react-router-dom'
import Container from 'react-bootstrap/Container'
import RowFluid from '../../global-component/RowFluid'
import Row from 'react-bootstrap/Row'
import { Depths } from "@uifabric/fluent-theme/lib/fluent/FluentDepths";
import UIButton from '../../global-component/UIButton';
import { AuthService } from '../../../services/AuthServices';
import Alert from 'react-bootstrap/Alert'

type IParam = {
    username: string;
}
interface IProfileProps extends RouteComponentProps<IParam> {

}
interface IProfileState {
    error?: Error;
    username: string;
    authorization: number;
}

class FormNew extends Component<IProfileProps, IProfileState> {
    /**
     *
     */
    constructor(props: IProfileProps) {
        super(props);
        this.state = {
            error: undefined,
            username: props.match.params.username,
            authorization: 0,
        }
        this.handleBack = this.handleBack.bind(this);
    }
    componentWillMount() {
        this.getAuthorization();
    }
    async getAuthorization() {
        const result = await AuthService.getUser(this.state.username);
        if (result instanceof Error) {
            this.setState({ error: result });
        } else {
            this.setState({ authorization: result.authorization });
        }
    }
    renderAuthorization(authorization: number) {
        switch (authorization) {
            case 1:
                return "Moderateur"

            default:
                return "Utilisateur"
        }
    }
    renderData(): JSX.Element[] | JSX.Element {
        if (!this.state.error) {
            return [<Row key={0} className="justify-content-start">
                <p className="col-5 font-weight-bolder text-right">Utilisateur :</p>
                <p className="col-2 text-left">{this.state.username}</p>
            </Row>,
            <Row key={1}>
                <p className="col-5 font-weight-bolder text-right">Status :</p>
                <p className="col-2 text-left">{this.renderAuthorization(this.state.authorization)}</p>
            </Row>]
        }
        else {
            return <Row className="justify-content-center">
                <Alert variant="danger">{this.state.error.message}</Alert>
            </Row>
        }

    }
    handleBack() {
        this.props.history.push("/");
    }

    render() {
        return (
            <Container fluid className="p-0">
                <RowFluid>
                    <Container
                        fluid
                        className="ac-block align-middle"
                        style={{ boxShadow: Depths.depth8, position: "fixed", top: 0, zIndex: 1 }}
                    >
                        <Row className="justify-content-center">
                            <div className="col-4 p-0">
                                <UIButton text="Back" onClick={this.handleBack} className="m-0"></UIButton>
                            </div>
                            <h1 className="col-8 p-0 text-justify m-0 align-vertical">Groupomania</h1>
                        </Row>
                    </Container>
                </RowFluid>
                <div style={{ marginTop: "8vh" }}></div>
                <RowFluid>
                    <Container
                        fluid
                        className="ac-block mx-auto my-1 align-middle ms-depth-64"
                    >
                        <Row className="justify-content-center">
                            <h2>Profile</h2>
                        </Row>
                        {this.renderData()}
                    </Container>
                </RowFluid>
                <RowFluid>
                    <Container
                        fluid
                        className="ac-block mx-auto my-1 align-middle ms-depth-64"
                    >
                        <Row className="justify-content-center">
                            <UIButton text="Supprimer votre compte" onClick={() => { }} />
                        </Row>
                    </Container>
                </RowFluid>
            </Container>
        )
    }
}

export default FormNew
