import React from 'react';
import { shallow } from 'enzyme';
import { InputNumber } from '../InputNumber';
import TextField from '../../TextField';
import FormElement from '../../FormElement';
import { parse, format } from '../../../helpers/number';

jest.mock('../../../helpers/number', () => ({
  format: jest.fn().mockReturnValue('formatMock'),
  parse: jest.fn().mockReturnValue('parseValue'),
}));

jest.mock('../../TextField', () => ({
  onChange, onFocus, onBlur,
}) => (
  <input onChange={onChange} onFocus={onFocus} onBlur={onBlur} />
));

jest.mock('../../FormElement', () => ({ children, ...props }) => (
  <div props={props}>{children}</div>
));


describe('Form/InputNubmer', () => {
  const defaultExpect = {
    className: 'InputNumber',
    onBlur: expect.any(Function),
    onChange: expect.any(Function),
    onFocus: expect.any(Function),
    type: 'text',
    value: 'formatMock',
  };
  const derivedPropsMock = {
    value: 'value',
    locale: 'us',
    precision: 5,
    currency: '$',
    disableThousandSeparator: true,
    percent: true,
    max: 5,
    min: 3,
  };
  const getWrapper = props => shallow(<InputNumber {...props} />);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render with defaults', () => {
    const wrapper = getWrapper();
    expect(wrapper.find(TextField)).toHaveLength(1);
    expect(wrapper.find(FormElement)).toHaveLength(0);
  });

  it('should call format for display in constructor', () => {
    const value = 'valueMock';
    const lastMocks = {
      percent: true,
      min: 2,
      max: 3,
    };
    const mocks = {
      value,
      locale: 'localeMock',
      precision: 8,
      currency: 'currencyMock',
      disableThousandSeparator: true,
    };

    getWrapper({ ...mocks, ...lastMocks });
    expect(format).toHaveBeenCalledTimes(1);
    expect(format).toHaveBeenCalledWith(
      ...Object.values(mocks),
      lastMocks,
    );
  });

  it('should have FormElement as a wrapper if has some label', () => {
    const wrapper = getWrapper({ label: 'abc' });

    expect(wrapper.find(FormElement)).toHaveLength(1);
    expect(wrapper.find(TextField)).toHaveLength(1);
  });

  describe('TextField', () => {
    const getProps = wprapper => wprapper.find(TextField).props();

    it('should have correct props as default', () => {
      expect(getProps(getWrapper())).toEqual(defaultExpect);
    });

    it('should past more props to TextField', () => {
      const propsMock = { test1: 'test1', test2: 'test2' };
      expect(getProps(getWrapper(propsMock))).toEqual({ ...defaultExpect, ...propsMock });
    });

    it('should respect className', () => {
      const { className } = getProps(getWrapper(({ className: 'classMock' })));
      expect(className).toBe('InputNumber classMock');
    });

    describe('handleFocus', () => {
      const onFocus = jest.fn();
      const onBlur = jest.fn();
      const onChange = jest.fn();

      let wrapper;

      beforeEach(() => {
        wrapper = getWrapper({ onFocus, onBlur, onChange });
        wrapper.simulate('focus', { target: { value: 'valueMock' }});
      });

      afterEach(() => {
        jest.clearAllMocks();
      });

      it('should call focus', () => {
        expect(onFocus).toHaveBeenCalledTimes(1);
      });

      it('should not call onBlur and onChange', () => {
        expect(onBlur).not.toHaveBeenCalled();
        expect(onChange).not.toHaveBeenCalled();
      });

      it('should correctly update state', () => {
        const { editing } = wrapper.state();
        expect(editing).toBe(true);
      });
    });

    describe('handleBlur', () => {
      const onFocus = jest.fn();
      const onBlur = jest.fn();
      const onChange = jest.fn();
      const locale = 'US';
      const precision = 6;

      const lastMocks = {
        percent: true,
        min: 1,
        max: 2,
      };

      const valueMock = 5;

      let wrapper;

      beforeEach(() => {
        wrapper = getWrapper({ locale, precision, onFocus, onBlur, onChange, ...lastMocks });
        wrapper.simulate('blur', { target: { value: valueMock }});
      });

      afterEach(() => {
        jest.clearAllMocks();
      });

      it('should call focus', () => {
        expect(onBlur).toHaveBeenCalledTimes(1);
      });

      it('should not call onFocus and onChange', () => {
        expect(onFocus).not.toHaveBeenCalled();
        expect(onChange).not.toHaveBeenCalled();
      });

      it('should correctly update state', () => {
        const { editing, display } = wrapper.state();
        expect({ editing, display }).toEqual({ editing: false, display: 'formatMock' })
      });

      it('should call parse on blur', () => {
        expect(parse).toHaveBeenCalledTimes(1);
        expect(parse).toHaveBeenCalledWith(
          valueMock,
          locale,
          precision,
          lastMocks,
        );
      });
    });

    describe('handleChange', () => {
      const onFocus = jest.fn();
      const onBlur = jest.fn();
      const onChange = jest.fn();
      const valueMock = 'valueMock';

      let wrapper;
      const event = { target: { value: valueMock }};

      beforeEach(() => {
        wrapper = getWrapper({ onFocus, onBlur, onChange });
        wrapper.simulate('change', event);
      });

      afterEach(() => {
        jest.clearAllMocks();
      });

      it('should call onChange', () => {
        expect(onChange).toHaveBeenCalledTimes(1);
        expect(onChange).toHaveBeenCalledWith(event, 'parseValue');
      });

      it('should not call onBlur and onFocus', () => {
        expect(onBlur).not.toHaveBeenCalled();
        expect(onFocus).not.toHaveBeenCalled();
      });

      it('should correctly update state', () => {
        const { display } = wrapper.state();
        expect(display).toBe(valueMock);
      });
    });

    it('should update state on change specific props for falsy editing', () => {
      const wrapper = getWrapper();

      Object.entries(derivedPropsMock).forEach(([name, value]) => {
        format.mockClear();
        wrapper.setProps({ [name]: value });

        expect(format).toHaveBeenCalledTimes(1);
      });
    });

    it('should update state on change specific props for truthy editing', () => {
      const wrapper = getWrapper();
      wrapper.simulate('focus');
      format.mockClear();

      wrapper.setProps({ value: 'aa'});
      expect(wrapper.state().display).toBe('formatMock');

      wrapper.setState({ value: 'oo' });
      expect(wrapper.state().display).toBe('formatMock');

      wrapper.setProps({ precision: 100 });
      expect(wrapper.state().display).toBe('formatMock');

      expect(format).not.toHaveBeenCalled();
    });

    it('should not react if specific props were not changed', () => {
      const wrapper = getWrapper(derivedPropsMock);
      format.mockClear();

      Object.entries(derivedPropsMock).forEach(([name, value]) => {
        wrapper.setProps({ [name]: value });
      });
      expect(format).not.toHaveBeenCalled();
    });
  });
});
