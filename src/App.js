import React, { useState, useRef } from "react";
import ReactDataSheet from "react-datasheet";
import Service from "./Service";
import { SheetRenderer, CellRenderer, RowRenderer } from "./table-renderers";
import { CSVLink } from "react-csv";

const columns = [
  { label: "S.No.", width: "3%" },
  { label: "Address", width: "40%" },
  { label: "Latitude", width: "25%" },
  { label: "Longitude", width: "25%" }
];

const emptyGrids = [
  [{ value: "" }, { value: "" }, { value: "" }],
  [{ value: "" }, { value: "" }, { value: "" }],
  [{ value: "" }, { value: "" }, { value: "" }],
  [{ value: "" }, { value: "" }, { value: "" }],
  [{ value: "" }, { value: "" }, { value: "" }],
  [{ value: "" }, { value: "" }, { value: "" }],
  [{ value: "" }, { value: "" }, { value: "" }]
];

export default function App() {
  const [grid, setGrid] = useState(emptyGrids);

  const [appKey, setAppKey] = useState("");

  const csvLink = useRef(null);

  function handleCellsChanged(changes, additions) {
    const tempGrid = grid.map(row => [...row]);

    changes.forEach(({ cell, row, col, value }) => {
      tempGrid[row][col] = { ...tempGrid[row][col], value };

      if (value && col === 0) {
        renderLatLon(value, tempGrid, row, col, cell);
      } else {
        if (col === 0) {
          tempGrid[row][col] = { ...tempGrid[row][col], value };
          tempGrid[row][col + 1] = { ...tempGrid[row][col + 1], value: "" };
          tempGrid[row][col + 2] = { ...tempGrid[row][col + 2], value: "" };

          setGrid(tempGrid);
        }
      }
    });

    // paste extended beyond end, so add a new row
    additions &&
      additions.forEach(({ cell, row, col, value }) => {
        if (!tempGrid[row]) {
          tempGrid[row] = [{ value: "" }, { value: "" }, { value: "" }];
        }
        if (tempGrid[row][col]) {
          tempGrid[row][col] = { ...tempGrid[row][col], value };
        }

        if (value && col === 0) {
          renderLatLon(value, tempGrid, row, col, cell);
        }
      });
  }

  function renderLatLon(value, grid, row, col, cell) {
    Service.getLatLon(value, appKey)
      .then(response => {
        //console.log(response.data)
        if (response && response.data) {
          if (response.data.results && response.data.results.length) {
            var lat = response.data.results[0].geometry.location.lat;
            var lon = response.data.results[0].geometry.location.lng;
            //console.log(lat, lon);
            grid[row][col + 1] = { ...grid[row][col + 1], value: lat };
            grid[row][col + 2] = { ...grid[row][col + 2], value: lon };
          } else {
            grid[row][col + 1] = { ...grid[row][col + 1], value: "FAILED" };
            grid[row][col + 2] = { ...grid[row][col + 2], value: "FAILED" };
          }
        }

        setGrid(grid);
      })
      .catch(function(error) {
        //console.log(error);
        grid[row][col + 1] = { ...grid[row][col + 1], value: "FAILED" };
        grid[row][col + 2] = { ...grid[row][col + 2], value: "FAILED" };
        setGrid(grid);
      });
  }

  const sheetRenderer = props => {
    return (
      <SheetRenderer
        columns={columns}
        as="table"
        headerAs="thead"
        bodyAs="tbody"
        rowAs="tr"
        cellAs="th"
        {...props}
      />
    );
  };

  const rowRenderer = props => {
    return <RowRenderer as="tr" cellAs="td" className="data-row" {...props} />;
  };

  const cellRenderer = props => {
    return <CellRenderer as="td" columns={columns} {...props} />;
  };

  const downloadCSV = event => {
    csvLink.current.link.click();
  };

  const handleAppkeyChange = e => {
    setAppKey(e.target.value);
  };

  const csvData =
    grid &&
    grid.map(rowData => {
      return (
        rowData &&
        rowData.map(colData => {
          return Object.values(colData);
        })
      );
    });

  return (
    <div className="App">
      <div className="d-flex flex-column">
        <h3 className="text-center">BATCH GEOCODING</h3>

        <div className="d-flex flex-row flex-wrap justify-content-center m-3">
          <label className="mb-0 mr-3 align-self-center">
            Google Maps App Key
          </label>
          <input
            id="appkey"
            className="appkey flex-grow-1"
            placeholder="App Key"
            onChange={e => handleAppkeyChange(e)}
            value={appKey}
            type="text"
          />
        </div>

        {appKey && (
          <>
            <ReactDataSheet
              data={grid}
              className="custom-sheet"
              sheetRenderer={sheetRenderer}
              rowRenderer={rowRenderer}
              cellRenderer={cellRenderer}
              onCellsChanged={handleCellsChanged}
              valueRenderer={cell => cell.value}
            />

            <div className="d-flex flex-row justify-content-end mt-3">
              <button className="btn btn-success btn-sm" onClick={downloadCSV}>
                Download CSV
              </button>
            </div>

            <CSVLink
              data={csvData}
              filename="data.csv"
              className="hidden"
              ref={csvLink}
              target="_blank"
            />
          </>
        )}
      </div>
    </div>
  );
}
