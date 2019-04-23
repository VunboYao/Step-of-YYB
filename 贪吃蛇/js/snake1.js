class Map {
    constructor() {
        let map = document.createElement('div')
        map.className = 'map'
        document.body.appendChild(map)
        return map
    }
}

/*class Food {
    constructor(map) {
        this.map = map
        // 地图宽高
        this.mapWidth = parseInt(getComputedStyle(this.map).width)
        this.mapHeight = parseInt(getComputedStyle(this.map).height)
        // 行数, 列数
        this.colNum = this.mapWidth / 50
        this.rowNum = this.mapHeight / 50
    }

    render() {
        // 创建食物
        let food = document.createElement('div')
        food.style.position = 'absolute'
        food.style.width = '50px'
        food.style.height = '50px'
        food.style.background = 'green'
        let {x, y} = this.generatePlace()
        food.style.left = x * 50 + 'px'
        food.style.top = y * 50 + 'px'

        this.map.appendChild(food)
    }

    // 随机位置
    generatePlace() {
        let x = Math.floor(Math.random() * this.colNum)
        let y = Math.floor(Math.random() * this.rowNum)
        return {x, y}
    }
}*/

class Snake {
    constructor(map) {
        this.map = map;
        this.originPosition = {}; // 蛇尾
        this.currentDirection = 'ArrowRight';

        // 地图宽高
        this.mapWidth = parseInt(getComputedStyle(this.map).width)
        this.mapHeight = parseInt(getComputedStyle(this.map).height)
        // 行数, 列数
        let col = this.colNum = this.mapWidth / 50
        let row = this.rowNum = this.mapHeight / 50

        // 创建数组地图
        this.mapArr = [];
        for (let c = 0; c < col; c++) {
            for (let r = 0; r < row; r++) {
                this.mapArr.push({x: c, y: r});
            }
        }

        // 初始蛇
        this.bodies = [
            {x: 3, y: 1, type: 1},
            {x: 2, y: 1, type: 0},
            {x: 1, y: 1, type: 0}
        ]

        // 方向操控
        document.body.onkeydown = ev => {
            switch (ev.key) {
                case 'ArrowUp':
                   if (this.currentDirection === 'ArrowDown') {
                       this.key = 'ArrowDown';
                   }
                   break;
                case 'ArrowLeft':
                    if (this.currentDirection === 'ArrowRight') {
                        this.key = 'ArrowRight';
                    }
                    break;
                case 'ArrowDown':
                    if (this.currentDirection === 'ArrowUp') {
                        this.key = 'ArrowUp';
                    }
                    break;
                case 'ArrowRight':
                    if (this.currentDirection === 'ArrowLeft') {
                        this.key = 'ArrowRight';
                    }
                    break;
            }
        }
    }

    // 创建食物
    foodRender() {
        let food = document.createElement('div')
        food.style.position = 'absolute'
        food.style.width = '50px'
        food.style.height = '50px'
        food.style.background = 'green'

        // 食物坐标
        this.foodPlace = this.generatePlace();

        food.style.left = this.foodPlace.x * 50 + 'px'
        food.style.top = this.foodPlace.y * 50 + 'px'

        this.map.appendChild(food)

        this.food = food;
    }

    // 删除食物
    removeFood() {
        this.food.parentNode.removeChild(this.food);
    }

    // 食物随机位置
    generatePlace() {
        /* 查询蛇身当前在数组地图中的索引,并在数组地图中将蛇身索引删除 */
        this.bodies.forEach(item => {
            let demo = {x: item.x, y: item.y};
            let index = this.mapArr.findIndex(value => {
                return demo.x === value.x && demo.y === value.y;
            })
            this.mapArr.splice(index, 1);
        })

        // 随机数组地图中索引值
        let ranNum = Math.floor(Math.random() * this.mapArr.length);

        let {x, y} = this.mapArr[ranNum];
        return {x, y};
    }

    // 创建蛇
    snakeRender() {
        // 删除之前的蛇
        let aSnake = document.querySelectorAll('.snake');
        aSnake.forEach(item => {
            item.parentNode.removeChild(item);
        })
        // 创建蛇
        this.bodies.forEach(item => {
            let oDiv = document.createElement('div')
            oDiv.className = 'snake';
            oDiv.style.position = 'absolute'
            oDiv.style.left = 50 * item.x + 'px'
            oDiv.style.top = 50 * item.y + 'px'
            oDiv.style.width = '50px'
            oDiv.style.height = '50px'
            if (item.type === 1) {
                oDiv.style.background = 'red'
            } else {
                oDiv.style.background = 'skyblue'
            }
            this.map.appendChild(oDiv)
        })
    }

    // 蛇移动
    snakeMove() {
        // 蛇尾
        this.originPosition = {
            x: this.bodies[this.bodies.length - 1].x,
            y: this.bodies[this.bodies.length - 1].y,
            type: 0
        }
        // 蛇节移动
        for (let i = this.bodies.length - 1; i > 0; i--) {
            this.bodies[i].x = this.bodies[i - 1].x;
            this.bodies[i].y = this.bodies[i - 1].y;
        }

        // 蛇头移动
        let oHead = this.bodies[0];
        switch (this.key) {
            case 'ArrowUp':
                // if (this.currentDirection !== 'ArrowDown') {
                oHead.y -= 1;
                this.currentDirection = 'ArrowUp';
                // }
                break;
            case 'ArrowRight':
                // if (this.currentDirection !== 'ArrowLeft') {
                oHead.x += 1;
                this.currentDirection = 'ArrowRight'
                // }
                break;
            case 'ArrowDown':
                // if (this.currentDirection !== 'ArrowUp') {
                oHead.y += 1;
                this.currentDirection = 'ArrowDown'
                // }
                break;
            case 'ArrowLeft':
                console.log(this.currentDirection);
                if (this.currentDirection !== 'ArrowRight') {
                    oHead.x -= 1;
                    this.currentDirection = 'ArrowLeft'
                } else {
                    return false;
                }
                break;
            default:
                oHead.x += 1;
                break;
        }
    }

    // 判断
    inspection() {
        let head = this.bodies[0];
        /* 撞墙GG */
        if (head.x >= this.colNum || head.y >= this.rowNum || head.x < 0 || head.y < 0) {
            alert('苦海无涯, 回头是岸~');
            clearInterval(this.timer);
            return false;
        }
        /* 自杀GG */
        // 最少四个才可能吃到自己
        for (let i = 4; i < this.bodies.length; i++) {
            if (head.x === this.bodies[i].x && head.y === this.bodies[i].y) {
                alert('本是同根生,相煎何太急~');
                clearInterval(this.timer);
                return false;
            }
        }

        /* 吃食物 */
        // 判定当前头坐标与食物坐标
        if (head.x === this.foodPlace.x && head.y === this.foodPlace.y) {
            // 1.删除当前食物
            this.removeFood();

            //2. 生成新的食物
            this.foodRender();

            // 3.蛇身加1
            this.bodies.push(this.originPosition);
        }
        return true;
    }

    //
    update() {
        this.timer = setInterval(() => {
            // 1.移动蛇
            this.snakeMove();

            // 2.验证
            let flag = this.inspection();
            if (!flag) {
                return;
            }
            // 3.蛇渲染
            this.snakeRender();
        }, 1000)
    }
}
