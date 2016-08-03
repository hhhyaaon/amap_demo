import React from "react"
import ReactDOM from "react-dom"
import Core from "./utils/core.js"
import Map from "./components/Map.js"
import Maker from "./components/Maker.js"

export default class App extends React.Component {
    constructor(props) {
        super(props)
    }
    render() {

        return (
            <div>
                <Demo1/>
            </div>
        )
    }
}

class Demo1 extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            long: 116.480983,
            lat: 39.989628
        }
    }
    render() {
        const {long, lat} = this.state;
        const makers = [
            {
                position: [long, lat]
            }
        ]
        const cfg = {
            // zoom: 15
            maker: makers
        }
        return (
            <div id="demo_1">
                <h3>根据经纬度设置坐标点</h3>
                <ul>
                    <li>
                        <label>经度：</label>
                        <input
                            type="number"
                            step={0.01}
                            ref="d1_long"
                            value={long}
                            onChange={this.onChangeLong.bind(this) }/>
                    </li>
                    <li>
                        <label>纬度：</label>
                        <input
                            type="number"
                            step={0.01}
                            ref="d1_lat"
                            value={lat}
                            onChange={this.onChangeLat.bind(this) }/>
                    </li>
                </ul>
                <Map {...cfg}/>
            </div>
        )
    }
    onChangeLong() {
        console.log("xx");
        this.setState({
            long: Number(this.refs.d1_long.value)
        })
    }
    onChangeLat() {
        this.setState({
            lat: Number(this.refs.d1_lat.value)
        })
    }
}


ReactDOM.render(<App/>, document.getElementById("app"));
