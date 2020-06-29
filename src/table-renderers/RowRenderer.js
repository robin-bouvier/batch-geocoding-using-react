import React from "react";

const RowRenderer = props => {
  const { className, row } = props;
  return (
    <tr className={className}>
      <td className="action-cell cell">
        <input type="text" disabled value={row + 1} />
      </td>
      {props.children}
    </tr>
  );
};

export default RowRenderer;
