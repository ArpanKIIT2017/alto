import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { bemClass } from '../../../../../helpers';
import Calendar from '../../../../../Icons/Calendar';
import CaretDown from '../../../../../Icons/CaretDown';

function DatagridCellContent({ classNameModifiers, disabled, editable, id, onClick, type, value }) {
  const ContentComponent = editable ? 'button' : 'div';
  const contentId = editable && id ? `${id}__button` : undefined;
  const isDate = type === 'date' || type === 'datetime';
  const isList = type === 'list' || type === 'select';

  return (
    <ContentComponent
      id={contentId}
      className={bemClass('DatagridCell__content', classNameModifiers)}
      onClick={editable ? onClick : undefined}
      disabled={disabled}
    >
      {isDate && editable && <Calendar className="DatagridCell__content-icon-left" />}
      <span className="DatagridCell__content-value">{value}</span>
      {isList && editable && <CaretDown className="DatagridCell__content-icon-right" />}
    </ContentComponent>
  );
}

DatagridCellContent.propTypes = {
  id: PropTypes.string,
  editable: PropTypes.bool,
  value: PropTypes.any,
  type: PropTypes.string,
  classNameModifiers: PropTypes.shape({
    'last-row': PropTypes.bool,
    'with-icon': PropTypes.bool,
    clickable: PropTypes.bool,
    comfortable: PropTypes.bool,
    compact: PropTypes.bool,
    date: PropTypes.bool,
    detached: PropTypes.bool,
    disabled: PropTypes.bool,
    editable: PropTypes.bool,
    edited: PropTypes.bool,
    editing: PropTypes.bool,
    error: PropTypes.bool,
    first: PropTypes.bool,
    focus: PropTypes.bool,
    formula: PropTypes.bool,
    header: PropTypes.bool,
    last: PropTypes.bool,
    left: PropTypes.bool,
    number: PropTypes.bool,
    right: PropTypes.bool,
    selected: PropTypes.bool,
    success: PropTypes.bool,
    summary: PropTypes.bool,
    text: PropTypes.bool,
    warning: PropTypes.bool,
  }),
};

export default memo(DatagridCellContent);
