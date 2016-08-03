import React from "react"
import ReactDOM from "react-dom"
import Core from "../utils/core.js"

import Maker from "./Maker.js"

export default class Map extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            map_id: `amap_${Core.getRandom()}`,
            map: null,
            maker: []
        }
        //加载amap sdk
        Core.insert({
            name: "amap",
            src: "http://webapi.amap.com/maps?v=1.3&key=38dbfac589d262c87bd3aaba70038538&callback=init"
        })
    }
    componentWillReceiveProps(nextProps) {
        //todo 合并、校验cfg
        const {map, maker} = this.state;
        //初始化地图
        //const map = this.initMap(map_id, nextProps);
        //重置定位点
        maker.map(m => {
            this.removeMaker(m);
        });
        this.initMaker(map, nextProps.maker);
    }
    componentDidMount() {
        window.init = function () {

            console.log("加载完毕！！", arguments);
            //初始化amap
            if (!window.AMap) {
                console.error("AMap is required");
            } else {
                const {map_id} = this.state;
                //初始化地图
                const map = this.initMap(map_id, this.props);
                //初始化定位点
                const maker = this.initMaker(map, this.props.maker);
            }
        }.bind(this, "a");
    }
    componentWillUnmount() {
        //卸载sdk
        Core.remove("amap");
        window.AMap = null;
    }
    render() {
        const {map_id} = this.state;
        const {width, height, maker} = this.props;
        //样式
        const styles = {
            style: {
                width,
                height
            }
        }

        return (
            <div
                id={map_id}
                {...styles}></div>
        )
    }

    //初始化地图
    initMap(id, cfg) {
        let _cfg = {};
        //获取纯cfg
        Object.getOwnPropertyNames(cfg).map(name => {
            if (Map.defaultProps[name] !== undefined) {
                _cfg[name] = cfg[name]
            }
        });
        const map = new AMap.Map(id, _cfg);
        this.setState({
            map: map
        });
        return map;
    }

    //初始化定位点
    initMaker(map, cfg) {
        //设置maker
        const maker = cfg.map(m => {
            const maker = new AMap.Marker(m);
            maker.setMap(map);
            return maker;
        });
        this.setState({
            maker: maker
        });
        return maker;
    }
    //删除定位点
    removeMaker(maker) {
        if (maker) {
            maker.setMap(null);
            maker = null;
        }
    }
}

Map.defaultProps = {
    width: 500,
    height: 400,
    //缩放比例
    zoom: 10,
    //中心点
    center: [116.39, 39.9],
    //...
    maker: [],
    plugin: [

    ]
}


