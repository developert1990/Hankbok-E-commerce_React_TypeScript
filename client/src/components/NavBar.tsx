import React from 'react'
import { Nav, Navbar, NavDropdown } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom'
import { signout } from '../actions/userActions';
import { initialAppStateType } from '../store';

export const NavBar = () => {
    const cart = useSelector((state: initialAppStateType) => state.cartStore);
    const { cartItems } = cart;
    const userSignin = useSelector((state: initialAppStateType) => state.userStore);
    const { userInfo } = userSignin;
    const dispatch = useDispatch();
    const signoutHandler = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
        e.preventDefault();
        dispatch(signout());
    }
    return (
        // <div className="navbar">
        <Navbar bg="dark" variant="dark">
            <Link to="/"><Navbar.Brand>대억상회</Navbar.Brand></Link>
            <Nav>
                <Nav.Link><Link to="/">Home</Link></Nav.Link>
                <Nav.Link><Link to="/about">About</Link></Nav.Link>
                <Nav.Link><Link to="/products">Products</Link></Nav.Link>
            </Nav>
            <Nav className="mr-auto">
                <Nav.Link><Link to="/cart">Cart
                {cartItems.length > 0 && (
                        <span className="badge">{cartItems.length}</span>
                    )}
                </Link>
                </Nav.Link>
                {
                    userInfo ? (
                        <NavDropdown title={userInfo.name} id="collasible-nav-dropdown">
                            <Link to="/history"><NavDropdown.Item >Order History</NavDropdown.Item></Link>
                            <Link to="#signout" onClick={signoutHandler}><NavDropdown.Item>Sign Out</NavDropdown.Item></Link>
                        </NavDropdown>
                    ) : (
                            <Nav.Link> <Link to="/signin">Sign In</Link></Nav.Link>
                        )
                }

            </Nav>
        </Navbar>
        // </div>
    )
}
