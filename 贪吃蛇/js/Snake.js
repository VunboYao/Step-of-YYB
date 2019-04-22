/* 地图 */
class SnakeMap {
    constructor() {
        let oDiv = document.createElement('div')
        oDiv.className = 'map';
        document.body.appendChild(oDiv);
        return oDiv;
    }
}

/* 食物 */
class SnakeFood {
    constructor(obj) {
        this.width = obj.width || 100;
        this.height = obj.height || 100;
        this.bgImg = obj.bgImg || 'images/body.png';
        this.map = obj.map || {};

        let oMapStyle = getComputedStyle(this.map);
        // 1.地图宽高
        let oMapWidth = parseInt(oMapStyle.width);
        let oMapHeight = parseInt(oMapStyle.height);
        // 2.地图行列
        this.colNum = oMapWidth / this.width;
        this.rowNum = oMapHeight / this.height;
    }

    /* 渲染食物 */
    render() {
        // 1.创建食物并设置样式
        let newFood = document.createElement('div');
        newFood.style.position = 'absolute';
        newFood.style.width = this.width + 'px';
        newFood.style.height = this.height + 'px';
        newFood.style.background = `url(${this.bgImg})`;
        // 2.随机位置的生成
        let {x, y} = this.generatePosition();
        this.x = x;
        this.y = y;
        newFood.style.left = this.width * x + 'px';
        newFood.style.top = this.height * y + 'px';
        // 3.添加到地图中
        this.map.appendChild(newFood);
        this.newFood = newFood;
    }

    remove() {
        this.newFood.parentNode.removeChild(this.newFood);
    }

    /* 随机生成位置 */
    generatePosition() {
        // 随机行列
        /* 随机数 Math.floor(Math.random() * 可能值的总数(max-min+1) + 第一个可能的值)
        *  colNum 的值为10, 但实际位置0-9, 所以可能值为9-0+1=10
        * */
        let x = Math.floor(Math.random() * this.colNum);
        let y = Math.floor(Math.random() * this.rowNum);
        return {x, y};
    }
}

/* Snake */
class Snake {
    constructor(obj = {}) {
        this.width = obj.width || 100;
        this.height = obj.height || 100;
        this.headBg = obj.headImg || 'images/head.png';
        this.bodyBg = obj.bodyImg || 'images/body.png';
        this.map = obj.map;
        this.bodies = [
            {x: 2, y: 1, type: 1},// 蛇头
            {x: 1, y: 1, type: 0},// 蛇身
            {x: 0, y: 1, type: 0},
        ];
        document.body.onkeydown = ev => {
            this.key = ev.key;
        }

        let oMapStyle = getComputedStyle(this.map);
        // 1.地图宽高
        let oMapWidth = parseInt(oMapStyle.width);
        let oMapHeight = parseInt(oMapStyle.height);
        // 2.地图行列
        this.colNum = oMapWidth / this.width;
        this.rowNum = oMapHeight / this.height;
    }

    render() {
        let aSnakes = document.getElementsByClassName('snake');
        /* 清除 */
        for (let i = aSnakes.length - 1; i >= 0; i--) {
            aSnakes[i].parentNode.removeChild(aSnakes[i]);
        }
        /* 渲染 */
        for (let item of this.bodies) {
            let oSnake = document.createElement('div')
            /* 样式 */
            oSnake.style.width = this.width + 'px';
            oSnake.style.height = this.height + 'px';
            oSnake.className = 'snake';
            /* 位置 */
            oSnake.style.position = 'absolute';
            oSnake.style.left = this.width * item.x + 'px';
            oSnake.style.top = this.height * item.y + 'px';
            /* 背景图片 */
            if (item.type === 1) {
                oSnake.style.background = `url(${this.headBg})`;
            } else {
                oSnake.style.background = `url(${this.bodyBg})`;
            }
            this.map.appendChild(oSnake);
        }
    }

    move() {
        /* 1. 修改蛇身的位置 */
        for (let i = this.bodies.length - 1; i > 0; i--) {
            this.bodies[i].x = this.bodies[i - 1].x;
            this.bodies[i].y = this.bodies[i - 1].y;
        }
        /* 2. 修改蛇头的位置*/
        let head = this.bodies[0];
        switch (this.key) {
            case 'ArrowRight':// 右
                head.x = head.x + 1;
                break;
            case 'ArrowLeft':// 左
                head.x = head.x - 1;
                break;
            case 'ArrowUp': // 上
                head.y = head.y - 1;
                break;
            case 'ArrowDown': // 下
                head.y = head.y + 1;
                break;
            default:
                head.x += 1;
                break;
        }
    }
    inspection(food) {
        let head = this.bodies[0];
        /* 3.判断蛇是否超出地图 */
        if (head.x < 0 || head.y < 0 || head.x >= this.colNum || head.y >= this.rowNum) {
            alert('Game Over');
            clearInterval(this.timer);
            return false;
        }
        for (let i = this.bodies.length - 1; i > 0; i--) {
            if (head.x === this.bodies[i].x && head.y === this.bodies[i].y) {
                alert('Game Over');
                clearInterval(this.timer);
                return false;
            }
        }
        /* 5.食物检测 */
        if (head.x === food.x && head.y === food.y) {
            // 删除当前食物
            food.remove();
            // 重新生车给你食物
            food.render();
            let lastBody = this.bodies[this.bodies.length - 1];
            let newBody = {x: lastBody.x, y: lastBody.y, type: 0}
            this.bodies.push(newBody);
        }
        return true;
    }
    update(food) {
        this.timer = setInterval(() => {
            // 1.移动蛇
            this.move();
            // 2.检查边界与食物
            let flag = this.inspection(food);
            if (!flag) {
                return;
            }
            /* 3.重新渲染 */
            this.render();
        }, 500)
    }
}

