// ==UserScript==
// @icon          https://www.douyu.com/favicon.ico
// @name          复读机自动弹幕发射器
// @namespace     https://github.com/zhenshiluosuo/Storyteller-AutoBarrageForDouyuTV
// @namespace     https://greasyfork.org/zh-CN/scripts/396928
// @author        闪光魔法师
// @description   适配斗鱼直播平台的自动弹幕发射器 随机复制复读机 Github:https://github.com/zhenshiluosuo/Storyteller-AutoBarrageForDouyuTV
// @match         *://www.douyu.com/*
// @match         *://www.youtube.com/*
// @version       1.0.0
// @grant         none
// ==/UserScript==
(function () {
    'use strict';

    let tip = false;
    let div1 = document.createElement('div');//默认悬浮窗
    let div2 = document.createElement('div');//控制台
    let css1 = 'background: #FFB5C5;color:#ffffff;overflow: hidden;z-index: 998;position: fixed;padding:5px;text-align:center;width: 85px;height: 22px;border-radius: 5px;right: 10px;top: 72%;'
    let css2 = 'background: #ffffff;overflow: hidden;z-index: 999;position: fixed;padding:5px;text-align:center;width: 125px;height: 110px;box-sizing: content-box;border: 1px solid #ff921a;border-radius: 5px;right: 10px;top: 72%;display: none;';
    let cycle_time;//弹幕周期，单位毫秒 建议设定至6000毫秒以上 过低有系统屏蔽风险
    let _cycle_time = 800;//弹幕div定时器
    let sentence = "";//复制的弹幕
    let interval;//发射定时器
    let danmu_interval;//等待弹幕div加载定时器
    let _ready = false;//弹幕div加载标记
    let div_manmu;//网页弹幕div
    let div_wenzi;//网页聊天室div
    let _mode = false;//套娃模式标记
    let __mode = false;//复读白字标记
    let ___mode = false;//重复复读标记
    let website;
    let ytb_iframe;//ytb直播右侧iframe

    init();//初始化

//核心功能函数
    function init() {
        let url = window.location.host;
        if(url === 'www.douyu.com') {
            website = 0;
        } else if(url === 'www.youtube.com') {
            if (window.top !== window.self) {
                throw new Error('Frame error!');
            }
            website = 3;
        }
        div1.id = 'DuLunChe2';
        div1.id = 'DuLunChe3';
        div1.style.cssText = css1;
        div2.style.cssText = css2;
        div1.innerHTML = '复读机控制台';
        div2.innerHTML = '<input type="text" style="width: 100px" placeholder="间隔时间(ms)" id="DuLunCheTime1"/><div style="font-size: 10px;margin-bottom: 2px;"><button id="DuLunCheBtn1" style="display: inline-block; background: #f70; color: #FFFFFF; width:50px; height: 25px; margin: 1px;">出动</button><button id="DuLunCheYinCang1" style="display: inline-block; background: #f70; color: #FFFFFF; width:50px; height: 25px; margin: 1px;">隐藏</div></button><div style="color: black;float: left;width: 100%;font-size: 75%;"><span>套娃模式(仅斗鱼)：</span><input type="checkbox" id="dlc_btn99" value="0" style=""/></div><div style="color: black;float: left;width: 100%;font-size: 75%;"><span>不复读白字(斗鱼)：</span><input type="checkbox" id="dlc_btn98" value="0" style=""/></div><div style="color: black;float: left;width: 100%;font-size: 75%;"><span>不重复复读(斗鱼)：</span><input type="checkbox" id="dlc_btn97" value="0" style=""/></div>';
        div1.onclick = () => {
            div2.style.setProperty('display','block');
            if(!tip){
                tip = true;
                alert('欢迎使用偶尔更新的复读机自动弹幕发射装置，当前版本V1.0.0，对本插件的意见和问题可以到Github反馈哦，项目地址：https://github.com/zhenshiluosuo/Storyteller-AutoBarrageForDouyuTV/ ');
            }
        };
        document.body.appendChild(div1);
        document.body.appendChild(div2);
        document.getElementById('DuLunCheYinCang1').onclick = () => {
            div2.style.setProperty('display','none');
        };
        document.getElementById('DuLunCheBtn1').onclick = () => {
            if(document.getElementById('DuLunCheBtn1').innerText === '出动') {
                document.getElementById('DuLunCheBtn1').innerText = '中止';
                if(!website) {
                    dy_run();
                } else {
                    ytb_run();
                }
            }
            else finish();
        };
        document.getElementById('dlc_btn99').onclick = () => {
            if(document.getElementById('dlc_btn99').checked){
                _mode = true;
            }else{
                _mode = false;
            }
        };
        if(!website) {
            document.getElementById('dlc_btn98').onclick = () => {
                if(document.getElementById('dlc_btn98').checked){
                    __mode = true;
                }else{
                    __mode = false;
                }
            };
            document.getElementById('dlc_btn97').onclick = () => {
                if(document.getElementById('dlc_btn97').checked){
                    ___mode = true;
                }else{
                    ___mode = false;
                }
            };
            danmu_interval = setInterval(() => {
                if(document.getElementsByClassName('danmu-6e95c1')[0].childNodes.length){
                    div_manmu = document.getElementsByClassName('danmu-6e95c1')[0];
                    div_wenzi = document.getElementById('js-barrage-list');
                    div_manmu.addEventListener('DOMNodeInserted', function () {
                        let _sentence = sentence;
                        if(_mode){
                            if(__mode && 'Barrage-content' === div_wenzi.childNodes[div_wenzi.childNodes.length - 1].getElementsByClassName('Barrage-content')[0].className){
                                return;
                            }
                            sentence = '@' + div_wenzi.childNodes[div_wenzi.childNodes.length - 1].getElementsByClassName('Barrage-nickName')[0].innerText + div_wenzi.childNodes[div_wenzi.childNodes.length - 1].getElementsByClassName('Barrage-content')[0].innerText;
                            _ready = true;

                        }else{
                            let len = div_manmu.childNodes.length;
                            if(len){
                                let _temp = div_manmu.childNodes[Math.floor((Math.random() * len))];
                                let _color = _temp.style.color;
                                if(!__mode || (__mode && _color.length)){
                                    _ready = true;
                                    sentence = _temp.innerText;
                                }
                            }
                        }
                        if(___mode && _ready){
                            if(_sentence === sentence){
                                _ready = false;
                            }
                        }
                    },false);
                    clearInterval(danmu_interval);
                }
            }, _cycle_time);
            let ad_i1 = setInterval(() => {
                if(document.getElementsByClassName('CommonShareDraw')[0].childNodes.length){
                    document.getElementsByClassName('CommonShareDraw')[0].style.display = 'none'
                    clearInterval(ad_i1);
                }
            },1000);
        } else {

        }
//
    }
//发射弹幕
    function dy_run() {
        let btn = document.getElementsByClassName('ChatSend-button')[0];
        let txt = document.getElementsByClassName('ChatSend-txt')[0];
        cycle_time = parseInt(document.getElementById('DuLunCheTime1').value);
        if(cycle_time <= 2999 || !cycle_time) {
            alert('请珍惜账号 加大发言间隔！');
            finish();
            document.getElementById('DuLunCheTime1').value = '9999';
            return;
        }
        interval = setInterval(() => {
            if(txt.value === '' && _ready && btn.innerHTML === '发送'){//输入框中有内容时等待用户发送完成后再继续
                txt.value = sentence;
                btn.click();
                _ready = false;
            }
        }, cycle_time);
    }
    function ytb_run() {
        ytb_iframe = document.getElementById('chatframe').contentWindow;
        let btn = ytb_iframe.document.querySelector('#send-button button');
        let txt = ytb_iframe.document.querySelector('#input.yt-live-chat-text-input-field-renderer');
        cycle_time = parseInt(document.getElementById('DuLunCheTime1').value);
        if(!cycle_time) {
            alert('请设定一个时间间隔！');
            finish();
            document.getElementById('DuLunCheTime1').value = '9999';
            return;
        }
        interval = setInterval(() => {
            let list = ytb_iframe.document.getElementsByClassName('style-scope yt-live-chat-item-list-renderer');
            txt.textContent = list[Math.floor(Math.random() * (list.length - 9))].children[1].children[2].innerText;
            txt.dispatchEvent(new InputEvent('input'));
            btn.click();
        }, cycle_time);
    }
//结束发射
    function finish() {
        document.getElementById('DuLunCheBtn1').innerText = '出动';
        clearInterval(interval);
    }
})();
