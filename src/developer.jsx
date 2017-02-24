import React, { Component } from 'react';
import brace from 'brace';
import AceEditor from 'react-ace';
import { Button, ButtonToolbar, Col, Grid, Panel, Row } from 'react-bootstrap';

import 'brace/mode/javascript';
import 'brace/theme/github';

function executeCode(the_code) {
    try {
        var output = document.getElementById('results');
        eval(the_code);
    } catch(e) {
        return e.message;
    }
    return 'No errors.';
}

export default class Developer extends Component {
    constructor(props) {
        super(props);
        this.onEdit = this.onEdit.bind(this);
        this.state = {
            codeVal: '// Type your Javascript code in here\noutput.innerText = "Your output here";\n',
            resultsLog: 'No errors.'
        };
    }

    onEdit(newValue) {
        this.setState({
            codeVal: newValue,
            resultsLog: executeCode(newValue)
        });
    }

    render() {
        let panelStyle = this.state.resultsLog == 'No errors.' ? 'primary' : 'danger';
        return (
            <div className="developer">
              <Grid>
                <Row className="show-grid">
                  <Col sm={12} md={12}>
                    <h2>Welcome to eHealth visualization builder.</h2>
                  </Col>
                </Row>
                
                <Row className="show-grid">
                  <Col sm={6} md={6}>
                    <AceEditor
                        mode="javascript"
                        theme="github"
                        onChange={this.onEdit}
                        name="theEditor"
                        editorProps={{$blockScrolling: true}}
                        value={this.state.codeVal}
                        height="20em"
                        width="100%"
                        setOptions={{
                                enableBasicAutocompletion: true,
                                enableLiveAutocompletion: true,
                                tabSize: 4,
                                fontSize: 14,
                                showGutter: true
                            }}
                    />
                  </Col>
                  <Col sm={6} md={6}>
                    <Panel header={this.state.resultsLog} bsStyle={panelStyle}>
                      <div id="results">Your output here</div>
                    </Panel>
                    <Button bsStyle="success" bsSize="large">Publish</Button>
                  </Col>
                </Row>
              </Grid>
            </div>
        );
    }
}
