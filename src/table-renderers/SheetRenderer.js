import React from "react";

const SheetRenderer = props => {
  const { className, columns } = props;

  return (
    <table className={className}>
      <thead className="data-header">
        <tr>
          {columns.map(column => (
            <th
              className="cell"
              style={{ width: column.width }}
              key={column.label}
            >
              {column.label}
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="data-body">{props.children}</tbody>
    </table>
  );
};

export default SheetRenderer;
