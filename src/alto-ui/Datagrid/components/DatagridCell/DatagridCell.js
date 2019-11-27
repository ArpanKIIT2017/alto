import React, { memo, useContext, useEffect, useMemo, useState } from 'react';
import debounce from 'lodash.debounce';
import PropTypes from 'prop-types';

import { bemClass } from '../../../helpers';
import { getTitleValue, getValue, getFormatter, IDENTITY, getType } from '../../helpers';
import { DatagridContext } from '../../Datagrid';

import './DatagridCell.scss';
import DatagridCellContent from './components/DatagridCellContent';
import DatagridCellError from './components/DatagridCellError';
import DatagridCellInput from '../DatagridCellInput';
import Dropdown from '../../../Dropdown';
import OptionsIcon from '../../../Icons/EllipsisVertical';

function DatagridCell({
  aria,
  className,
  clickable,
  detached,
  header,
  row,
  column,
  disabled,
  editable,
  edited,
  id,
  inputProps,
  lastRow,
  render,
  selectedRowKey,
  summary,
  width,
}) {
  const [cellEditing, setCellEditing] = useState(false);
  const [value, setValue] = useState(row[column.key]);
  const {
    tooltipVisible,
    formatters,
    parsers,
    renderers,
    onSelectRow,
    rowKeyField,
    compact,
    comfortable,
    showError,
    modifiers,
    columns,
    visible,
    isWarningError,
    onStopEditing,
    onClickCellDropdownItem,
    onChange,
    debounceTime,
  } = useContext(DatagridContext);

  useEffect(() => {
    setValue(row[column.key || column]);
  }, [header]);

  function getCellStyle() {
    const minWidth = column.editable ? '4.625rem' : '2rem';
    return { width, minWidth, maxWidth: width };
  }

  function getCellValue() {
    if (render) return '';
    if (header) return value;
    return getValue(value, column, row);
  }

  function getFormattedCellValue(val, type) {
    const format = getFormatter({ parsers, formatters }, type);
    return format(val, column, row);
  }

  function getCellParsedValue(cellValue, cellType) {
    const parser = parsers[cellType] || IDENTITY;
    return parser(cellValue, column, row, { parsers, formatters });
  }

  function startCellEditing() {
    setCellEditing(true);
  }

  function replaceRowValues(message) {
    if (typeof message !== 'string') return message;
    return columns.reduce(
      (acc, col) =>
        acc.replace(
          new RegExp(`\\{${col.key}\\}`, 'g'),
          getFormattedCellValue(row[col.key || col], getType(row[col.key || col], col))
        ),
      message
    );
  }

  function stopCellEditing() {
    setCellEditing(false);
    if (typeof onStopEditing === 'function') {
      const error = showError(value, column, row);
      onStopEditing(value, column, row, replaceRowValues(error));
    }
  }

  function propagateChange(newValue) {
    if (onChange) {
      const error = showError(newValue, column, row);
      onChange(newValue, column, row, replaceRowValues(error));
    }
  }

  function handleChange(newValue) {
    setValue(newValue);
    if (debounceTime) {
      debounce(() => propagateChange(newValue), debounceTime);
    } else {
      propagateChange(newValue);
    }
  }

  function getCellClassNameModifiers(val, type, isCellBolean) {
    const selected = selectedRowKey && rowKeyField(row) === selectedRowKey;

    return {
      ...(type && type !== 'undefined' ? { [type]: true } : {}),
      formula: !!column.formula,
      editable,
      editing: cellEditing || isCellBolean,
      edited,
      focus: cellEditing,
      disabled,
      header,
      summary,
      selected,
      clickable,
      detached,
      first: typeof onSelectRow !== 'function' && aria.colIndex === 1,
      last: aria.colIndex === columns.length,
      'last-row': lastRow,
      compact,
      comfortable,
      'with-icon': showError(value, column, row),
      ...modifiers(value, column, row),
      ...(column.align ? { [column.align]: true } : {}),
    };
  }

  function renderValue(cellValue, cellType, cellFormattedValue) {
    const contextValues = { parsers, formatters };
    if (render) {
      const formatter = getFormatter({ parsers, formatters }, cellType);

      const format = x => formatter(x, column, row, contextValues);
      return render(column, row, format);
    }
    const renderer = renderers[cellType] || IDENTITY;

    switch (cellType) {
      case 'error':
        return renderer(value, column, row, contextValues);
      case 'list': {
        const itemSelected =
          (inputProps.options || []).find(option => option.value === value) || {};
        return renderer(itemSelected.title, column, row, contextValues);
      }
      default:
        return renderer(cellFormattedValue, column, row, contextValues);
    }
  }

  function renderCellContent(
    isCellBoolean,
    cellType,
    cellValue,
    classNameModifiers,
    cellFormattedValue,
    cellParsedValue,
    cellRenderValue
  ) {
    const contentComponent = (
      <DatagridCellContent
        id={id}
        editable={editable}
        type={cellType}
        value={cellRenderValue}
        disabled={disabled}
        classNameModifiers={classNameModifiers}
        onClick={editable ? startCellEditing : undefined}
      />
    );
    if (render && isCellBoolean) {
      return contentComponent;
    }

    return (
      <>
        <DatagridCellError
          column={column}
          row={row}
          value={cellValue}
          showError={showError}
          isWarningError={isWarningError}
          replaceRowValues={replaceRowValues}
        />
        {contentComponent}
        {!header && !(!editable && !isCellBoolean) && (
          <DatagridCellInput
            id={`${id}__input`}
            column={column}
            value={cellParsedValue}
            type={cellType}
            inputProps={{ ...inputProps, readOnly: !editable }}
            onChange={handleChange}
            onStartEditing={startCellEditing}
            onStopEditing={stopCellEditing}
            modifiers={classNameModifiers}
            editing={cellEditing}
          />
        )}
        {!header && column.cellDropdownItems && column.cellDropdownItems.length && (
          <Dropdown
            id={`${id}__column-dropdown`}
            items={column.cellDropdownItems}
            end
            onClick={item => onClickCellDropdownItem(item, value, row, column)}
            renderTrigger={(onClick, open, ref) => (
              <span ref={ref}>
                <OptionsIcon onClick={onClick} />
              </span>
            )}
          />
        )}
      </>
    );
  }

  const style = useMemo(getCellStyle, [column.editable, width]);
  const cellTitle = useMemo(() => (tooltipVisible ? getTitleValue(value) : ''), [tooltipVisible]);
  const cellValue = getCellValue();
  const cellType = useMemo(() => getType(cellValue, column), [column.type, cellValue]);
  const cellFormattedValue = getFormattedCellValue(cellValue, cellType);
  const isCellBoolean = ['boolean'].includes(cellType);
  const classNameModifiers = useMemo(
    () => getCellClassNameModifiers(cellValue, cellType, isCellBoolean),
    [cellValue, cellType, isCellBoolean]
  );
  const cellParsedValue = useMemo(() => getCellParsedValue(cellValue, cellType), []);
  const isCellVisible = visible(column, row);
  const cellRenderValue = renderValue(cellValue, cellType, cellFormattedValue);

  return (
    <div
      className={bemClass('DatagridCell', modifiers, className)}
      title={cellTitle}
      style={style}
      role="gridcell"
      aria-rowindex={aria.rowIndex}
      aria-colindex={aria.colIndex}
    >
      {isCellVisible && (
        <div className="DatagridCell__container">
          {renderCellContent(
            isCellBoolean,
            cellType,
            cellValue,
            classNameModifiers,
            cellFormattedValue,
            cellParsedValue,
            cellRenderValue
          )}
        </div>
      )}
    </div>
  );
}
DatagridCell.displayName = 'DatagridCell';

DatagridCell.defaultProps = {
  clickable: false,
  comfortable: false,
  compact: false,
  detached: false,
  disabled: false,
  editable: false,
  edited: false,
  header: false,
  lastRow: false,
  row: {},
  summary: false,
  width: 150,
};

DatagridCell.propTypes = {
  id: PropTypes.string,
  column: PropTypes.shape({
    key: PropTypes.any.isRequired,
    title: PropTypes.any.isRequired,
    description: PropTypes.string,
    type: PropTypes.string,
    formula: PropTypes.string,
    formatter: PropTypes.func,
  }),
  aria: PropTypes.shape({
    rowIndex: PropTypes.number.isRequired,
    colIndex: PropTypes.number.isRequired,
  }).isRequired,
  className: PropTypes.string,
  clickable: PropTypes.bool,
  colIndex: PropTypes.number,
  detached: PropTypes.bool,
  disabled: PropTypes.bool,
  editable: PropTypes.bool,
  edited: PropTypes.bool,
  header: PropTypes.bool,
  inputProps: PropTypes.object,
  lastRow: PropTypes.bool,
  render: PropTypes.func,
  row: PropTypes.object,
  rowIndex: PropTypes.number,
  selectedRowKey: PropTypes.string,
  summary: PropTypes.bool,
  width: PropTypes.number,
};

export default memo(DatagridCell);
