/**
 * Created by zmouse on 2017/6/16.
 * E-mail: zmouse@miaov.com
 * GitHub: zmouse@github.com
 */

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const ShopTypeModel = require('./schema/ShopType');

app.use( '/', bodyParser.urlencoded({extended: false}) );

mongoose.connect('mongodb://localhost/app');

app.use('/', function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    next();
});

/*
* 添加商户类型
* method: post
* fields:
*   name: 商户名称
* */
app.post('/shoptype/add', function (req, res) {
    let name = (req.body.name || '').trim();

    if (name == '') {
        res.json({
            code: 1,
            message: '请输入商户类型名称'
        });
    }

    ShopTypeModel.findOne({
        name: name
    }).exec(function (err, shopTypeInfo) {
        if (!err) {
            if (shopTypeInfo) {
                res.json({
                    code: 2,
                    message: '添加失败 - 已经存在该分类了'
                });
            } else {
                let shopType = new ShopTypeModel({name: name});
                shopType.save(function (err) {
                    if (err) {
                        res.json({
                            code: 3,
                            message: '添加失败'
                        });
                    } else {
                        res.json({
                            code: 0,
                            message: '添加成功'
                        });
                    }
                });
            }
        }
    });

});

/*
* 获取所有商户类型列表
* */
app.get('/shoptype', function(req, res) {
    ShopTypeModel.find({}).then(function(data) {
        res.json({
            data: data
        });
    });
});

app.listen(8888, function () {
    console.log('服务器启动成功');
});
