'use strict';

define(['internal_packages/aaf/core/coreUtils'], function (coreUtils) {
    var mod = angular.module('aafCommonModule', []);

    coreUtils.InitAngularModule(mod);

    return mod;
});
