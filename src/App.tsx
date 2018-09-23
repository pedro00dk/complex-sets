import * as React from 'react'
import P5 from 'p5'

export class App extends React.Component {
    parent: HTMLDivElement
    p5: any
    sketch: Sketch

    render() {
        return <div ref={r => this.parent = r} />
    }

    componentDidMount() {
        this.p5 = new P5(
            (p5) => {
                let sketch = new Sketch(p5, this.props, this.state)
                p5.setup = () => sketch.setup()
                p5.draw = () => sketch.draw()
            },
            this.parent
        )
    }

    componentDidUpdate() {
        this.sketch.update(this.props, this.state)
    }
}

class Sketch {

    constructor(private p5: any, private props: any, private state: any) { }

    update(props: any, state: any) {
        this.props = props
        this.state = state
    }

    setup() {
        this.p5.createCanvas(1000, 1000)
        this.p5.pixelDensity(1)
        this.p5.loadPixels()

        this.mandelbrotSet(
            this.p5.pixels as number[],
            64,
            this.p5.width as number,
            this.p5.height as number,
            [-2, 2],
            [-2, 2]
        )

        this.p5.updatePixels()
    }

    mandelbrotSet(buffer: number[], iterations: number, width: number, height: number, xRange: [number, number], yRange: [number, number]) {

        for (let x = 0; x < width; x++) {
            for (let y = 0; y < this.p5.height; y++) {
                let pixelIndex = (x + y * this.p5.width) * 4

                let a = this.p5.map(x, 0, width, xRange[0], xRange[1])
                let b = this.p5.map(y, 0, height, yRange[0], yRange[1])
                let ca = a
                let cb = b

                let i = 0
                for (; i < iterations && a + b < 16; i++) {
                    let aa = a * a - b * b
                    let bb = 2 * a * b
                    a = aa + ca
                    b = bb + cb
                }
                let bright = i == iterations ? 0 : this.p5.map(i, 0, iterations - 1, 0, 255)

                buffer[pixelIndex + 0] = bright
                buffer[pixelIndex + 1] = bright
                buffer[pixelIndex + 2] = bright
                buffer[pixelIndex + 3] = 255
            }
        }
    }

    draw() {
        console.log('hello')
    }
}