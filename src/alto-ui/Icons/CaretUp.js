import React from 'react';
import Icon from './Icon';

const CaretUp = props => (
  <Icon {...props}>
    {ownProps => (
      <g transform="rotate(180, 18, 18)">
        <path
          {...ownProps}
          d="M28.2,11H7.83a.73.73,0,0,0-.56,1.2L17.6,24.73a.74.74,0,0,0,1.14,0l10-12.54A.73.73,0,0,0,28.2,11Z"
        />
      </g>
    )}
  </Icon>
);

CaretUp.displayName = 'CaretUp';

export default CaretUp;
