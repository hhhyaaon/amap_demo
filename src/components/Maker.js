import React from "react"
import ReactDOM from "react-dom"
import Core from "../utils/core.js"

export default class Maker extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            map_id: `amap_maker_${Core.getRandom()}`
        }
    }
    componentWillReceiveProps(next) {
        //合并、校验cfg
    }
    componentDidMount() {
        console.log(AMap);
    }
    componentWillUnmount() {
        //卸载sdk
    }
    render() {
        return (
            <div></div>
        )
    }
}

Maker.defaultProps = {
    icon: "http://webapi.amap.com/theme/v1.3/markers/n/mark_b.png",
    position: []

}

