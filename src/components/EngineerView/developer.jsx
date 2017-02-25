import React, { Component } from 'react';
import brace from 'brace';
import AceEditor from 'react-ace';
import Chart from 'chart.js';
import { Button, ButtonToolbar, Col, Grid, Panel, Row } from 'react-bootstrap';

import 'brace/mode/javascript';
import 'brace/theme/github';
import 'brace/theme/xcode';
import 'brace/theme/twilight';

function getHtmlOutput() {
    let results = document.querySelector('#results');
    results.innerHTML = '<div class="output"></div>';
    return document.querySelector('#results .output');
}

function getChart() {
    let results = document.querySelector('#results');
    results.innerHTML = '<canvas id="outputChart" width="400" height="300"></canvas>';
    return document.querySelector('#results canvas');
}

function _executeCode(_the_code, data) {
    let pulse = data.pulse;
    let pressure = data.pressure;
    let galvanic = data.galvanic;
    return eval(_the_code);
}

function executeCode(the_code, data, refresh) {
    try {
        let results = document.querySelector('#results');
        results.innerHTML = '<div class="returnValue"></div>';

        Chart.defaults.global.animation.duration = refresh ? 0 : 500;
        let status = {message:'No errors.', output: _executeCode(the_code, data)};
        if (document.querySelectorAll('#results .returnValue').length == 1) {
            results.innerText = status.output === undefined ? '' : status.output;
        }
        return status;
    } catch(e) {
        return {message: e.message, output: ''};
    }
}

export default class Developer extends Component {
    constructor(props) {
        super(props);
        this.onEdit = this.onEdit.bind(this);
        this.onRefresh = this.onRefresh.bind(this);
        this.scheduleRefresh = this.scheduleRefresh.bind(this);
        this.state = {
            codeVal: '// Type your Javascript/ES6 code in here\n' +
                     '["Your", "output", "here!"].join(" ");\n',
            resultsLog: 'No errors.',
            resultOutput: '',
            timer: false,
            data: {
                pulse: [],
                pressure: [],
                galvanic: []
            }
        };
        this.scheduleRefresh();
    }

    componentWillUnmount() {
        clearTimeout(this.state.timer);
    }

    onRefresh() {
        let n1 = Math.floor((Math.random() * 10) + 1);
        let n2 = Math.floor((Math.random() * 10) + 1);
        let n3 = Math.floor((Math.random() * 10) + 1);
        let pulse = this.state.data.pulse;
        pulse.push(n1);
        if (pulse.length > 10)
            pulse.shift();
        
        this.setState({
            data: {
                pulse: pulse,
                pressure: this.state.data.pressure,
                galvanic: this.state.data.galvanic
            }
        });
        let result = executeCode(this.state.codeVal, this.state.data, true);
        this.setState({
            resultsLog: result.message,
            resultOutput: result.output,
            timer: this.scheduleRefresh()
        });
    }

    scheduleRefresh() {
        let self = this;
        return setTimeout(function() {
            self.onRefresh();
        }, 1000);
    }

    onEdit(newValue) {
        let result = executeCode(newValue, this.state.data, false);
        this.setState({
            codeVal: newValue,
            resultsLog: result.message,
            resultOutput: result.output
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
                        enableBasicAutocompletion={true}
                        setOptions={{
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
                
                <Row className="show-grid">
                  <Col sm={12} md={12}>
                    <h3>Check out these samples</h3>
                  </Col>
                </Row>
                <Row className="show-grid">
                  <Col sm={6} md={6}>
                    <AceEditor
                        mode="javascript"
                        theme="xcode"
                        name="sample1"
                        highlightActiveLine={false}
                        readOnly={true}
                        editorProps={{$blockScrolling: true}}
                        value={
                            '// Draw a barchart\n' +
                               'let chart = new Chart(getChart(), {\n' +
                               '    type: "bar", \n' +
                               '    data: {\n' +
                               '        datasets: [{\n' +
                               '            label: "Pulse",\n' +
                               '            data: [1, 2, 3]\n' +
                               '        }],\n' +
                               '        labels: ["Red", "Blue", "Green"]\n' +
                               '    }\n' +
                               '});\n' +
                               '\n\n// Output some formatted html\n' +
                               'let output = getHtmlOutput();\n' +
                               'output.innerHTML = "Your <b>output</b> here";\n'
                              }
                        height="20em"
                        width="100%"
                        setOptions={{showGutter: false}}
                    />
                  </Col>
                  <Col sm={6} md={6}>
                    <AceEditor
                        mode="javascript"
                        theme="xcode"
                        name="sample1"
                        highlightActiveLine={false}
                        readOnly={true}
                        editorProps={{$blockScrolling: true}}
                        value={
                            '// Draw a line chart\n' +
                               'let chart = new Chart(getChart(), {\n' +
                               '    type: "line", \n' +
                               '    data: {\n' +
                               '        datasets: [{\n' +
                               '            label: "Pulse",\n' +
                               '            data: [1, 3, 2]\n' +
                               '        }],\n' +
                               '        labels: ["Red", "Blue", "Green"]\n' +
                               '    }\n' +
                               '});\n'
                              }
                        height="20em"
                        width="100%"
                        setOptions={{showGutter: false}}
                    />
                  </Col>
                </Row>
              </Grid>
            </div>
        );
    }
}
