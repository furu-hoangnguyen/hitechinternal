// Loading tab content
var dateTime = {};
var PRE_ORDER_STATUS = '未依頼';
var refreshPageEvery30Min;
var pageFilesData = [];
var LIST_PATH_PAGES = [
    {id: 'selectFunction_chooseSys', path: baseUrl + '/choose-kit-dms'},
    {id: 'selectFunction_notification', path: baseUrl + '/design-management-notification'},
    {id: 'selectFunction_listsitepage', path: baseUrl + '/design-management-site-list'},
    {id: 'selectFunction_order', path: baseUrl + '/design-management-site?siteNum=' + siteNum +'&tab=structureDiagramOrder'}
];
var listOrderProcess = [];
function loadTabContent(tab) {
    lockScreen('Loading...!');
    tab = !tab ? defaultTab : tab; //default tab is base on user type
    markSelectedTab(tab);
    var targetPageId;
    switch (tab) {
        case "structureDiagramOrder": // 構造図 / Structure Diagram
            doLoadTab('get-tab-view/structure-diagram?siteNum=' + siteNum);
            targetPageId = targetPageIdStructureDiagram;
            break;
        case "panelDiagramOrder": // パネル図 / Panel Diagram
            doLoadTab('get-tab-view/panel-diagram?siteNum=' + siteNum);
            targetPageId = targetPageIdPanelDiagram;
            break;
        case "structureCalculationOrder": // 構造計算 / Structure Calculation
            doLoadTab('get-tab-view/structure-calculation?siteNum=' + siteNum);
            targetPageId = targetPageIdStructureCalculation;
            break;
        case "shaftCalculationOrder": // 軸組計算 / Shaft Calculation
            doLoadTab('get-tab-view/shaft-calculation?siteNum=' + siteNum);
            targetPageId = targetPageIdShaftCalculation;
            break;
        case "foundationPlanOrder": // 基礎伏図 / Foundation Plan
            doLoadTab('get-tab-view/foundation-plan?siteNum=' + siteNum);
            targetPageId = targetPageIdFoundationPlan;
            break;
        case "buildingSkinCalculationOrder": // 外皮計算 / Building Skin Calculation
            doLoadTab('get-tab-view/building-skin-calculation?siteNum=' + siteNum);
            targetPageId = targetPageIdBuildingSkinPlan;
            break;
        case "ventilationCalculationOrder": // 換気計算 / Ventilation Calculation
            doLoadTab('get-tab-view/ventilation-calculation?siteNum=' + siteNum);
            targetPageId = targetPageIdVentilationCalculation;
            break;
        case "unitRebar": // ユニット鉄筋 / Unit Rebar
            doLoadTab('get-tab-view/unit-rebar?siteNum=' + siteNum);
            break;
        case "cadStructureDiagramOffer":
            doLoadTab('get-tab-view/cad-structure-diagram?siteNum=' + siteNum);
            targetPageId = targetPageIdCadStructureOffer;
            break;
        case "precutOffer":
            doLoadTab('get-tab-view/precut-offer?siteNum=' + siteNum);
            targetPageId = targetPageIdPrecutOffer;
            break;
        case "ironGoodsOffer":
            doLoadTab('get-tab-view/iron-goods-offer?siteNum=' + siteNum);
            targetPageId = targetPageIdIronGoodsOffer;
            break;
        default:
            doLoadTab('get-tab-view/structure-diagram?siteNum=' + siteNum);
            targetPageId = targetPageIdStructureDiagram;
            break;
    }
    // Unlock table
    if (tab != "unitRebar") {
        releaseLockDesignTable(siteNum, targetPageId, null);
    }
}

function doLoadTab(uri) {
    var promise = new Promise(function (resolve, reject) {
        $('#tab_view_container').load(uri, function (response, status, xhr) {
            if (status != "success") {
                ajaxErrorHandling(xhr, status, response)
                reject();
            }
            setBackgroundTab();
            resolve();
        });
    })
    return promise;
}

function markSelectedTab(tabName) {
    $(".tabMenu").each(function () {
        if ($(this).hasClass('choosemode')) {
            $(this).removeClass('choosemode');
        }
    })
    $('.tabMenu[name="' + tabName + '"]').addClass('choosemode');
}

function errorOccur(err) {
    console.log(err);
}


function closeModal() {
    $(".changeStatus_dalog").hide();
    $(".layoutmodal").hide();
    $(".closeModal").slideUp();
}

function closePopUpOrder() {
    closeModal();
    releaseLockDesignTable(siteNum, targetPageIdStructureDiagram, null);

}

function base64ToArrayBuffer(base64) {
    var binaryString = window.atob(base64);
    var binaryLen = binaryString.length;
    var bytes = new Uint8Array(binaryLen);
    for (var i = 0; i < binaryLen; i++) {
        var ascii = binaryString.charCodeAt(i);
        bytes[i] = ascii;
    }
    return bytes;
}

function formatNumber(n) {
    var minus = '-', numberStr = String(n), hasMinus = (numberStr.charAt(0) === minus);
    var numberFormated = numberStr.replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return (numberFormated && hasMinus) ? minus + numberFormated : numberFormated;
}

function formatCurrency(input, blur) {
    var input_val = input.val();
    if (input_val === "") {
        return;
    }
    var original_len = input_val.length;
    var caret_pos = input.prop("selectionStart");

    if (input_val.indexOf(".") >= 0) {
        var decimal_pos = input_val.indexOf(".");
        var left_side = input_val.substring(0, decimal_pos);
        var right_side = input_val.substring(decimal_pos);
        left_side = formatNumber(left_side);
        right_side = formatNumber(right_side);
        if (blur === "blur") {
            right_side += "00";
        }
        right_side = right_side.substring(0, 2);
        input_val = left_side + "." + right_side;

    } else {
        input_val = formatNumber(input_val);
        input_val = input_val;
        if (blur === "blur") {
            input_val += ".00";
        }
    }
    input.val(input_val);
    var updated_len = input_val.length;
    caret_pos = updated_len - original_len + caret_pos;
    input[0].setSelectionRange(caret_pos, caret_pos);
}

/**
 * Fill date fields: ordered, wish, planned and submit date
 */
function fillDates(data, prefix, type) {
    try {
        type = !type ? 'customer' : type;

        if (type == 'customer') {
            var orderedDate = newDate(data.orderedAt)
            $('#' + prefix + '_ordered_date').val(formatDate(orderedDate) ? formatDate(orderedDate) : '');
        } else {
            var offeredDate = newDate(data.offeredAt);
            $('#' + prefix + '_offered_date').val(formatDate(offeredDate) ? formatDate(offeredDate) : '');
        }

        var wishDate = newDate(data.wishAt);
        var plannedDate = newDate(data.plannedAt);
        var submitDate = newDate(data.submitAt);

        $('#' + prefix + '_wish_date').val(formatDate(wishDate) ? formatDate(wishDate) : '');
        $('#' + prefix + '_planned_date').val(formatDate(plannedDate) ? formatDate(plannedDate) : '');
        $('#' + prefix + '_submit_date').val(formatDate(submitDate) ? formatDate(submitDate) : '');
    } catch (err) {
        errorOccur(err);
    }
}

/**
 * Fill course data | コース選択
 * @param data
 * @param parentId
 */
function fillCourse(data) {
    try {
        if (typeof data !== 'undefined' && typeof data.courseCd !== 'undefined') {
            var courseCd = parseInt(data.courseCd) || 0;
            $('#course_cd_' + courseCd).prop("checked", true);
        }
    } catch (err) {
        errorOccur(err);
    }
}

/**
 * Fill data for Status area
 * @param data
 */
function fillStatus(data, prefix) {
    try {
        $('#' + prefix + '_order_status').val(data.status ? data.status.statusName : '');
        $('#' + prefix + '_assign_user').val(data.assignedUser ? data.assignedUser.name : '');
    } catch (err) {
        errorOccur(err);
    }
}

/**
 * Fill data for Costs area
 * @param data
 */
function fillCosts(data, prefix) {
    try {
        $('#' + prefix + '_order_count').val(data.orderCount);
        if (typeof data.costsDto !== 'undefined' && data.costsDto !== null) {
            $('#' + prefix + '_costs_base').val(formatNumber(data.costsDto.baseCost || 0));
            $('#' + prefix + '_costs_base').attr('data', data.costsDto.baseCost || 0);
            $('#' + prefix + '_costs_fix').val(formatNumber(data.costsDto.fixedCost || 0));
            $('#' + prefix + '_costs_fix').attr('data', data.costsDto.fixedCost || 0);
            $('#' + prefix + '_costs_total').val(formatNumber(data.costsDto.totalCost || 0));
            $('#' + prefix + '_costs_total').attr('data', data.costsDto.totalCost || 0);
        }
    } catch (err) {
        errorOccur(err);
    }
}

/**
 * Generate table data of cost history to show in the popup
 * @param data
 */
function fillCostsHistory(data, historyTableElement) {
    try {
        var historyTableEle = document.getElementById(historyTableElement);
        if (typeof data.costsDto !== 'undefined' && data.costsDto !== null) {
            var histories = data.costsDto.history;
            if (histories) {
                histories.forEach(function (object) {
                    var tr = document.createElement('tr');
                    tr.innerHTML = '<td>' + object.typeName + '</td>' +
                        '<td style="text-align: right">' + formatNumber(object.value.toString()) + '  <span>円</span></td>';
                    historyTableEle.appendChild(tr);
                    console.log(typeof object.value)
                });
            }
        }
    } catch (err) {
        errorOccur(err);
    }
}

/**
 * Show the costs history popup base on tab page (prefix)
 * @param prefix
 */
function showCostsHistory(prefix) {
    try {
        $(".layoutmodal").slideDown();
        $('#' + prefix + '_costs_history_div').slideDown();
    } catch (err) {
        errorOccur(err);
    }
}

/**
 * Re-calculate the total amount when adjusting the fixed cost
 */
function reCalculateTotalAmount(prefix) {
    try {
        var fixCostStr = formatNumber($('#' + prefix + '_costs_fix').val());
        $('#' + prefix + '_costs_fix').val(fixCostStr);

        var fixCost = parseInt(fixCostStr.replace(/,/g, '')) || 0;
        var baseCost = parseInt($('#' + prefix + '_costs_base').attr('data')) || 0;
        var total = baseCost + fixCost;

        $('#' + prefix + '_costs_fix').attr('data', fixCost);
        $('#' + prefix + '_costs_total').attr('data', total);
        $('#' + prefix + '_costs_total').val(formatNumber(total));
    } catch (err) {
        errorOccur(err);
    }
}

function reCalculateReviewFee(scopeId, targetId) {
    try {
        var reviewFee = 0;
        $('#' + scopeId + ' input[type=checkbox]').each(function () {
            if ($(this).is(':checked')) {
                reviewFee += parseInt($(this).attr("data"));
            }
        });
        var reviewFeeFormatCurrency = formatNumber(reviewFee) + ' 円';
        $('#' + targetId).text(reviewFeeFormatCurrency);
    } catch (err) {
        errorOccur(err);
    }
}

function setCostsViewMode(prefix) {
    try {
        $('#' + prefix + '_adjust_cost').css({"visibility": "hidden"});
        $('#' + prefix + '_costs_fix').prop("disabled", true);
    } catch (err) {
        errorOccur(err);
    }
}

function setCostsEditMode(prefix) {
    try {
        $('#' + prefix + '_adjust_cost').css({"visibility": "visible"});
        //$('#' + prefix + '_costs_fix').prop("disabled", false);
    } catch (err) {
        errorOccur(err);
    }
}

function setDatesViewMode(scopeId) {
    try {
        $('#' + scopeId + ' input[type=text]').prop("disabled", true);
    } catch (err) {
        errorOccur(err);
    }
}

function setDatesEditMode(scopeId) {
    try {
        // Wish and Plan only
        if (isIbiken) {
            $('#' + scopeId + ' .dateAbleEditIbiken').prop("disabled", false);
        } else {
            $('#' + scopeId + ' .dateAbleEdit').prop("disabled", false);
        }
    } catch (err) {
        errorOccur(err);
    }
}

function setCourseViewMode(scopeId) {
    try {
        $('#' + scopeId + ' input[type=checkbox]').prop("disabled", true);
    } catch (err) {
        errorOccur(err);
    }
}

function setCourseEditMode(scopeId) {
    try {
        $('#' + scopeId + ' .course-section-dialog input[type=checkbox]').prop("disabled", false);
        $('#' + scopeId + ' #course-section-structure-calculation-table input[type=checkbox]').prop("disabled", false);
        $('#' + scopeId + ' #course-section-shaft-calculation-table input[type=checkbox]').prop("disabled", false);
        $('#' + scopeId + ' #course-section-foundation-plan-table input[type=checkbox]').prop("disabled", false);
        $('#' + scopeId + ' #course-section-building-skin-calculation-table input[type=checkbox]').prop("disabled", false);
        $('#' + scopeId + ' #course-section-ventilation-calculation-table input[type=checkbox]').prop("disabled", false);
           } catch (err) {
        errorOccur(err);
    }
}

function setCostsData2DtoObj(dtoObj, prefix) {
    try {
        if (isIbiken) {
            dtoObj.costsDto.fixedCost = parseInt($('#' + prefix + '_costs_fix').attr('data') || 0);
            dtoObj.costsDto.totalCost = parseInt($('#' + prefix + '_costs_total').attr('data') || 0);
        }
    } catch (err) {
        errorOccur(err);
    }

}

function setCourseData2DtoObj(dtoObj, prefix) {
    try {
        var courseCd = $('#' + prefix + ' input:checkbox:checked:visible:first').val();
        if (courseCd == 'undefined' || courseCd == null) {
            courseCd = 0;
        }
        dtoObj.courseCd = parseInt(courseCd);
    } catch (err) {
        errorOccur(err);
    }
}

function setDatesData2DtoObj(dtoObj, prefix) {
    try {
        var wishDateStr = prefix + '_wish_date';
        dtoObj.wishAt = dateTime[wishDateStr];

        if (isIbiken) {
            var planDateStr = prefix + '_planned_date';
            dtoObj.plannedAt = dateTime[planDateStr];
        }
    } catch (err) {
        errorOccur(err);
    }
}

function validateDate(ele) {
    var d = ele.value;
    console.log(isValidDate(d));
    if (d != "") {
        if (!isValidDate(d)) {
            openConfirmDialog('characters-error-dialog')
                .then(function () {
                    $("#field-error-layout").slideDown();
                })
            $("#error_date_except").click(function () {
                closeConfirmDialog('characters-error-dialog')
                    .then(function (value) {
                        $("#field-error-layout").slideUp();
                        $(ele).focus();
                        $("#error_date_except").unbind("click");
                    })
            })
        } else {
            (ele.val) ? ele.val(moment(d).format("YYYY/MM/DD")) : $(ele).val(moment(d).format("YYYY/MM/DD"));
        }
    }
}

function validateNumberField(ele, max, min) {
    var val = ele.value;
    if (val == "") { return; }

    var n = parseInt(val);

    // Error
    if (isNaN(n) || n != ele.value || n > max || n < min) {
        openConfirmDialog('invalid-input-error-dialog');
        $("#invalid-input-error_accept").click(function () {
            closeConfirmDialog('invalid-input-error-dialog');
            $(ele).focus();
        })
        $(ele).focus();
    }
}

function openConfirmDialog(prefixModal) {
    var promise = new Promise(function (resolve, reject) {
        $(".layoutmodal").slideDown();
        $('#' + prefixModal).slideDown();
        resolve();
    });
    return promise;
}

function closeConfirmDialog(prefixModal) {
    var promise = new Promise(function (resolve, reject) {
        $(".layoutmodal").slideUp();
        $('#' + prefixModal).slideUp();
        resolve();
    });
    return promise;
}

function isValidDate(d) {
    if (!d) {
        return false;
    }
    var newDate = "";
    if(d.toString().indexOf("/") !== -1){
        var date = d.split("/");
        date.forEach(function (elm) {
            if(elm.length <2){
                newDate += "0" + elm + "-";
            }else {
                newDate += elm + "-"
            }
        })
        return moment(newDate.substring(0, newDate.length-1), 'YYYY-MM-DD', true).isValid() || moment(newDate.substring(0, newDate.length-1), 'YYYY-MM-DD', true).isValid();
    }else {
        return moment(d, 'YYYY-MM-DD', true).isValid() || moment(d, 'YYYY-MM-DD', true).isValid();
    }

}

function formatDate(d) {
    if (isValidDate(d)) {
        return moment(d).format('YYYY/MM/DD')
    } else {
        return "";
    }
}

function newDate(d) {
    if (d) {
        var a = d.split(/[^0-9]/);
        var newDate =new Date(a[0],a[1]-1,a[2],a[3],a[4],a[5]);
        return newDate;
    }
    return null;
}

function controlDisplayOtherField(targetEleId, isDisplay) {
    if (isDisplay == 1) {
        $('#' + targetEleId).prop('disabled', false);
        $('#' + targetEleId).focus();
    } else {
        $('#' + targetEleId).prop('disabled', true);
    }
}

/*********************************************************************************************************************/
/********************************************* File Upload Processing ************************************************/

/*********************************************************************************************************************/

function checkAndUploadFiles(siteNumber, targetOrder, callback) {
    if (isNeedToUploadFiles()) {
        var formData = buildFilesRequestBody(siteNumber, targetOrder);
        $.ajax({
            url: "api/files-upload",
            data: formData,
            cache: false,
            contentType: false,
            processData: false,
            method: 'POST',
            type: 'POST',
            success: function (data) {
                setUploadFileResult(JSON.parse(data));
                callback();
            },
            error: function (jqXHR, textStatus, errorThrown) {
                ajaxErrorHandling(jqXHR, textStatus, errorThrown);
            }
        });
    } else {
        callback();
    }
}


function isNeedToUploadFiles() {
    return pageFilesData.some(function (fileData) {
        return isHaveBinaryFile(fileData);
    });
}

function isHaveBinaryFile(fileData) {
    return fileData.files.some(function (file) {
        return !!file.binaryFile;
    });
}

function buildFilesRequestBody(siteNumber, targetOrder) {
    var formData = new FormData();
    formData.append("siteNumber", siteNumber);
    formData.append("targetOrder", targetOrder);

    $.each(pageFilesData, function (index, fileData) {
        $.each(fileData.files, function (indexFile, file) {
            if (file.binaryFile) {
                formData.append("uploadingFiles", file.binaryFile);
            }
        });
    });
    return formData;
}

function setUploadFileResult(uploadFilesResultAsJson) {
    $.each(pageFilesData, function (index, fileData) {
        $.each(fileData.files, function (indexFile, file) {
            var matchedFile = uploadFilesResultAsJson.filter(function (item) {
                return item.fileSize == file.fileSize && !!file.binaryFile;
            })[0];
            if (matchedFile) {
                file.awsS3FileName = matchedFile.awsS3FileName;
            }
        });
    });
}

function removeFile(databaseFieldName, fileIndex, isNeedToConfirm) {
    var matchedFile = pageFilesData.filter(function (fileData) {
        return fileData.databaseFieldName === databaseFieldName;
    })[0];
    if (matchedFile) {
        var fileOriginalName = matchedFile.files[fileIndex].fileOriginalName;
        if (isNeedToConfirm) {
            $(".layoutmodal").slideDown();
            $("#confirmDialogDeleteFile").slideDown();
            $('#deleting-file-name').html(fileOriginalName);

            $('#fileConfirmDialogOK').unbind("click").bind("click", function () {
                removeFileFromPageFiles(databaseFieldName, matchedFile, fileIndex);
                $(".layoutmodal").slideUp();
                $("#confirmDialogDeleteFile").slideUp();
            });
        } else {
            removeFileFromPageFiles(databaseFieldName, matchedFile, fileIndex);
        }
    }
}

function removeFileFromPageFiles(databaseFieldName, matchedFile, fileIndex) {
    var itemIndex = pageFilesData.indexOf(matchedFile);

    if (matchedFile.isSingleFile) {
        matchedFile.files = [];
    } else {
        matchedFile.files.splice(fileIndex, 1);
    }
    pageFilesData[itemIndex] = matchedFile;

    if (matchedFile.isSingleFile) {
        displaySingleFile(matchedFile.files[0], databaseFieldName, true);
    } else {
        displayMultiFile(matchedFile.files, databaseFieldName, true);
    }
}

function setFilesDataToDtoObject(dtoObject) {
    $.each(pageFilesData, function (index, fileData) {
        if (fileData.isSingleFile) {
            if (dtoObject[fileData.databaseFieldName] && dtoObject[fileData.databaseFieldName].awsS3FileName) {
                if (fileData.files.length > 0 && fileData.files[0].awsS3FileName) {
                    if (dtoObject[fileData.databaseFieldName].awsS3FileName != fileData.files[0].awsS3FileName) {
                        dtoObject[fileData.databaseFieldName] = fileData.files[0];
                    }
                } else {
                    dtoObject[fileData.databaseFieldName] = {};
                }
            } else {
                dtoObject[fileData.databaseFieldName] = fileData.files.length > 0 ? fileData.files[0] : {};
            }
        } else {
            dtoObject[fileData.databaseFieldName] = fileData.files;
        }
    });
}

function buildSingleFileData(fileModel, dbFieldName) {
    var file = !!fileModel ? fileModel : {};
    var singleFile = {
        isSingleFile: true,
        databaseFieldName: dbFieldName,
        files: [file]
    }
    pageFilesData.push(singleFile);
}

function buildMultiFileData(fileModels, dbFieldName) {
    var files = !!fileModels ? fileModels : [];
    var multiFile = {
        isSingleFile: false,
        databaseFieldName: dbFieldName,
        files: files
    }
    pageFilesData.push(multiFile);
}

function displaySingleFile(fileModel, dbFieldName, isEditMode) {
    if (fileModel && fileModel.fileOriginalName) {
        $("#filenames_" + dbFieldName).html(fileModel.fileOriginalName);
        $("#filenames_" + dbFieldName).attr("aws-s3-file-name", fileModel.awsS3FileName);
    } else {
        $("#filenames_" + dbFieldName).empty();
        $("#filenames_" + dbFieldName).attr("aws-s3-file-name", "");
    }
    if (!isEditMode || !fileModel || !fileModel.fileOriginalName) {
        $("#upfileicon_" + dbFieldName).hide();
    } else {
        $("#upfileicon_" + dbFieldName).show();
    }
}

function displayMultiFile(fileModels, dbFieldName, isEditMode) {
    var isNeedToConfirm = dbFieldName !== 'acknowledgmentFilePathDto';
    var isLogDownloadHistory = !isIbiken && (dbFieldName == 'deliverablesFilePathDto');
    $('#filenames_' + dbFieldName).empty();
    if (fileModels) {
        $.each(fileModels, function (key, fileItem) {
            $('#filenames_' + dbFieldName).append('<div><span onclick="onFileLabelClicked(\'' + fileItem.fileOriginalName + '\',\'' + fileItem.awsS3FileName + '\', ' + isEditMode + ', ' + isLogDownloadHistory + ' )" id="file-index-' + key + '" style="cursor: pointer;">' + fileItem.fileOriginalName + '</span> <i class="fa fa-times remove-file-icon" style="top: 0.1vw;padding-left: 5px;" onclick="removeFile(\'' + dbFieldName + '\', ' + key + ', ' + isNeedToConfirm + ')"></i></div>');
        });
    }
}

function setFileFromInput(files, dbFieldName) {
    if (isOverFileSizeLimit(files)) {
        showFileSizeLimitError();
    } else {
        var matchedFile = pageFilesData.filter(function (fileData) {
            return fileData.databaseFieldName === dbFieldName;
        })[0];
        if (matchedFile) {
            if ((matchedFile.files.length + files.length) > 20) {
                w2alert('アップロードファイルの最大数は20ファイルです。', 'エラー');
            } else {
                var index = pageFilesData.indexOf(matchedFile);
                if (matchedFile.isSingleFile) {
                    matchedFile.files[0] = {
                        fileOriginalName: files[0].name,
                        fileSize: files[0].size,
                        binaryFile: files[0]
                    };
                    displaySingleFile(matchedFile.files[0], dbFieldName, true);
                } else {
                    $.each(files, function (index, file) {
                        var newFile = {
                            fileOriginalName: file.name,
                            fileSize: file.size,
                            binaryFile: file
                        }
                        matchedFile.files.push(newFile);
                    });
                    displayMultiFile(matchedFile.files, dbFieldName, true);
                }

                pageFilesData[index] = matchedFile;
            }
        }
    }
}

function isOverFileSizeLimit(newFiles) {
    var fileSize = 0;
    $.each(pageFilesData, function (index, fileData) {
        $.each(fileData.files, function (indexInfo, file) {
            if (file.binaryFile) {
                fileSize += file.fileSize;
            }
        });
    });

    if (newFiles) {
        $.each(newFiles, function (indexInput, newFile) {
            fileSize += newFile.size;
        });
    }
    return fileSize > 100 * 1024 * 1024; //100MB
}

function previewFile(fileName, pdfTargetId) {
    $(".hisorydialog12").addClass("hisorydialog12_pdf_preview");
    $(".no-preview").hide();
    $("#file-preview").show();
    lockScreen("Loading...!");
    $.ajax({
        url: "api/file-preview", data: {"fileName": fileName}, method: 'GET', type: 'GET',
        success: function (data) {
            var arrrayBuffer = base64ToArrayBuffer(data);
            var blob = new Blob([arrrayBuffer], {type: "application/pdf"});
            var link = window.URL.createObjectURL(blob);
            $("#" + pdfTargetId).attr("src", "resources/core/pdf/web/viewer.html?file=" + encodeURIComponent(link));
            $(".layoutmodal_history").slideDown();
            $(".hisorydialog12").slideDown();
            unlockScreen();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            closeModal();
            ajaxErrorHandling(jqXHR, textStatus, errorThrown);
        }
    });
}

function downloadFile() {
    var downloadIcon = document.getElementById("file-download-icon");
    var s3fileName = downloadIcon.getAttribute("aws-file-name");
    var downloadFileName = downloadIcon.getAttribute("aws-file-original-name");
    window.location.href = encodeURI("api/file-download?s3fileName=" + s3fileName + "&downloadFileName=" + downloadFileName);
}

function onFileLabelClicked(originalFileName, fileName, isEditMode, isLogDownloadHistory) {
    if (!isEditMode && fileName) {
        if (fileName.toLocaleLowerCase().indexOf('.pdf') > 0) {
            previewFile(fileName, 'file-preview');
        } else {
            $(".hisorydialog12").removeClass("hisorydialog12_pdf_preview");
            $(".no-preview").show();
            $("#file-preview").hide();
            $("#file-download-icon").attr('aws-file-name', fileName);
            $("#file-download-icon").attr('aws-file-original-name', originalFileName);
            $("#no-preview-ext").text(fileName.substr(fileName.lastIndexOf('.') + 1));
            // $(".layoutmodal").slideDown().addClass("history_layoutmodal");
            $(".layoutmodal_history").slideDown();
            $(".hisorydialog12").slideDown();
        }
        if (isLogDownloadHistory) {
            logDownloadFileInfo(fileName, originalFileName);
        }
    }
}

function logDownloadFileInfo(awsS3FileName, originalFileName) {
    var dataInfo = {
        "siteNum": siteNum,
        "awsS3FileName": awsS3FileName,
        "fileOriginalName": originalFileName
    };
    var currentTab = $(".choosemode").attr("name");
    $.ajax({
        url: "api/" + currentTab + "/log-download-file-history", data: dataInfo, method: 'GET', type: 'GET',
        success: function () {
           console.log("created file download history");
        },
        error: function (jqXHR, textStatus, errorThrown) {
            closeModal();
            ajaxErrorHandling(jqXHR, textStatus, errorThrown);
        }
    });
}

function listStatusHistory(status) {
    var url = baseUrl + "/list-status?targetPageId=" + status.targetPage + "&branchId=" + status.statusBranch + "&statusCd=" + status.statusCd;
    var promise = new Promise(function (resolve, reject) {
        $.ajax({
            type: "GET",
            contentType: "application/json",
            url: url,
            dataType: 'json',
            cache: false,
            timeout: 600000,
            async: true,
            success: function (data) {
                resolve(data);
            },
            error: function (jqXHR, textStatus, errorThrown) {
                closeModal();
                ajaxErrorHandling(jqXHR, textStatus, errorThrown);
                reject(errorThrown);
            }
        });
    })
    return promise;
}

function logout() {
    var tab = $(".choosemode").attr("name");
    var targetPageId;
    switch (tab) {
        case "structureDiagramOrder": // 構造図 / Structure Diagram
            targetPageId = targetPageIdStructureDiagram;
            break;
        case "panelDiagramOrder": // パネル図 / Panel Diagram
            targetPageId = targetPageIdPanelDiagram;
            break;
        case "structureCalculationOrder": // 構造計算 / Structure Calculation
            targetPageId = targetPageIdStructureCalculation;
            break;
        case "shaftCalculationOrder": // 軸組計算 / Shaft Calculation
            targetPageId = targetPageIdShaftCalculation;
            break;
        case "foundationPlanOrder": // 基礎伏図 / Foundation Plan
            targetPageId = targetPageIdFoundationPlan;
            break;
        case "buildingSkinCalculationOrder": // 外皮計算 / Building Skin Calculation
            targetPageId = targetPageIdBuildingSkinPlan;
            break;
        case "ventilationCalculationOrder": // 換気計算 / Ventilation Calculation
            targetPageId = targetPageIdVentilationCalculation;
            break;
        case "unitRebar": // ユニット鉄筋 / Unit Rebar
            break;
        case "cadStructureDiagramOffer":
            targetPageId = targetPageIdCadStructureOffer;
            break;
        case "precutOffer":
            targetPageId = targetPageIdPrecutOffer;
            break;
        case "ironGoodsOffer":
            targetPageId = targetPageIdIronGoodsOffer;
            break;
        default:
            targetPageId = targetPageIdStructureDiagram;
            break;
    }
    releaseLockDesignTable(siteNum, targetPageId, function () {
        sessionStorage.clear();
        lockScreen('処理中です。');
        var form = document.createElement('form');
        form.setAttribute('action', 'logout');
        form.setAttribute('method', 'post');
        form.style.display = 'none';
        document.body.appendChild(form);
        form.submit();
    });

}

function lockScreen(msg) {
    w2utils.lock($("#layout"), msg, true);
}

function unlockScreen() {
    w2utils.unlock($("#layout"));
}

function isUserIBiken(usertype) {
    return usertype === '0000P01';
}

//Private Memo

function showCommentSizeLimitError(label) {
    w2alert('{' + label + '}の入力文字数が上限を超えています。\n' + '一度に入力できる文字数は７００文字です。文字数を減らし再度お試しください。', 'エラー');
}

function showMemoSizeLimitError(label) {
    w2alert('{' + label + '}の入力文字数が上限を超えています。\n' + '一度に入力できる文字数は７００文字です。文字数を減らし再度お試しください。', 'エラー');
}

function showInputError(label) {
    console.log(label);
    w2alert(label, 'エラー');
}

function fillPrivateMemo(data, prefix) {
    try {
        if (data.privateMemoDtos) {
            $('#' + prefix + ' #content_memo').val(data.privateMemoDtos[0] ? data.privateMemoDtos[0].mesg : '');
            $('#' + prefix + ' #lists_memo').val(getSDText(data.privateMemoDtos));
        }
    } catch (err) {
        errorOccur(err);
    }
}

function editPrivateMemo(prefix) {
    $('#' + prefix + ' #content_memo').prop("disabled", false);
    $('#' + prefix + ' #content_memo').show();
    $('#' + prefix + ' #lists_memo').css({"background": "#EAEAEA"});
}

function viewPrivateMemo(prefix) {
    $('#' + prefix + ' #content_memo').hide();
    $('#' + prefix + ' #lists_memo').css({"background": "white"});
}

function viewDeliverableFiles(prefix, isEditMode, option) {
    var controlBtn = $('#' + prefix + ' #btnupload_deliverablesFilePathDto');
    var controlIcon = $('#' + prefix + ' #btn_upload_deliverablesFilePathDto');
    var controlFile = $('#filenames_deliverablesFilePathDto');
    if (isEditMode) {
        controlBtn.show();
        controlIcon.show();
        if (option && option.editHeight) {
            controlFile.css({'height': option.editHeight});
        }
    } else {
        controlBtn.hide();
        controlIcon.hide();
        if (option && option.viewHeight) {
            controlFile.css({'height': option.viewHeight});
        }
    }
}

function setdataPrivateMemo2Dto(dtoObj, prefix) {
    try {
        var private_memo = {};
        private_memo["mesg"] = $('#' + prefix + ' #content_memo').val();
        dtoObj.privateMemoDto = private_memo;
    } catch (err) {
        errorOccur(err);
    }
}

// common Remarks
function mbStrWidthRemarks(input) {
    var maxLenght = 1400;
    var len = 0;
    for (var i = 0; i < input.length; i++) {
        var code = input.charCodeAt(i);
        if ((code >= 0x0020 && code <= 0x1FFF) || (code >= 0xFF61 && code <= 0xFF9F)) {
            len += 1;
        } else if ((code >= 0x2000 && code <= 0xFF60) || (code >= 0xFFA0)) {
            len += 2;
        } else {
            len += 0;
        }
    }
    if (len > maxLenght) {
        return true;
    }
    return false;

}

function trimFileName(fileName) {
    if (fileName.length > 25) {
        var len = 0;
        var numChar = 0;
        for (var i = 0; i < fileName.length; i++) {
            if (len <= 50) {
                var code = fileName.charCodeAt(i);
                if ((code >= 0x0020 && code <= 0x1FFF) || (code >= 0xFF61 && code <= 0xFF9F)) {
                    len += 1;
                } else if ((code >= 0x2000 && code <= 0xFF60) || (code >= 0xFFA0)) {
                    len += 2;
                } else {
                    len += 2;
                }
                numChar += 1;
            } else {
                break;
            }
        }
        return len > 50 ?  fileName.substring(0, numChar) + '...' : fileName;
    }
    return fileName;
}

function fillComments(data, prefix) {
    try {
        if (data.commentDtos) {
            $('#' + prefix + ' #content').val(data.commentDtos[0] ? data.commentDtos[0].mesg : '');
            $('#' + prefix + ' #list_comments').val(getSDText(data.commentDtos));
        }
    } catch (err) {
        errorOccur(err);
    }
}

function editComment(prefix) {
    $('#' + prefix + ' #content').prop("disabled", false);
    $('#' + prefix + ' #content').show();
    $('#' + prefix + ' #list_comments').css({"background": "#EAEAEA"});
}

function viewComment(prefix) {
    $('#' + prefix + ' #content').hide();
    $('#' + prefix + ' #list_comments').css({"background": "white"});
}

function hideComment(prefix) {
    $('#' + prefix + ' #content').hide();
}

function updateHeightComment(listCmtHeight) {
    $("#list_comments").css({'height': listCmtHeight});
}

function updateHeightMemoList(memoListHeight) {
    $("#lists_memo").css({'height': memoListHeight});
}

function getSDText(results) {
    var result = '';
    for (var i = 0; i < results.length; i++) {
        if (results[i].mesg == '') {
            continue;
        }
        result += results[i].at +  '\t' +  results[i].author.user_name + changeComment(results[i]) + '\n';
    }
    return result;
}

function changeComment(data) {
    var result = '';
    var results = data.mesg.split("\n")
    for (var i = 0; i < results.length; i++) {
        result += '\n' + '\t' + results[i];
    }
    return result
}

function setdata2Dto(dtoObj, prefix) {
    try {
        var comment = {};
        comment["mesg"] = $('#' + prefix + ' #content').val();
        dtoObj.commentDto = comment;
    } catch (err) {
        errorOccur(err);
    }
}

function switchBreadcrumb(breadcrumbId) {
    var tab = $(".choosemode").attr("name");
    var targetPageId;
    switch (tab) {
        case "structureDiagramOrder": // 構造図 / Structure Diagram
            targetPageId = targetPageIdStructureDiagram;
            break;
        case "panelDiagramOrder": // パネル図 / Panel Diagram
            targetPageId = targetPageIdPanelDiagram;
            break;
        case "structureCalculationOrder": // 構造計算 / Structure Calculation
            targetPageId = targetPageIdStructureCalculation;
            break;
        case "shaftCalculationOrder": // 軸組計算 / Shaft Calculation
            targetPageId = targetPageIdShaftCalculation;
            break;
        case "foundationPlanOrder": // 基礎伏図 / Foundation Plan
            targetPageId = targetPageIdFoundationPlan;
            break;
        case "buildingSkinCalculationOrder": // 外皮計算 / Building Skin Calculation
            targetPageId = targetPageIdBuildingSkinPlan;
            break;
        case "ventilationCalculationOrder": // 換気計算 / Ventilation Calculation
            targetPageId = targetPageIdVentilationCalculation;
            break;
        case "unitRebar": // ユニット鉄筋 / Unit Rebar
            break;
        case "cadStructureDiagramOffer":
            targetPageId = targetPageIdCadStructureOffer;
            break;
        case "precutOffer":
            targetPageId = targetPageIdPrecutOffer;
            break;
        case "ironGoodsOffer":
            targetPageId = targetPageIdIronGoodsOffer;
            break;
        default:
            targetPageId = targetPageIdStructureDiagram;
            break;
    }
    var url = window.location.origin;
    switch (breadcrumbId) {
        case LIST_PATH_PAGES[0].id:
            url += LIST_PATH_PAGES[0].path;
            releaseLockDesignTable(siteNum, targetPageId, null);
            break;
        case LIST_PATH_PAGES[1].id:
            url += LIST_PATH_PAGES[1].path;
            releaseLockDesignTable(siteNum, targetPageId, null);
            break;
        case LIST_PATH_PAGES[2].id:
            url += LIST_PATH_PAGES[2].path;
            releaseLockDesignTable(siteNum, targetPageId, null);
            break;
        case LIST_PATH_PAGES[3].id:
            url += LIST_PATH_PAGES[3].path;
            break;
        default:
            break;
    }
    window.location.replace(url);
}

function previousPageOnBreadcrumb() {
    var pathname = window.location.pathname;
    var previousPage = getPreviousPageByCurrentPath(pathname, LIST_PATH_PAGES);
    switchBreadcrumb(previousPage.id);
}

function getPreviousPageByCurrentPath(currentPath, listPath) {
    var previousPage = null;
    for (var i = 0; i < listPath.length; i++) {
        if (listPath[i].path.indexOf(currentPath) >= 0) {
            previousPage = (i === 0) ? listPath[i] : listPath[i - 1];
        }
    }
    return previousPage;
}

function showFileSizeLimitError() {
    w2alert('一度にアップロードできる容量は100MBが上限となります。\n' + 'ファイル数を減らすか、ファイルのサイズを小さくして再度お試し下さい。', 'エラー');
}

function changeStatus(typeDiagram, siteNum) {
    var statusKey = $('#ddlStatus').val();
    var data = {};
    data.siteNum = siteNum;
    data.statusKey = statusKey;
    var promise = new Promise(function (resolve, reject) {
        $.ajax({
            type: "POST",
            contentType: "application/json",
            url: typeDiagram + "/change-status",
            data: JSON.stringify(data),
            dataType: 'json',
            cache: false,
            async: true,
            timeout: 600000,
            success: function (d) {
                resolve(d);
            },
            statusCode: {
                304: function () {
                    closeModal();
                    alert("Can not change status!");
                    unlockScreen();
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                closeModal();
                ajaxErrorHandling(jqXHR, textStatus, errorThrown);
                reject(errorThrown);
            }
        });
    })

    return promise;
}

function orderMultiTab(listTab, siteNum) {
    if (siteNum && Array.isArray(listTab) && listTab.length) {
        var data = {};
        data.siteNum = siteNum;
        data.listTab = listTab;
        var promise = new Promise(function (resolve, reject) {
            $.ajax({
                type: "POST",
                contentType: "application/json",
                url: "order-multi-tab",
                data: JSON.stringify(data),
                dataType: 'json',
                cache: false,
                async: true,
                timeout: 600000,
                success: function (d) {
                    resolve(d);
                },
                statusCode: {
                    304: function () {
                        closeModal();
                        alert("Can not order!");
                        unlockScreen();
                    }
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    closeModal();
                    ajaxErrorHandling(jqXHR, textStatus, errorThrown);
                    reject(errorThrown);
                }
            });
        })

        return promise;

    } else {
        return new Promise(function (resolve) {
            showPopupError("物件番号及びタブ一覧は必須です。");
            resolve();
        });
    }

}

function checkScheduleValid(siteNum) {
    var tab = $(".choosemode").attr("name");
    $.ajax({
        type: "GET",
        contentType: "application/json",
        url: "dat-site/get-site-schedule?siteNum=" + siteNum + "&tab=" + tab,
        dataType: 'json',
        cache: false,
        async: false,
        timeout: 600000,
        success: function (d) {
            unlockScreen();
            if (d.valid == true) {
                pageFilesData = [];
                $("#filenames_acknowledgmentFilePathDto").empty();
                $("#filenames_mapFilePathDto").empty();

                $('#bedsil_laying_date').val(moment(d.bedsilLayingDate).format('YYYY/MM/DD'));
                $('#bedsil_laying_changed_date').val(moment(d.frameRaisingDate).format('YYYY/MM/DD'));
                if (tab == "panelDiagramOrder") {
                    $('.infoPopupInfoStructure').css("visibility", "hidden");
                    $(".saveDialogTitle").text("パネル図の承認");
                    $("#panelInfoWaring_note0").text("パネル図承認書をアップロードしてください。");
                    $("#note_for_panel").show();
                    $("#note_for_structure").hide();
                    $("#diagram_approve").text("パネル図承認書");
                    $("#message").text("「土台伏日、上棟日はキット発注Webに登録されている上記の通りです。パネル図を承認しますか？ \n" +
                        "            上記の日程で各作業が進みますが宜しいですか？ \n" +
                        "            日程が異なるなら「Kit発注Webへ」ボタンをクリックして、日程変更して下さい。」");
                } else if (tab == "structureDiagramOrder") {
                    $('.infoPopupInfoStructure').css("visibility", "visible");
                    $(".saveDialogTitle").text("構造図の承認");
                    $("#panelInfoWaring_note0").text("構造図承認書と地図データをアップロードしてください。");
                    $("#note_for_panel").hide();
                    $("#note_for_structure").show();
                    $("#diagram_approve").text("構造図承認書（必須)");
                    $("#message").text("「土台伏日、上棟日はキット発注Webに登録されている上記の通りです。構造図を承認しますか？ \n" +
                        "            上記の日程で各作業が進みますが宜しいですか？ \n" +
                        "            日程が異なるなら「Kit発注Webへ」ボタンをクリックして、日程変更して下さい。」");
                }
                $(".layoutmodal").slideDown();
                $("#approveDialog").slideDown();
                if (tab == "panelDiagramOrder") {
                    buildMultiFileData(panelDiagramDto["acknowledgmentFilePathDto"], "acknowledgmentFilePathDto");
                    displayMultiFile(panelDiagramDto["acknowledgmentFilePathDto"], "acknowledgmentFilePathDto", true);
                } else if (tab == "structureDiagramOrder"){
                    buildSingleFileData(structureDiagramDto["mapFilePathDto"], "mapFilePathDto");
                    displaySingleFile(structureDiagramDto["mapFilePathDto"], "mapFilePathDto", true);
                    buildMultiFileData(structureDiagramDto["acknowledgmentFilePathDto"], "acknowledgmentFilePathDto");
                    displayMultiFile(structureDiagramDto["acknowledgmentFilePathDto"], "acknowledgmentFilePathDto", true);
                }
            } else {
                // print dialog error
                var error = "";
                if (tab == "panelDiagramOrder") {
                    error = "上棟日まで25日を切っているため、パネル図の承認が出来ません。<br>" +
                        "「Kit発注Webへ」ボタンをクリックして、上棟日を変更して下さい。";
                    $("#error_approval_except").unbind( "click" ).bind("click", function () {
                        $(".layoutmodal").hide();
                        $("#error_approval_dialog").slideUp();
                        releaseLockDesignTable(siteNum, targetPageIdPanelDiagram, null);
                        goToKitOrderDelivery();
                    });
                    showApprovalPopupError(error)
                } else if (tab == "structureDiagramOrder") {
                    error = "土台伏日まで21日を切っているため、構造図の承認が出来ません。<br>" +
                        "「Kit発注Webへ」ボタンをクリックして、土台伏日を変更して下さい。";
                    $("#error_approval_except").unbind( "click" ).bind("click", function () {
                        $(".layoutmodal").hide();
                        $("#error_approval_dialog").slideUp();
                        releaseLockDesignTable(siteNum, targetPageIdStructureDiagram, null);
                        goToKitOrderDelivery();
                    });
                    showApprovalPopupError(error)
                }
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            ajaxErrorHandling(jqXHR, textStatus, errorThrown);
        }
    });
}

function  goToKitOrderDelivery() {
    var data = {
        siteNum: siteNum,
        action: 2,
        mode: 0,
        sourcePage: 'delivery'
    }

    lockScreen('処理中です。', 20000);
    var form = document.createElement('form');
    form.setAttribute('action', 'delivery');
    form.setAttribute('method', 'post');
    form.style.display = 'none';
    document.body.appendChild(form);

    for (var paramName in data) {
        var input = document.createElement('input');
        input.setAttribute('type', 'hidden');
        input.setAttribute('name', paramName);
        input.setAttribute('value', data[paramName]);
        form.appendChild(input);
    }

    form.submit();
}

function approvalUploadButtonClicked(dbFieldName) {
    $("#uploadinput_" + dbFieldName).trigger("click");
}

function checkWishAtValid(siteNum, tabOrder) {
    var promise = new Promise(function (resolve,reject) {
        $.ajax({
            type: "GET",
            contentType: "application/json",
            url: "dat-site/wish-at-valid?siteNum=" + siteNum + "&tabOrder=" + tabOrder,
            dataType: 'json',
            timeout: 600000,
            success: function (d) {
                resolve(d);
            },
            error: function (jqXHR, textStatus, errorThrown) {
                ajaxErrorHandling(jqXHR, textStatus, errorThrown);
            }
        });
    })
    return promise;
}

// showPopupConfirm
function showPopupQuestionIconDes(content) {
    $(".layoutmodal").slideDown();
    $("#question_description_dialog").show();
    $("#question_description_derdialog--ok, .layoutmodal").click(function () {
        $(".layoutmodal").slideUp();
        $("#question_description_dialog").hide();
    });
    $("#question_description_dialog .question_description_derdialog--body").html(content)
}

function showPopupConfirmGoPage(pageName, isTabBackCrumb) {

    $("#confirmdialog--cancel, .layoutmodal").click(function () {
        $(".layoutmodal").slideUp();
        $("#confirmdialog").slideUp();
    });
    $(".layoutmodal").slideDown();
    $("#confirmdialog").slideDown();
    $("#confirmdialog--except").unbind("click").bind("click", function () {
        $(".layoutmodal").slideUp();
        $("#confirmdialog").slideUp();
        var currentTab = $(".choosemode").attr("name");
        switch (currentTab) {
            case "structureDiagramOrder":
                doUpdateStructureDiagramWhenChangingTab(function () {
                    goToTargetPage(pageName, isTabBackCrumb);
                });
                break;
            case "panelDiagramOrder": // パネル図 / Panel Diagram
                doUpdatePanelDiagramWhenChangingTab(function () {
                    goToTargetPage(pageName, isTabBackCrumb);
                });
                break;
            case "structureCalculationOrder": // 構造計算 / Structure Calculation
                doUpdateStructureCalculationWhenChangingTab(function () {
                    goToTargetPage(pageName, isTabBackCrumb);
                });
                break;
            case "shaftCalculationOrder": // 軸組計算 / Shaft Calculation
                doUpdateShaftCalculationWhenChangingTab(function () {
                    goToTargetPage(pageName, isTabBackCrumb);
                });
                break;
            case "foundationPlanOrder": // 基礎伏図 / Foundation Plan
                doUpdateFoundationPlanWhenChangingTab(function () {
                    goToTargetPage(pageName, isTabBackCrumb);
                });
                break;
            case "buildingSkinCalculationOrder": // 外皮計算 / Building Skin Calculation
                doUpdateBuildingSkinWhenChangingTab(function () {
                    goToTargetPage(pageName, isTabBackCrumb);
                });
                break;
            case "ventilationCalculationOrder": // 換気計算 / Ventilation Calculation
                doUpdateVentilationWhenChangingTab(function () {
                    goToTargetPage(pageName, isTabBackCrumb);
                });
                break;
            case "cadStructureDiagramOffer":
                doUpdateCadWhenChangingTab(function () {
                    goToTargetPage(pageName, isTabBackCrumb);
                });
                break;
            case "precutOffer":
                doUpdatePreCutWhenChangingTab(function () {
                    goToTargetPage(pageName, isTabBackCrumb);
                });
                break;
            case "ironGoodsOffer":
                doUpdateIronGoodsWhenChangingTab(function () {
                    goToTargetPage(pageName, isTabBackCrumb);
                });
                break;
        }
    });
}

function goToTargetPage(pageName, isTabBackCrumb) {
    unlockTableDesign();
    if(isTabBackCrumb){
        switchBreadcrumb(pageName)
    }else {
        loadTabContent(pageName);
    }
    inEditMode = false;
    $(".layoutmodal").slideUp();
    $("#confirmdialog").slideUp();
    if(listOrderProcess.length > 0){
        unlockTabsOrdering();
        listOrderProcess = [];
    }
}

function showPopupConfirmBackPage() {
    $(".layoutmodal").slideDown();
    $("#confirmdialog").slideDown();
    $("#confirmdialog--cancel, .layoutmodal").click(function () {
        $(".layoutmodal").slideUp();
        $("#confirmdialog").slideUp();
    });
    $("#confirmdialog--except").unbind("click").bind("click", function () {
        $(".layoutmodal").slideUp();
        $("#confirmdialog").slideUp();
        var currentTab = $(".choosemode").attr("name");
        switch (currentTab) {
            case "structureDiagramOrder":
                doUpdateStructureDiagramWhenChangingTab(function () {
                    previousPageOnBreadcrumb();
                });
                break;
            case "panelDiagramOrder": // パネル図 / Panel Diagram
                doUpdatePanelDiagramWhenChangingTab(function () {
                    previousPageOnBreadcrumb();
                });
                break;
            case "structureCalculationOrder": // 構造計算 / Structure Calculation
                doUpdateStructureCalculationWhenChangingTab(function () {
                    previousPageOnBreadcrumb();
                });
                break;
            case "shaftCalculationOrder": // 軸組計算 / Shaft Calculation
                doUpdateShaftCalculationWhenChangingTab(function () {
                    previousPageOnBreadcrumb();
                });
                break;
            case "foundationPlanOrder": // 基礎伏図 / Foundation Plan
                doUpdateFoundationPlanWhenChangingTab(function () {
                    previousPageOnBreadcrumb();
                });
                break;
            case "buildingSkinCalculationOrder": // 外皮計算 / Building Skin Calculation
                doUpdateBuildingSkinWhenChangingTab(function () {
                    previousPageOnBreadcrumb();
                });
                break;
            case "ventilationCalculationOrder": // 換気計算 / Ventilation Calculation
                doUpdateVentilationWhenChangingTab(function () {
                    previousPageOnBreadcrumb();
                });
                break;
            case "cadStructureDiagramOffer":
                doUpdateCadWhenChangingTab(function () {
                    previousPageOnBreadcrumb();
                });
                break;
            case "precutOffer":
                doUpdatePreCutWhenChangingTab(function () {
                    previousPageOnBreadcrumb();
                });
                break;
            case "ironGoodsOffer":
                doUpdateIronGoodsWhenChangingTab(function () {
                    previousPageOnBreadcrumb();
                });
                break;
        }
        inEditMode = false;
    });

}
function unlockTableDesign() {
    var nameTabOrdering = $(".choosemode").attr("name");
    switch (nameTabOrdering) {
        case "structureDiagramOrder":
            releaseLockDesignTable(siteNum, targetPageIdStructureDiagram, null);
            break;
        case "panelDiagramOrder": // パネル図 / Panel Diagram
            releaseLockDesignTable(siteNum, targetPageIdPanelDiagram, null);
            break;
        case "structureCalculationOrder": // 構造計算 / Structure Calculation
            releaseLockDesignTable(siteNum, targetPageIdStructureCalculation, null);
            break;
        case "shaftCalculationOrder": // 軸組計算 / Shaft Calculation
            releaseLockDesignTable(siteNum, targetPageIdShaftCalculation, null);
            break;
        case "foundationPlanOrder": // 基礎伏図 / Foundation Plan
            releaseLockDesignTable(siteNum, targetPageIdFoundationPlan, null);
            break;
        case "buildingSkinCalculationOrder": // 外皮計算 / Building Skin Calculation
            releaseLockDesignTable(siteNum, targetPageIdBuildingSkinPlan, null);
            break;
        case "ventilationCalculationOrder": // 換気計算 / Ventilation Calculation
            releaseLockDesignTable(siteNum, targetPageIdVentilationCalculation, null);
            break;
        case "cadStructureDiagramOffer":
            releaseLockDesignTable(siteNum, targetPageIdCadStructureOffer, null);
            break;
        case "precutOffer":
            releaseLockDesignTable(siteNum, targetPageIdPrecutOffer, null);
            break;
        case "ironGoodsOffer":
            releaseLockDesignTable(siteNum, targetPageIdIronGoodsOffer, null);
            break;
    }
}

function showPopupWarning(popupContent, popupAccept) {
    $(".error_dialog .error_dialog_field #warning_dialog_content").html("");
    if (popupContent) {
        popupContent.forEach(function (err) {
            $(".error_dialog .error_dialog_field #warning_dialog_content").append('<li>' + err + '</li>')
        })
    }
    ;
    $("#warning_except").unbind("click").bind("click", function () {
        popupAccept();
        $(".layoutmodal").hide();
        $("#warning-dialog").slideUp();
    });
    $("#warning_cancel, .layoutmodal").click(function () {
        $(".layoutmodal").hide();
        $("#warning-dialog").slideUp();
    });
    $(".layoutmodal").show();
    $("#warning-dialog").slideDown();
}

function showPopupWarningWhenChangedPage(popupContent, popupAccept, param) {
    $(".error_dialog .error_dialog_field #warning_dialog_content").html("");
    if (popupContent) {
        popupContent.forEach(function (err) {
            $(".error_dialog .error_dialog_field #warning_dialog_content").append('<li>' + err + '</li>')
        })
    }
    ;
    $("#warning_except").unbind("click").bind("click", function () {
        popupAccept(param);
        $(".layoutmodal").hide();
        $("#warning-dialog").slideUp();
    });
    $("#warning_cancel, .layoutmodal").click(function () {
        $(".layoutmodal").hide();
        $("#warning-dialog").slideUp();
    });
    $(".layoutmodal").show();
    $("#warning-dialog").slideDown();
}

function showPopupError(popupContent) {
    $("#error_dialog_content").html("");
    if (popupContent) {
        popupContent.forEach(function (err) {
            $("#error_dialog_content").append('<li>' + err + '</li>')
        })
    }
    ;
    $("#error_except, .layoutmodal").click(function () {
        $(".layoutmodal").hide();
        $("#error-dialog").slideUp();
    });
    $(".layoutmodal").show();
    $("#error-dialog").slideDown();
}

function showApprovalPopupError(popupContent) {
    $("#error_approval_dialog_content").html("");
    if (popupContent) {
        $("#approval_error_msg").html(popupContent);
    }
    $(".layoutmodal").click(function () {
        $(".layoutmodal").hide();
        $("#error_approval_dialog").slideUp();
    });
    $(".layoutmodal").show();
    $("#error_approval_dialog").slideDown();
}


function showPopupInvalidInput(popupContent) {
    $("#validateError_dialog_content").html("");
    if (popupContent) {
        popupContent.forEach(function (elm) {
            $("#validateError_dialog_content").append(
                '<li>' + elm + '</li>'
            )
        })
    };
    $("#validateError_cancel,.layoutmodal").click(function () {
        $(".layoutmodal").slideUp();
        $("#validateError").slideUp();
    })
    $(".layoutmodal").slideDown();
    $("#validateError").slideDown();
}

function showPopupConfirmCourseContent(popupContent, popupAccept) {
    $(".confirm_course_content tbody, .confirm_course_contentTitle tr").html("");
    if (popupContent) {
        for (var i = 0; i < Object.keys(popupContent).length; i++) {
            if (i > 0) {
                $(".confirm_course_content tbody").append('<tr>' + '<td>' + '<span>' + Object.keys(popupContent)[i] + '</span>' + ':' + '</td>' + '<td>' + popupContent[Object.keys(popupContent)[i]] + '</td>' + '</tr>')
            } else {
                console.log(Object.keys(popupContent)[i] + " " + "first elm");
                $(".confirm_course_contentTitle tr").append('<td>' + '<span>' + Object.keys(popupContent)[i] + '</span>' + ':' + '</td>' + '<td>' + popupContent[Object.keys(popupContent)[i]] + '</td>')
            }
        }
        $(".layoutmodal").hide();
        $("#confirm_course_content_dialog").slideUp();
    }
    $("#confirm_course_content_except").unbind("click").bind("click", function () {
        popupAccept();
        $(".layoutmodal").hide();
        $("#confirm_course_content_dialog").slideUp();
    })
    $("#confirm_course_content_cancel, .layoutmodal").click(function () {
        $(".layoutmodal").hide();
        $("#confirm_course_content_dialog").slideUp();
    });
    $(".layoutmodal").show();
    $("#confirm_course_content_dialog").slideDown();
}

function showPopupConfirmOrderModify(popupContent, popupAccept) {
    $("#confirm_order_modify_value").html("")
    if (popupContent) {
        $("#confirm_order_modify_value").html(popupContent)
    }
    $("#popup_order_modify_accept").unbind("click").bind("click", function () {
        popupAccept();
        $(".layoutmodal").hide();
        $("#confirm_order_modify_dialog").slideUp();
    });
    $("#popup_order_modify_cancel,.layoutmodal").click(function () {
        $(".layoutmodal").hide();
        $("#confirm_order_modify_dialog").slideUp();
    });
    $(".layoutmodal").show();
    $("#confirm_order_modify_dialog").slideDown();
}

function showPopupChangeStatus(typeDiagram, siteNum) {
    var statusName;
    $("#ddlStatus").change(function () {
        statusName = $(this).children("option:selected").text();
    })
    $(".layoutmodal").show();
    $("#changeStatus_dalog").slideDown();
    $("#submit-status").unbind("click").bind("click", function () {
        $(".layoutmodal").slideUp();
        showPopupConfirmChangeStatus(statusName, typeDiagram, siteNum);
        $("#changeStatus_dalog").slideUp();
    });
}

function showPopupConfirmChangeStatus(popupContent, typeDiagram, siteNum) {
    var date1 = new Date();
    $(".confirm_change_status_dialog .confirm_change_status_value").html("")
    if (popupContent) {
        $(".confirm_change_status_dialog .confirm_change_status_value").html(popupContent)
    }
    $("#popup_change_status_accept").unbind("click").bind("click", function () {
        lockScreen('Updating');
        changeStatus(typeDiagram, siteNum)
            .then(function (value) {
                $(".layoutmodal").slideUp();
                $(".saveDialog").slideUp();
                $(".layoutmodal").hide();
                $("#confirm_change_status_dialog").slideUp();
                closeModal();
                $('#tab_view_container').load('get-tab-view/' + typeDiagram + '?siteNum=' + siteNum);
            }).finally(function () {
            unlockScreen();
        })
    });

    $("#popup_change_status_cancel,.layoutmodal").click(function () {
        $(".layoutmodal").hide();
        $("#confirm_change_status_dialog").slideUp();
    });
    $(".layoutmodal").show();
    $(".confirm_change_status_dialog").slideDown();
    var date2 = new Date();
    console.log(date2 - date1);
}

function showPopupConfirmSave(updateFunctionName) {
    $(".layoutmodal").slideDown();
    $("#saveChangeWhenEdit").slideDown();

    $("#saveChangeWhenEdit--except").unbind("click").bind('click',function () {
        $(".layoutmodal").slideUp();
        $("#saveChangeWhenEdit").slideUp();
        executeFunctionByName(updateFunctionName, window);
    });
    $("#saveChangeWhenEdit--cancel").click(function () {
        $(".layoutmodal").hide();
        $("#saveChangeWhenEdit").slideUp()
    });
}

function showPopupConfirmProceedAction(objectName, actionName, statusName) {
    $("#confirm_proceed_action_objectName, .confirm_proceed_action_actionName, #confirm_proceed_action_statusName").html("");
    if (objectName && actionName && statusName) {
        $("#confirm_proceed_action_objectName").html(objectName);
        $(".confirm_proceed_action_actionName").html(actionName);
        $("#confirm_proceed_action_statusName").html(statusName);
    }
    $("#confirm_proceed_action_dialog_cancel, .layoutmodal").click(function () {
        $(".layoutmodal").slideUp();
        $("#confirm_proceed_action_dialog").slideUp();
    });
    $(".layoutmodal").slideDown();
    $("#confirm_proceed_action_dialog").slideDown();
}

function showPopupMoveInputOfFrameSetCalculation(popupAccept) {
    $("#moveInputOfFrameSetCalculation_accept").unbind("click").bind("click", function () {
        lockScreen('Loading...!');
        popupAccept().then(function () {
            unlockScreen();
        });
        $(".layoutmodal").hide();
        $("#moveInputOfFrameSetCalculation").slideUp();
    });
    $("#moveInputOfFrameSetCalculation_cancel").click(function () {
        $(".layoutmodal").slideUp();
        $("#moveInputOfFrameSetCalculation").slideUp();
    });
    $(".layoutmodal").click(function () {
        $(".layoutmodal").slideUp();
        $("#moveInputOfFrameSetCalculation").slideUp();
    })
    $(".layoutmodal").slideDown();
    $("#moveInputOfFrameSetCalculation").slideDown();
}

function showPopupPriceOrder(popupContent, popupAccept) {
    var nameTab= $(".choosemode").attr("name");
    switch (nameTab) {
        case "panelDiagramOrder":
            var index_panelDiagramOrder = listOrderProcess.indexOf("panelDiagramOrder");
            if (index_panelDiagramOrder < 0) {
                listOrderProcess.push("panelDiagramOrder");
            }
            break;
        case "structureDiagramOrder":
            var index_structureDiagramOrder = listOrderProcess.indexOf("structureDiagramOrder");
            if (index_structureDiagramOrder < 0) {
                listOrderProcess.push("structureDiagramOrder");
            }
            break;
        case "shaftCalculationOrder":
            var index_shaftCalculationOrder = listOrderProcess.indexOf("shaftCalculationOrder");
            if (index_shaftCalculationOrder < 0) {
                listOrderProcess.push("shaftCalculationOrder");
            }
            break;
    }
    $(".priceOrder .priceOrder_table table tbody").html("");
    if (popupContent) {
        var priceOrdername = Object.keys(popupContent);
        priceOrdername.forEach(function (elm) {
            $(".priceOrder .priceOrder_table table tbody").append(
                '<tr>' + '<td' + " " + 'class' + '=' + "status" + '>' + elm + '</td>' + '<td>' + popupContent[elm] + " 円" + " " + '</td>' + '</tr>'
            )
        })
    };
    $("#priceOrder_accept").unbind("click").bind("click", function () {
        popupAccept();
        $(".layoutmodal").hide();
        $("#priceOrder").slideUp();
        loadTabContent();
    });
    $("#priceOrder_cancel").click(function () {
        $(".layoutmodal").slideUp();
        $("#priceOrder").slideUp();
        removeItemListOrderProcess();
    });
    $(".layoutmodal").click(function () {
        $(".layoutmodal").slideUp();
        $("#priceOrder").slideUp();
        removeItemListOrderProcess();
    });
    $(".layoutmodal").slideDown();
    $("#priceOrder").slideDown();
}

function showPopUpInputError(content) {
    $("#inputError-dialog_content").html("");
    content.forEach(function (elm) {
        $("#inputError-dialog_content").append(
            '<li>' + elm + '</li>'
        )
    })
    $("#inputError-dialog").slideDown();
    $(".layoutmodal").slideDown();

    $("#inputError-dialog_except").click(function () {
        $("#inputError-dialog").slideUp();
        $(".layoutmodal").slideUp();
    });
}
function executeFunctionByName(functionName, context /*, args */) {
    var args = Array.prototype.slice.call(arguments, 2);
    var namespaces = functionName.split(".");
    var func = namespaces.pop();
    for (var i = 0; i < namespaces.length; i++) {
        context = context[namespaces[i]];
    }
    return context[func].apply(context, args);
}


function getHistoryStatus(history) {
    var status = history.changed.filter(function (changedItem) {
        return changedItem.where == "status";
    })[0];
    if (status) {
        return {
            beforeStatus: status.before.statusName,
            afterStatus: status.after.statusName
        }
    }
    return {};
}

function displayMultiFileHistory(histories, fieldName, dialogTitle) {
    $("#file_history_table_body").empty();
    $.each(histories, function (index, history) {
        var status = getHistoryStatus(history);
        var htmlFiles = '';
        var historyFileItem = history.changed.filter(function (changedItem) {
            return changedItem.where == fieldName;
        })[0];
        if (historyFileItem) {
            historyFileItem.after = historyFileItem.after ? historyFileItem.after : [];
            historyFileItem.before = historyFileItem.before ? historyFileItem.before : [];
            htmlFiles += displayNewAddedFiles(historyFileItem);
            htmlFiles += displayChangedFiles(historyFileItem);
            htmlFiles += displayDeletedFiles(historyFileItem);
        }

        if (htmlFiles) {
            $("#file_history_table_body").append('<tr><td>' + history.at + '</td><td>' + history.actionName + '</td><td>' + status.beforeStatus + '</td><td>' + htmlFiles + '</td></tr>');
        }
    });

    $("#file-history-title").text(dialogTitle);
    $(".layoutmodal").slideDown();
    $("#structurediagram__upfileHistoryPopup").slideDown()
    unlockScreen();
}

function displayNewAddedFiles(historyFileItem) {
    var newHtml = '';
    $.each(historyFileItem.after, function (index, file) {
        var isExisting = historyFileItem.before.some(function (existingFile) {
            return existingFile.fileOriginalName == file.fileOriginalName;
        });

        if (!isExisting) {
            var displayName = trimFileName(file.fileOriginalName);
            newHtml += '<div class="history-single-file"><span title="' + file.fileOriginalName + '" class="history-file-name" onclick="onFileLabelClicked(\'' + file.fileOriginalName + '\',\'' + file.awsS3FileName + '\', false, false)" style="cursor: pointer;">' + displayName + '</span> <span>追加</span></div>';
        }
    });
    return newHtml;
}

function displayChangedFiles(historyFileItem) {
    var newHtml = '';
    $.each(historyFileItem.after, function (index, file) {
        var isExisting = historyFileItem.before.some(function (existingFile) {
            return existingFile.fileOriginalName == file.fileOriginalName && existingFile.awsS3FileName != file.awsS3FileName;
        });

        if (isExisting) {
            var displayName = trimFileName(file.fileOriginalName);
            newHtml += '<div class="history-single-file"><span title="' + file.fileOriginalName + '" class="history-file-name" onclick="onFileLabelClicked(\'' + file.fileOriginalName + '\',\'' + file.awsS3FileName + '\', false, false)" style="cursor: pointer;">' + displayName + '</span> <span>変更</span></div>';
        }
    });
    return newHtml;
}

function displayDeletedFiles(historyFileItem) {
    var newHtml = '';
    $.each(historyFileItem.before, function (index, file) {
        var isExisting = historyFileItem.after.some(function (existingFile) {
            return existingFile.fileOriginalName == file.fileOriginalName;
        });

        if (!isExisting) {
            var displayName = trimFileName(file.fileOriginalName);
            newHtml += '<div class="history-single-file"><span title="' + file.fileOriginalName + '" class="history-file-name" onclick="onFileLabelClicked(\'' + file.fileOriginalName + '\',\'' + file.awsS3FileName + '\', false, false)" style="cursor: pointer;">' + displayName + '</span> <span>削除</span></div>';
        }
    });
    return newHtml;
}

function changeReviewFee(prefixModal, prefixTable, targetFee) {

    $('#' + prefixModal + ' input[type=checkbox]').click(function () {
        var reviewFee = 0;
        var syncId = $(this).attr("syncId");

        if ($(this).is(":checked")) {
            $('#' + prefixModal + ' input[type=checkbox]').prop('checked', false);
            $('#' + prefixTable + ' input[type=checkbox]').prop('checked', false);
            $(this).prop('checked', true);
            $('#' + prefixTable + ' #' + syncId).prop('checked', true);
        } else {
            $('#' + prefixTable + ' #' + syncId).prop('checked', false);
        }

        $('#' + prefixModal + ' input[type=checkbox]:checked').each(function () {
            reviewFee += parseInt($(this).attr("data"));
        });

        var reviewFeeFormatCurrency = formatNumber(reviewFee) + ' 円';
        $('#' + targetFee).text(reviewFeeFormatCurrency);
    });
}
function changeReviewFeeTable(prefixModal, prefixTable) {
    $('#' + prefixTable + ' input[type=checkbox]').click(function () {
        var syncId = $(this).attr("id");
        if ($(this).is(":checked")) {
            $('#' + prefixModal + ' input[type=checkbox]').prop('checked', false);
            $('#' + prefixTable + ' input[type=checkbox]').prop('checked', false);
            $(this).prop('checked', true);
            $('#' + prefixModal + ' #' + syncId +"_dialog").prop('checked', true);
        } else {
            $('#' + prefixModal + ' #' + syncId + "_dialog").prop('checked', false);
        }
    });
}
function openCourseDialog(prefixTable, prefixModal) {
    $('#' + prefixTable + ' input[type=checkbox]:checked').each(function () {
        $('#' + prefixModal + ' #' + $(this).attr("id") + '_dialog').prop('checked', true);
    });

    $(".layoutmodal").slideDown();
    $('#' + prefixModal).slideDown();
}

function validateInput(prefixDate, prefixRemark, prefixMemo) {
    var error = [];
    $('#' + prefixDate + ' input[type=text]').each(function (index) {
        if (!validateDateError($(this).val())) {
            error.push($(this).attr("label-name") + 'の入力文字数が日付ではありません。年月日を減らし再度お試しください。');
        }
    });
    if (mbStrWidthRemarks($('#' + prefixRemark + ' #content').val())) {
        error.push("依頼時の特記事項の入力文字数が上限を超えています。\n" +
            "一度に入力できる文字数は７００文字です。文字数を減らし再度お試しください。")
    }
    if (mbStrWidthRemarks($('#' + prefixMemo + ' #content_memo').val())) {
        error.push("イビケン納品時のコメントの入力文字数が上限を超えています。\n" +
            "一度に入力できる文字数は７００文字です。文字数を減らし再度お試しください。")
    }
    return error;
}

function validateDateError(val_date) {
    if (val_date.trim() === "") {
        return true;
    }
    var dateformat = /^\d{4}-\d{2}-\d{2}$/;
    if (val_date.match(dateformat)) {
        var seperator = val_date.split('-');

        if (seperator.length > 1) {
            var splitdate = val_date.split('-');
        }
        var yy = parseInt(splitdate[0]);
        var mm = parseInt(splitdate[1]);
        var dd = parseInt(splitdate[2]);
        var ListofDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
        if (yy > 2050) {
            return false;
        }
        if (mm == 1 || mm > 2) {
            if (dd > ListofDays[mm - 1]) {
                return false;
            }
        }
        if (mm == 2) {
            var lyear = false;
            if ((!(yy % 4) && yy % 100) || !(yy % 400)) {
                lyear = true;
            }
            if ((lyear == false) && (dd >= 29)) {
                return false;
            }
            if ((lyear == true) && (dd > 29)) {
                return false;
            }
        }
    } else {
        return false;
    }
    return true;
}

function closeDialog(scopeId) {
    $(".layoutmodal").slideUp();
    $("#" + scopeId).slideUp();
}

function validateButton(listButton) {
    if(listButton && Array.isArray(listButton)) {
        for (i = 0; i < listButton.length; ++i) {
            var button = listButton[i].buttonId;
            var status = listButton[i].status;
            switch (status) {
                case "disabled":
                    $(button).prop("disabled", true);
                    break;
                case "enable":
                    $(button).prop("enable", true);
                    break;
                case "visible":
                    $(button).css({"visibility": "visible"});
                    break;
                case "hidden":
                    $(button).css({"visibility": "hidden"});
                    break;
                case "none":
                    $(button).css("display", "none");
                    break;
                default:
                    $(button).css("display", "none");
                    break;
            }
        }
    }
    $("#button-processing, #button-status-processing").css("display", "");
    $(".fa-history, .sizeHistoryIcon").css("display", "");
}

function displaySingleFileHistories(histories, singleFileUpload, dialogTitle, fieldLabelMapping) {
    $("#file_history_table_body").empty();
    $.each(histories, function (index, history) {
        var status = getHistoryStatus(history);
        var htmlFiles = '';
        $.each(singleFileUpload, function (index, fileItemName) {
            var historyFileItem = history.changed.filter(function (changedItem) {
                return changedItem.where == fileItemName;
            })[0];

            if (isHistoryFileNotEmpty(historyFileItem) && isDisplayFileHistory(historyFileItem)) {
                var displayFileName = '';
                if (isDeletedFile(historyFileItem)) {
                    displayFileName = trimFileName(historyFileItem.before.fileOriginalName);
                    htmlFiles += '<div class="history-single-file"><label class="file-history-label">' + fieldLabelMapping[historyFileItem.where]  + '</label><span title="' + historyFileItem.before.fileOriginalName + '" class="history-file-name" onclick="onFileLabelClicked(\'' + historyFileItem.before.fileOriginalName + '\',\'' + historyFileItem.before.awsS3FileName + '\', false, false )" style="cursor: pointer;position: relative; height: 2em; float: left; overflow: hidden; width: 80%;">' + displayFileName + '</span> <span>削除</span></div>';
                } else if (isModifiedFile(historyFileItem)) {
                    displayFileName = trimFileName(historyFileItem.after.fileOriginalName);
                    htmlFiles += '<div class="history-single-file"><label class="file-history-label">' + fieldLabelMapping[historyFileItem.where] + '</label><span title="' + historyFileItem.after.fileOriginalName + '" class="history-file-name" onclick="onFileLabelClicked(\'' + historyFileItem.after.fileOriginalName + '\',\'' + historyFileItem.after.awsS3FileName + '\', false, false )" style="cursor: pointer;position: relative; height: 2em; float: left; overflow: hidden; width: 80%;">' + displayFileName + '</span> <span>変更</span></div>';
                } else {
                    displayFileName = trimFileName(historyFileItem.after.fileOriginalName);
                    htmlFiles += '<div class="history-single-file"><label class="file-history-label">' + fieldLabelMapping[historyFileItem.where] + '</label><span title="' + historyFileItem.after.fileOriginalName + '" class="history-file-name" onclick="onFileLabelClicked(\'' + historyFileItem.after.fileOriginalName + '\',\'' + historyFileItem.after.awsS3FileName + '\', false, false )" style="cursor: pointer;position: relative; height: 2em; float: left; overflow: hidden; width: 80%;">' + displayFileName + '</span> <span>追加</span></div>';
                }

            }
        });
        if (htmlFiles) {
            $("#file_history_table_body").append('<tr><td>' + history.at + '</td><td>' + history.actionName + '</td><td>' + status.beforeStatus + '</td><td>' + htmlFiles + '</td></tr>');
        }
    });
    $("#file-history-title").text(dialogTitle);
    $(".layoutmodal").slideDown();
    $("#structurediagram__upfileHistoryPopup").slideDown();
    unlockScreen();
}

function isHistoryFileNotEmpty(fileHistory) {
    return !!fileHistory && ((!!fileHistory.before && !!fileHistory.before.awsS3FileName) || (!!fileHistory.after && !!fileHistory.after.awsS3FileName));
}

function isDeletedFile(fileHistory) {
    return !!fileHistory.before && !!fileHistory.before.awsS3FileName && (!fileHistory.after || !fileHistory.after.awsS3FileName);
}

function isModifiedFile(fileHistory) {
    return !!fileHistory.before && !!fileHistory.before.awsS3FileName && !!fileHistory.after && !!fileHistory.after.awsS3FileName && fileHistory.before.awsS3FileName != fileHistory.after.awsS3FileName;
}

function isDisplayFileHistory(fileHistory) {
    if (!fileHistory.before || !fileHistory.after) {
        return true;
    }
    return  fileHistory.before.awsS3FileName != fileHistory.after.awsS3FileName;
}

function  displayCurrentFileDownloadHistories(currentFileDownloadHistory) {
    var downloadHistoryHtml = '';
    if (currentFileDownloadHistory) {
        var sortedArray = currentFileDownloadHistory.reverse();
        $.each(sortedArray, function (index, downloadHistory) {
            downloadHistoryHtml += '<tr><td><div class="history-content"><div align="right"><span>' + downloadHistory.at + '</span></div> <label>＞' + downloadHistory.who.member_name + ' ' + downloadHistory.who.user_name + '</label> <p>ダウンロードファイル名： ' + downloadHistory.name + '</p></div></td><td></td></tr>';
        });
    }
    $("#history_record_body").append(downloadHistoryHtml);
}

function displayRecordHistory(histories, checkboxFields, fieldLabelMapping, multiFiles) {
    var historyHtml = '';
    $.each(histories, function (index, history) {
        var historyContent = '<div align="right"><span>' + history.at + '</span></div> <label>＞' + history.author.member_name + ' ' + history.author.user_name + '</label>';
        $.each(history.changed, function (index, changedItem) {
            if (checkboxFields.indexOf(changedItem.where) >= 0) {
                historyContent += '<p>' + buildHtmlForCheckboxType(changedItem, fieldLabelMapping) + '</p>';
            } else if (changedItem.type == "FileModel") {
                historyContent += '<p>' + buildHtmlFile(changedItem, fieldLabelMapping) + '</p>';
            } else if (changedItem.where == "status") {
                var statusHtml = "<p> 変更点 : ステータス, 前 :" + changedItem.before.statusName + ", 後 :" + changedItem.after.statusName + "</p>";
                historyContent += statusHtml;
            } else if (changedItem.where == "assignedUser" || changedItem.where == "partnerDto") {
                var statusHtml = "<p> 変更点 : " + (fieldLabelMapping[changedItem.where] ? fieldLabelMapping[changedItem.where] : changedItem.where) + ", 前 :" + changedItem.before.name + ", 後 :" + changedItem.after.name + "</p>";
                historyContent += statusHtml;
            } else if (changedItem.where == "costsDto") {
                if (changedItem.before) {
                    if (changedItem.before.baseCost != changedItem.after.baseCost) {
                        historyContent += '<p>変更点 : 費用 , 前 : ' + changedItem.before.baseCost + ', 後 : ' + changedItem.after.baseCost + '</p>';
                    }
                    if (changedItem.before.fixedCost != changedItem.after.fixedCost) {
                        historyContent += '<p>変更点 : 調整費用, 前 : ' + changedItem.before.fixedCost + ', 後 : ' + changedItem.after.fixedCost + '</p>';
                    }
                    if (changedItem.before.totalCost != changedItem.after.totalCost) {
                        historyContent += '<p>変更点 : 合計費用, 前 : ' + changedItem.before.totalCost + ', 後 : ' + changedItem.after.totalCost + '</p>';
                    }
                } else {
                    historyContent += '変更点 : 費用 , 前 :, 後 : ' + changedItem.after.baseCost;
                    historyContent += '変更点 : 調整費用, 前 :, 後 : ' + changedItem.after.fixedCost;
                    historyContent += '変更点 : 合計費用, 前 :, 後 : ' + changedItem.after.totalCost;
                }
            } else if (changedItem.where == "entranceInfoDto") {
                var sizeHtml = '変更点 : 玄関ドア仕様, 前 :';
                if (changedItem.before && (changedItem.before.width || changedItem.before.height)) {
                    sizeHtml += ('W - ' + changedItem.before.width + ', H - ' + changedItem.before.height);
                }
                sizeHtml += ", 後 :";

                if (changedItem.after && (changedItem.after.width || changedItem.after.height)) {
                    sizeHtml += ('W - ' + changedItem.after.width + ', H - ' + changedItem.after.height);
                }
                historyContent += sizeHtml;
            } else if (changedItem.where == "disasterPresentationAreaDto") {
                var bfText = getDisplayTextFromDesasterPresentation(changedItem.before);
                var afText = getDisplayTextFromDesasterPresentation(changedItem.after);
                var desasterHtml = "<p> 変更点 : " + (fieldLabelMapping[changedItem.where] ? fieldLabelMapping[changedItem.where] : changedItem.where) + ", 前 :" + bfText + ", 後 :" + afText + "</p>";
                historyContent += desasterHtml;
            } else if (changedItem.where == "baseHeightDto") {
                var bfText = getDisplayTextFromBaseHeight(changedItem.before);
                var afText = getDisplayTextFromBaseHeight(changedItem.after);
                var baseHeightDtoHtml = "<p> 変更点 : " + (fieldLabelMapping[changedItem.where] ? fieldLabelMapping[changedItem.where] : changedItem.where) + ", 前 :" + bfText + ", 後 :" + afText + "</p>";
                historyContent += baseHeightDtoHtml;
            } else if (changedItem.where == "rootingDepthDto") {
                var bfText = getDisplayTextFromRootingDepth(changedItem.before);
                var afText = getDisplayTextFromRootingDepth(changedItem.after);
                var rootingHtml = "<p> 変更点 : " + (fieldLabelMapping[changedItem.where] ? fieldLabelMapping[changedItem.where] : changedItem.where) + ", 前 :" + bfText + ", 後 :" + afText + "</p>";
                historyContent += rootingHtml;
            } else if (changedItem.where == "snowlyAreaDivisionCd") {
                var bfText = "";
                var afText = "";
                var arrNum = ['一般地域', '多雪地域（雪止め無し）', '多雪地域（雪止めあり）'];
                if (changedItem.before) {
                    bfText =  arrNum[changedItem.before - 1];
                }
                if (changedItem.after) {
                    afText =  arrNum[changedItem.after - 1];
                }
                var snowlyAreaDivisionCdHtml = "<p> 変更点 : " + (fieldLabelMapping[changedItem.where] ? fieldLabelMapping[changedItem.where] : changedItem.where) + ", 前 :" + bfText + ", 後 :" + afText + "</p>";
                historyContent += snowlyAreaDivisionCdHtml;
            } else if (changedItem.where == "standardWindSpeed") {
                var bfText = "";
                var afText = "";
                if (changedItem.before) {
                    bfText =  28 + changedItem.before * 2;
                }
                if (changedItem.after) {
                    afText =  28 + changedItem.after * 2;
                }
                var standardWindSpeedHtml = "<p> 変更点 : " + (fieldLabelMapping[changedItem.where] ? fieldLabelMapping[changedItem.where] : changedItem.where) + ", 前 :" + bfText + ", 後 :" + afText + "</p>";
                historyContent += standardWindSpeedHtml;
            } else if (changedItem.where == "courseCd") {
                var bfText = getDisplayTextFromCourseCd(changedItem.before);
                var afText = getDisplayTextFromCourseCd(changedItem.after);
                var courseCdHtml = "<p> 変更点 : " + (fieldLabelMapping[changedItem.where] ? fieldLabelMapping[changedItem.where] : changedItem.where) + ", 前 :" + bfText + ", 後 :" + afText + "</p>";
                historyContent += courseCdHtml;
            } else if (changedItem.where == "thermalInsulationAreaDivision") {
                var bfText = "";
                var afText = "";
                var arrNum = ['3地域（Old: Ⅱ地域）', '4地域（Old: Ⅲ地域）', '5地域（Old: Ⅳa地域）', '6地域（Old: Ⅳb地域）', '7地域（Old: Ⅴ地域）'];
                if (changedItem.before) {
                    bfText =  arrNum[changedItem.before - 1];
                }
                if (changedItem.after) {
                    afText =  arrNum[changedItem.after - 1];
                }
                var thermalInsulationAreaDivisionHtml = "<p> 変更点 : " + (fieldLabelMapping[changedItem.where] ? fieldLabelMapping[changedItem.where] : changedItem.where) + ", 前 :" + bfText + ", 後 :" + afText + "</p>";
                historyContent += thermalInsulationAreaDivisionHtml;
            } else if (changedItem.where == "planCd" || changedItem.where == "frequency") {
                var bfText = "";
                var afText = "";
                var arrNum = ['標準', '標準外'];
                if (changedItem.before) {
                    bfText =  arrNum[changedItem.before - 1];
                }
                if (changedItem.after) {
                    afText =  arrNum[changedItem.after - 1];
                }
                var frequencyHtml = "<p> 変更点 : " + (fieldLabelMapping[changedItem.where] ? fieldLabelMapping[changedItem.where] : changedItem.where) + ", 前 :" + bfText + ", 後 :" + afText + "</p>";
                historyContent += frequencyHtml;
            } else if (changedItem.where == "panelInfoDto") {
                historyContent += "<p>変更点 : 屋根パネル仕様, 前 : " + getDisplayTextFromPanelInfo(changedItem.before) + ", 後 :" + getDisplayTextFromPanelInfo(changedItem.after) + "</p>";
            } else if (changedItem.where == "commentDtos" || changedItem.where == "informativesDtos" || changedItem.where == "directionsDtos") {
                var commentHtml = '';
                if (changedItem.after) {
                    $.each(changedItem.after, function (index, comment) {
                        if (comment.mesg) {
                            commentHtml += comment.mesg + ', ';
                        }
                    });
                }
                if (commentHtml.length > 0) {
                    historyContent += '<p>変更点 : ' + (fieldLabelMapping[changedItem.where] ? fieldLabelMapping[changedItem.where] : changedItem.where) + ', 前 :, 後 : ' + commentHtml + '</p>';
                }
            } else if (changedItem.where == "privateMemoDtos") {
                if (userType == 'ibiken' || userType == 'customer') {
                    var commentHtml = '';
                    if (changedItem.after) {
                        $.each(changedItem.after, function (index, comment) {
                            if (comment.mesg) {
                                commentHtml += comment.mesg + ', ';
                            }
                        });
                    }
                    if (commentHtml.length > 0) {
                        historyContent += '<p>変更点 : ' + (fieldLabelMapping[changedItem.where] ? fieldLabelMapping[changedItem.where] : changedItem.where) + ', 前 :, 後 : ' + commentHtml + '</p>';
                    }
                }
            } else if (multiFiles.indexOf(changedItem.where) >= 0) {
                var multifileHtml = '変更点 : ' + (fieldLabelMapping[changedItem.where] ? fieldLabelMapping[changedItem.where] : changedItem.where) + ', 前 :';
                if (changedItem.before) {
                    $.each(changedItem.before, function (index, file) {
                        multifileHtml += ('<span onclick="onFileLabelClicked(\'' + file.fileOriginalName + '\',\'' + file.awsS3FileName + '\', false, false )" style="cursor: pointer; color: #0000ff;">' + file.fileOriginalName + '</span> ');
                    });
                }
                multifileHtml += ", 後 :";
                if (changedItem.after) {
                    $.each(changedItem.after, function (index, file) {
                        multifileHtml += ('<span onclick="onFileLabelClicked(\'' + file.fileOriginalName + '\',\'' + file.awsS3FileName + '\', false, false )" style="cursor: pointer; color: #0000ff;">' + file.fileOriginalName + '</span> ');
                    });
                }
                historyContent += ("<p>" + multifileHtml + "</p>");
            } else if (changedItem.where != "deliverablesFileDowanloadedInfoDto" && changedItem.where != "deliverablesFileDowanloadedInfo") {
                var bfText = changedItem.before ? changedItem.before : "";
                var afText = changedItem.after ? changedItem.after : "";
                var otherFieldHtml = "<p> 変更点 : " + (fieldLabelMapping[changedItem.where] ? fieldLabelMapping[changedItem.where] : changedItem.where) + ", 前 :" + bfText + ", 後 :" + afText + "</p>";
                historyContent += otherFieldHtml;
            }
        });

        if (isUserIBiken(history.author.member_id)) {
            historyHtml += ('<tr><td></td><td><div class="history-content">' + historyContent + '</div></td></tr>');

        } else {
            historyHtml += ('<tr><td><div class="history-content">' + historyContent + '</div></td><td></td></tr>');
        }
        var fileDownloadHistoryHtml = checkAndRenderDownloadHistory(history);
        if (fileDownloadHistoryHtml.length > 0) {
            historyHtml += fileDownloadHistoryHtml;
        }
    });
    $("#history_record_body").append(historyHtml);
    $(".layoutmodal").slideDown();
    $("#structurediagram__historyPopup").slideDown();
    unlockScreen();
}

function getDisplayTextFromDesasterPresentation(fieldValue) {
    if (fieldValue.nonSpecification == 1) {
        return '無指定';
    } else if (fieldValue.article22 == 1) {
        return '22条';
    } else if (fieldValue.quasiFirePreventionDistricts == 1) {
        return '準防火';
    } else if (fieldValue.cannotProcess == 1) {
        return '防火地域・準防火地域対応不可';
    }
    return '';
}

function getDisplayTextFromBaseHeight(fieldValue) {
    if (fieldValue.gl400 == 1) {
        return 'GL+400';
    } else if (fieldValue.gl600 == 1) {
        return 'GL+600';
    } else if (fieldValue.other == 1) {
        return 'その他 ' + fieldValue.value;
    }
    return '';
}

function getDisplayTextFromRootingDepth(fieldValue) {
    if (fieldValue.newSpec250 == 1) {
        return '250mm';
    } else if (fieldValue.oldSpec380 == 1) {
        return '旧仕様380mm';
    } else if (fieldValue.other == 1) {
        return 'その他 ' + fieldValue.val;
    }
    return '';
}

function getDisplayTextFromCourseCd(fieldValue) {
    if (fieldValue == 1 || fieldValue == 12 || fieldValue == 15 || fieldValue == 17 || fieldValue == 28) {
        return 'A';
    } else if (fieldValue == 2 || fieldValue == 13) {
        return 'B';
    } else if (fieldValue == 3) {
        return 'C';
    } else if (fieldValue == 4) {
        return 'D';
    } else if (fieldValue == 11) {
        return 'O';
    }
    return '';
}

function getDisplayTextFromPanelInfo (panelInfo) {
    var textArr = [];
    if (getDisplayTextFromPanelRoof(panelInfo)) {
        textArr.push(getDisplayTextFromPanelRoof(panelInfo))
    }

    if (getDisplayTextFromPanelPorch(panelInfo)) {
        textArr.push(getDisplayTextFromPanelPorch(panelInfo))
    }

    if (getDisplayTextFromPanelEavesBack(panelInfo)) {
        textArr.push(getDisplayTextFromPanelEavesBack(panelInfo))
    }

    return textArr.toString();
}

function getDisplayTextFromPanelRoof (panelInfo) {
    if (panelInfo.roof.verge == 'std_750') {
        return '大屋根: 750mmタイプ';
    } else if (panelInfo.roof.verge == 'std_400') {
        return '大屋根: 400mmタイプ';
    } else if (panelInfo.roof.verge == 'cus_verge') {
        if (panelInfo.roof.eaves == 'cus_eaves_none_item') {
            return '大屋根: ケラバの出 特注タイプ, 軒の出 特注サイズ（天窓も煙突もなしの場合 ）';
        } else if (panelInfo.roof.eaves == 'cus_eaves_has_item') {
            return '大屋根: ケラバの出 特注タイプ, 軒の出 特注サイズ（天窓、煙突、Ｌ字のいずれかがある場合 ）';
        }
        return '大屋根: ケラバの出 特注タイプ';
    }
    return '';
}

function getDisplayTextFromPanelPorch (panelInfo) {
    if (panelInfo.porch == 'std_455') {
        return 'ポーチ: 455mmタイプ ';
    } else if (panelInfo.porch == 'cus_width') {
        return 'ポーチ: 幅方向の変更 特注サイズ';
    }
    return '';
}

function getDisplayTextFromPanelEavesBack (panelInfo) {
    if (panelInfo.eavesBack == 'siding') {
        return '軒裏仕様: 羽目板（防火無指定・22条地域)';
    } else if (panelInfo.eavesBack == 'cus_width') {
        return '軒裏仕様: ケイカル板12mm（準防火地域）';
    }
    return '';
}

function checkAndRenderDownloadHistory(history) {
    var downloadHistoryHtml = '';
    var downloadHistory = history.changed.filter(function (changedItem) {
        return changedItem.where == "deliverablesFileDowanloadedInfoDto";
    })[0];
    if (downloadHistory) {
        if (downloadHistory.after) {
            var sortedArray = downloadHistory.after.reverse();
            $.each(sortedArray, function (index, downloadHistory) {
                downloadHistoryHtml += '<tr><td><div class="history-content"><div align="right"><span>' + downloadHistory.at + '</span></div> <label>＞' + downloadHistory.who.member_name + ' ' + downloadHistory.who.user_name + '</label> <p>ダウンロードファイル名： ' + downloadHistory.name + '</p></div></td><td></td></tr>';
            });
        }
    }
    return downloadHistoryHtml;
}

function buildHtmlForCheckboxType(changedItem, fieldLabelMapping) {
    if (changedItem.where == 'baseHeightDto') {
        if (changedItem.after.gl400 == 1) {
            return "変更点 : 基礎の高さ - GL+400, 前 : 無し, 後 : 有り";
        } else if (changedItem.after.gl600 == 1) {
            return "変更点 : 基礎の高さ - GL+600, 前 : 無し, 後 : 有り";
        } else {
            if (changedItem.before.other == 1 && changedItem.after.other == 1) {
                return "変更点 : 基礎の高さ - その他, 前 : " + changedItem.before.value + ", 後 : " + changedItem.after.value;
            } else {
                var valueOther = changedItem.after.value ? changedItem.after.value : '';
                return "変更点 : 基礎の高さ - その他, 前 : 無し, 後 : 有り " + valueOther;
            }
        }
    } else if (changedItem.where == 'disasterPresentationAreaDto') {
        if (changedItem.after.nonSpecification == 1) {
            return "変更点 : 防火地域 - 無指定, 前 : 無し, 後 : 有り";
        } else if (changedItem.after.article22 == 1) {
            return "変更点 : 防火地域 - 22条, 前 : 無し, 後 : 有り";
        } else {
            return "変更点 : 防火地域 - 準防火, 前 : 無し, 後 : 有り";
        }
    } else if (changedItem.where == 'snowyInfoDto') {
        var changedText = '';
        if (changedItem.before.is != changedItem.after.is) {
            if (changedItem.after.is == 1) {
                changedText += "変更点 : 多雪地域検討, 前 : 無し, 後 : 有り";
            } else {
                changedText += "変更点 : 多雪地域検討, 前 : 有り, 後 : 無し";
            }
        } else if (changedItem.before.depth != changedItem.after.depth) {
            var beforeStop = changedItem.before.stop ? "有り" : "無し";
            var afterStop = changedItem.after.stop ? "有り" : "無し";

            var beforeValue = changedItem.before.depth ? changedItem.before.depth + '-' + beforeStop : beforeStop;
            var afterValue = changedItem.after.depth ? changedItem.after.depth + '-' + afterStop : afterStop;
            changedText += ("変更点 : 積雪深さ(有償), 前 : " + beforeValue + ", 後 : " + afterValue);
        }
        return changedText;
    } else if (changedItem.where == "rootingDepthDto") {
        var label = fieldLabelMapping[changedItem.where] ? fieldLabelMapping[changedItem.where] : changedItem.where;
        if (changedItem.after.newSpec250 == 1) {
            return "変更点 : " + label + " - 250mm, 前 : 無し, 後 : 有り";
        } else if (changedItem.after.oldSpec380 == 1) {
            return "変更点 : " + label + " - 旧仕様380mm, 前 : 無し, 後 : 有り";
        } else {
            if (changedItem.before.other == 1 && changedItem.after.other == 1) {
                return "変更点 : " + label + " - その他, 前 : " + changedItem.before.val + ", 後 : " + changedItem.after.val;
            } else {
                var valueOther = changedItem.after.val ? changedItem.after.val : '';
                return "変更点 : " + label + " - その他, 前 : 無し, 後 : 有り " + valueOther;
            }
        }
    } else {
        var fieldLabel = (fieldLabelMapping[changedItem.where] ? fieldLabelMapping[changedItem.where] : changedItem.where);
        if (changedItem.after == 1) {
            return "変更点 : " + fieldLabel + ", 前 : 無し, 後 : 有り";
        } else {
            return "変更点 : " + fieldLabel + ", 前 : 有り, 後 : 無し";
        }
    }
}

function buildHtmlFile(changedItem, fieldLabelMapping) {
    if (isHistoryFileNotEmpty(changedItem) && isDisplayFileHistory(changedItem)) {
        var fileHtml = '変更点 : ' + (fieldLabelMapping[changedItem.where] ? fieldLabelMapping[changedItem.where] : changedItem.where) + ', 前 : ';
        if (!!changedItem.before && !!changedItem.before.awsS3FileName) {
            fileHtml += ('<span onclick="onFileLabelClicked(\'' + changedItem.before.fileOriginalName + '\',\'' + changedItem.before.awsS3FileName + '\', false, false )" style="cursor: pointer; color: #0000ff;">' + changedItem.before.fileOriginalName + '</span>');
        }
        fileHtml += ", 後 :";
        if (!!changedItem.after && !!changedItem.after.awsS3FileName) {
            fileHtml += ('<span onclick="onFileLabelClicked(\'' + changedItem.after.fileOriginalName + '\',\'' + changedItem.after.awsS3FileName + '\', false, false )" style="cursor: pointer; color: #0000ff;">' + changedItem.after.fileOriginalName + '</span>');
        }
        return fileHtml;
    }
    return "";
}

function downloadHisotryAsCsv() {
    var exportTarget = $("#download-history-as-csv-button").attr("export-target");
    window.location.href = baseUrl + "/api/" + exportTarget + "/export-csv-history?siteNum=" + siteNum;
}

function openW2UiPopup(uri, data, title, callBack, width, height) {
    var wkFrame = document.createElement("iframe");
    wkFrame.setAttribute('name', 'wkFrame');
    wkFrame.setAttribute('src', 'about:blank');
    wkFrame.setAttribute('style', 'border: 0px;');
    wkFrame.setAttribute('width', '100%');
    wkFrame.setAttribute('height', '99%');

    var wCnt = 0;
    var onload = wkFrame.onload = function () {
        if (wCnt++ == 0) {
            // iframeの準備ができたらPOSTでフォーム送信
            setTimeout(function () {
                // ダミーフォームをiframe内に生成
                var form = document.createElement('form');
                form.id = "wkFrameForm";
                form.setAttribute('action', uri);
                form.setAttribute('method', 'POST');
                form.setAttribute('accept-charset', 'UTF-8');
                form.setAttribute('target', wkFrame.getAttribute('name'));
                form.style.display = 'none';
                wkFrame.contentWindow.document.writeln('<body></body>');
                wkFrame.contentWindow.document.close();
                wkFrame.contentWindow.document.body.appendChild(form);

                // パラメーター設定
                if (data) {
                    for (var paramName in data) {
                        var input = document.createElement('input');
                        input.setAttribute('type', 'hidden');
                        input.setAttribute('name', paramName);
                        input.setAttribute('value', data[paramName]);

                        console.log("openPopup paramName =" + paramName + " data[paramName] =" + data[paramName]);

                        form.appendChild(input);
                    }
                }
                form.submit();

            }, 0);

        }
    };
    w2popup.open({
        title: title,
        width: width,
        height: height,
        showMax: true,
        modal: false,
        body: wkFrame,
        onToggle: function (event) {
            event.onComplete = function () {
                w2ui.layout.resize();
            }
        },
        onClose: function (event) {
            callBack(event);
        }
    });
}

function ajaxErrorHandling(jqXHR, textStatus, errorThrown) {
    unlockScreen();
    if (jqXHR.status == 408) {
        w2alert("セッションの有効期限を過ぎました。", 'エラー').done(function () {
            window.location.href = baseUrl + "/login";
        });
    } else if (textStatus == 'timeout') {
        w2alert('現在サーバーが込み合っています。<br>時間を空けて再度処理を行ってください。', 'エラー');
    } else if (textStatus == 'cannotLock') {
        w2alert('現在のレコードはロックされています。', 'エラー');
    } else if (textStatus == 'cannotUnlock') {
        w2alert('現在の記録のロックを解除できません。', 'エラー');
    } else {
        w2alert('予期せぬエラーが発生しました。システム管理者に連絡してください。<br>TEL:999-9999-9999', 'エラー');
    }
}

function setAutoRefreshPage(refreshTab) {
    var refreshInterval = 30 * 60 * 1000;
    var bufferTime = 5000;
    clearTimeout(refreshPageEvery30Min);
    refreshPageEvery30Min = setTimeout(function () {
        loadTabContent(refreshTab);
    }, refreshInterval - bufferTime);
}

function executeScreenshot(contentEleId, config) {
    lockScreen('Screenshot...');
    config = config || {};
    var pagemainEle = $("#" + contentEleId);
    var option = {
        background: "#fafafa",
        scale: 1
    };
    html2canvas(document.getElementById(contentEleId), option).then(function (canvas) {
        for (var property in config) {
            if (config.hasOwnProperty(property)) {
                var cssObj = {};
                cssObj[property] = config[property];
                $(canvas).css(cssObj);
            }
        }
        var screenshotEle = $("#screenshot-review-dialog");
        screenshotEle.fadeIn(400);
        screenshotEle.append(canvas);
        unlockScreen();
    })
    $('#close-screenshot-dialog').click(function () {
        $("#screenshot-review-dialog").fadeOut(400);
        $("#screenshot-review-dialog canvas").remove();
    })
    $('#download-screenshot-capture').click(function () {
        var now = new Date();
        var year = now.getFullYear().toString(), month = now.getMonth().toString(),
            day = now.getDay().toString();
        var filename = 'Screenshot-' + year + '-' + month + '-' + day + '.png';
        saveAs($("#screenshot-review-dialog").find('canvas')[0], filename);
    })
}

function saveAs(canvasEle, filename) {
    var uri = canvasEle.toDataURL();
    var link = document.createElement('a');
    if(canvasEle.msToBlob) {
        // IE and Edge
        blob = canvasEle.msToBlob();
        window.navigator.msSaveBlob(blob, filename);
    } else if (typeof link.download === 'string') {
        link.href = uri;
        link.download = filename;
        //Firefox requires the link to be in the body
        document.body.appendChild(link);
        //simulate click
        link.click();
        //remove the link when done
        document.body.removeChild(link);
    } else {
        window.open(uri);
    }
}

function loadNextTabWhenOrder(tabName, uri) {
    markSelectedTab(tabName);
    isProcessOrdering = true;
    return doLoadTab(uri + siteNum).then(function () {
        lockScreen("loading...!");
        // $("#panelDiagramOrder #btnEdit").click()
    }).then(function () {
        unlockScreen();
    });
}

function orderShaftInOrderProcess() {
    var shaftOrdered;
    checkShaftOrdered(siteNum).then(function (value) {
        shaftOrdered = value;
    }).then(function () {
        if (shaftOrdered || structureDiagramDto.isShaft !== 1){
            unlockScreen();
            getDataPriceOrdering().then(function (value) {
                showPopupPriceOrder(value, orderProcessAccept);
            }).then(function () {
                unlockScreen();
            });
        } else {
            loadTabShaftCalculationOrderWhenOrder()
                .then(function () {
                    unlockScreen();
                    getLockDesignTable(siteNum, targetPageIdShaftCalculation, function () {
                        console.log("log table panel");
                    });
                }).then(function () {
                inEditMode = true;
            })
        }
    });
}
function doOrderProcess() {
    lockScreen('Loading...!');
    var nameTabOrdering = $(".choosemode").attr("name");
    var panelOrdered;
    var shaftOrdered;
    var selectOrderShaft = $("#is_shaft").attr('checked') == "checked";
    function setIsPanelOrdered(param) {
        panelOrdered = param
    };
    function setIsShaftOrdered(param) {
        shaftOrdered = param
    };
    switch (nameTabOrdering) {
            case "structureDiagramOrder":
                $(".orderstructurediagram").slideUp();
                $(".layoutmodal").slideUp();
                if (hasPanel) {
                    checkPanelOrdered(siteNum).then(function (value) {
                        setIsPanelOrdered(value);
                    }).then(function () {
                        if (panelOrdered) {
                            orderShaftInOrderProcess();
                        } else {
                            listOrderProcess.push("structureDiagramOrder");
                            loadNextTabWhenOrder("panelDiagramOrder", 'get-tab-view/panel-diagram?siteNum=')
                                .then(function () {
                                    unlockScreen();
                                    getLockDesignTable(siteNum, targetPageIdPanelDiagram, function () {
                                        console.log("log table panel");
                                    });
                                }).then(function () {
                                inEditMode = true;
                                checkShaftOrdered(siteNum).then(function (value) {
                                    if(selectOrderShaft && value == 0){
                                        $("#btnGoFrameCalculation").html("軸組計算の入力画面へ行く");
                                    } else {
                                        $("#btnGoFrameCalculation").html("依頼を確定する");
                                    }
                                });
                            })
                        }
                    });
                } else {
                    orderShaftInOrderProcess();
                }
                break;
            case "panelDiagramOrder":
                var validationErrorRequired = validateInvalidInputDataPanelDiagram();
                if (validationErrorRequired == true) {
                    if(listOrderProcess.length > 0) {
                        updatePanelWhenOrderProcessing().then(function () {
                            checkWishAtValid(siteNum, "panelDiagramOrder").then(function (value) {
                                if (value === true) {
                                    orderShaftInOrderProcess();
                                } else {
                                    unlockScreen();
                                    var errFields = [];
                                    errFields.push("「作業必要日数よりも短い日付の指定できません。」")
                                    showPopupError(errFields)
                                }
                            });
                        });
                    } else {
                        checkWishAtValid(siteNum, "panelDiagramOrder").then(function (value) {
                            if (value === true) {
                                orderShaftInOrderProcess();
                            } else {
                                unlockScreen();
                                var errFields = [];
                                errFields.push("「作業必要日数よりも短い日付の指定できません。」")
                                showPopupError(errFields)
                            }
                        });
                    }

                } else {
                    unlockScreen();
                    showPopupError(validationErrorRequired);
                }

                break;
            case "shaftCalculationOrder":
                var validationErrorRequired = validateRequiredFieldsShaftCalculation();
                if (validationErrorRequired === true) {
                    if(listOrderProcess.length > 0) {
                        updateShaftCalculationWhenOrderProcessing().then(function () {
                            checkWishAtValid(siteNum, "shaftCalculationOrder").then(function (value) {
                                if (value === true) {
                                    // Show popup confirm course cost
                                    getLockDesignTable(siteNum, targetPageIdShaftCalculation, function () {
                                        getDataPriceOrdering().then(function (value) {
                                            unlockScreen();
                                            showPopupPriceOrder(value, orderProcessAccept);
                                        });
                                    });
                                } else {
                                    unlockScreen();
                                    var errFields = [];
                                    errFields.push("「作業必要日数よりも短い日付の指定できません。」")
                                    showPopupError(errFields)
                                }
                            });
                        });
                    } else {
                        checkWishAtValid(siteNum, "shaftCalculationOrder").then(function (value) {
                            if (value === true) {
                                // Show popup confirm course cost
                                getLockDesignTable(siteNum, targetPageIdShaftCalculation, function () {
                                    getDataPriceOrdering().then(function (value) {
                                        unlockScreen();
                                        showPopupPriceOrder(value, orderProcessAccept);
                                    });
                                });
                            } else {
                                unlockScreen();
                                var errFields = [];
                                errFields.push("「作業必要日数よりも短い日付の指定できません。」")
                                showPopupError(errFields)
                            }
                        });
                    }
                } else {
                    unlockScreen();
                    showPopupError(validationErrorRequired);
                }
                break;
        }
}


function loadTabShaftCalculationOrderWhenOrder() {
    var nameTab= $(".choosemode").attr("name");
    switch (nameTab) {
        case "panelDiagramOrder":
            listOrderProcess.push("panelDiagramOrder");
        break;
        case "structureDiagramOrder":
            listOrderProcess.push("structureDiagramOrder");
            break;
    }
    return loadNextTabWhenOrder("shaftCalculationOrder", 'get-tab-view/shaft-calculation?siteNum=')
}

function cancelOrderProcess() {
    unlockTabsOrdering();
    loadTabContent();
    listOrderProcess = [];
}

function orderProcessAccept() {
    orderMultiTab(listOrderProcess, siteNum);
    unlockTabsOrdering();
    listOrderProcess = [];
}
function unlockTabsOrdering() {
    var nameTab = $(".choosemode").attr("name");
    if (nameTab == "panelDiagramOrder") {
        releaseLockDesignTable(siteNum, targetPageIdPanelDiagram, null);
    }
    if (nameTab == "shaftCalculationOrder") {
        releaseLockDesignTable(siteNum, targetPageIdShaftCalculation, null);
    }
    for (count = 0; count < listOrderProcess.length; count++) {
        switch (listOrderProcess[count]) {
            case "structureDiagramOrder":
                releaseLockDesignTable(siteNum, targetPageIdStructureDiagram, null);
                break;
            case "panelDiagramOrder":
                releaseLockDesignTable(siteNum, targetPageIdPanelDiagram, null);
                break;
            case "shaftCalculationOrder":
                releaseLockDesignTable(siteNum, targetPageIdShaftCalculation, null);
                break;
        }
    }
}
 function getDataPriceOrdering() {
    var promise = new Promise(function (resolve,reject) {
        var dataPriceOrder={};
        function getData(d) {
            listOrderProcess.forEach(function (elm) {
                switch (elm) {
                    case "structureDiagramOrder":
                        dataPriceOrder["構造図費用"] = d.structureDiagramPrice;
                        break;
                    case "panelDiagramOrder":
                        dataPriceOrder["パネル図"] = d.panelPrice;
                        break;
                    case "shaftCalculationOrder":
                        dataPriceOrder["軸組費用"] = d.shaftPrice;
                        break;
                }
            })
            dataPriceOrder["合計費用"] = d.totalPrice;
            resolve(dataPriceOrder);
        }
        getPriceOrder(listOrderProcess,siteNum, getData);
    })

     return promise
 }
function checkPanelOrdered(siteNum) {
    var promise = new Promise(function (resolve , reject ) {
        $.ajax({
            type: "GET",
            contentType: "application/json",
            url: "check-panel-ordered?siteNum=" + siteNum,
            dataType: 'json',
            cache: false,
            timeout: 600000,
            success: function (d) {
                resolve(d);
            },
            error: function (jqXHR, textStatus, errorThrown) {
                ajaxErrorHandling(jqXHR, textStatus, errorThrown);
            }
        });
    });
    return promise;
}

function formatRequest(listTab, siteNum) {
    var result = "siteNum=" + siteNum;
    listTab.forEach(function (elm) {
        result += "&listTab=" + elm
    })
    return result;
}

function getPriceOrder(listTab, siteNum, callBack) {
    callBack = callBack || function(){}
    var nameTab= $(".choosemode").attr("name");
    var listRequest = [];
    listRequest = listTab;
    listRequest.push(nameTab);
    var modelRequest = formatRequest(listRequest,siteNum);

    $.ajax({
        type: "GET",
        contentType: "application/json",
        url: "price-order?" + modelRequest,
        dataType: 'json',
        cache: false,
        timeout: 600000,
        success: function (d) {
            callBack(d);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            ajaxErrorHandling(jqXHR, textStatus, errorThrown);
        }
    });
}

function checkShaftOrdered(siteNum) {
    var promise = new Promise(function (resolve,reject) {
        $.ajax({
            type: "GET",
            contentType: "application/json",
            url: "check-shaft-ordered?siteNum=" + siteNum,
            dataType: 'json',
            cache: false,
            timeout: 600000,
            success: function (d) {
               resolve(d)
            },
            error: function (jqXHR, textStatus, errorThrown) {
                ajaxErrorHandling(jqXHR, textStatus, errorThrown);
            }
        });
    });
    return promise;
}

function addFielderror(value, errFields) {
    if (!value) {
        errFields.push("「作業必要日数よりも短い日付の指定できません。」");
    }
}


function checkWishAtToSave(date, tab, callback) {
    if(date) {
        var d = new Date();
        var wishAt = formatDateTime(date,"-") + " " + formatDateTime(d.toLocaleTimeString('en-US', {hour12: false}),":");
        $.ajax({
            type: "GET",
            contentType: "application/json",
            url: "date-is-saved?wishAt=" + wishAt + "&tabOrder=" + tab,
            dataType: 'json',
            cache: false,
            async: false,
            timeout: 600000,
            success: function (result) {
                callback(result);
            },
            error: function (jqXHR, textStatus, errorThrown) {
                ajaxErrorHandling(jqXHR, textStatus, errorThrown);
            }
        });
    } else {
        callback(true);
    }
}
function backTabWhenOrder(){
    var lastTabOrder = listOrderProcess[listOrderProcess.length -1]
    switch(lastTabOrder){
        case "structureDiagramOrder":
            var listFieldRequire;
            var tabIsChooseMode = $(".choosemode").attr("name");
            if (tabIsChooseMode == "panelDiagramOrder") {
                listFieldRequire = validateInvalidInputDataPanelDiagram();
                if (listFieldRequire.length > 0) {
                    showPopupWarning(listFieldRequire, function () {
                        releaseLockDesignTable(siteNum, targetPageIdPanelDiagram, updatePanelWhenOrderProcessing).then(function () {
                            loadTabContent();
                        });
                        listOrderProcess = [];
                    });
                } else {
                    releaseLockDesignTable(siteNum, targetPageIdPanelDiagram, updatePanelWhenOrderProcessing).then(function () {
                        loadTabContent();
                    });
                    listOrderProcess = [];
                }
            } else {
                listFieldRequire = validateInvalidInputDataShaftCalculation();
                if (listFieldRequire.length > 0) {
                    showPopupWarning(listFieldRequire, function () {
                        releaseLockDesignTable(siteNum, targetPageIdPanelDiagram, updateShaftCalculationWhenOrderProcessing()).then(function () {
                            loadTabContent();
                        });
                        listOrderProcess = [];
                    });
                } else {
                    releaseLockDesignTable(siteNum, targetPageIdPanelDiagram, updateShaftCalculationWhenOrderProcessing).then(function () {
                        loadTabContent();
                    });
                    listOrderProcess = [];
                }
            }

            break;
        case "panelDiagramOrder":
            listOrderProcess.pop();
            lockScreen('Loading...!');
            releaseLockDesignTable(siteNum, targetPageIdShaftCalculation, updateShaftCalculationWhenOrderProcessing).then(function () {
                loadNextTabWhenOrder("panelDiagramOrder", 'get-tab-view/panel-diagram?siteNum=');
            }).then(function () {
            unlockScreen();
            });
            break;
    }
}
function removeItemListOrderProcess() {
    var nameTab= $(".choosemode").attr("name");
    if(listOrderProcess.length >0){
        switch (nameTab) {
            case "panelDiagramOrder":
               var index_panelDiagramOrder = listOrderProcess.indexOf("panelDiagramOrder");
               if (index_panelDiagramOrder >= 0) {
                   listOrderProcess.splice(index_panelDiagramOrder, 1);
               }
               break;
            case "shaftCalculationOrder":
                var index_shaftCalculationOrder = listOrderProcess.indexOf("shaftCalculationOrder");
                if (index_shaftCalculationOrder >= 0) {
                    listOrderProcess.splice(index_shaftCalculationOrder, 1);
                }
                break;
            case "structureDiagramOrder":
                var index_structureDiagramOrder = listOrderProcess.indexOf("structureDiagramOrder");
                if (index_structureDiagramOrder >= 0) {
                    listOrderProcess.splice(index_structureDiagramOrder, 1);
                }
                break;
        }
    }
}
function getDateTimeValue(date,prefix,dto){
    if(dto){
        date.forEach(function (elm) {
            switch (elm) {
                case prefix + '_planned_date':
                    dateTime[elm] = dto["plannedAt"];
                    break;
                case prefix + '_wish_date':
                    dateTime[elm] = dto["wishAt"];
                    break;
            }
            $('#' + elm).on('change', function () {
                var d = new Date();
                if($('#' + elm)[0].value === ""){
                    dateTime[elm] = null;
                }else {
                    dateTime[elm] = formatDateTime($('#' + elm)[0].value,"-") + "T" + formatDateTime(d.toLocaleTimeString('en-US', {hour12: false}),":") + "." + d.getMilliseconds().toString();
                }
            })
        })
    }
}
function formatDateTime(dateValue, key) {
    var dateArray = dateValue.split(/\D/);
    var newdate = "";
    dateArray.forEach(function (elm) {
       if(elm !== ""){
           newdate += elm + key
       }
    });
    return newdate.substring(0,newdate.length-1);
}
function deleteDateTimeValue(){
    dateTime={};
}
function syncInputOrderProcess(){
    $(".tabpage_topleft .sycnOrderProcess").each(function(){
        if(this.checked){
            var syncId = $(this).parent().parent().attr('syncID');
            switch (this.value) {
                case "0":
                    $(".orderstructurediagram" + " #"+syncId).prop("checked", false);
                    break;
                case "1":
                    $(".orderstructurediagram" + " #"+syncId).prop("checked", true);
                    break;
            }
        }
    });
}
function openFormvalidateDateFielt(fieldID){
    var promise = new Promise(function (resolve, reject) {
        $("#field-error-layout").slideDown();
        $("#characters-error-dialog").slideDown();
        $("#error_date_except").unbind().bind('click',function () {
            $("#field-error-layout").slideUp();
            $("#characters-error-dialog").slideUp();
            $("#input-datefield-backdrop").hide();
            $('#'+ fieldID).click();
            $(this).unbind();
        })
    });
    return promise;
}

function getLockDesignTable(siteNum, targetPageId, callback, paramCallBack) {
    lockScreen('Checking lock...');
    var promise = new Promise(function (resolve, reject) {
        var url = baseUrl + "/api/lock-design-table";
        var lockData = new Object();
        lockData.siteNum = siteNum;
        lockData.targetPageId = targetPageId;

        $.ajax({
            url: url,
            method: 'POST',
            type: 'POST',
            data: JSON.stringify(lockData),
            contentType: 'application/json',
            dataType: 'json',
            cache: false,
            processData: false,
            success: function (data, textStatus, xhr) {
                unlockScreen();
                if (xhr.status == 200) {
                    if (paramCallBack) {
                        callback(paramCallBack);
                    } else {
                        callback();
                    }

                } else {
                    ajaxErrorHandling(xhr, 'cannotLock', '');
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                ajaxErrorHandling(jqXHR, textStatus, errorThrown);
            }
        });

        resolve();
    });

    return promise;
}

function releaseLockDesignTable(siteNum, targetPageId, callback) {
    var promise = new Promise(function (resolve, reject) {
        var url = baseUrl + "/api/unlock-design-table";
        var lockData = new Object();
        lockData.siteNum = siteNum;
        lockData.targetPageId = targetPageId;
        lockScreen('Checking lock...');

        $.ajax({
            url: url,
            method: 'POST',
            type: 'POST',
            data: JSON.stringify(lockData),
            contentType: 'application/json',
            dataType: 'json',
            cache: false,
            processData: false,
            success: function (data, textStatus, xhr) {
                unlockScreen();
                if (xhr.status == 200) {
                    if (callback) {
                        callback();
                    }
                } else {
                    ajaxErrorHandling(xhr, 'cannotUnlock', '');
                }
                resolve();
            },
            error: function (jqXHR, textStatus, errorThrown) {
                ajaxErrorHandling(jqXHR, textStatus, errorThrown);
            }
        });


    });

    return promise;
}

function setBackGroundCurrentTab(tabName,value) {
    $(".tabMenu").each(function () {
        if($(this).attr('name') == tabName){
            if (!$(this).hasClass('choosemode')) {
                if(value[tabName] == '未依頼'){
                    $(this).removeClass("choosemode");
                    $(this).removeClass("tab_backGround_2");
                    $(this).addClass("tab_backGround_1");
                }else {
                    $(this).removeClass("choosemode");
                    $(this).removeClass("tab_backGround_1");
                    $(this).addClass("tab_backGround_2");
                    if(value[tabName] == false){
                        $(this).removeClass("choosemode");
                        $(this).addClass("tab_backGround_1");
                        $(this).removeClass("tab_backGround_2");
                    }
                }

            }else {
                $(this).removeClass("tab_backGround_1");
                $(this).removeClass("tab_backGround_2");
            }
        }

    });
}

function setBackgroundTab() {
    getCurrentStatusAllTab().then(function (value) {
        var tabNameSattus = Object.keys(value);
        tabNameSattus.forEach(function (elm) {
            switch (elm) {
                case "cadStructureDiagramOffer":
                    setBackGroundCurrentTab('cadStructureDiagramOffer',value);
                case "ironGoodsOffer":
                    setBackGroundCurrentTab('ironGoodsOffer',value);
                case "shaftCalculationOrder":
                    setBackGroundCurrentTab('shaftCalculationOrder',value);
                case "ventilationCalculationOrder":
                    setBackGroundCurrentTab('ventilationCalculationOrder',value);
                case "structureDiagramOrder":
                    setBackGroundCurrentTab('structureDiagramOrder',value);
                case "precutOffer":
                    setBackGroundCurrentTab('precutOffer',value);
                case "buildingSkinCalculationOrder":
                    setBackGroundCurrentTab("buildingSkinCalculationOrder",value);
                case "foundationPlanOrder":
                    setBackGroundCurrentTab('foundationPlanOrder',value);
                case "structureCalculationOrder":
                    setBackGroundCurrentTab('structureCalculationOrder',value);
                case "panelDiagramOrder":
                    setBackGroundCurrentTab('panelDiagramOrder',value);
                case "unitRebar":
                    setBackGroundCurrentTab('unitRebar',value);
        }})
    })
}
function getCurrentStatusAllTab(){
    var promise = new Promise(function (resolve, reject) {
        $.ajax({
            type: "GET",
            contentType: "application/json",
            url: baseUrl +"/status-all-tab?siteNum=" + siteNum,
            cache: false,
            timeout: 600000,
            success: function (d) {
                resolve(d);
            },
            error: function (jqXHR, textStatus, errorThrown) {
                ajaxErrorHandling(jqXHR, textStatus, errorThrown);
            }
        });
    });

    return promise;
};

console.log("Loaded dms_site js");
