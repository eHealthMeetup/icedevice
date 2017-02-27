import React, { Component } from 'react';
import IceApi from '../../backend/ice';
import { executeCode, updateData } from '../../components/EngineerView/developer';
import moment from 'moment';

import { Button, Col, Grid, Row } from 'react-bootstrap';
import './MDView.css';

const MDView = (props)  => (
    <div>
      <h2>View your insights here:</h2>
      <LiveInsights />
    </div>
);

export class LiveInsights extends Component {
    constructor(props) {
        super(props);
        this.onRefresh = this.onRefresh.bind(this);
        this.state = {
            backend: new IceApi(),
            insights: [],
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
        this.onRefresh();
    }

    onRefresh() {
        this.state.backend.getCode().then((insights) => {
            this.setState({insights: insights});
            let updates = insights.map((insight) => {
                insight.author = '';
                insight.code = '';
                return new Promise((resolve, reject) => {
                    this.state.backend.getBlob(insight.code_blob)
                        .then((extInsight) => {
                            insight.author = extInsight.author + ' ';
                            insight.code = extInsight.code;
                            resolve(insight);
                        })
                        .catch(() => {
                            resolve(insight);
                        });
                });
            });
            updateData(this).then(() => {
                Promise.all(updates)
                       .then((insights) => {
                           this.setState({insights: insights});
                           return insights;
                       })
                       .then((insights) => {
                           insights.map((insight, iindex) => {
                               executeCode(`.item-${iindex}`, insight.code, this.state.data, false);
                           });
                       });
            });
        });
    }
    
    render() {
        let itemRenders = this.state.insights.map((insight, iindex) => {
            return (
                <Row className="show-grid md_insight" key={iindex}>
                  <Col md={3}>
                    <p>
                      Insight: <b>{insight.name}</b>
                      ({insight.author}updated {moment(insight.updated).fromNow()})
                    </p>
                  </Col>
                  <Col md={6} mdOffset={6} className={'item-' + iindex}>
                  </Col>
                </Row>
            );
        });
        
        return (
            <div>
              <Grid>
                <Row className="show-grid">
                  <Col md={6} mdOffset={3} className="md_toolbar">
                    <Button bsStyle="default" bsSize="large" block onClick={this.onRefresh}>
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
