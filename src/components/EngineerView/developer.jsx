import React, { Component } from 'react';
import brace from 'brace';
import AceEditor from 'react-ace';
import Chart from 'chart.js';
import { Button, ButtonToolbar, Col, Grid, Panel, Row } from 'react-bootstrap';

import 'brace/mode/javascript';
import 'brace/theme/github';
import 'brace/theme/xcode';

import IceApi from '../../backend/ice';
import moment from 'moment';
import underscore from 'underscore';

function momentjs() {
    return moment;
}

function underscorejs() {
    return underscore;
}

/*
 * Helper function designed to provide a clean local scope against which the insights code 
 * can be evaluated.
 */
function _executeCode(selector, _the_code, data) {
    let bpTimes = data.bpTimes;
    let bpTimestamps = data.bpTimestamps;
    let bpValues = data.bpValues;

    let edaTimes = data.edaTimes;
    let edaTimestamps = data.edaTimestamps;
    let edaValues = data.edaValues;

    let dgTimestamps = data.dgTimestamps;
    let dgRespTimes = data.dgRespTimes;
    let dgRespCorrect = data.dgRespCorrect;

    let pulseTimestamps = data.pressure;
    
    let moment = momentjs();
    let _ = underscorejs();

    /*
     * Inserts a canvas element as required by the chart.js library which is used to draw
     * the nice graphics.
     * @insights_api
     */
    var getChart = function getChart() {
        let results = document.querySelector(selector);
        results.innerHTML = '<canvas id="outputChart" width="400" height="300"></canvas>';
        return document.querySelector(`${selector} canvas`);
    };
    
    /*
     * Inserts a div element in to the results. This is designed for direct manipulation 
     * of HTML content.
     * @insights_api
     */
    var getHtmlOutput = function getHtmlOutput() {
        let results = document.querySelector(selector);
        results.innerHTML = '<div class="output"></div>';
        return document.querySelector(`${selector} .output`);
    };


    return eval(_the_code);
}

/*
 * Execute the insight code and show its output (or error message) to the user.
 */
export const executeCode = function executeCode(selector, the_code, data, animation) {
    try {
        let results = document.querySelector(`${selector}`);
        results.innerHTML = '<div class="returnValue"></div>';

        Chart.defaults.global.animation.duration = animation ? 500 : 0;
        let status = {
            message:'No errors.',
            output: _executeCode(selector, the_code, data)};
        if (document.querySelectorAll(`${selector} .returnValue`).length == 1) {
            results.innerText = status.output === undefined ? '' : status.output;
        }
        return status;
    } catch(e) {
        return {message: e.message, output: ''};
    }
};

export const updateData = function updateData(comp) {
    return comp.state.backend.getSensors().then((json) => {
        let d = json[0].data;
        comp.setState({
            data: {
                bpTimes: d.bp.times,
                bpTimestamps: d.bp.timestamps,
                bpValues: d.bp.values,

                edaTimes: d.eda.times,
                edaTimestamps: d.eda.timestamps,
                edaValues: d.eda.values,
                
                dgTimestamps: d.duckgoose.timestamps,
                dgRespTimes: d.duckgoose.response_times,
                dgRespCorrect: d.duckgoose.response_correct,
                
                pulseTimestamps: d.pulse
            }
        });
    });
};

export default class Developer extends Component {
    constructor(props) {
        super(props);
        this.onEdit = this.onEdit.bind(this);
        this.onRefresh = this.onRefresh.bind(this);
        this.onPublish = this.onPublish.bind(this);
        this.scheduleRefresh = this.scheduleRefresh.bind(this);
        this.state = {
            backend: new IceApi(),
            codeVal: '// Usable variables for each sensor\n' +
                     '// BP: bpTimestamps, bpTimes, bpValues\n' +
                     '// EDA: edaTimestamps, edaTimes, edaValues\n' +
                     '// DG: dgTimestamps, dgRespCorrect, dgRespTimes\n' +
                     '// PULSE: pulseTimestamps\n\n' +
                     '// Type your Javascript/ES6 code in here\n' +
                     '["Your", "output", "here!"].join(" ");\n',
            resultsLog: 'No errors.',
            resultOutput: '',
            timer: false,
            data: {
                bpTimes: [],
                bpTimestamps: [],
                bpValues: [],

                edaTimes: [],
                edaTimestamps: [],
                edaValues: [],
                
                dgTimestamps: [],
                dgRespTimes: [],
                dgRespCorrect: [],
                
                pulseTimestamps: []
            }
        };
        this.scheduleRefresh(true);
    }

    componentWillUnmount() {
        clearTimeout(this.state.timer);
    }

    onRefresh() {
        updateData(this).then(() => {
            this.scheduleRefresh(false);
        });
    }

    scheduleRefresh(animation) {
        let self = this;
        let result = executeCode(
            '#results', this.state.codeVal, this.state.data, animation);
        clearTimeout(this.state.timer);
        this.setState({
            resultsLog: result.message,
            resultOutput: result.output,
            timer: setTimeout(function() {
                self.onRefresh();
            }, 1000)
        });
    }

    onEdit(newValue) {
        this.setState({codeVal: newValue});
        this.scheduleRefresh(true);
    }

    onPublish() {
        this.state.backend.postCode('test', 'Mihai', this.state.codeVal);
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
                    <Button
                        bsStyle="success" bsSize="large"
                        onClick={this.onPublish}>
                      Publish
                    </Button>
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
                            '// Example 1 - Draw a barchart\n' +
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
                               '\n\n// Example 2 - Output some formatted html\n' +
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
                            '// Example 3 - Draw a line chart for BP values\n' +
                               'let chart = new Chart(getChart(), {\n' +
                               '    type: "line", \n' +
                               '    data: {\n' +
                               '        datasets: [{\n' +
                               '            label: "Blood Pressure",\n' +
                               '            data: bpValues\n' +
                               '        }],\n' +
                               '        labels: bpTimes\n' +
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
