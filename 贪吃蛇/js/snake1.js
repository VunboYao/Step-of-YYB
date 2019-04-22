class Map {
    constructor() {
        let map = document.createElement('div')
        map.className = 'map'
        document.body.appendChild(map)
        return map
    }
}

class Food {
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
}

class Snake {
    constructor(map) {
        this.map = map
        this.bodies = [
            {x: 3, y: 1, type: 1},
            {x: 2, y: 1, type: 0},
            {x: 1, y: 1, type: 0}
        ]
    }

    render() {
        this.bodies.forEach(item => {
            let oDiv = document.createElement('div')
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
}
