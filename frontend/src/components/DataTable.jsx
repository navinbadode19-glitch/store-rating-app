import './DataTable.css';

// renderCell(row, key) is optional; onSort is called with (key, 'asc' | 'desc')
export default function DataTable({
  columns,
  data,
  onSort,
  sortBy,
  order,
  renderCell,
  onRowClick,
}) {
  const handleSort = (key) => {
    if (!onSort) return;
    onSort(key, sortBy === key && order === 'asc' ? 'desc' : 'asc');
  };

  const sortIcon = (key) => {
    if (sortBy !== key) return <span className="sort-icon inactive">⇅</span>;
    return <span className="sort-icon active">{order === 'asc' ? '↑' : '↓'}</span>;
  };

  return (
    <div className="table-container">
      <table className="data-table" id="data-table">
        <thead>
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                onClick={() => col.sortable !== false && handleSort(col.key)}
                className={col.sortable !== false ? 'sortable' : ''}
                id={`th-${col.key}`}
              >
                <span className="th-content">
                  {col.label}
                  {col.sortable !== false && sortIcon(col.key)}
                </span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="empty-row">
                No data available
              </td>
            </tr>
          ) : (
            data.map((row, i) => (
              <tr
                key={row.id || i}
                onClick={() => onRowClick?.(row)}
                className={onRowClick ? 'clickable' : ''}
              >
                {columns.map((col) => (
                  <td key={col.key}>
                    {renderCell ? renderCell(row, col.key) : row[col.key] ?? '—'}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
