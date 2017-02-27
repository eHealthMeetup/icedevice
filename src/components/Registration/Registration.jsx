import React, { Component } from 'react';
import IceApi from '../../backend/ice';
import {Modal} from 'react-bootstrap';

import { Button, Checkbox, FormGroup, ControlLabel, FormControl, HelpBlock } from 'react-bootstrap';

export default class Registration extends Component {
    constructor(props) {
        super(props);
        this.state = {
            backend: new IceApi(),
            name: '',
            email: '',
            phone: '',
            organization: '',
            attend: false,
            present: false,
            interest: false,
            insight: ''
        };
    }

    textField({id, label, help, ...props }) {
        return (
            <FormGroup controlId={id}>
              <ControlLabel>{label}</ControlLabel>
              <FormControl {...props} />
              {help && <HelpBlock>{help}</HelpBlock>}
            </FormGroup>);
    }
    
    render() {
        return (
            <Modal show={this.props.isModalOpen} onHide={this.props.onUserClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Modal heading</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div>
                        <form md={6} mdOffset={3}>
                            {this.textField({
                                id: 'formInsight',
                                type: 'text',
                                label: 'Insight Description',
                                onChange: (e) => this.setState({insight:e.target.value}),
                                value: this.state.insight,
                                placeholder: 'Insight description'
                            })}
                            {this.textField({
                                id: 'formName',
                                type: 'text',
                                label: 'Name',
                                onChange: (e) => this.setState({name:e.target.value}),
                                value: this.state.name,
                                placeholder: 'Enter your name'
                            })}
                            {this.textField({
                                id: 'formEmail',
                                type: 'email',
                                label: 'Email address',
                                onChange: (e) => this.setState({email:e.target.value}),
                                value: this.state.email,
                                placeholder: 'Enter email'
                            })}
                            {this.textField({
                                id: 'formPhone',
                                type: 'text',
                                label: 'Phone number',
                                onChange: (e) => this.setState({phone:e.target.value}),
                                value: this.state.phone,
                                placeholder: 'Enter your phone number'
                            })}
                            {this.textField({
                                id: 'formOrg',
                                type: 'text',
                                label: 'Organization',
                                onChange: (e) => this.setState({organization:e.target.value}),
                                value: this.state.organization,
                                placeholder: 'Enter the name of your employer'
                            })}
                            <Checkbox
                                onChange={(e) => this.setState({attend: e.target.value})}
                                value={this.state.attend}>
                                I'd like to attend future editions of this event
                            </Checkbox>
                            <Checkbox
                                onChange={(e) => this.setState({present: e.target.value})}
                                value={this.state.present}>
                                I'd like to give a presentation in a future edition
                            </Checkbox>
                            <Checkbox
                                onChange={(e) => this.setState({interest: e.target.value})}
                                value={this.state.interest}>
                                I'd like to be involved in projects and work with mobile and wearable tech
                            </Checkbox>
                            <Button bsStyle="success" type="submit" onClick={() => this.props.onUserSubmit(this.state)}>Submit</Button>
                        </form>
                    </div>
                </Modal.Body>
            </Modal>

        );
    }
}

