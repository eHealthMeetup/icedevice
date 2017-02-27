import React, { Component } from 'react';
import IceApi from '../../backend/ice';
import moment from 'moment';

import { Button, Col, Grid, Row } from 'react-bootstrap';
import './MDView.css';

const MDView = (props)  => (
    <div>
      <h2>This is MD View component</h2>
      <LiveInsights />
    </div>
);

export class LiveInsights extends Component {
    constructor(props) {
        super(props);
        this.onRefresh = this.onRefresh.bind(this);
        this.state = {
            backend: new IceApi(),
            insights: []
        };
        this.onRefresh();
    }

    onRefresh() {
        this.state.backend.getCode().then((insights) => {
            this.setState({insights: insights});
            
        });
    }
    
    render() {
        let itemRenders = this.state.insights.map((insight) => {
            return (
                <Row className="show-grid">
                  <Col md={12} className="md_insight">
                    <p>Insight: <b>{insight.name}</b> ({moment(insight.updated).max().fromNow()})</p>
                  </Col>
                </Row>
            );
        });
        
        return (
            <div>
              <Grid>
                <Row className="show-grid">
                  <Col md={6} mdOffset={3} className="md_toolbar">
                    <Button bsStyle="primary" bsSize="large" block onClick={this.onRefresh}>
                      Refresh
                    </Button>
                  </Col>
                </Row>
                {itemRenders}
              </Grid>
              
            </div>
        );
    }
}


export default MDView;
