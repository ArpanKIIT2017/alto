import React from 'react';
import Icon from './Icon';

const Numeric = props => (
  <Icon {...props}>
    {ownProps => (
      <path
        {...ownProps}
        d="M26.07,24l-3.2,3.84h3.2Zm4.43,5.64H28.29V33H26.07V29.63H20.5V28.09l5.83-7.28h2v7H30.5ZM10,31a4.1,4.1,0,0,0,1.2-.16,2.86,2.86,0,0,0,.93-.44,2.08,2.08,0,0,0,.6-.66,1.58,1.58,0,0,0,.22-.82,1.69,1.69,0,0,0-.24-.93,1.73,1.73,0,0,0-.69-.59,3.33,3.33,0,0,0-1.05-.32A9.17,9.17,0,0,0,9.61,27H8.5v-1.3l3.33-3.77H6.5v-2h8.41v1.67l-3.49,3.69h.45a4.44,4.44,0,0,1,1.35.22,3.36,3.36,0,0,1,1.16.67,3.12,3.12,0,0,1,.81,1.1,3.5,3.5,0,0,1,.31,1.52A3.57,3.57,0,0,1,15,30.59a4.31,4.31,0,0,1-1.22,1.33,5.16,5.16,0,0,1-1.76.81A7.72,7.72,0,0,1,10,33a10.81,10.81,0,0,1-1.79-.15,9.29,9.29,0,0,1-1.72-.46l.69-2a2.89,2.89,0,0,0,.49.18l.69.19a7,7,0,0,0,.8.14A5.39,5.39,0,0,0,10,31ZM30.5,16.12h-9V14.34l.61-.49.81-.68c.31-.26.62-.54,1-.85s.67-.63,1-1,.86-.88,1.2-1.26A9,9,0,0,0,26.92,9a4.54,4.54,0,0,0,.49-1,3.12,3.12,0,0,0,.16-1,1.54,1.54,0,0,0-.18-.72,2.1,2.1,0,0,0-.5-.62,2.64,2.64,0,0,0-.78-.42,3.13,3.13,0,0,0-1-.16,4,4,0,0,0-1.32.21A4.39,4.39,0,0,0,22.55,6L21.5,4.31a9,9,0,0,1,1.89-.93A7,7,0,0,1,25.78,3a6,6,0,0,1,1.66.22,4.86,4.86,0,0,1,1.42.65,3.23,3.23,0,0,1,1,1.08,2.89,2.89,0,0,1,.37,1.49,5.37,5.37,0,0,1-.11,1.09,4.84,4.84,0,0,1-.35,1,5.89,5.89,0,0,1-.6,1c-.25.36-.55.74-.9,1.16s-.56.64-.88,1-.63.64-.94.93-.61.57-.91.83-.58.47-.82.64H30.5ZM9.62,14.25v-8L6.88,7.69,5.5,5.56,10,3h2.13V16.12H9.62Z"
      />
    )}
  </Icon>
);

export default Numeric;