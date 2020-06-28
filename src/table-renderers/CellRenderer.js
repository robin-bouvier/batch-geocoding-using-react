
import React from 'react';

const CellRenderer = props => {
    const {
      as: TD, cell, row, col, columns, attributesRenderer,
      selected, editing, updated, style,
      ...rest
    } = props
  
    // hey, how about some custom attributes on our cell?
    const attributes = cell.attributes || {}
    // ignore default style handed to us by the component and roll our own
    attributes.style = { width: columns[col].width }
    if (col === 0) {
      attributes.title = cell.label
    }
  
    return (
      <TD {...rest} {...attributes}>
        {props.children}
      </TD>
    )
  }

  export default CellRenderer