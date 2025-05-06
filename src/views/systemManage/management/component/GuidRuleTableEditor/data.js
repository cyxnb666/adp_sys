
export const tableData = {
    "decisionTableId": "0bda35f7d105431dbca7b3be43069f72",
    "decisionTableName": "复杂.xlsx",
    "decisionRepCatalogueId": "cd8a554afa7649e09dd1d17b4f5194e5",
    "ruleDefinedEdit": {
        "id": "37305d5c9e7d4177a025b884bee49254",
        "ruleId": "SINOSIG_0000523",
        "ruleName": null,
        "ruleContent": "{\"label\":\"是\",\"code\":\"STR_EQ\",\"nodeType\":\"COMPARISON\",\"returnType\":\"boolean\",\"left\":{\"field\":\"maincarkindcode\",\"fieldPath\":\"bomRenewPolicy.prptitemcar.maincarkindcode\",\"key\":\"maincarkindcode\",\"label\":\"被续保单对象的车辆信息的车辆大类\",\"type\":\"string\",\"actualTypes\":null,\"actualTypeNames\":null,\"bomModelDetailId\":null,\"classPath\":\"com.company.ruleapp.bom.Prptitemcar\",\"codeService\":\"\",\"value\":null,\"children\":null,\"collectionType\":null,\"dataType\":\"field\",\"path\":\".left\",\"requiredField\":false,\"fieldId\":\"2cac4c495f524e13b68a77a88239bd71\",\"detailsList\":null,\"preDefine\":null,\"afield\":true,\"returnType\":\"string\",\"nodeType\":\"FIELD\"},\"right\":{\"type\":\"input\",\"nodeType\":\"CUSTOM\",\"returnType\":\"string\",\"paramValue\":\"123\",\"path\":\".right\"},\"path\":\"\"}",
        "ruleDesc": "<span class=\"fields\"> 被续保单对象的车辆信息的车辆大类 </span> 是 <span class=\"values\">123</span>",
        "ruleTips": null,
        "allowEdit": true,
        "existPath": false,
        "allowDelete": true,
        "ruleDefinedParams": null,
        "codeServices": [],
        "expressionIds": [],
        "predefineDTO": null,
        "methods": null,
        "path": null,
        "decisionTableId": null
    },
    "decisionTableComplexHeaderContentDTOList": [
        {
            "rule": null,
            "columns": [
                [
                    {
                        "decisionTableId": "0bda35f7d105431dbca7b3be43069f72",
                        "cellAddress": "A3",
                        "rowNum": 3,
                        "columnNum": "A",
                        "cellType": "NUMERIC",
                        "cellValue": "a1",
                        "formula": null,
                        "alias": null,
                        "valueType": null,
                        "headerRule": null,
                        "frontX": "00",
                        "frontY": "A"
                    },
                ],
                [
                    {
                        "decisionTableId": "0bda35f7d105431dbca7b3be43069f72",
                        "cellAddress": "A4",
                        "rowNum": 4,
                        "columnNum": "A",
                        "cellType": "NUMERIC",
                        "cellValue": "1",
                        "formula": null,
                        "alias": null,
                        "valueType": null,
                        "headerRule": null,
                        "frontX": "10",
                        "frontY": "A"
                    },
                ],
                [
                    {
                        "decisionTableId": "0bda35f7d105431dbca7b3be43069f72",
                        "cellAddress": "A5",
                        "rowNum": 5,
                        "columnNum": "A",
                        "cellType": "NUMERIC",
                        "cellValue": "2",
                        "formula": null,
                        "alias": null,
                        "valueType": null,
                        "headerRule": null,
                        "frontX": "20",
                        "frontY": "A"
                    },
                ],
                [
                    {
                        "decisionTableId": "0bda35f7d105431dbca7b3be43069f72",
                        "cellAddress": "A6",
                        "rowNum": 6,
                        "columnNum": "A",
                        "cellType": "NUMERIC",
                        "cellValue": "3",
                        "formula": null,
                        "alias": null,
                        "valueType": null,
                        "headerRule": null,
                        "frontX": "30",
                        "frontY": "A"
                    }
                ]
            ],
            "headers": [
                {
                    "decisionTableId": "0bda35f7d105431dbca7b3be43069f72",
                    "cellAddress": "A1",
                    "rowNum": 1,
                    "columnNum": "A",
                    "cellType": "STRING",
                    "cellValue": "被续保单对象_基本信息_保单号",
                    "formula": null,
                    "alias": null,
                    "valueType": null,
                    "headerRule": null,
                    "frontX": null,
                    "frontY": null
                },
                {
                    "decisionTableId": "0bda35f7d105431dbca7b3be43069f72",
                    "cellAddress": "A2",
                    "rowNum": 2,
                    "columnNum": "A",
                    "cellType": "STRING",
                    "cellValue": "【条件列】等于=",
                    "formula": null,
                    "alias": null,
                    "valueType": null,
                    "headerRule": null,
                    "frontX": null,
                    "frontY": null
                }
            ],
            "dtFieldPathMappings": [
                {
                    "decisionTableId": "0bda35f7d105431dbca7b3be43069f72",
                    "dtFieldMappingId": "87fe2e86fca34275aa6b0b9b9d6f888a",
                    "columnType": "0",
                    "headName": "被续保单对象_基本信息_保单号",
                    "fieldName": "被续保单对象",
                    "fieldPath": "bomRenewPolicy",
                    "fieldType": "object"
                },
                {
                    "decisionTableId": "0bda35f7d105431dbca7b3be43069f72",
                    "dtFieldMappingId": "41581f6f133444cc8b9472cd82105875",
                    "columnType": "0",
                    "headName": "被续保单对象_基本信息_保单号",
                    "fieldName": "基本信息",
                    "fieldPath": "bomRenewPolicy.prptmain",
                    "fieldType": "object"
                },
                {
                    "decisionTableId": "0bda35f7d105431dbca7b3be43069f72",
                    "dtFieldMappingId": "05008dac7ea445ceb2f6884a730eb61d",
                    "columnType": "0",
                    "headName": "被续保单对象_基本信息_保单号",
                    "fieldName": "保单号",
                    "fieldPath": "bomRenewPolicy.prptmain.policyNo",
                    "fieldType": "string"
                }
            ]
        },
        {
            "rule": null,
            "columns": [
                [
                    {
                        "decisionTableId": "0bda35f7d105431dbca7b3be43069f72",
                        "cellAddress": "B3",
                        "rowNum": 3,
                        "columnNum": "B",
                        "cellType": "NUMERIC",
                        "cellValue": "0",
                        "formula": null,
                        "alias": null,
                        "valueType": null,
                        "headerRule": null,
                        "frontX": "B",
                        "frontY": "00"
                    },
                ],
                [
                    {
                        "decisionTableId": "0bda35f7d105431dbca7b3be43069f72",
                        "cellAddress": "B4",
                        "rowNum": 4,
                        "columnNum": "B",
                        "cellType": "NUMERIC",
                        "cellValue": "1",
                        "formula": null,
                        "alias": null,
                        "valueType": null,
                        "headerRule": null,
                        "frontX": "B",
                        "frontY": "10"
                    },
                ],
                [
                    {
                        "decisionTableId": "0bda35f7d105431dbca7b3be43069f72",
                        "cellAddress": "B5",
                        "rowNum": 5,
                        "columnNum": "B",
                        "cellType": "NUMERIC",
                        "cellValue": "2",
                        "formula": null,
                        "alias": null,
                        "valueType": null,
                        "headerRule": null,
                        "frontX": "B",
                        "frontY": "20"
                    },
                ],
                [
                    {
                        "decisionTableId": "0bda35f7d105431dbca7b3be43069f72",
                        "cellAddress": "B6",
                        "rowNum": 6,
                        "columnNum": "B",
                        "cellType": "NUMERIC",
                        "cellValue": "3",
                        "formula": null,
                        "alias": null,
                        "valueType": null,
                        "headerRule": null,
                        "frontX": "B",
                        "frontY": "30"
                    }
                ]
            ],
            "headers": [
                {
                    "decisionTableId": "0bda35f7d105431dbca7b3be43069f72",
                    "cellAddress": "B1",
                    "rowNum": 1,
                    "columnNum": "B",
                    "cellType": "STRING",
                    "cellValue": "被续保单对象_基本信息_代理协议号",
                    "formula": null,
                    "alias": null,
                    "valueType": null,
                    "headerRule": null,
                    "frontX": null,
                    "frontY": null
                },
                {
                    "decisionTableId": "0bda35f7d105431dbca7b3be43069f72",
                    "cellAddress": "B2",
                    "rowNum": 2,
                    "columnNum": "B",
                    "cellType": "STRING",
                    "cellValue": "【条件列】等于=",
                    "formula": null,
                    "alias": null,
                    "valueType": null,
                    "headerRule": null,
                    "frontX": null,
                    "frontY": null
                }
            ],
            "dtFieldPathMappings": [
                {
                    "decisionTableId": "0bda35f7d105431dbca7b3be43069f72",
                    "dtFieldMappingId": "ce97bb716d634c3793d1d0eada1cd17e",
                    "columnType": "0",
                    "headName": "被续保单对象_基本信息_代理协议号",
                    "fieldName": "代理协议号",
                    "fieldPath": "bomRenewPolicy.prptmain.agreeMentNo",
                    "fieldType": "string"
                }
            ]
        },
        {
            "rule": null,
            "columns": [
                [
                    {
                        "decisionTableId": "0bda35f7d105431dbca7b3be43069f72",
                        "cellAddress": "C3",
                        "rowNum": 3,
                        "columnNum": "C",
                        "cellType": "STRING",
                        "cellValue": "00",
                        "formula": null,
                        "alias": null,
                        "valueType": null,
                        "headerRule": null,
                        "frontX": "00",
                        "frontY": "C"
                    },
                    {
                        "decisionTableId": "0bda35f7d105431dbca7b3be43069f72",
                        "cellAddress": "D3",
                        "rowNum": 3,
                        "columnNum": "D",
                        "cellType": "STRING",
                        "cellValue": "01",
                        "formula": null,
                        "alias": null,
                        "valueType": null,
                        "headerRule": null,
                        "frontX": "01",
                        "frontY": "C"
                    },
                    {
                        "decisionTableId": "0bda35f7d105431dbca7b3be43069f72",
                        "cellAddress": "E3",
                        "rowNum": 3,
                        "columnNum": "E",
                        "cellType": "STRING",
                        "cellValue": "02",
                        "formula": null,
                        "alias": null,
                        "valueType": null,
                        "headerRule": null,
                        "frontX": "02",
                        "frontY": "C"
                    },
                    {
                        "decisionTableId": "0bda35f7d105431dbca7b3be43069f72",
                        "cellAddress": "F3",
                        "rowNum": 3,
                        "columnNum": "F",
                        "cellType": "STRING",
                        "cellValue": "03",
                        "formula": null,
                        "alias": null,
                        "valueType": null,
                        "headerRule": null,
                        "frontX": "03",
                        "frontY": "C"
                    },
                ],
                [
                    {
                        "decisionTableId": "0bda35f7d105431dbca7b3be43069f72",
                        "cellAddress": "C4",
                        "rowNum": 4,
                        "columnNum": "C",
                        "cellType": "STRING",
                        "cellValue": "10",
                        "formula": null,
                        "alias": null,
                        "valueType": null,
                        "headerRule": null,
                        "frontX": "10",
                        "frontY": "C"
                    },
                    {
                        "decisionTableId": "0bda35f7d105431dbca7b3be43069f72",
                        "cellAddress": "D4",
                        "rowNum": 4,
                        "columnNum": "D",
                        "cellType": "STRING",
                        "cellValue": "11",
                        "formula": null,
                        "alias": null,
                        "valueType": null,
                        "headerRule": null,
                        "frontX": "11",
                        "frontY": "C"
                    },
                    {
                        "decisionTableId": "0bda35f7d105431dbca7b3be43069f72",
                        "cellAddress": "E4",
                        "rowNum": 4,
                        "columnNum": "E",
                        "cellType": "STRING",
                        "cellValue": "12",
                        "formula": null,
                        "alias": null,
                        "valueType": null,
                        "headerRule": null,
                        "frontX": "12",
                        "frontY": "C"
                    },
                    {
                        "decisionTableId": "0bda35f7d105431dbca7b3be43069f72",
                        "cellAddress": "F4",
                        "rowNum": 4,
                        "columnNum": "F",
                        "cellType": "STRING",
                        "cellValue": "13",
                        "formula": null,
                        "alias": null,
                        "valueType": null,
                        "headerRule": null,
                        "frontX": "13",
                        "frontY": "C"
                    },
                ],
                [
                    {
                        "decisionTableId": "0bda35f7d105431dbca7b3be43069f72",
                        "cellAddress": "C5",
                        "rowNum": 5,
                        "columnNum": "C",
                        "cellType": "STRING",
                        "cellValue": "20",
                        "formula": null,
                        "alias": null,
                        "valueType": null,
                        "headerRule": null,
                        "frontX": "20",
                        "frontY": "C"
                    },
                    {
                        "decisionTableId": "0bda35f7d105431dbca7b3be43069f72",
                        "cellAddress": "D5",
                        "rowNum": 5,
                        "columnNum": "D",
                        "cellType": "STRING",
                        "cellValue": "21",
                        "formula": null,
                        "alias": null,
                        "valueType": null,
                        "headerRule": null,
                        "frontX": "21",
                        "frontY": "C"
                    },
                    
                    {
                        "decisionTableId": "0bda35f7d105431dbca7b3be43069f72",
                        "cellAddress": "E5",
                        "rowNum": 5,
                        "columnNum": "E",
                        "cellType": "STRING",
                        "cellValue": "22",
                        "formula": null,
                        "alias": null,
                        "valueType": null,
                        "headerRule": null,
                        "frontX": "22",
                        "frontY": "C"
                    },
                    {
                        "decisionTableId": "0bda35f7d105431dbca7b3be43069f72",
                        "cellAddress": "F5",
                        "rowNum": 5,
                        "columnNum": "F",
                        "cellType": "STRING",
                        "cellValue": "23",
                        "formula": null,
                        "alias": null,
                        "valueType": null,
                        "headerRule": null,
                        "frontX": "23",
                        "frontY": "C"
                    },
                ],
                [
                    {
                        "decisionTableId": "0bda35f7d105431dbca7b3be43069f72",
                        "cellAddress": "C6",
                        "rowNum": 6,
                        "columnNum": "C",
                        "cellType": "STRING",
                        "cellValue": "30",
                        "formula": null,
                        "alias": null,
                        "valueType": null,
                        "headerRule": null,
                        "frontX": "30",
                        "frontY": "C"
                    },
                    {
                        "decisionTableId": "0bda35f7d105431dbca7b3be43069f72",
                        "cellAddress": "D6",
                        "rowNum": 6,
                        "columnNum": "D",
                        "cellType": "STRING",
                        "cellValue": "31",
                        "formula": null,
                        "alias": null,
                        "valueType": null,
                        "headerRule": null,
                        "frontX": "31",
                        "frontY": "C"
                    },
                    {
                        "decisionTableId": "0bda35f7d105431dbca7b3be43069f72",
                        "cellAddress": "E6",
                        "rowNum": 6,
                        "columnNum": "E",
                        "cellType": "STRING",
                        "cellValue": "32",
                        "formula": null,
                        "alias": null,
                        "valueType": null,
                        "headerRule": null,
                        "frontX": "32",
                        "frontY": "C"
                    },
                    {
                        "decisionTableId": "0bda35f7d105431dbca7b3be43069f72",
                        "cellAddress": "F6",
                        "rowNum": 6,
                        "columnNum": "F",
                        "cellType": "STRING",
                        "cellValue": "33",
                        "formula": null,
                        "alias": null,
                        "valueType": null,
                        "headerRule": null,
                        "frontX": "33",
                        "frontY": "C"
                    }
                ]
            ],
            "headers": [
                {
                    "decisionTableId": "0bda35f7d105431dbca7b3be43069f72",
                    "cellAddress": "C1",
                    "rowNum": 1,
                    "columnNum": "C",
                    "cellType": "STRING",
                    "cellValue": "被续保单对象_车辆信息_车架号>=%s&&被续保单对象_车辆信息_车牌号<=%s&&被续保单对象_车辆信息_实际使用年数>%s&&被续保单对象_车辆信息_车辆大类==%s",
                    "formula": null,
                    "alias": null,
                    "valueType": null,
                    "headerRule": null,
                    "frontX": null,
                    "frontY": null
                },
                {
                    "decisionTableId": "0bda35f7d105431dbca7b3be43069f72",
                    "cellAddress": "C2",
                    "rowNum": 2,
                    "columnNum": "C",
                    "cellType": "STRING",
                    "cellValue": "【数据列】",
                    "formula": null,
                    "alias": null,
                    "valueType": null,
                    "headerRule": null,
                    "frontX": null,
                    "frontY": null
                },
                {
                    "decisionTableId": "0bda35f7d105431dbca7b3be43069f72",
                    "cellAddress": "D1",
                    "rowNum": 1,
                    "columnNum": "D",
                    "cellType": "STRING",
                    "cellValue": "被续保单对象_车辆信息_车架号==%s&&被续保单对象_车辆信息_车牌号==%s&&被续保单对象_车辆信息_实际使用年数==%s&&被续保单对象_车辆信息_车辆大类==%s",
                    "formula": null,
                    "alias": null,
                    "valueType": null,
                    "headerRule": null,
                    "frontX": null,
                    "frontY": null
                },
                {
                    "decisionTableId": "0bda35f7d105431dbca7b3be43069f72",
                    "cellAddress": "D2",
                    "rowNum": 2,
                    "columnNum": "D",
                    "cellType": "STRING",
                    "cellValue": "【数据列】",
                    "formula": null,
                    "alias": null,
                    "valueType": null,
                    "headerRule": null,
                    "frontX": null,
                    "frontY": null
                },
                {
                    "decisionTableId": "0bda35f7d105431dbca7b3be43069f72",
                    "cellAddress": "E1",
                    "rowNum": 1,
                    "columnNum": "E",
                    "cellType": "STRING",
                    "cellValue": "被续保单对象_车辆信息_车架号==%s&&被续保单对象_车辆信息_车牌号==%s&&被续保单对象_车辆信息_实际使用年数==%s&&被续保单对象_车辆信息_车辆大类==%s",
                    "formula": null,
                    "alias": null,
                    "valueType": null,
                    "headerRule": null,
                    "frontX": null,
                    "frontY": null
                },
                {
                    "decisionTableId": "0bda35f7d105431dbca7b3be43069f72",
                    "cellAddress": "E2",
                    "rowNum": 2,
                    "columnNum": "E",
                    "cellType": "STRING",
                    "cellValue": "【数据列】",
                    "formula": null,
                    "alias": null,
                    "valueType": null,
                    "headerRule": null,
                    "frontX": null,
                    "frontY": null
                },
                {
                    "decisionTableId": "0bda35f7d105431dbca7b3be43069f72",
                    "cellAddress": "F1",
                    "rowNum": 1,
                    "columnNum": "F",
                    "cellType": "STRING",
                    "cellValue": "被续保单对象_车辆信息_车架号==%s&&被续保单对象_车辆信息_车牌号==%s&&被续保单对象_车辆信息_实际使用年数==%s&&被续保单对象_车辆信息_车辆大类==%s",
                    "formula": null,
                    "alias": null,
                    "valueType": null,
                    "headerRule": null,
                    "frontX": null,
                    "frontY": null
                },
                {
                    "decisionTableId": "0bda35f7d105431dbca7b3be43069f72",
                    "cellAddress": "F2",
                    "rowNum": 2,
                    "columnNum": "F",
                    "cellType": "STRING",
                    "cellValue": "【数据列】",
                    "formula": null,
                    "alias": null,
                    "valueType": null,
                    "headerRule": null,
                    "frontX": null,
                    "frontY": null
                }
            ],
            "dtFieldPathMappings": [
                {
                    "decisionTableId": "0bda35f7d105431dbca7b3be43069f72",
                    "dtFieldMappingId": "fa76dc8bd2374df79db98acbcca8ce13",
                    "columnType": "2",
                    "headName": "被续保单对象_车辆信息_车牌号",
                    "fieldName": "车牌号",
                    "fieldPath": "bomRenewPolicy.prptitemcar.licenseNo",
                    "fieldType": "string"
                },
                {
                    "decisionTableId": "0bda35f7d105431dbca7b3be43069f72",
                    "dtFieldMappingId": "cf0cdb8dd1c3452d918d2320c4a6ec61",
                    "columnType": "2",
                    "headName": "被续保单对象_车辆信息_车辆大类",
                    "fieldName": "车辆大类",
                    "fieldPath": "bomRenewPolicy.prptitemcar.maincarkindcode",
                    "fieldType": "string"
                },
                {
                    "decisionTableId": "0bda35f7d105431dbca7b3be43069f72",
                    "dtFieldMappingId": "6d3ff96cf034497aa3f83c76f20b1163",
                    "columnType": "2",
                    "headName": "被续保单对象_车辆信息_实际使用年数",
                    "fieldName": "实际使用年数",
                    "fieldPath": "bomRenewPolicy.prptitemcar.useYears",
                    "fieldType": "double"
                },
                {
                    "decisionTableId": "0bda35f7d105431dbca7b3be43069f72",
                    "dtFieldMappingId": "ca43446893914414b7a3b15a3a3c5c50",
                    "columnType": "2",
                    "headName": "被续保单对象_车辆信息_车架号",
                    "fieldName": "车辆信息",
                    "fieldPath": "bomRenewPolicy.prptitemcar",
                    "fieldType": "object"
                },
                {
                    "decisionTableId": "0bda35f7d105431dbca7b3be43069f72",
                    "dtFieldMappingId": "01062bbcd4b1439d87082fb54347e2e5",
                    "columnType": "2",
                    "headName": "被续保单对象_车辆信息_车架号",
                    "fieldName": "车架号",
                    "fieldPath": "bomRenewPolicy.prptitemcar.frameNo",
                    "fieldType": "string"
                },
                {
                    "decisionTableId": "0bda35f7d105431dbca7b3be43069f72",
                    "dtFieldMappingId": "cf0cdb8dd1c3452d918d2320c4a6ec61",
                    "columnType": "2",
                    "headName": "被续保单对象_车辆信息_车辆大类",
                    "fieldName": "车辆大类",
                    "fieldPath": "bomRenewPolicy.prptitemcar.maincarkindcode",
                    "fieldType": "string"
                },
                {
                    "decisionTableId": "0bda35f7d105431dbca7b3be43069f72",
                    "dtFieldMappingId": "6d3ff96cf034497aa3f83c76f20b1163",
                    "columnType": "2",
                    "headName": "被续保单对象_车辆信息_实际使用年数",
                    "fieldName": "实际使用年数",
                    "fieldPath": "bomRenewPolicy.prptitemcar.useYears",
                    "fieldType": "double"
                },
                {
                    "decisionTableId": "0bda35f7d105431dbca7b3be43069f72",
                    "dtFieldMappingId": "ca43446893914414b7a3b15a3a3c5c50",
                    "columnType": "2",
                    "headName": "被续保单对象_车辆信息_车架号",
                    "fieldName": "车辆信息",
                    "fieldPath": "bomRenewPolicy.prptitemcar",
                    "fieldType": "object"
                },
                {
                    "decisionTableId": "0bda35f7d105431dbca7b3be43069f72",
                    "dtFieldMappingId": "01062bbcd4b1439d87082fb54347e2e5",
                    "columnType": "2",
                    "headName": "被续保单对象_车辆信息_车架号",
                    "fieldName": "车架号",
                    "fieldPath": "bomRenewPolicy.prptitemcar.frameNo",
                    "fieldType": "string"
                },
                {
                    "decisionTableId": "0bda35f7d105431dbca7b3be43069f72",
                    "dtFieldMappingId": "cf0cdb8dd1c3452d918d2320c4a6ec61",
                    "columnType": "2",
                    "headName": "被续保单对象_车辆信息_车辆大类",
                    "fieldName": "车辆大类",
                    "fieldPath": "bomRenewPolicy.prptitemcar.maincarkindcode",
                    "fieldType": "string"
                },
                {
                    "decisionTableId": "0bda35f7d105431dbca7b3be43069f72",
                    "dtFieldMappingId": "6d3ff96cf034497aa3f83c76f20b1163",
                    "columnType": "2",
                    "headName": "被续保单对象_车辆信息_实际使用年数",
                    "fieldName": "实际使用年数",
                    "fieldPath": "bomRenewPolicy.prptitemcar.useYears",
                    "fieldType": "double"
                },
                {
                    "decisionTableId": "0bda35f7d105431dbca7b3be43069f72",
                    "dtFieldMappingId": "ca43446893914414b7a3b15a3a3c5c50",
                    "columnType": "2",
                    "headName": "被续保单对象_车辆信息_车架号",
                    "fieldName": "车辆信息",
                    "fieldPath": "bomRenewPolicy.prptitemcar",
                    "fieldType": "object"
                },
                {
                    "decisionTableId": "0bda35f7d105431dbca7b3be43069f72",
                    "dtFieldMappingId": "01062bbcd4b1439d87082fb54347e2e5",
                    "columnType": "2",
                    "headName": "被续保单对象_车辆信息_车架号",
                    "fieldName": "车架号",
                    "fieldPath": "bomRenewPolicy.prptitemcar.frameNo",
                    "fieldType": "string"
                },
                {
                    "decisionTableId": "0bda35f7d105431dbca7b3be43069f72",
                    "dtFieldMappingId": "cf0cdb8dd1c3452d918d2320c4a6ec61",
                    "columnType": "2",
                    "headName": "被续保单对象_车辆信息_车辆大类",
                    "fieldName": "车辆大类",
                    "fieldPath": "bomRenewPolicy.prptitemcar.maincarkindcode",
                    "fieldType": "string"
                },
                {
                    "decisionTableId": "0bda35f7d105431dbca7b3be43069f72",
                    "dtFieldMappingId": "6d3ff96cf034497aa3f83c76f20b1163",
                    "columnType": "2",
                    "headName": "被续保单对象_车辆信息_实际使用年数",
                    "fieldName": "实际使用年数",
                    "fieldPath": "bomRenewPolicy.prptitemcar.useYears",
                    "fieldType": "double"
                },
                {
                    "decisionTableId": "0bda35f7d105431dbca7b3be43069f72",
                    "dtFieldMappingId": "ca43446893914414b7a3b15a3a3c5c50",
                    "columnType": "2",
                    "headName": "被续保单对象_车辆信息_车架号",
                    "fieldName": "车辆信息",
                    "fieldPath": "bomRenewPolicy.prptitemcar",
                    "fieldType": "object"
                },
                {
                    "decisionTableId": "0bda35f7d105431dbca7b3be43069f72",
                    "dtFieldMappingId": "01062bbcd4b1439d87082fb54347e2e5",
                    "columnType": "2",
                    "headName": "被续保单对象_车辆信息_车架号",
                    "fieldName": "车架号",
                    "fieldPath": "bomRenewPolicy.prptitemcar.frameNo",
                    "fieldType": "string"
                }
            ]
        },
        {
            "rule": null,
            "columns": [
                [
                    {
                        "decisionTableId": "0bda35f7d105431dbca7b3be43069f72",
                        "cellAddress": "G3",
                        "rowNum": 3,
                        "columnNum": "G",
                        "cellType": "STRING",
                        "cellValue": "a",
                        "formula": null,
                        "alias": null,
                        "valueType": null,
                        "headerRule": null,
                        "frontX": "00",
                        "frontY": "D"
                    },
                ],
                [
                    {
                        "decisionTableId": "0bda35f7d105431dbca7b3be43069f72",
                        "cellAddress": "G4",
                        "rowNum": 4,
                        "columnNum": "G",
                        "cellType": "STRING",
                        "cellValue": "b",
                        "formula": null,
                        "alias": null,
                        "valueType": null,
                        "headerRule": null,
                        "frontX": "10",
                        "frontY": "D"
                    },
                ],
                [
                    {
                        "decisionTableId": "0bda35f7d105431dbca7b3be43069f72",
                        "cellAddress": "G5",
                        "rowNum": 5,
                        "columnNum": "G",
                        "cellType": "STRING",
                        "cellValue": "c",
                        "formula": null,
                        "alias": null,
                        "valueType": null,
                        "headerRule": null,
                        "frontX": "20",
                        "frontY": "D"
                    },
                ],
                [
                    {
                        "decisionTableId": "0bda35f7d105431dbca7b3be43069f72",
                        "cellAddress": "G6",
                        "rowNum": 6,
                        "columnNum": "G",
                        "cellType": "STRING",
                        "cellValue": "d",
                        "formula": null,
                        "alias": null,
                        "valueType": null,
                        "headerRule": null,
                        "frontX": "30",
                        "frontY": "D"
                    }
                ]
            ],
            "headers": [
                {
                    "decisionTableId": "0bda35f7d105431dbca7b3be43069f72",
                    "cellAddress": "G1",
                    "rowNum": 1,
                    "columnNum": "G",
                    "cellType": "STRING",
                    "cellValue": "结果输出对象_是否必须AI验车",
                    "formula": null,
                    "alias": null,
                    "valueType": null,
                    "headerRule": null,
                    "frontX": null,
                    "frontY": null
                },
                {
                    "decisionTableId": "0bda35f7d105431dbca7b3be43069f72",
                    "cellAddress": "G2",
                    "rowNum": 2,
                    "columnNum": "G",
                    "cellType": "STRING",
                    "cellValue": "【决策列】",
                    "formula": null,
                    "alias": null,
                    "valueType": null,
                    "headerRule": null,
                    "frontX": null,
                    "frontY": null
                }
            ],
            "dtFieldPathMappings": [
                {
                    "decisionTableId": "0bda35f7d105431dbca7b3be43069f72",
                    "dtFieldMappingId": "3f1526cfc32c40de86a59e40a9fec262",
                    "columnType": "1",
                    "headName": "结果输出对象_是否必须AI验车",
                    "fieldName": "结果输出对象",
                    "fieldPath": "bomRuleResultVo",
                    "fieldType": "object"
                },
                {
                    "decisionTableId": "0bda35f7d105431dbca7b3be43069f72",
                    "dtFieldMappingId": "ab63ce15e841454ab4f3c3520995cd02",
                    "columnType": "1",
                    "headName": "结果输出对象_是否必须AI验车",
                    "fieldName": "是否必须AI验车",
                    "fieldPath": "bomRuleResultVo.ifAICarCheck",
                    "fieldType": "boolean"
                }
            ]
        }
    ]
}
