/// <reference path="emdduallist-vsdoc.js" />
/**
* duallist v0.0.1 by @emd
* Copyright 2018 EMD
* http://www.apache.org/licenses/LICENSE-2.0
*/

(function ($) {
    //test
    $.fn.emdduallist = function emdduallist (options) {
        /// test

        //default values
        var defaults={
            color:"black",
            backgroundColor: "white",
            height:200,
            multiple: true,
            leftSelectSource: "",
            rightSelectSource: "",
            leftLabel: "",
            rightLabel: "",
            searchBoxLocation:"bottom"
        };

        var settings = $.extend({}, defaults, options);

        RenderControls(this);
        HookUpEvents();

        function RenderControls(targetSelect) {
            RenderLeftSelect(targetSelect);

            var grandParent = targetSelect.parent().parent();

            RenderMoveControls(grandParent);
            RenderRightSelect(grandParent);
            RenderLeftSearchBox();
            RenderRightSearchBox();
            RenderLabels();
        }

        function RenderLeftSelect(targetSelect) {
            //css style left selectbox
            targetSelect.css({
                color: settings.color,
                backgroundColor: settings.backgroundColor,
                height: settings.height
            });

            if (settings.multiple) {
                targetSelect.attr("multiple", "multiple");
            }

            //name the left selectbox
            targetSelect.prop({
                name: "leftSelect",
                id: "leftSelect"
            });

            targetSelect.addClass("form-control");

            //wrap the left select box
            targetSelect.wrap("<div id='leftDiv' name='leftDiv' class='col-md-4'></div>");

            //wrap the all of the controls into a div
            var targetSelectParent = targetSelect.parent();
            targetSelectParent.wrap("<div class='container emdduallist'>");

            RenderSelectValues(targetSelect,settings.leftSelectSource);
        }

        function RenderMoveControls(grandParent) {
            //move buttons
            $(grandParent).append("<div id='controlDiv' name='controlDiv' class='col-md-4 emdduallist-controlDiv'></div>");

            var controlDiv = $('#controlDiv');
            controlDiv.css({
                height: settings.height + 100 //center the controls accordingly
            });

            var controlDivContent = $("<div id='controlDivContent' name='controlDivContent' class='emdduallist-controlDivContent'></div>");

            controlDiv.append(controlDivContent);

            //move all to right button
            var moveAllToRightButton = $("<button></button>", {
                id: "moveAllToRightBtn",
                name: "moveAllToRightBtn",
                class: "btn btn-block emdduallist-moveBtn",
            }).append($("<span></span>", {
                text: "Move all to right",
                class: "emdduallist-moveBtn-text-paddRight"
            })).append($("<span></span>", {
                class: "glyphicon glyphicon-list"
            })).append($("<span></span>", {
                class: "glyphicon glyphicon-chevron-right"
            }));
            controlDivContent.append(moveAllToRightButton);


            //move right button
            var moveRightButton = $("<button></button>", {
                id: "moveRightBtn",
                name: "moveRightBtn",
                class: "btn btn-block emdduallist-moveBtn",
            }).append($("<span></span>", {
                text: "Move right",
                class: "emdduallist-moveBtn-text-paddRight"
            })).append($("<span></span>", {
                class: "glyphicon glyphicon-chevron-right"
            }));
            controlDivContent.append(moveRightButton);

            //move left button
            var moveLeftButton = $("<button></button>", {
                id: "moveLeftBtn",
                name: "moveLeftBtn",
                class: "btn btn-block emdduallist-moveBtn",
            }).append($("<span></span>", {
                class: "glyphicon glyphicon-chevron-left"
            })).append($("<span></span>", {
                text: "Move left",
                class: "emdduallist-moveBtn-text-paddLeft"
            }));
            controlDivContent.append(moveLeftButton);

            //move all to left button
            var moveAllToLeftButton = $("<button></button>", {
                id: "moveAllToLeftBtn",
                name: "moveAllToLeftBtn",
                class: "btn btn-block emdduallist-moveBtn",
            }).append($("<span></span>", {
                class: "glyphicon glyphicon-chevron-left"
            })).append($("<span></span>", {
                class: "glyphicon glyphicon-list"
            })).append($("<span></span>", {
                text: "Move all to left",
                class: "emdduallist-moveBtn-text-paddLeft"
            }));
            controlDivContent.append(moveAllToLeftButton);
        }
      
        function RenderRightSelect(grandParent) {
            //right select box ie.target
            $(grandParent).append("<div id='rightDiv' name='rightDiv' class='col-md-4'></div>");

            var rightDiv = $("#rightDiv");

            //create right selectbox
            var rightSelectBox = $("<select></select>", {
                id: "rightSelect",
                name: "rightSelect"
            });

            //css style right selectbox
            rightSelectBox.css({
                color: settings.color,
                backgroundColor: settings.backgroundColor,
                height: settings.height
            });

            if (settings.multiple) {
                rightSelectBox.attr("multiple", "multiple");
            }

            rightSelectBox.addClass("form-control");

            //add right selectbox
            rightDiv.append(rightSelectBox);

            RenderSelectValues(rightSelectBox, settings.rightSelectSource);
        }
        
        function RenderLeftSearchBox() {
            //left search box
            var leftSearchBox = $("<input></input>", {
                type: "text",
                id: "searchLeftSelectBox",
                name: "searchLeftSelectBox",
                placeholder: "Search",
                class: "form-control emdduallist-searchBox"
            });

            if (settings.searchBoxLocation === "bottom") {
                var leftDiv = $("#leftDiv");
                leftDiv.append(leftSearchBox);
            } else {
                leftSearchBox.insertBefore("#leftSelect");
            }
        }

        function RenderRightSearchBox() {
            //right search box
            var rightDiv = $("#rightDiv");
            var rightSearchBox = $("<input></input>", {
                type: "text",
                id: "searchRightSelectBox",
                name: "searchRightSelectBox",
                placeholder: "Search",
                class: "form-control emdduallist-searchBox"
            });

            if (settings.searchBoxLocation === "bottom") {
                rightDiv.append(rightSearchBox);
            } else {
                rightSearchBox.insertBefore("#rightSelect");
            }
        }

        function HookUpEvents() {
            //events hookup
            var leftSelect = $("#leftSelect");
            var rightSelect = $("#rightSelect");

            //move right
            var moveRightBtn = $("#moveRightBtn");
            moveRightBtn.on("click", function () {
                var source = leftSelect;
                var target = rightSelect;
                var itemsToMove = $(leftSelect).find(":selected");

                MoveItemsTo(source, target, itemsToMove);

                return false;
            });

            //move all to right
            var moveAllToRightBtn = $("#moveAllToRightBtn");
            moveAllToRightBtn.on("click", function () {

                var source = leftSelect;
                var target = rightSelect;
                var itemsToMove = $(leftSelect).find("option");

                MoveItemsTo(source, target, itemsToMove);
            });

            //move left
            var moveLeftBtn = $("#moveLeftBtn");
            moveLeftBtn.on("click", function () {
                var source = rightSelect;
                var target = leftSelect;
                var itemsToMove = $(rightSelect).find(":selected");

                MoveItemsTo(source, target, itemsToMove);

                return false;
            });

            //move all to left
            var moveAllToLeftBtn = $("#moveAllToLeftBtn");
            moveAllToLeftBtn.on("click", function () {
                var source = rightSelect;
                var target = leftSelect;
                var itemsToMove = $(rightSelect).find("option");

                MoveItemsTo(source, target, itemsToMove);

                return false;
            });
        }


        function MoveItemsTo(source, target, items) {
            items.each(function () {
                $(source).find("option[value='" + $(this).val() + "']").remove();
                $(target).append(this);

                SortItems(source);
                SortItems(target);
            });
        };

        //sort
        function SortItems(target) {
            var optionList = target.find("option");

            optionList.sort(function (a, b) {
                return $(a).text() > $(b).text() ? 1 : -1;
            });

            target.find("option").remove();
            target.append(optionList);
        }

        //search
        var searchLeft = $("#searchLeftSelectBox");
        searchLeft.on("input", function () {
            var target = $("#leftSelect");
            var filter = $(this).val();

            Search(target, filter);
        });

        var searchRight = $("#searchRightSelectBox");
        searchRight.on("input", function () {
            var target = $("#rightSelect");
            var filter = $(this).val();

            Search(target, filter);
        });

        function Search(target, filter) {
            var options = target.find("option");
            var browserName = navigator.browserSpecs.name.toLowerCase();
            filter = filter.toLowerCase();
            options.each(function () {
                if (this.text.toLowerCase().indexOf(filter) >= 0) {
                    if (browserName === "ie") {
                        if ($(this).parent().is("span")) {
                            var span = $(this).parent();
                            var opt = this;
                            $(span).replaceWith(opt);
                        }
                    } else {
                        $(this).show();
                    }
                } else {
                    if (browserName === "ie") {
                        if (!$(this).parent().is("span")) {
                            $(this).wrap("<span>").hide();
                        }
                    } else {
                        $(this).hide();
                    }
                }
            });
        }

        //render values
        function RenderSelectValues(target, source) {            
            if (source != "") {
                var values
                try{
                    values = JSON.parse(source);
                }catch(e){

                }
               
                if (typeof values === "object") {                    
                    RenderValues(target,values)
                } else {                    
                    $.getJSON(source, function (data) {                        
                        RenderValues(target,data)
                    });
                }
            }
        }

        function RenderValues(target,values) {
            $(target).find("option").remove();
            $.each(values, function (key, val) {
                $(target).append("<option value'"+ key +"'>"+ val +"</option>");
            });
        }

        function RenderLabels() {
            if (settings.leftLabel) {
                var leftSelectLabel = $("<span></span>", {
                    id: "leftSelectLabel",
                    name: "leftSelectLabel",
                    text: settings.leftLabel,
                    class: "emdduallist-leftSelectLabel"
                });

                if (settings.searchBoxLocation === "bottom") {
                    leftSelectLabel.insertBefore("#leftSelect");
                } else {
                    leftSelectLabel.insertBefore("#searchLeftSelectBox");
                }
            }

            if (settings.rightLabel) {
                var rightSelectLabel = $("<span></span>", {
                    id: "rightSelectLabel",
                    name: "rightSelectLabel",
                    text: settings.rightLabel,
                    class: "emdduallist-rightSelectLabel"
                });

                if (settings.searchBoxLocation === "bottom") {
                    rightSelectLabel.insertBefore("#rightSelect");
                } else {
                    rightSelectLabel.insertBefore("#searchRightSelectBox");
                }
            }
        }

        //get browser
        navigator.browserSpecs = (function() {
            var ua = navigator.userAgent,
                tem,
                M = ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
            if (/trident/i.test(M[1])) {
                tem = /\brv[ :]+(\d+)/g.exec(ua) || [];
                return { name: 'IE', version: (tem[1] || '') };
            }
 
            if (M[1] === 'Chrome') {
                tem = ua.match(/\b(OPR|Edge)\/(\d+)/);
                if (tem != null) return { name: tem[1].replace('OPR', 'Opera'), version: tem[2] };
            }
            M = M[2] ? [M[1], M[2]] : [navigator.appName, navigator.appVersion, '-?'];
            if ((tem = ua.match(/version\/(\d+)/i)) != null)
                M.splice(1, 1, tem[1]);
            return { name: M[0], version: M[1] };
        })();

        return this;
    };
}(jQuery));

