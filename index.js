const platformImg = './img/platform.png'
const hills = './img/hills.png'
const background = './img/background.png'
const platformSmallTall = './img/platformSmallTall.png'
const canvas = document.querySelector('canvas')

const c = canvas.getContext('2d')

canvas.width = 1024
canvas.height = 576

const gravity = .5

class Player {
    constructor() {
        this.position = {
            x: 100,
            y: 100
        }
        this.velocity = {
            x: 0,
            y: 1
        }
        const image = createImage('./img/hero.png')
        this.image = image
        this.width = image.width
        this.height = image.height
        this.speed = 10
    }

    draw() {
        c.drawImage(this.image, this.position.x, this.position.y)
    }

    update() {
        this.draw()
        this.position.y += this.velocity.y
        this.position.x += this.velocity.x
        if (this.position.y + this.height + this.velocity.y <= canvas.height)
            this.velocity.y += gravity
    }
}

class Platform {
    constructor({ x, y, image }) {
        this.position = {
            x, // similar to x: x
            y
        }
        this.image = image
        this.width = image.width
        this.height = image.height
    }

    draw() {
        c.drawImage(this.image, this.position.x, this.position.y)
    }
}

class GenericObject {
    constructor({ x, y, image }) {
        this.position = {
            x,
            y
        }
        this.image = image
        this.width = image.width
        this.height = image.height
    }

    draw() {
        c.drawImage(this.image, this.position.x, this.position.y)
    }
}

function createImage(src) {
    const image = new Image()
    image.src = src
    return image
}

let player = new Player()
let platforms = []
let genericObjects = []
let keys = {
    right: {
        pressed: false
    },
    left: {
        pressed: false
    }
}
let scrollOffset = 0

function init() {

    player = new Player()
    platforms = [
        new Platform({ x: createImage(platformImg).width * 5 + 300 - 3 - createImage(platformSmallTall).width, y: 270, image: createImage(platformSmallTall) }),
        new Platform({ x: -1, y: 470, image: createImage(platformImg) }),
        new Platform({ x: createImage(platformImg).width - 3, y: 470, image: createImage(platformImg) }),
        new Platform({ x: createImage(platformImg).width * 2 + 100, y: 470, image: createImage(platformImg) }),
        new Platform({ x: createImage(platformImg).width * 3 + 300, y: 470, image: createImage(platformImg) }),
        new Platform({ x: createImage(platformImg).width * 4 + 300 - 3, y: 470, image: createImage(platformImg) }),
        new Platform({ x: createImage(platformImg).width * 5 + 700 - 3, y: 470, image: createImage(platformImg) })
    ]
    genericObjects = [new GenericObject({ x: -1, y: -1, image: createImage(background) }), new GenericObject({ x: -1, y: -1, image: createImage(hills) })]
    keys = {
        right: {
            pressed: false
        },
        left: {
            pressed: false
        }
    }
    scrollOffset = 0

}
function animate() {
    requestAnimationFrame(animate)
    c.fillStyle = 'white'
    c.fillRect(0, 0, canvas.width, canvas.height)
    genericObjects.forEach(genericObject => {
        genericObject.draw()
    })
    platforms.forEach(platform => {
        platform.draw()
    })
    player.update()

    if (keys.right.pressed && player.position.x < 400) {
        player.velocity.x = player.speed
    } else if ((keys.left.pressed && player.position.x > 100) || (keys.left.pressed && scrollOffset == 0 && player.position.x > 0)) {
        player.velocity.x = -player.speed
    } else {
        player.velocity.x = 0

        if (keys.right.pressed) {
            scrollOffset += player.speed
            genericObjects.forEach(genericObject => {
                genericObject.position.x -= player.speed * .4
            })
            platforms.forEach(platform => {
                platform.position.x -= player.speed
            })
        } else if (keys.left.pressed && scrollOffset > 0) {
            scrollOffset -= player.speed
            genericObjects.forEach(genericObject => {
                genericObject.position.x += player.speed * .4
            })
            platforms.forEach(platform => {
                platform.position.x += player.speed
            })
        }
    }

    platforms.forEach(platform => {
        if (player.position.y + player.height <= platform.position.y && player.position.y + player.height + player.velocity.y >= platform.position.y && player.position.x + player.width >= platform.position.x && player.position.x <= platform.position.x + platform.width)
            player.velocity.y = 0

        if (scrollOffset > createImage(platformImg).width * 5 + 700 - 3) {
            alert('You won!')
            init()
        }
        if (player.position.y > canvas.height) {
            alert('You lose!')
            init()
        }
    })
}

init()
animate()

// also window.addEventListener
addEventListener('keydown', ({ key }) => {
    switch (key) {
        case 'w':
        case 'ArrowUp':
            player.velocity.y = -20
            break;

        case 's':
        case 'ArrowDown':
            break;

        case 'd':
        case 'ArrowRight':
            keys.right.pressed = true
            break;

        case 'a':
        case 'ArrowLeft':
            keys.left.pressed = true
            break;

        default:
            break;
    }
})

addEventListener('keyup', ({ key }) => {
    switch (key) {
        case 'w':
        case 'ArrowUp':
            break;

        case 's':
        case 'ArrowDown':
            break;

        case 'd':
        case 'ArrowRight':
            keys.right.pressed = false
            break;

        case 'a':
        case 'ArrowLeft':
            keys.left.pressed = false
            break;

        default:
            break;
    }
})