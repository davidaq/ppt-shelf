(function(func){ if (typeof window == "undefined") {
  var fake={};
  fake.React=require("react");
  module.exports = func.bind(this, fake);
 } else {
  window.Widgets = window.Widgets||{};
  window.Widgets["admin"] = func(window, {get:function(name) {return window.Widgets[name]}});
 }})(function(window, widgets) {var $EXP$ = {};
(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function (global){
"use strict";function initState(e){global.ReactMaterialize=e.get("ReactMaterialize")}Object.defineProperty(exports,"__esModule",{value:!0});var _login=require("./login");Object.defineProperty(exports,"Login",{enumerable:!0,get:function(){return _login.Login}}),exports.initState=initState,$EXP$=exports;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./login":2}],2:[function(require,module,exports){
"use strict";function _interopRequireDefault(e){return e&&e.__esModule?e:{"default":e}}function _classCallCheck(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function _possibleConstructorReturn(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function _inherits(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}Object.defineProperty(exports,"__esModule",{value:!0}),exports.Login=void 0;var _createClass=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),_react=window.React,_react2=_interopRequireDefault(_react),_widgets$get=widgets.get("ReactMaterialize"),Button=_widgets$get.Button,Input=_widgets$get.Input,Preloader=_widgets$get.Preloader,Icon=_widgets$get.Icon,Toast=_widgets$get.Toast,Login=exports.Login=function(e){function t(){return _classCallCheck(this,t),_possibleConstructorReturn(this,Object.getPrototypeOf(t).apply(this,arguments))}return _inherits(t,e),_createClass(t,[{key:"componentWillMount",value:function(){this.state={}}},{key:"render",value:function(){var e=this;return _react2["default"].createElement("form",{id:"loginForm",style:{height:"100%",background:"#EEE"},onSubmit:this.login.bind(this)},_react2["default"].createElement("div",{className:"valign-wrapper",style:{height:"80%"}},_react2["default"].createElement("div",{className:"card",style:{margin:"0 auto",minHeight:"350px"}},_react2["default"].createElement("div",{className:"card-content center-align"},_react2["default"].createElement(Icon,{large:!0},"account_circle"),_react2["default"].createElement(Input,{name:"username",label:"用户名"}),_react2["default"].createElement(Input,{name:"password",label:"密码",type:"password"}),function(){var t;return t=e.state.loading,t?_react2["default"].createElement(Preloader,{flashing:!0}):_react2["default"].createElement(Button,{waves:"light",onClick:e.login.bind(e)},"登录")}()))))}},{key:"login",value:function(e){var t=this;e.preventDefault();var n=$(ReactDOM.findDOMNode(this)).formData();ajax("/admin/login.page",n,function(e){return t.setState({loading:!0})},function(e){t.setState({loading:!1}),e.ok?document.location.replace("/admin.page"):Materialize.toast(e.error,3e3)})}}]),t}(_react2["default"].Component);

},{}]},{},[1]);
;return $EXP$;})