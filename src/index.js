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

//更加经纬度设置定位点
class Demo1 extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            lng: 116.452961,
            lat: 39.917553
        }
    }
    componentWillReceiveProps(next) {
        if (Object.getOwnPropertyNames(this.props.plugin != null).length != 0) return;
        const {plugin, service} = next;
        this.getLocation(plugin.Geolocation);
        this.getAddress(service.Geocoder);
    }
    render() {
        const {lng, lat} = this.state;
        const makers = [
            {
                position: [lng, lat]
            }
        ]
        const cfg = {
            zoom: 17,
            center: [lng, lat],
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
                            value={lng}
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
                <Map
                    {...cfg}
                    plugins={this.props}
                    callback={this.props}/>
            </div>
        )
    }
    onChangeLong() {
        this.setState({
            lng: Number(this.refs.d1_long.value)
        })
    }
    onChangeLat() {
        this.setState({
            lat: Number(this.refs.d1_lat.value)
        })
    }
    getLocation(geo) {
        geo.getCurrentPosition();
        window.AMap.event.addListener(geo, 'complete', (info) => {
            console.log("定位结果：", info);
            this.setState({
                lng: info.position.lng,
                lat: info.position.lat
            })
        });//返回定位信息
        window.AMap.event.addListener(geo, 'error', (info) => {
            console.error(info);
        });//返回定位出错信息
    }
    getAddress(coder) {
        console.log("xxxxx");
        coder.getAddress(new window.AMap.LngLat(112.752686, 37.692514), function (status, result) {
            //根据服务请求状态处理返回结果
            if (status == 'error') {
                alert("服务请求出错啦！ ");
            }
            if (status == 'no_data') {
                alert("无数据返回，请换个关键字试试～～");
            }
            else {
                console.warn(result);
            }
        });
    }
}

//注册插件
Demo1 = Map.plugin([
    {
        name: "Geolocation",
        cfg: {
            enableHighAccuracy: true,//是否使用高精度定位，默认:true
            timeout: 10000,          //超过10秒后停止定位，默认：无穷大
            maximumAge: 0,           //定位结果缓存0毫秒，默认：0
            convert: true,           //自动偏移坐标，偏移后的坐标为高德坐标，默认：true
            showButton: true,        //显示定位按钮，默认：true
            buttonPosition: 'LB',    //定位按钮停靠位置，默认：'LB'，左下角
            showMarker: true,        //定位成功后在定位到的位置显示点标记，默认：true
            showCircle: true,        //定位成功后用圆圈表示定位精度范围，默认：true
            panToLocation: true,     //定位成功后将定位到的位置作为地图中心点，默认：true
            zoomToAccuracy: true      //定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
        }
    }
])(Demo1);

//注册服务
Demo1 = Map.service([
    {
        name: "Geocoder",
        cfg: {
            radius: 1000,
            extensions: "all"
        }
    }
])(Demo1);

ReactDOM.render(<App/>, document.getElementById("app"));
