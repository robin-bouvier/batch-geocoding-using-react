import React from 'react'

const SheetRenderer = props => {
    const { as: Table, headerAs: THead, bodyAs: TBody, rowAs: TR, cellAs: TD,
        className, columns } = props
    return (
        <Table className={className}>
            <THead className='data-header'>
                <TR>
                    {columns.map(column => <TD className='cell' style={{ width: column.width }} key={column.label}>{column.label}</TD>)}
                </TR>
            </THead>
            <TBody className='data-body'>
                {props.children}
            </TBody>
        </Table>
    )
}

export default SheetRenderer