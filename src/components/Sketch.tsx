import * as React from 'react'
// interfaces

import { ISketch } from '../interfaces/sketch'

interface Props {
    sketch: ISketch
}

const Sketch: React.FC<Props> = ({sketch}) => {
    return (
        <div>
            <p>{sketch.description}</p>
        </div>
    )
}

export default Sketch
