import React, {PropTypes} from "react"
import ReactDOM from "react-dom"
import Core from "../utils/core.js"

import Maker from "./Maker.js"

class Map extends React.Component {
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
        });

    }

    componentWillReceiveProps(nextProps) {
        //todo 合并、校验cfg
        const {map_id, maker} = this.state;
        //初始化地图
        const map = this.initMap(map_id, nextProps);
        //重置定位点
        maker.map(m => {
            this.removeMaker(m);
        });
        this.initMaker(map, nextProps.maker);
    }
    componentDidMount() {
        window.init = () => {
            //初始化amap
            if (!window.AMap) {
                console.error("AMap is required");
            } else {
                const {map_id} = this.state;
                const {pluginCb, serviceCb} = this.context;
                //初始化地图
                const map = this.initMap(map_id, this.props);
                //初始化定位点
                const maker = this.initMaker(map, this.props.maker);

                debugger;
                //初始化插件
                pluginCb.call(this, map);
                //初始化服务
                serviceCb.call(this, map);
            }
        };
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

Map.contextTypes = {
    pluginCb: PropTypes.func
}




Map.plugin = (plugins) => {
    const PLUGINS = [
        "MapType", "OverView", "Scale", "ToolBar", "Geolocation",
        "MouseTool", "CircleEditor", "Circle", "PolyEditor", "Hotspot",
        "MarkerClusterer", "Heatmap", "RangingTool", "DragRoute", "PlaceSearchLayer",
        "CustomLayer", "AdvancedInfoWindow"
    ];
    return (Component) => React.createClass({
        getInitialState() {
            return {
                ist: {}
            }
        },
        propTypes: {
            pluginCb: PropTypes.func
        },
        childContextTypes: {
            pluginCb: PropTypes.func
        },
        getChildContext(a) {
            return {
                pluginCb: this._getPlugins
            }
        },
        render() {
            return <Component
                {...this.props}
                plugin={this.state.ist}/>
        },
        //获取已注册组件的实例
        _getPlugins(map) {
            const istObj = {};
            plugins.map(plugin => {
                map.plugin(`AMap.${plugin.name}`, () => {
                    const p = new window.AMap[plugin.name](plugin.cfg);
                    istObj[plugin.name] = p;
                })
            });
            this.setState({
                ist: istObj
            });
        }
    });
}

Map.service = (services) => {
    const PLUGINS = [
        "MapType", "OverView", "Scale", "ToolBar", "Geolocation",
        "MouseTool", "CircleEditor", "Circle", "PolyEditor", "Hotspot",
        "MarkerClusterer", "Heatmap", "RangingTool", "DragRoute", "PlaceSearchLayer",
        "CustomLayer", "AdvancedInfoWindow"
    ];
    return (Component) => React.createClass({
        getInitialState() {
            return {
                ist: {}
            }
        },
        propTypes: {
            serviceCb: PropTypes.func
        },
        childContextTypes: {
            serviceCb: PropTypes.func
        },
        getChildContext(a) {
            return {
                serviceCb: this._getService
            }
        },
        render() {
            return <Component
                {...this.props}
                service={this.state.ist}/>
        },
        //获取已注册服务的实例
        _getService(map) {
            const istObj = {};
            services.map(service => {
                map.service(`AMap.${service.name}`, () => {
                    const p = new window.AMap[service.name](service.cfg);
                    istObj[service.name] = p;
                })
            });
            this.setState({
                ist: istObj
            });
        }
    });
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
    plugin: []
}


export default Map;