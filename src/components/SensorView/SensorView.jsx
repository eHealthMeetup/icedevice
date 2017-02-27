import React, { Component } from 'react';
import IceApi from '../../backend/ice';

import { Button, ButtonToolbar, Col, Grid, Panel, Row } from 'react-bootstrap';

import ReactSimpleRange from 'react-simple-range';
import './SensorView.css';

const SensorView = (props)  => (
    <div>
      <h2>This is Sensor View component</h2>
      <RandomSensor />
    </div>
);


export class RandomSensor extends Component {
    constructor(props) {
        super(props);
        this.onChange = this.onChange.bind(this);
        this.renderEDA = this.renderEDA.bind(this);
        this.renderBP = this.renderBP.bind(this);
        this.renderPulse = this.renderPulse.bind(this);
        this.renderDuckGoose = this.renderDuckGoose.bind(this);
        this.scheduleDuck = this.scheduleDuck.bind(this);
        
        let chance = (Math.random() * 100);
        // let chance = 100;
        let variable = chance<25 ? 'EDA' :
                       chance<50 ? 'BP' :
                       chance<75 ? 'PULSE' : 'DG'
        let renderer = {
            'EDA': this.renderEDA,
            'BP': this.renderBP,
            'PULSE': this.renderPulse,
            'DG': this.renderDuckGoose
        }
        this.state = {
            backend: new IceApi(),
            value: 90,
            timer: false,
            duck: chance < 88 ? 'goose' : 'duck',
            duckTimer: new Date().getTime(),
            renderSensor: renderer[variable],
            variable: variable
        };
        this.scheduleDuck();
    }

    componentWillUnmount() {
        clearTimeout(this.state.timer);
    }
    
    onChange(state) {
        if (this.state.variable == 'DG') {
            let responseTime = new Date().getTime() - this.state.duckTimer;
            let responseCorrect = state.value == this.state.duck ? 2 : 1;
            this.state.backend.postValue('DGCORRECT', responseCorrect);
            this.state.backend.postValue('DGTIME', responseTime);
        } else {
            this.state.backend.postValue(this.state.variable, state.value);
        }
        this.setState({
            value: state.value,
            duck: 'unk'
        });
    }

    scheduleDuck() {
        let chance = (Math.random() * 100);
        let self = this;
        clearTimeout(this.state.timer);
        this.setState({
            duck: chance < 50 ? 'goose' : 'duck',
            duckTimer: new Date().getTime(),
            timer: setTimeout(function() {
                self.scheduleDuck();
            }, 5000)
        });
    }
    
    renderEDA() {
        return (
            <Row className="show-grid">
              <Col md={6} mdOffset={3} className="sensor">
                <p>EDA - Electrodermal activity (0-100)</p>
                <ReactSimpleRange
                    label
                    horizontal
                    sliderSize={4}
                    thumbSize={24}
                    min={0} max={100} step={10}
                    value={this.state.value}
                    onChange={this.onChange}
                />
              </Col>
            </Row>
        );
    }
    
    renderBP() {
        return (
            <Row className="show-grid">
              <Col md={6} mdOffset={3} className="sensor">
                <p>Blood Pressure (0-200)</p>
                <ReactSimpleRange
                    label
                    vertical verticalSliderHeight="200px"
                    disableThumb
                    sliderSize={90}
                    min={0} max={200} step={10}
                    value={this.state.value}
                    onChange={this.onChange}
                />
              </Col>
            </Row>
        );
    }

    renderPulse() {
        return (
            <Row className="show-grid">
              <Col md={6} mdOffset={3} className="sensor">
                <p>Heartbeat</p>
                <Button bsStyle="warning" bsSize="large" block onClick={() => this.onChange({value:'Pulse'})}>
                  Pulse!
                </Button>
              </Col>
            </Row>
        );
    }

    renderDuckGoose() {
        return (
            <Row className="show-grid">
              <Col md={6} mdOffset={3} className="sensor">
                <p>Duck or Goose?</p>
                <img src={this.state.duck + '.png'} />
                <Button bsStyle="warning" bsSize="large" block
                        disabled={this.state.duck == 'unk'}
                        onClick={() => this.onChange({value:'goose'})}>
                  Goose
                </Button>
                <Button bsStyle="success" bsSize="large" block
                        disabled={this.state.duck == 'unk'}
                        onClick={() => this.onChange({value:'duck'})}>
                  Duck
                </Button>
              </Col>
            </Row>
        );
    }

    render() {
        return (
            <div>
              <Grid>
                {this.state.renderSensor()}
              </Grid>
            </div>
        );
    }
};


export default SensorView
