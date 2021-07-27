import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {
  Form,
  Table,
  Grid,
  Button,
  Input,
  Select,
  Field,
  Dialog,
} from '@alifd/next';
import { Provider, connect } from 'react-redux';
import { createStore } from 'redux';
import { columns } from './dataSource';
import './index.scss';

import DialogContent from './dialog-content';

import { Action, createReducer } from './store';

const { Row, Col } = Grid;

const formLayout = {
  labelCol: { fixedSpan: 4 },
};

const siteList = [{ label: '浙江嘉兴公司', value: '314000' }];

const api = {
  getList: 'https://mocks.sto.cn/mock/site/settle/query/settleDetail',
};

const store = createStore(createReducer);

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      formData: {},
      data: [],
      dialogVisible: false,
    };
  }

  field = new Field(this);

  handleSubmit = () => {
    fetch(api.getList, {
      method: 'get',
    })
      .then((res) => res.json())
      .then(({ data }) => {
        this.setState({
          data: data.items,
        });
      });
  };

  showDialog = () =>
    this.setState({
      dialogVisible: true,
    });

  hideDialog = () =>
    this.setState({
      dialogVisible: false,
    });

  render() {
    const { data, dialogVisible, stupidAction } = this.state;

    const renderColumns = columns.concat({
      title: '操作',
      dataIndex: 'action',
      lock: 'right',
      width: 100,
      cell: () => {
        return (
          <Button text type="primary" onClick={this.showDialog}>
            详情
          </Button>
        );
      },
    });

    return (
      <div id="app">
        {stupidAction && <div />}
        <section>
          <Form field={this.field} className="my-form">
            <div className="form-section-left">
              <Row>
                <Col span="8">
                  <Form.Item label="所属网点" {...formLayout} fullWidth>
                    <Select dataSource={siteList}></Select>
                  </Form.Item>
                </Col>
                <Col span="8">
                  <Form.Item label="运单号" {...formLayout} fullWidth>
                    <Input />
                  </Form.Item>
                </Col>
              </Row>
            </div>
            <div className="form-section-right">
              <Form.Item>
                <Form.Submit type="primary" onClick={this.handleSubmit}>
                  查询
                </Form.Submit>
              </Form.Item>
              <Form.Item>
                <Form.Reset>重置</Form.Reset>
              </Form.Item>
            </div>
          </Form>
        </section>
        <section>
          <Table dataSource={data} fixedHeader maxBodyHeight={250}>
            {renderColumns.map((c) => (
              <Table.Column key={c.title} {...c}></Table.Column>
            ))}
          </Table>
        </section>
        <Dialog
          className="my-dialog"
          title="详情"
          visible={dialogVisible}
          onClose={this.hideDialog}
        >
          <DialogContent update={this.updateStupidAction}></DialogContent>
        </Dialog>
      </div>
    );
  }
}

function render() {
  ReactDOM.render(<App />, document.getElementById('root'));
}

render();

/**
 * hot api accept demo on dependencies and self
 */
if (module.hot) {
  module.hot.accept('./dialog-content.jsx', () => {
    render();
  });
}
