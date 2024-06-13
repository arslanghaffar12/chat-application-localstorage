import React, { Fragment, useContext, useEffect, useState } from 'react';
import { Collapse, DropdownMenu, DropdownToggle, Nav, Navbar, NavbarBrand, NavbarToggler, NavItem, UncontrolledDropdown } from 'reactstrap';
import { logo } from './common';
import logo1 from "../assets/company-logo.jpg"
import { useSelector } from 'react-redux';


export default function TopHeaders() {

    const [isOpen, setIsOpen] = useState(false);
    const currentUser = useSelector(state => state.auth.user);


    const toggle = () => {
        setIsOpen(!isOpen);
    };






    return (
        <div>
            <Fragment>
                <Navbar color="white" expand="md" light className='py-3 border-bottom border-2' container>
                    <NavbarBrand href="/">
                        <img src={logo1} width="50px" />
                    </NavbarBrand>
                    <NavbarToggler onClick={toggle} />
                    <Collapse navbar isOpen={isOpen} >
                        <Nav className='me-auto' navbar style={{ backgroundColor: '' }}>
                            {
                                <span className='className="d-block small opacity-50"'><i>You dont have any Menu please contact admin</i></span>

                            }
                        </Nav>
                    </Collapse>
                </Navbar>
            </Fragment>
        </div>
    )
}
