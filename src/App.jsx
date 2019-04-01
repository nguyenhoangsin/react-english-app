import React, { Component, createRef } from 'react';
import { Container, Row, Col, Button, Label } from 'reactstrap';
import Select from 'react-select';
import logo from './logo.svg';
import './App.css';
import dataImport from './data.json';

class App extends Component {
  state = {
    isRun: false,
    data: dataImport,
    immutableDataFile: null,
    seconds: { value: 1.0, label: '1.0s' },
    type: { value: 0, label: 'Hòa trộn' },
  };
  dataFile = createRef();

  componentDidMount() {
    // this.setState({ data: dataImport });
  }

  handleSortData = () => {
    const { data } = this.state;
    this.setState({
      data: [...data].sort((a, b) => 0.5 - Math.random()),
    })
  };

  handeInterval = () => {
    const { isRun, immutableDataFile, seconds, type } = this.state;
    const flagMix = Math.random() > 0.5 ? 2 : 1;
    const flag = type.value === 0 ? flagMix : type.value;

    clearInterval(window.timer);
    if (isRun) {
      window.timer = setInterval(() => {
        this.setState({ data: this.createRandomData(immutableDataFile || dataImport, flag)})
      }, seconds.value * 1000);
    }
  };

  handleImportDataFile = () => {
    try {
      const reader = new FileReader();
      reader.onload = (e) => {
        const dataJson = JSON.parse(e.target.result);
        this.setState({ data: dataJson, immutableDataFile: dataJson });
      };
      reader.readAsText(this.dataFile.current.files[0]);
    } catch (error) {
      console.log(error);
    }
  };

  createRandomData = (data, flag) => {
    const rdIndex = Math.floor(Math.random()* data.length);
    const newItem = { ...data[rdIndex], flag };
    const newData = [...data];

    newData[rdIndex] = newItem;
    console.log(newData)
    return newData;
  };


  render() {
    const { isRun, data, seconds, type } = this.state;

    this.handeInterval();
    console.log(isRun)

    return (
      <div className="app">
        <Container fluid>
          <div className="d-flex pt-3 pb-2">
            <Button
              className="mr-2 mb-3 button-size" color={isRun ? 'danger' : 'primary'} size="sm"
              onClick={() => this.setState({ isRun: !isRun })}
            >
              {isRun ? 'Dừng lại' : 'Bắt đầu'}
            </Button>
            <Button
              className="mr-2 mb-3 button-size" color="primary" size="sm"
              onClick={this.handleSortData}
            >
              Xáo trộn
            </Button>
            <Label className="mr-2 mb-3 btn btn-primary btn-sm button-size">
              {console.log(this.dataFile.current)}
              {this.dataFile.current && this.dataFile.current.files[0] ? this.dataFile.current.files[0].name : 'Chọn file'}
              <input
                className="d-none" type="file"
                ref={this.dataFile}
                onChange={this.handleImportDataFile}
              />
            </Label>
            <Select
              className="mr-2 mb-3 select-size-sm"
              placeholder="Giây"
              options={[
                { value: 0.5, label: '0.5s' },
                { value: 1.0, label: '1.0s' },
                { value: 1.5, label: '1.5s' },
                { value: 2.0, label: '2.0s' },
                { value: 2.5, label: '2.5s' },
                { value: 3.0, label: '3.0s' },
              ]}
              value={seconds}
              onChange={(v) => this.setState({ seconds: v })}
            />
            <Select
              className="mr-2 mb-3 select-size"
              placeholder="Chọn chế độ"
              options={[
                { value: 0, label: 'Hòa trộn' },
                { value: 1, label: 'Âm cuối ed' },
                { value: 2, label: 'Âm cuối s/es' },
              ]}
              value={type}
              onChange={(v) => this.setState({ type: v })}
            />
            {isRun && <img src={logo} className="mb-3 app-logo" alt="logo" />}
          </div>
          <Row className="row-8">
            {
              data && data.map(d => (
                <Col key={d.word} className="col-min-width px-2 mb-3">
                  <div
                    className={`
                      h-100 p-3 rounded shadow bg-white border-item
                      ${d.flag === 0 && 'border-white'}
                      ${d.flag === 1 && 'border-success'}
                      ${d.flag === 2 && 'border-warning'}
                    `}
                  >
                    <div
                      className={`
                        ${d.flag === 1 && 'font-weight-bold text-success'}
                        ${d.flag === 2 && 'font-weight-bold text-warning'}
                      `}
                    >
                      {d.word}
                    </div>
                    <div className="text-secondary">/{d.spelling}/</div>
                  </div>
                </Col>
              ))
            }
          </Row>
        </Container>
      </div>
    );
  }
}

export default App;
