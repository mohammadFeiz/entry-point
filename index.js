"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireWildcard(require("react"));

var _react2 = require("@mdi/react");

var _js = require("@mdi/js");

var _rRangeSlider = _interopRequireDefault(require("r-range-slider"));

var _aioButton = _interopRequireDefault(require("aio-button"));

var _gahDatepicker = _interopRequireDefault(require("gah-datepicker"));

var _aioValidation = _interopRequireDefault(require("aio-validation"));

var _aioTable = _interopRequireDefault(require("aio-table"));

var _reactVirtualDom = _interopRequireDefault(require("react-virtual-dom"));

require("./index.css");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

class AIOForm extends _react.Component {
  constructor(props) {
    super(props);
    let {
      model,
      theme = {}
    } = this.props;
    this.state = {
      initialModel: JSON.stringify(model),
      model,
      theme,
      groupDic: {}
    };
  }

  getModel() {
    return this.props.onSubmit ? this.state.model : this.props.model;
  }

  getValue({
    field,
    def,
    props = this.props,
    input
  }) {
    let model = this.getModel(),
        {
      data = {}
    } = this.props,
        a;

    if (typeof field === 'string') {
      if (field.indexOf('.') !== -1 && (field.indexOf('model.') !== -1 || field.indexOf('props.') !== -1 || field.indexOf('input.') !== -1)) {
        try {
          a = eval(field);
        } catch {
          a = def;
        }
      } else {
        a = field;
      }
    } else if (typeof field === 'function') {
      return field();
    } else {
      a = field;
    }

    return a === undefined && def !== undefined ? def : a;
  }

  setValueByField(obj, field, value) {
    //debugger;
    field = field.replaceAll('[', '.');
    field = field.replaceAll(']', '');
    var fields = field.split('.');
    var node = obj;

    for (let i = 0; i < fields.length - 1; i++) {
      if (node[fields[i]] === undefined) {
        if (isNaN(parseFloat(fields[i + 1]))) {
          node[fields[i]] = {};
        } else {
          node[fields[i]] = [];
        }

        node = node[fields[i]];
      } else {
        node = node[fields[i]];
      }
    }

    node[fields[fields.length - 1]] = value;
    return obj;
  }

  setValue(field, value, model) {
    return this.setValueByField(model, field, value);
  }

  async onChange(input, value) {
    let {
      onChange,
      onSubmit
    } = this.props;

    if (onSubmit) {
      this.setState({
        model: this.setValue(input.field, value, {
          model: this.getModel()
        }).model
      });
    } else {
      if (input.onChange) {
        return await input.onChange(value);
      }

      await onChange(this.setValue(input.field, value, {
        model: this.getModel()
      }).model);
    }
  }

  getInput_text({
    className,
    value,
    onChange,
    options,
    disabled,
    style,
    placeholder
  }, input) {
    let props = { ...input.attrs,
      autoHeight: input.autoHeight,
      type: input.type,
      value,
      className,
      onChange,
      options,
      disabled,
      style,
      placeholder,
      options,
      optionText: input.optionText,
      optionValue: input.optionValue
    };
    return /*#__PURE__*/_react.default.createElement(Input, props);
  }

  getInput_number(obj, input) {
    return this.getInput_text(obj, input);
  }

  getInput_password(obj, input) {
    return this.getInput_text(obj, input);
  }

  getInput_textarea(obj, input) {
    return this.getInput_text(obj, input);
  }

  getInput_color(obj, input) {
    return this.getInput_text(obj, input);
  }

  getInput_checkbox({
    className,
    onChange,
    value,
    disabled,
    style,
    text,
    subtext,
    theme
  }, input) {
    let props = {
      disabled,
      style,
      value,
      subtext: input.subText,
      text,
      subtext,
      onChange: value => onChange(!value),
      className,
      iconSize: theme.checkIconSize,
      iconColor: theme.checkIconColor
    };
    return /*#__PURE__*/_react.default.createElement(_aioButton.default, _extends({}, props, {
      type: "checkbox"
    }));
  }

  getInput_checklist({
    className,
    options: Options,
    disabled,
    style,
    theme
  }, input) {
    let options = Options.map(o => {
      let model = this.getModel(),
          value = this.getValue({
        field: o.field
      }),
          text = o.text;
      return {
        text,
        value,
        onChange: (val, obj) => {
          this.onChange({
            field: o.field,
            onChange: o.onChange
          }, !val);
        },
        ...o
      };
    });
    let {
      input: inputTheme = {}
    } = theme;
    let props = {
      options,
      disabled,
      style,
      optionSubtext: input.optionSubtext,
      className,
      options,
      optionClassName: '"aio-form-input"',
      optionStyle: () => {
        return {
          width: input.optionWidth || 'fit-content',
          height: inputTheme.height,
          padding: inputTheme.padding,
          background: 'none'
        };
      },
      optionIconSize: theme.checkIconSize,
      optionIconColor: theme.checkIconColor
    };
    return /*#__PURE__*/_react.default.createElement(_aioButton.default, _extends({}, props, {
      type: "checklist"
    }));
  }

  getInput_radio({
    value,
    onChange,
    options,
    disabled,
    style,
    className,
    theme
  }, input) {
    let {
      input: inputTheme = {}
    } = theme;
    let props = {
      options,
      value,
      onChange,
      disabled,
      style,
      optionSubtext: input.optionSubtext,
      optionText: input.optionText,
      optionValue: input.optionValue,
      className,
      optionClassName: '"aio-form-input"',
      optionStyle: () => {
        return {
          width: input.optionWidth || 'fit-content',
          height: inputTheme.height,
          padding: inputTheme.padding,
          background: 'none'
        };
      },
      optionIconSize: theme.checkIconSize,
      optionIconColor: theme.checkIconColor
    };
    return /*#__PURE__*/_react.default.createElement(_aioButton.default, _extends({}, props, {
      type: "radio"
    }));
  }

  getInput_datepicker({
    value,
    onChange,
    disabled,
    style,
    className,
    placeholder,
    theme
  }, input) {
    let {
      datepicker = {}
    } = theme;
    let props = {
      value,
      onChange: ({
        dateString
      }) => onChange(dateString),
      disabled,
      style,
      placeHolder: placeholder,
      theme: [datepicker.color1, datepicker.color2],
      className,
      calendarType: input.calendarType,
      unit: input.unit,
      onClear: input.onClear ? () => onChange(false) : undefined
    };
    return /*#__PURE__*/_react.default.createElement(_gahDatepicker.default, props);
  }

  getInput_slider({
    className,
    value = 0,
    onChange,
    disabled,
    style,
    start,
    end,
    step,
    theme
  }, input) {
    let editValue;

    if (typeof input.editValue === 'string') {
      let str = input.editValue;

      if (str.indexOf('calc ') === 0) {
        str = str.slice(5, str.length);
      }

      editValue = value => {
        let res;

        try {
          eval(`res = ${str}`);
        } catch {
          res = value;
        }

        return res;
      };
    } else {
      editValue = input.editValue;
    }

    let props = {
      className,
      value,
      onChange,
      start,
      end,
      step,
      disabled,
      style,
      editValue,
      padding: input.padding,
      theme
    };
    return /*#__PURE__*/_react.default.createElement(Slider, props);
  }

  getInput_select({
    className,
    value,
    onChange,
    options,
    disabled,
    style,
    text
  }, input) {
    let props = {
      options,
      value,
      onChange,
      className,
      search: input.search,
      disabled,
      style,
      optionText: input.optionText,
      optionValue: input.optionValue,
      optionBefore: input.optionBefore,
      optionAfter: input.optionAfter,
      optionStyle: input.optionStyle,
      text,
      before: input.before,
      optionSubtext: input.optionSubtext
    };
    return /*#__PURE__*/_react.default.createElement(_aioButton.default, _extends({}, props, {
      type: "select",
      popupWidth: "fit",
      popupAttrs: {
        style: {
          maxHeight: 400
        }
      }
    }));
  }

  getInput_multiselect({
    className,
    value,
    onChange,
    options,
    disabled,
    style,
    text,
    subtext,
    theme
  }, input) {
    let props = {
      className,
      value,
      onChange,
      options,
      text,
      subtext,
      disabled,
      search: input.search,
      style,
      popupWidth: 'fit',
      optionText: input.optionText,
      optionValue: input.optionValue,
      optionBefore: input.optionBefore,
      optionAfter: input.optionAfter,
      text,
      before: input.before,
      optionSubtext: input.optionSubtext,
      optionStyle: input.optionStyle,
      optionIconSize: theme.checkIconSize,
      optionIconColor: theme.checkIconColor,
      optionTagAttrs: {
        style: { ...theme.tag
        }
      }
    };
    return /*#__PURE__*/_react.default.createElement(_aioButton.default, _extends({}, props, {
      type: "multiselect",
      popupAttrs: {
        style: {
          maxHeight: 400
        }
      }
    }));
  }

  getInput_table({
    className,
    value,
    onChange,
    disabled,
    style,
    columns,
    theme
  }, input) {
    let props = {
      attrs: input.attrs,
      className,
      value,
      onChange,
      columns,
      addable: input.addable,
      rowNumber: input.rowNumber,
      disabled,
      style,
      theme
    };
    return /*#__PURE__*/_react.default.createElement(Table, _extends({}, props, {
      getValue: this.getValue.bind(this)
    }));
  }

  getInput_file({
    className,
    value,
    onChange,
    disabled,
    style,
    text
  }, input) {
    let props = {
      className,
      value,
      onChange,
      disabled,
      style,
      text
    };
    return /*#__PURE__*/_react.default.createElement(File, _extends({}, props, {
      getValue: this.getValue.bind(this)
    }));
  }

  getInput_group(obj, input) {
    let {
      attrs = {}
    } = input;
    let {
      groupDic
    } = this.state;
    let {
      theme = {}
    } = obj;
    let {
      group = {}
    } = theme;
    groupDic[input.id] = groupDic[input.id] === undefined ? true : groupDic[input.id];
    let open = groupDic[input.id];
    return /*#__PURE__*/_react.default.createElement("div", _extends({}, attrs, {
      style: { ...group,
        ...attrs.style
      },
      className: 'aio-form-group' + (attrs.className ? ' ' + attrs.className : ''),
      onClick: () => {
        groupDic[input.id] = !groupDic[input.id];
        this.setState({
          groupDic
        });
      }
    }), /*#__PURE__*/_react.default.createElement("div", null, input.text), /*#__PURE__*/_react.default.createElement("div", {
      style: {
        flex: 1
      }
    }), /*#__PURE__*/_react.default.createElement("div", {
      className: "aio-form-group-icon"
    }, /*#__PURE__*/_react.default.createElement("svg", {
      viewBox: "0 0 24 24",
      role: "presentation",
      style: {
        transform: `rotate(${open ? '180' : '0'}deg)`
      }
    }, /*#__PURE__*/_react.default.createElement("path", {
      d: "M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z",
      style: {
        fill: 'currentcolor'
      }
    }))));
  }

  getInput_message(obj, input) {
    let {
      attrs = {}
    } = input;
    let message = this.getValue({
      field: input.message
    });
    return /*#__PURE__*/_react.default.createElement("div", _extends({}, attrs, {
      className: 'aio-form-input-message' + (attrs.className ? ' ' + attrs.className : '')
    }), message || obj.value);
  }

  getInput_html(obj, input) {
    return input.html(this.getModel, this.props.onSubmit ? model => this.setState({
      model
    }) : undefined);
  }

  getFix(input, rtl, type) {
    let fix_props = this.props[type + 'Attrs'] || {};
    let fix_input = input[type + 'Attrs'] || {};
    let attrs = { ...fix_props,
      ...fix_input
    };
    let {
      onClick = () => {}
    } = attrs;
    let value = this.getValue({
      field: input[type]
    });

    if (value === undefined) {
      return null;
    }

    return /*#__PURE__*/_react.default.createElement("div", _extends({}, attrs, {
      onClick: () => onClick(input),
      className: `aio-form-${type}` + (rtl ? ' rtl' : '') + (attrs.className ? ' ' + attrs.className : '')
    }), value);
  }

  getInputTheme(input) {
    let {
      theme: stateTheme = {}
    } = this.state;
    let {
      theme: inputTheme = {}
    } = input;
    return { ...stateTheme,
      ...inputTheme,
      label: { ...stateTheme.label,
        ...inputTheme.label
      },
      input: { ...stateTheme.input,
        ...inputTheme.input
      }
    };
  }

  getLabelLayout(label, theme, input) {
    let {
      inputs
    } = this.props;
    let {
      label: themeLabel = {}
    } = theme;
    let props = {
      align: 'v',
      show: label !== undefined,
      style: { ...themeLabel,
        width: 'fit-content',
        height: 'fit-content'
      },
      className: 'aio-form-label'
    };
    props.size = themeLabel.inline ? themeLabel.width : themeLabel.height || 24;
    let {
      onChangeInputs
    } = this.props;

    if (onChangeInputs) {
      props.html = /*#__PURE__*/_react.default.createElement(_aioButton.default, {
        style: {
          padding: 0,
          fontSize: 'inherit'
        },
        text: label,
        type: "button",
        popOver: () => {
          return /*#__PURE__*/_react.default.createElement(FormGenerator, {
            input: input,
            onChange: () => {
              onChangeInputs(inputs);
            }
          });
        }
      });
    } else {
      props.html = label;
    }

    return props;
  }

  getInput(input) {
    let {
      rtl
    } = this.props;
    let {
      label,
      affix,
      prefix
    } = input;
    let theme = this.getInputTheme(input);
    let value = this.getValue({
      field: input.field
    });
    let options = this.getValue({
      field: input.options,
      def: []
    });
    let disabled = this.getValue({
      field: input.disabled,
      def: false
    });
    let text = this.getValue({
      field: input.text
    });
    let start = this.getValue({
      field: input.start,
      def: 0
    });
    let end = this.getValue({
      field: input.end,
      def: 100
    });
    let subtext = this.getValue({
      field: input.subtext
    });
    let columns = this.getValue({
      field: input.columns,
      def: []
    });
    let placeholder = this.getValue({
      field: input.placeholder,
      def: false
    });

    let onChange = value => this.onChange(input, value);

    let style = { ...theme.input
    };
    let className = `aio-form-input aio-form-input-${input.type}` + (disabled === true ? ' disabled' : '') + (input.className ? ' ' + input.className : '') + (affix ? ' has-affix' : '') + (prefix ? ' has-prefix' : '') + (rtl ? ' rtl' : ' ltr');
    let error = this.getError(input, value, options);
    let props = {
      value,
      options,
      disabled: disabled === true,
      onChange,
      className,
      style,
      placeholder,
      text,
      subtext,
      start,
      end,
      theme,
      columns
    };
    let {
      label: themeLabel = {},
      error: themeError = {}
    } = theme;

    if (themeLabel.inline) {
      return {
        className: 'aio-form-item',
        style: {
          overflow: 'visible',
          marginBottom: theme.rowGap
        },
        row: [this.getLabelLayout(label, theme, input), {
          size: 6,
          show: label !== undefined
        }, {
          flex: 1,
          column: [{
            row: [{
              show: !!input.prefix,
              html: () => this.getFix(input, rtl, 'prefix')
            }, {
              flex: 1,
              style: {
                overflow: 'visible'
              },
              html: () => this['getInput_' + input.type](props, input)
            }, {
              show: !!input.affix,
              html: () => this.getFix(input, rtl, 'affix')
            }]
          }, {
            align: 'v',
            show: error !== '',
            html: error,
            className: 'aio-form-error',
            style: themeError
          }]
        }]
      };
    } else {
      return {
        className: 'aio-form-item',
        style: {
          overflow: 'visible',
          marginBottom: theme.rowGap
        },
        column: [this.getLabelLayout(label, theme, input), {
          row: [{
            show: !!input.prefix,
            html: () => this.getFix(input, rtl, 'prefix')
          }, {
            flex: 1,
            html: () => this['getInput_' + input.type](props, input)
          }, {
            show: !!input.affix,
            html: () => this.getFix(input, rtl, 'affix')
          }]
        }, {
          size: themeError.height,
          show: error !== '',
          html: error,
          className: 'aio-form-error',
          style: themeError
        }]
      };
    }
  }

  sortByRows(inputs) {
    let res = {};
    let result = [];

    for (let i = 0; i < inputs.length; i++) {
      let {
        type,
        show
      } = inputs[i];

      if (!type) {
        continue;
      }

      if (this.getValue({
        field: show,
        def: true,
        input: inputs[i]
      }) === false) {
        continue;
      }

      inputs[i]._index = i;

      if (type === 'group') {
        let a = 'a' + Math.random();
        res[a] = [inputs[i]];
        result.push(res[a]);
        continue;
      }

      let {
        rowKey
      } = inputs[i];

      if (!rowKey) {
        rowKey = 'a' + Math.random();
      }

      if (!res[rowKey]) {
        res[rowKey] = [];
        result.push(res[rowKey]);
      }

      res[rowKey].push(inputs[i]);
    }

    return result;
  }

  handleGroups(inputs) {
    this.res = [];
    this.handleGroupsReq(inputs, []);
    return this.res;
  }

  handleGroupsReq(inputs = []) {
    let {
      groupDic
    } = this.state;

    for (let i = 0; i < inputs.length; i++) {
      let input = inputs[i];

      if (input.type === 'group') {
        if (input.text !== undefined) {
          this.res.push({ ...input,
            type: 'group'
          });
        }

        if (input.id === undefined || groupDic[input.id] !== false) {
          this.handleGroupsReq(input.inputs, input.id);
        }
      } else {
        this.res.push(input);
      }
    }
  }

  getColumnGap(input) {
    let {
      theme = {}
    } = this.state;
    let {
      columnGap: themeColumnGap = 12
    } = theme;
    let {
      columnGap = themeColumnGap
    } = input;
    return columnGap;
  }

  getInputs(inputs) {
    if (!inputs.length) {
      return [];
    }

    let {
      onSwap
    } = this.props;
    let {
      theme
    } = this.state;
    return this.sortByRows(this.handleGroups(inputs)).map((input, i) => {
      return {
        swapId: onSwap ? input._index.toString() : undefined,
        swapHandleClassName: 'aio-form-label',
        gap: this.getColumnGap(input),
        row: input.map(o => {
          return { ...this.getInput(o),
            flex: o.rowWidth ? undefined : 1,
            size: o.rowWidth,
            align: 'v'
          };
        })
      };
    });
  }

  getError(o, value, options) {
    let {
      validations = []
    } = o;
    let lang = 'en';

    if (!validations.length) {
      return '';
    }

    let a = {
      value,
      title: o.label,
      lang,
      validations: validations.map(a => {
        return [a[0], typeof a[1] === 'function' ? a[1] : this.getValue({
          field: a[1],
          def: ''
        }), a[2]];
      })
    };
    let error = (0, _aioValidation.default)(a);

    if (!this.isThereError && error) {
      this.isThereError = true;
    }

    return error;
  }

  async reset() {
    let {
      onSubmit,
      onChange
    } = this.props;
    let {
      initialModel
    } = this.state;

    if (onSubmit) {
      this.setState({
        model: JSON.parse(initialModel)
      });
    } else if (onChange) {
      await onChange(JSON.parse(initialModel));
    }
  }

  render() {
    let {
      inputs = [],
      header,
      rtl,
      onSubmit,
      submitText = 'Submit',
      closeText = 'Close',
      resetText = 'Reset',
      onClose,
      footerAttrs,
      reset,
      tabs = [],
      tabSize = 36
    } = this.props;
    let {
      theme
    } = this.state;
    this.isThereError = false;
    return /*#__PURE__*/_react.default.createElement(_reactVirtualDom.default, {
      layout: {
        className: 'aio-form',
        column: [{
          show: header !== undefined,
          html: /*#__PURE__*/_react.default.createElement(AIOFormHeader, _extends({}, header, {
            rtl: rtl,
            theme: theme,
            getValue: this.getValue.bind(this)
          }))
        }, {
          className: 'aio-form-body',
          style: theme.body,
          scroll: 'v',
          flex: 1,
          column: () => this.getInputs(inputs),
          show: tabs.length === 0
        }, {
          style: theme.body,
          flex: 1,
          show: tabs.length !== 0,
          row: [{
            className: 'aio-form-tabs',
            size: tabSize,
            column: tabs.map(o => {
              return {
                className: 'aio-form-tab active',
                size: tabSize,
                html: o.html,
                align: 'vh',
                style: {}
              };
            })
          }, {
            className: 'aio-form-body',
            flex: 1,
            scroll: 'v',
            column: () => this.getInputs(inputs)
          }]
        }, {
          show: onSubmit !== undefined || reset === true || onClose !== undefined,
          html: () => /*#__PURE__*/_react.default.createElement(AIOFormFooter, {
            isThereError: this.isThereError,
            theme: theme,
            onClose: onClose,
            onSubmit: onSubmit ? () => onSubmit({ ...this.state.model
            }) : undefined,
            closeText: closeText,
            submitText: submitText,
            resetText: resetText,
            footerAttrs: footerAttrs,
            onReset: reset ? () => this.reset() : undefined
          })
        }]
      }
    });
  }

}

exports.default = AIOForm;

class AIOFormHeader extends _react.Component {
  render() {
    let {
      title,
      onClose,
      attrs = {},
      print,
      onBack,
      justify,
      onForward,
      rtl,
      theme,
      getValue
    } = this.props;
    let subtitle = getValue({
      field: this.props.subtitle
    });
    return /*#__PURE__*/_react.default.createElement(_reactVirtualDom.default, {
      layout: {
        className: 'aio-form-header' + (attrs.className ? ' ' + attrs.className : ''),
        style: { ...theme.header,
          ...attrs.style
        },
        align: 'v',
        row: [{
          show: onBack !== undefined,
          html: /*#__PURE__*/_react.default.createElement(_react2.Icon, {
            path: rtl ? _js.mdiChevronRight : _js.mdiChevronLeft,
            size: 0.9
          }),
          align: 'vh',
          size: 36,
          attrs: {
            onClick: onBack
          }
        }, {
          show: justify === true,
          flex: 1
        }, {
          column: [{
            html: title,
            className: 'aio-form-title',
            align: 'v'
          }, {
            show: subtitle !== undefined,
            html: subtitle,
            className: 'aio-form-subtitle',
            align: 'v'
          }]
        }, {
          flex: 1
        }, {
          show: onForward !== undefined,
          html: /*#__PURE__*/_react.default.createElement(_react2.Icon, {
            path: rtl ? _js.mdiChevronLeft : _js.mdiChevronRight,
            size: 0.9
          }),
          align: 'vh',
          size: 36,
          attrs: {
            onClick: onForward
          }
        }, {
          show: print !== undefined,
          html: /*#__PURE__*/_react.default.createElement(_react2.Icon, {
            path: _js.mdiPrinter,
            size: 0.9
          }),
          align: 'vh',
          size: 36
        }, {
          show: onClose !== undefined,
          html: /*#__PURE__*/_react.default.createElement(_react2.Icon, {
            path: _js.mdiClose,
            size: 0.8
          }),
          align: 'vh',
          size: 36,
          attrs: {
            onClick: onClose
          }
        }]
      }
    });
  }

}

class AIOFormFooter extends _react.Component {
  render() {
    let {
      onClose,
      onSubmit,
      closeText,
      submitText,
      footerAttrs = {},
      onReset,
      resetText,
      isThereError,
      theme = {}
    } = this.props;
    return /*#__PURE__*/_react.default.createElement(_reactVirtualDom.default, {
      layout: {
        align: 'v',
        className: 'aio-form-footer',
        style: theme.footer,
        row: [{
          show: onClose !== undefined,
          html: () => /*#__PURE__*/_react.default.createElement("button", {
            className: "aio-form-footer-button aio-form-close-button",
            onClick: () => onClose()
          }, closeText)
        }, {
          size: 12,
          show: onSubmit !== undefined
        }, {
          show: onSubmit !== undefined,
          html: () => /*#__PURE__*/_react.default.createElement("button", {
            className: "aio-form-footer-button aio-form-submit-button",
            disabled: isThereError,
            onClick: () => onSubmit()
          }, submitText)
        }, {
          size: 12,
          show: onSubmit !== undefined
        }, {
          show: onReset !== undefined,
          html: () => /*#__PURE__*/_react.default.createElement("button", {
            className: "aio-form-footer-button aio-form-reset-button",
            onClick: () => onReset()
          }, resetText)
        }]
      }
    });
  }

}

function Input(obj) {
  let [value, setValue] = (0, _react.useState)(obj.value),
      [prevValue, setPrevValue] = (0, _react.useState)(obj.value),
      [timer, setTimer] = (0, _react.useState)();
  let [error, setError] = (0, _react.useState)(false);
  let dom = (0, _react.useRef)(null);

  if (obj.value !== prevValue) {
    setTimeout(() => {
      setValue(obj.value);
      setPrevValue(obj.value);
    }, 0);
  }

  function onChange(e) {
    let value = e.target.value;

    if (obj.type === 'number') {
      if (value) {
        value = +value;
      }
    }

    setValue(value);
    clearTimeout(timer);
    setTimer(setTimeout(() => {
      obj.onChange(value);
    }, 800));
  }

  function getOptions(options) {
    let Options = options.map((option, index) => {
      let text;

      if (typeof option === 'object' && option.text !== undefined) {
        text = option.text;
      } else if (typeof obj.optionText === 'function') {
        text = optionText(option, index);
      } else if (typeof obj.optionText === 'string') {
        try {
          eval(`text = ${obj.optionText}`);
        } catch {
          text = '';
        }
      } else {
        text = '';
      }

      return /*#__PURE__*/_react.default.createElement("option", {
        key: index,
        value: text
      });
    });
    return /*#__PURE__*/_react.default.createElement("datalist", {
      id: uid
    }, Options);
  }

  (0, _react.useEffect)(() => {
    if (obj.type === 'textarea' && obj.autoHeight) {
      let scrollHeight = dom.current.scrollHeight + 'px';
      dom.current.style.height = scrollHeight;
      dom.current.style.overflow = 'hidden';
      dom.current.style.resize = 'none';
    }
  });
  let props = { ...obj,
    value,
    onChange: e => onChange(e),
    ref: dom
  };
  let uid = 'a' + Math.random();

  if (error !== false) {
    return /*#__PURE__*/_react.default.createElement("div", {
      className: "aio-form-inline-error aio-form-input",
      onClick: () => setError(false)
    }, error);
  }

  return obj.type === 'textarea' ? /*#__PURE__*/_react.default.createElement("textarea", props) : /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/_react.default.createElement("input", _extends({}, props, {
    list: uid
  })), Array.isArray(obj.options) && obj.options.length !== 0 && getOptions(obj.options));
}

class Slider extends _react.Component {
  render() {
    let {
      className,
      start,
      end,
      step,
      value,
      onChange,
      disabled,
      style = {},
      editValue,
      padding = style.padding,
      theme = {}
    } = this.props;

    if (!Array.isArray(value)) {
      value = [value];
    }

    let {
      slider: sliderTheme = {}
    } = theme;
    let {
      color1 = 'dodgerblue',
      color2 = '#fff',
      color3 = '#bbb'
    } = sliderTheme;
    let props = {
      attrs: {
        className,
        style: { ...style,
          padding
        }
      },
      start,
      end,
      step,
      points: value,
      onChange: disabled ? undefined : points => points.length === 1 ? onChange(points[0]) : onChange([points[0], points[1]]),
      showValue: true,
      editValue,
      fillStyle: index => {
        if (value.length === 1) {
          if (index === 1) {
            return {
              background: 'none'
            };
          }
        } else {
          if (index === 0 || index === value.length) {
            return {
              background: 'none'
            };
          }
        }

        return {
          background: color1
        };
      },
      valueStyle: () => {
        return {
          height: 20,
          display: 'flex',
          minWidth: 12,
          padding: '0 3px',
          justifyContent: 'center',
          alignItems: 'center',
          top: 'calc(50% - 10px)',
          background: color1,
          color: color2
        };
      },
      lineStyle: () => {
        return {
          background: color3,
          height: 1
        };
      },
      pointStyle: () => {
        return {
          display: 'none'
        };
      }
    };
    return /*#__PURE__*/_react.default.createElement(_rRangeSlider.default, props);
  }

}

class Table extends _react.Component {
  setValueByField(obj, field, value) {
    field = field.replaceAll('[', '.');
    field = field.replaceAll(']', '');
    var fields = field.split('.');
    var node = obj;

    for (let i = 0; i < fields.length - 1; i++) {
      if (node[fields[i]] === undefined) {
        if (isNaN(parseFloat(fields[i + 1]))) {
          node[fields[i]] = {};
        } else {
          node[fields[i]] = [];
        }

        node = node[fields[i]];
      } else {
        node = node[fields[i]];
      }
    }

    node[fields[fields.length - 1]] = value;
    return obj;
  }

  add() {
    let {
      columns = [],
      onChange,
      value = []
    } = this.props;

    if (!columns.length) {
      return;
    }

    let obj = {};

    for (let i = 0; i < columns.length; i++) {
      let {
        field,
        type
      } = columns[i];

      if (!field) {
        continue;
      }

      if (typeof field === 'string' && field.indexOf('calc ') === 0) {
        continue;
      }

      let val;

      if (type === 'text') {
        val = '';
      } else if (type === 'number') {
        val = 0;
      } else if (type === 'select') {
        let options = this.getColumnOptions(columns[i]);

        try {
          val = options[0].value;
        } catch {
          val = '';
        }
      } else if (type === 'checkbox') {
        val = false;
      }

      this.setValueByField(obj, field, val);
    }

    value.push(obj);
    onChange(value);
  }

  getToolbarItems() {
    let {
      item,
      addable = true,
      disabled
    } = this.props;

    if (disabled) {
      return;
    }

    let toolbarItems = [];

    if (addable) {
      toolbarItems.push({
        text: '+',
        type: 'button',
        onClick: () => this.add(),
        className: 'aio-form-input aio-form-input-table-add',
        style: {
          background: 'none',
          color: 'inherit',
          padding: 0,
          width: '100%'
        }
      });
    }

    return toolbarItems;
  }

  getColumnOptions(column) {
    let {
      getValue
    } = this.props;
    let options = getValue({
      field: column.options,
      def: []
    });
    let {
      optionText,
      optionValue
    } = column;
    options = options.map(option => {
      let text, value;

      if (optionText) {
        try {
          eval(`text = ${optionText}`);
        } catch {
          text = '';
        }
      } else {
        text = option.text;
      }

      if (optionValue) {
        try {
          eval(`value = ${optionText}`);
        } catch {
          value = undefined;
        }
      } else {
        value = option.value;
      }

      return {
        text,
        value
      };
    });
    return options.filter(o => {
      return getValue({
        field: o.show,
        def: true
      });
    });
  }

  getColumns() {
    let {
      onChange,
      addable = true,
      disabled,
      columns,
      value,
      rowNumber,
      theme = {}
    } = this.props;
    let {
      input = {}
    } = theme;
    let cellAttrs = {
      className: 'aio-form-input',
      style: {
        height: input.height,
        borderColor: input.borderColor,
        background: 'none',
        boxShadow: 'none'
      }
    };
    let titleAttrs = {
      className: 'aio-form-input',
      style: {
        height: input.height,
        borderColor: input.borderColor,
        background: 'none',
        boxShadow: 'none'
      }
    };
    let result = columns.map(column => {
      let a = { ...column,
        cellAttrs,
        titleAttrs,
        getValue: column.field
      };

      if (column.type === 'select') {
        let options = this.getColumnOptions(column);

        a.template = (row, column, value) => {
          let option = options.filter(o => o.value === value)[0];
          return option ? option.text : '';
        };
      }

      if (column.type === 'checkbox') {
        let options = this.getColumnOptions(column) || [{
          text: 'True',
          value: true
        }, {
          text: 'False',
          value: false
        }];

        a.template = (row, column, value) => {
          let option = options.filter(o => o.value === value)[0];
          return option ? option.text : '';
        };
      }

      if (typeof column.type === 'function') {
        a.inlineEdit = row => {
          let type = column.type(row);
          return {
            type,
            onChange: (row, val) => {
              if (!value[row._index]) {
                value[row._index] = {};
              }

              this.setValueByField(value[row._index], column.field, val);
              onChange(value);
            },
            disabled: () => {
              if (column.disabled) {
                return true;
              }

              return false;
            },
            options: type === 'select' ? this.getColumnOptions(column) : undefined
          };
        };
      } else if (['text', 'number', 'select', 'checkbox'].indexOf(column.type) !== -1 && !disabled) {
        a.inlineEdit = {
          type: column.type,
          disabled: column.disabled,
          onChange: (row, val) => {
            if (!value[row._index]) {
              value[row._index] = {};
            }

            this.setValueByField(value[row._index], column.field, val);
            onChange(value);
          },
          disabled: () => disabled
        };

        if (column.type === 'select') {
          a.inlineEdit.options = this.getColumnOptions(column);
        }

        a.inlineEdit.disabled = row => {
          if (column.disabled) {
            return true;
          }

          return false;
        };
      }

      return a;
    });

    if (rowNumber) {
      result.splice(0, 0, {
        title: '#',
        width: 48,
        getValue: ({
          _index
        }) => _index + 1,
        cellAttrs,
        titleAttrs
      });
    }

    if (addable && !disabled) {
      result.push({
        title: '',
        width: 36,
        cellAttrs,
        titleAttrs,
        template: row => {
          return /*#__PURE__*/_react.default.createElement("div", {
            onClick: () => {
              let {
                value
              } = this.props;
              value.splice(row._index, 1);
              onChange(value);
            }
          }, "X");
        }
      });
    }

    return result;
  }

  render() {
    let {
      value = [],
      disabled,
      className,
      style,
      attrs,
      theme = {}
    } = this.props;
    let model;
    let {
      input = {}
    } = theme;

    try {
      model = JSON.parse(JSON.stringify(value));
    } catch {
      model = [];
    }

    if (!model.length) {
      if (disabled) {
        return null;
      }

      return /*#__PURE__*/_react.default.createElement("div", {
        className: "aio-form-table-add aio-form-input",
        onClick: () => this.add(),
        style: {
          fontSize: input.fontSize,
          background: input.background,
          borderWidth: input.borderWidth,
          borderColor: input.borderColor,
          height: input.height
        }
      }, "+");
    }

    let columns = this.getColumns();
    let props = {
      getCellStyle: () => {
        return style;
      },
      titleStyle: style,
      disabled,
      className,
      columns,
      toolbarItems: this.getToolbarItems(),
      columns,
      model: value,
      style: attrs ? attrs.style : undefined
    };
    return /*#__PURE__*/_react.default.createElement(_aioTable.default, {
      columns: props.columns,
      model: props.model,
      rowGap: 0,
      toolbarItems: props.toolbarItems,
      toolbarAttrs: {
        className: 'aio-form-input',
        style: { ...theme.input,
          border: 'none',
          display: disabled ? 'none' : undefined,
          borderRadius: 0
        }
      },
      style: {
        borderColor: input.borderColor,
        borderWidth: input.borderWidth,
        borderRadius: input.borderRadius,
        fontSize: input.fontSize,
        color: input.color,
        background: input.background
      }
    });
  }

}

class File extends _react.Component {
  render() {
    let {
      text,
      value,
      onChange,
      disabled,
      className,
      style
    } = this.props;
    let files = value;
    let props = {
      files,
      disabled,
      className,
      style,
      text,
      onAdd: list => {
        files = [...files, ...list];
        onChange(files);
      },
      onRemove: index => {
        files.splice(index, 1);
        onChange(files);
      }
    };
    return /*#__PURE__*/_react.default.createElement(FileManager, props);
  }

}

class FileManager extends _react.Component {
  render() {
    let {
      files = [],
      onAdd,
      onRemove,
      className,
      text,
      color,
      style
    } = this.props;
    let Previews = [];

    for (let i = 0; i < files.length; i++) {
      let file = files[i];
      Previews.push( /*#__PURE__*/_react.default.createElement(FilePreview, {
        key: i,
        index: i,
        file: file,
        onRemove: onRemove,
        color: color
      }));
    }

    return /*#__PURE__*/_react.default.createElement("div", {
      className: 'file-manager' + (className ? ' ' + className : ''),
      style: style
    }, onAdd && /*#__PURE__*/_react.default.createElement(AddFile, {
      onAdd: list => onAdd(list),
      text: text,
      color: color
    }), Previews);
  }

}

class FilePreview extends _react.Component {
  constructor(props) {
    super(props);
    this.state = {
      preview: false
    };
  }

  getFile(file) {
    try {
      let minName, sizeString;
      let lastDotIndex = file.name.lastIndexOf('.');
      let name = file.name.slice(0, lastDotIndex);
      let format = file.name.slice(lastDotIndex + 1, file.name.length);

      if (name.length > 10 + 5) {
        minName = name.slice(0, 10) + '...' + name.slice(10, 10 + 5) + '.' + format;
      } else {
        minName = file.name;
      }

      let size = file.size;
      let gb = size / (1024 * 1024 * 1024),
          mb = size / (1024 * 1024),
          kb = size / 1024;

      if (gb >= 1) {
        sizeString = gb.toFixed(2) + ' GB';
      } else if (mb >= 1) {
        sizeString = mb.toFixed(2) + ' MB';
      } else if (kb >= 1) {
        sizeString = kb.toFixed(2) + ' KB';
      } else {
        sizeString = size + ' byte';
      }

      return {
        minName,
        sizeString
      };
    } catch {
      return {
        minName: 'untitle',
        sizeString: '0'
      };
    }
  }

  getIcon(file, size) {
    return /*#__PURE__*/_react.default.createElement(_react2.Icon, {
      style: {
        width: size,
        height: size
      },
      path: _js.mdiAttachment,
      size: 1,
      onClick: () => this.setState({
        preview: file
      })
    });
  }

  render() {
    let {
      file,
      onRemove,
      index,
      color,
      size = 36
    } = this.props;
    let {
      preview
    } = this.state;
    let {
      sizeString,
      minName
    } = this.getFile(file);
    return /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/_react.default.createElement(_reactVirtualDom.default, {
      layout: {
        attrs: {
          className: 'file-preview',
          style: {
            background: color,
            height: size
          }
        },
        flex: 'none',
        row: [{
          size,
          html: this.getIcon(file, size),
          align: 'vh',
          attrs: {
            style: {
              overflow: 'hidden'
            }
          }
        }, {
          column: [{
            align: 'v',
            flex: 1,
            html: minName,
            attrs: {
              className: 'file-preview-name'
            }
          }, {
            aling: 'v',
            flex: 0.8,
            html: sizeString,
            attrs: {
              className: 'file-preview-size'
            }
          }]
        }, {
          show: onRemove !== undefined,
          size,
          html: /*#__PURE__*/_react.default.createElement(_react2.Icon, {
            path: _js.mdiClose,
            size: 0.7
          }),
          align: 'vh',
          attrs: {
            onClick: () => onRemove(index)
          }
        }, {
          show: onRemove === undefined,
          size: 12
        }]
      }
    }), preview && /*#__PURE__*/_react.default.createElement("div", {
      className: "file-preview-preview",
      onClick: () => this.setState({
        preview: false
      })
    }, /*#__PURE__*/_react.default.createElement("embed", {
      type: preview.type,
      src: URL.createObjectURL(preview),
      width: "90%",
      height: '90%',
      style: {
        pointerEvent: 'none'
      }
    })));
  }

}

class AddFile extends _react.Component {
  async toBase64(file) {
    let a = await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onload = () => resolve(reader.result);

      reader.onerror = error => reject(error);
    });
    return a;
  }

  change(e) {
    let {
      onAdd
    } = this.props;
    onAdd(e.target.files);
  }

  render() {
    let {
      text = 'Add File',
      color
    } = this.props;
    return /*#__PURE__*/_react.default.createElement("label", {
      className: "add-file",
      style: {
        color
      }
    }, /*#__PURE__*/_react.default.createElement("input", {
      type: "file",
      onChange: e => this.change(e),
      multiple: true
    }), /*#__PURE__*/_react.default.createElement("div", {
      className: "add-file-icon"
    }, /*#__PURE__*/_react.default.createElement(_react2.Icon, {
      path: _js.mdiPlusThick,
      size: 0.8
    })), /*#__PURE__*/_react.default.createElement("div", {
      className: "add-file-text"
    }, text));
  }

}

class FormGenerator extends _react.Component {
  render() {
    let {
      input,
      onChange
    } = this.props;
    let validations = input.validations || [];
    console.log(validations);
    let validations_obj = validations.map(([operator, target]) => {
      return {
        operator,
        target: JSON.stringify(target)
      };
    });
    input.validations_obj = validations_obj;
    return /*#__PURE__*/_react.default.createElement(AIOForm, {
      model: input,
      data: {
        validationOperators: ['required', '=', '!=', '<', '<=', '>', '>=', 'length=', 'length!=', 'length<', 'length>', 'date<', 'date<=', 'date>', 'date>=', 'contain', '!contain']
      },
      onChange: () => onChange(),
      theme: {
        rowGap: 0,
        label: {
          inline: true,
          width: 80
        },
        input: {
          height: 24
        }
      },
      inputs: [{
        type: 'text',
        field: 'model.rowKey',
        label: 'rowKey'
      }, {
        type: 'number',
        field: 'model.rowWidth',
        label: 'rowWidth'
      }, {
        type: 'text',
        field: 'model.field',
        label: 'field'
      }, {
        type: 'text',
        field: 'model.label',
        label: 'label'
      }, {
        type: 'text',
        field: 'model.show',
        label: 'show'
      }, {
        type: 'text',
        field: 'model.disabled',
        label: 'disabled'
      }, {
        type: 'text',
        field: 'model.prefix',
        label: 'prefix'
      }, {
        type: 'text',
        field: 'model.affix',
        label: 'affix'
      }, {
        type: 'text',
        field: 'model.placeholder',
        label: 'placeholder',
        show: '["text","number","textarea","datepicker"].indexOf(model.type) !== -1'
      }, {
        type: 'text',
        field: 'model.options',
        label: 'options',
        show: '["text","number","select","multiselect","radio"].indexOf(model.type) !== -1'
      }, {
        type: 'text',
        field: 'model.text',
        label: 'text',
        show: '["select","multiselect","checkbox"].indexOf(model.type) !== -1'
      }, {
        type: 'text',
        field: 'model.optionWidth',
        label: 'optionWidth',
        show: '["radio","checklist"].indexOf(model.type) !== -1'
      }, {
        type: 'text',
        field: 'model.optionValue',
        label: 'optionValue',
        show: '["select","multiselect","radio"].indexOf(model.type) !== -1'
      }, {
        type: 'text',
        field: 'model.optionText',
        label: 'optionValue',
        show: '["text","number","select","multiselect","radio"].indexOf(model.type) !== -1'
      }, {
        type: 'text',
        field: 'model.optionSubtext',
        label: 'optionSubtext',
        show: '["select","multiselect","radio"].indexOf(model.type) !== -1'
      }, {
        type: 'text',
        field: 'model.optionStyle',
        label: 'optionStyle',
        show: '["select","multiselect","radio"].indexOf(model.type) !== -1'
      }, {
        type: 'text',
        field: 'model.autoHeight',
        label: 'autoHeight',
        show: 'model.type === "textarea"'
      }, {
        type: 'number',
        field: 'model.start',
        label: 'start',
        show: 'model.type === "slider"'
      }, {
        type: 'number',
        field: 'model.end',
        label: 'end',
        show: 'model.type === "slider"'
      }, {
        type: 'number',
        field: 'model.step',
        label: 'step',
        show: 'model.type === "slider"'
      }, {
        type: 'table',
        field: 'model.validations_obj',
        label: 'Validations',
        theme: {
          label: {
            inline: false
          }
        },
        onChange: value => {
          input.validations = value.map(({
            operator,
            target = ''
          }) => {
            let Target;

            try {
              Target = JSON.parse(target);
            } catch {
              Target = undefined;
            }

            return [operator, Target];
          });
          onChange();
        },
        columns: [{
          title: 'Operator',
          type: 'select',
          options: 'props.data.validationOperators',
          optionText: 'option',
          optionValue: 'option',
          field: 'operator'
        }, {
          title: 'Target',
          type: 'text',
          field: 'target'
        }]
      }]
    });
  }

}