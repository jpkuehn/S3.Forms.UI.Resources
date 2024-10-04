﻿angular.module("umbraco").controller("S3TrackingFieldsController", function ($scope, $routeParams, pickerResource) {
    if (!$scope.setting.value) {
        $scope.trackingfields = [];
    } else {
        $scope.trackingfields = JSON.parse($scope.setting.value);
    }

    var formId = $routeParams.id;
    if (formId !== -1 || !$scope.model || !$scope.model.fields) {
        pickerResource.getAllFields(formId).then(function (response) {
            $scope.fields = response.data;
        });
    }

    $scope.addTrackingField = function () {
        $scope.trackingfields.push({
            value: ""
        });
    };

    $scope.deleteTrackingField = function (index) {
        $scope.trackingfields.splice(index, 1);
        $scope.setting.value = JSON.stringify($scope.trackingfields);
    };

    $scope.stringifyValue = function () {
        $scope.setting.value = JSON.stringify($scope.trackingfields);
    };
});
