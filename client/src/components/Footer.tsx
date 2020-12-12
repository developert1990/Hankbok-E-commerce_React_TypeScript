import React from 'react';
import { Button, Col, Jumbotron, Row, } from "react-bootstrap";


export const Footer = () => {
    return (
        <div className="footer">
            <h1 className="pt-3 text-center font-details-b pb-3">CONTACT ME</h1>
            <h2 className="pt-3 text-center font-details-b pb-3">Created by<br /> Sangmean Hong</h2>
            <Jumbotron className="contact-jumbotron">
                <Row>
                    <Col className="d-flex justify-content-center flex-wrap">
                        <div className="m-2">
                            <a href="mailto:magicq6265@gmail.com" target="_blank" rel="noopener noreferrer">
                                <Button variant="outline-success" title="akjha96@gmail.com">
                                    <i className="fas fa-envelope-square"></i> Email Me
                                </Button>
                            </a>
                        </div>
                        <div className="m-2">
                            <a href="https://www.linkedin.com/in/sangmean-hong/" target="_blank" rel="noopener noreferrer">
                                <Button variant="outline-info" title="Visit my LinkenIn">
                                    <i className="fab fa-linkedin"></i> LinkedIn
                                </Button>
                            </a>
                        </div>
                        <div className="m-2">
                            <a href="https://www.facebook.com/sangmean.hong" target="_blank" rel="noopener noreferrer">
                                <Button variant="outline-primary" title="Say hello on FB">
                                    <i className="fab fa-facebook-square"></i> FaceBook
                                </Button>
                            </a>
                        </div>
                        <div className="m-2">
                            <a href="https://github.com/jadenHong" target="_blank" rel="noopener noreferrer">
                                <Button variant="outline-warning" title="My other projects">
                                    <i className="fab fa-github-square"></i> GitHub
                                </Button>
                            </a>
                        </div>
                        <div className="m-2">
                            <a href="https://www.instagram.com/hong_ca_/" target="_blank" rel="noopener noreferrer">
                                <Button variant="outline-danger" title="Tweets are welcomed!">
                                    <i className="fab fa-instagram-square"></i> Instargram
                                </Button>
                            </a>
                        </div>
                    </Col>
                </Row>
            </Jumbotron>
        </div>
    )
}
