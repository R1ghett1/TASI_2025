import React from 'react'

const Filho = ({texto, fundo}) => {
    return (
        <div style={{backgroundColor: fundo}}>
            <h1>{texto}</h1>
        </div>
    )
}

export default Filho