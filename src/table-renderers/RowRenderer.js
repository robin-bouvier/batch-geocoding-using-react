import React from 'react'

const RowRenderer = props => {
    const { as: TR, cellAs: TD, className, row} = props
    return (
      <TR className={className}>
        <TD className='action-cell cell'>
          <input
            type='text'
            disabled
            value={row + 1}
          />
        </TD>
        {props.children}
      </TR>
    )
  }

  export default RowRenderer