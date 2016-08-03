const core = {
    insert: (attr, cb) => {
        attr = Object.assign({}, {
            name: "sdk_" + core.getRandom(),
            src: "",
            type: "text/javascript"
        }, attr);

        let parent = document.querySelector("#sdk_lib");
        let script = parent.querySelector(`[name=${attr.name}]`);
        //避免重复创建同名sdk
        if (script) {
            if (typeof cb === "function") {
                cb.call(this, script);
            }
        } else {
            script = document.createElement("script");
            //attr
            Object.getOwnPropertyNames(attr).map(name => {
                script.setAttribute(name, attr[name]);//暂时只支持一层object
            });
            parent.appendChild(script).addEventListener("load", () => {
                if (typeof cb === "function") {
                    cb.call(this, script);
                }
            }, false);
        }
    },
    /**
    * 移除指定sdk
    * return {obj}
    */
    remove: (name) => {
        let parent = document.querySelector("#sdk_lib");
        Array.prototype.slice.call(parent.querySelectorAll(`[name=${name}]`)).map(node => {
            parent.removeChild(node);
        });
    },
    /**
    * 获得一个任意长度的随机字符串
    * @param {number = 8} count 随机字符串长度，默认长度8
	*/
    getRandom: (count = 8) => {
        let str = "";
        for (let i = 0; i < count; i++) {
            str += (Math.random() * 10).toString(36).charAt(parseInt(((Math.random() * 5) + 2).toString()));
        }
        return str;
    }
};


export default core;