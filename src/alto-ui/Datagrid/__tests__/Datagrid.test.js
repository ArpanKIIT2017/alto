import React from 'react';
import { shallow } from 'enzyme';

import Datagrid from '../Datagrid';

import DatagridHead from '../components/DatagridHead';
import DatagridContent from '../components/DatagridContent';

jest.mock('../components/DatagridHead', () => () => null);
jest.mock('../components/DatagridContent', () => () => null);

describe('Datagrid', () => {
  const defaultProps = {
    id: 'test-id',
    columns: [],
    rows: [],
    rowKeyField: jest.fn('key'),
  };
  const getWrapper = props => shallow(<Datagrid {...defaultProps} {...props} />);
  it('should render it self', () => {
    const wrapper = getWrapper();

    expect(wrapper.find(DatagridHead)).toHaveLength(1);
    expect(wrapper.find(DatagridContent)).toHaveLength(1);
  });
});