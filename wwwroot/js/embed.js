var reports = window.reports;
var datasets = window.datasets;
var embedToken = window.embedToken;
var models = window['powerbi-client'].models;

// Generate nav links for reports and datasets
$(function () {
    var reportsList = $("#reports-list");
    var datasetsList = $("#datasets-list");

    if (reports.length == 0) {
        reportsList.append($("<li>").text("[None]"));
    }
    else {
        reports.forEach((report) => {
            var li = $("<li>");
            li.append($("<a>", {
                "href": "javascript:void(0);"
            }).text(report.Name).click(() => { embedReport(report) }));
            reportsList.append(li);
        });
    }

    if (datasets.length == 0) {
        datasetsList.append($("<li>").text("[None]"));
    }
    else {
        datasets.forEach((dataset) => {
            var li = $("<li>");
            li.append($("<a>", {
                "href": "javascript:void(0);"
            }).text(dataset.Name).click(() => { embedQnaDataset(dataset) }));
            datasetsList.append(li);
        });
    }
});

// Embed a report
var embedReport = (report, editMode) => {

    // Create the report embed config object
    var config = {
        type: 'report',
        id: report.Id,
        embedUrl: report.EmbedUrl,
        accessToken: embedToken,
        tokenType: models.TokenType.Embed,
        permissions: models.Permissions.All,
        viewMode: editMode ? models.ViewMode.Edit : models.ViewMode.View,
        settings: {
            panes: {
                filters: { visible: false },
                pageNavigation: { visible: false }
            },
            extensions: [
                {
                    command: {
                        name: "showValue",
                        title: "Show value in alert box",
                        selector: {
                            $schema: "http://powerbi.com/product/schema#visualSelector",
                            visualName: "bf36eb378296825d9db9" // Monthly sales trends
                        },
                        extend: {
                            visualContextMenu: {
                                title: "Show value in alert box"
                            }
                        }
                    }
                }
            ]
        }
    };

    // Get a reference to the embed container
    var embedContainer = document.getElementById('embed-container');

    // Embed the report
    var embeddedReport = powerbi.embed(embedContainer, config);

    // Add "Show value" context menu item
    embeddedReport.on("commandTriggered", function (command) {
        // Determine the command detail
        var commandDetails = command.detail;

        // If the command is showValue, show an alert box
        if (commandDetails.command === "showValue") {
            // Retrieve specific details from the selected data point
            const category = commandDetails.dataPoints[0].identity[0].equals;
            const value = commandDetails.dataPoints[0].values[0].formattedValue;

            alert(category + " value is " + value);
        }
    });
}

// Embed the Q&A experience
var embedQnaDataset = (dataset) => {

    // Create the Q&A embed config object
    var config = {
        type: 'qna',
        tokenType: models.TokenType.Embed,
        accessToken: embedToken,
        embedUrl: dataset.EmbedUrl,
        datasetIds: [dataset.Id],
        viewMode: models.QnaMode.Interactive
    };

    // Get a reference to the embed container
    var embedContainer = document.getElementById('embed-container');

    // Embed the Q&A experience
    var embeddedObject = powerbi.embed(embedContainer, config);
}

// Filter reports by product demographic
$(document).ready(function () {
    $('#demographic').change(function () {
        const report = powerbi.embeds[0];
        const demographic = this.value;

        const removeFilters = (demographic == "*");
        const basicFilter = {
            "$schema": "http://powerbi.com/product/schema#basic",
            "target": {
                "table": "Product",
                "column": "Demographic"
            },
            "operator": removeFilters ? "All" : "In",
            "values": removeFilters ? [] : [demographic]
        }

        // Update filters
        report.updateFilters(models.FiltersOperations.Replace, [basicFilter])
            .catch(error => { console.log(error); });
    });
});

// Filter reports by Region
$(document).ready(function () {
    $('#region').change(function () {
        const report = powerbi.embeds[0];
        const region = this.value;

        const removeFilters = (region == "*");
        const basicFilter = {
            "$schema": "http://powerbi.com/product/schema#basic",
            "target": {
                "table": "Region",
                "column": "Region"
            },
            "operator": removeFilters ? "All" : "In",
            "values": removeFilters ? [] : [region]
        }

        // Update filters
        report.updateFilters(models.FiltersOperations.Replace, [basicFilter])
            .catch(error => { console.log(error); });
    });
});

// Filter reports by Item Group
$(document).ready(function () {
    $('#itemGroup').change(function () {
        const report = powerbi.embeds[0];
        const itemGroup = this.value;

        const removeFilters = (itemGroup == "*");
        const basicFilter = {
            "$schema": "http://powerbi.com/product/schema#basic",
            "target": {
                "table": "Product",
                "column": "Item Group"
            },
            "operator": removeFilters ? "All" : "In",
            "values": removeFilters ? [] : [itemGroup]
        }

        // Update filters
        report.updateFilters(models.FiltersOperations.Replace, [basicFilter])
            .catch(error => { console.log(error); });
    });
});