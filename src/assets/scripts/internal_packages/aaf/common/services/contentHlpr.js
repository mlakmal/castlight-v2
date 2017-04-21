'use strict';

/**
 * @author Lakmal Molligoda
 *  helper service to support various content definition tasks related with WCS.
 *  Support to store error definition html and retrieve that content.
 */
define(['internal_packages/aaf/common/commonModule'], function (mod) {
	var injectParams = [];

	var aafContentHlpr = function () {
		var errors = {};
		var content = {};

		this.setErrorContent = function (widget, code, content) {
			if (typeof errors[widget] === 'undefined') {
				errors[widget] = {};
			}

			if (typeof errors[widget][code] === 'undefined') {
				errors[widget][code] = content;
			}
		};

		this.getErrorContent = function (widget, code) {
			if (typeof errors[widget] !== 'undefined' && typeof errors[widget][code] !== 'undefined') {
				return errors[widget][code];
			}

			return '';
		};

		this.setWcsConent = function (widget, wcsContent) {
			if (typeof content[widget] === 'undefined') {
				content[widget] = {};
			}

			content[widget] = wcsContent;
		};

		this.getWcsContent = function (widget) {
			if (typeof content[widget] !== 'undefined') {
				return content[widget];
			}

			return null;
		};

		this.resetWcsContent = function () {
			content = {};
		};

		this.getBrandContent = function (content, brand) {
			if (!content.default) {
				return content;
			}

			var t = angular.copy(content.default);
			var b = (brand || '').toLowerCase();
			var c = content[b];

			if (c) {
				angular.merge(t, c);
			}

			return t;
		};
	};

	aafContentHlpr.$inject = injectParams;

	mod.register('service', 'aafContentHlpr', aafContentHlpr);
});
