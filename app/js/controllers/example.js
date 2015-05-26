'use strict';

var controllersModule = require('./_index');

/**
 * @ngInject
 */
function ExampleCtrl() {

  // ViewModel
  var vm = this;

  vm.title = 'This is my portfolio!';
  vm.number = 1234;

}

controllersModule.controller('ExampleCtrl', ExampleCtrl);