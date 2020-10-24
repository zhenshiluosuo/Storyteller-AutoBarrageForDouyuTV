// ==UserScript==
// @icon          https://www.douyu.com/favicon.ico
// @name          独轮车-说书人自动弹幕发射器
// @namespace     https://github.com/zhenshiluosuo/Storyteller-AutoBarrageForDouyuTV
// @author        飞天小协警
// @description   适配斗鱼/虎牙/Mildom/b站/ytb直播平台的自动弹幕发射器 抽象独轮车 说书人 Github:https://github.com/zhenshiluosuo/Storyteller-AutoBarrageForDouyuTV
// @match         *://www.douyu.com/*
// @match         *://www.huya.com/*
// @match         *://live.bilibili.com/*
// @match         *://www.youtube.com/*
// @match         *://www.mildom.com/*
// @require       https://greasyfork.org/scripts/414419-st-ex/code/ST_EX.js?version=861721
// @version       2.2.1
// @license       GPLv2
// @grant         unsafeWindow
// @grant         GM_xmlhttpRequest
// @grant         GM_getResourceText
// @grant         GM_notification
// @grant         GM_download
// @connect       sohu.com
// @namespace     https://greasyfork.org/scripts/396285
// ==/UserScript==
(function () {
    'use strict';
    let tip = false;
    let div1 = document.createElement('div');//默认悬浮窗
    let div2 = document.createElement('div');//控制台
    let div3 = document.createElement('div');//计数器
    let div5 = document.createElement('div');//快速发射
    let div6 = document.createElement('div');//资源库
    let css1 = 'background: #D4F2E7;color:#000000;overflow: hidden;z-index: 996;position: fixed;text-align:center;width: 100px;height: 30px;box-sizing: border-box;border: 1px solid #ff921a;border-radius: 5px;padding: 0;right: 5px;top: 30%;display: flex; justify-content: center; align-items: center;line-height: 100%;'
    let css2 = 'background: #FFFFFF;color:#ffffff;overflow: hidden;z-index: 997;position: fixed;padding:5px;text-align:center;width: 165px;height: 375px;box-sizing: border-box;border: 1px solid #ff921a;border-radius: 5px;right: 5px;top: 30%;display: none;';
    let css3 = 'background: #FFFFFF;color:#000000;overflow: hidden;z-index: 999;position:absolute;text-align:center;width: 100%;height: 100%;box-sizing: border-box;border: 1px solid #ff921a;padding:5px;border-radius: 5px;top: 7%;right: 0px;display: none;';
    let css6_1 = 'font-size: 12px; cursor: pointer; border: 1px solid #ff921a;  height: 25px; margin: 1px; display: flex; justify-content: center; align-items: center; position: relative; float: left; padding: 3px;';
    let div2_innerHTML1 = '<div><div style="position: absolute; cursor: move;" id="dlc-move"><svg viewBox="0 0 1024 1024" width="16" height="16"><path d="M192 448h192v128H192v128L0 512l192-192v128z m256 384v-192h128v192h128l-192 192-192-192h128z m384-256h-192V448h192V320l192 192-192 192V576zM576 192v192H448V192H320l192-192 192 192H576z" fill="#2c2c2c" p-id="4932"></path></svg></div><div id="dlc-website" style="cursor: pointer; position: absolute; top: 5px; right: 5px;"><svg viewBox="0 0 1024 1024" width="16" height="16"><path d="M512 1024A512 512 0 1 1 512 0a512 512 0 0 1 0 1024z m3.008-92.992a416 416 0 1 0 0-832 416 416 0 0 0 0 832zM448 448h128v384H448V448z m0-256h128v128H448V192z" fill="#262626" p-id="3853"></path></svg></div><select style="display:inline-block;position:relative;" id="DuLunCheSelect"><option value="0">单句模式</option><option value="1">说书模式</option><option value="2">多句转轮</option><option value="3">编程模式</option><option value="4">计数器</option><option value="5">快速发射</option><option value="6">弹幕资源库</option></select></div><textarea id="DuLunCheText" rows="10" cols="20" placeholder="输入需要发射的内容到这里哦☆发射前请斟酌内容是否符合当前网站的弹幕规范☆最重要的是！大伙不爱看烂活！⚠使用出现问题可在Github或Greasyfork提出反馈哦" style="margin: 2px;overflow-y: scroll;overflow-wrap: normal;width: 90%;"></textarea><div  style="margin: 0 auto;"><input type="text" placeholder="间隔时间(ms) 建议6000" style="display: block;position: relative;font-size: 10px;width: 90%;margin: 1px auto;" id="DuLunCheTime"/><div><button id="DuLunCheBtn" style="display: inline-block; background: #f70; color: #FFFFFF; width: 70px; height: 35px; margin: 2px;cursor: pointer; ">出动</button><button id="DuLunCheYincang" style="display: inline-block; background: #f70; color: #FFFFFF; width:70px; height: 35px; margin: 2px;cursor: pointer; ">隐藏</button></div></div><div style="font-size: 75%;float: left;color: #777;user-select:none;">屏蔽白字黑奴（斗鱼）：<input type="checkbox" id="dlc_btn1" value="0" /><br>屏蔽绿字色友（斗鱼）：<input type="checkbox" id="dlc_btn2" value="1" /><br>屏蔽粉字男同（斗鱼）：<input type="checkbox" id="dlc_btn3" value="2" /><br>临时应急弹幕（斗鱼）：<input type="checkbox" id="dlc_btn4" value="2" /></div>';
    let div3_innerHTML1 = '<textarea id="DuLunCheCountText" rows="6" cols="19" placeholder="输入计数内容,如：“本局豹女Q命中次数：”" style="margin: 0 auto;overflow: scroll;overflow-wrap: normal;"></textarea><div><h5 style="margin: 5px;">计数方式1</h5><div><input type="text" value="0" id="dlcCount1" style="width:40%;"/>&nbsp/&nbsp<input value="0" type="text" id="dlcCount2" style="width:40%;"/></div><div style="margin-top:5px;"><button id="dlcCountBtn1" style="cursor: pointer; height: 20px;width:40%;font-size:50%;background: #f70; color: #FFFFFF;">增加双值</button>&nbsp&nbsp&nbsp<button id="dlcCountBtn2" style="cursor: pointer; height: 20px;width:40%;font-size:50%;background: #f70; color: #FFFFFF;">增加分母</button><div style="margin: 2px;"><button id="dlcCountBtn3" style="cursor: pointer; width:50%;font-size:50%;background: #f70; color: #FFFFFF;height: 20px;">发送</button></div></div></div><div><h5 style="margin: 5px;">计数方式2</h5><div><input type="text" value="0" id="dlcCount3" style="width:35%;"/>&nbsp单位:<input value="次" type="text" id="dlcCountUnit" style="width:30%;"/></div><div style="margin-top:5px;"><button id="dlcCountBtn5" style="cursor: pointer; height: 20px;width:45%;font-size:50%;background: #f70; color: #FFFFFF;">增加值</button>&nbsp&nbsp&nbsp<button id="dlcCountBtn6" style="cursor: pointer; height: 20px;width:45%;font-size:50%;background: #f70; color: #FFFFFF;">发送</button></div><div style="margin: 5px;"><button id="dlcCountBtn0" style="cursor: pointer; width:50%;font-size:50%;background: #f70; color: #FFFFFF;height: 20px;">重置数据</button></div>';
    let max_danmu_long = 43;//弹幕字数限制
    let min_danmu_long = 18;//最小弹幕长度
    let error_danmu_long = 25;//防止无法断句弹幕长度
    let cycle_time;//弹幕周期，单位毫秒 建议设定至6000毫秒以上 过低有系统屏蔽风险
    let story;//textarea内容
    let story_arr = [];//story分段
    let time_arr = [];//时间记录
    let index;//小说分段
    let interval;//小说定时器
    let danmu_interval;//等待弹幕div加载定时器
    let color_box = [];//禁止的弹幕颜色
    let div_manmu;//网页弹幕div
    let select_flag = false;//功能标记
    let radio_flag = false;
    let radio_change_flag = false;
    let resource_flag = false;
    let danmu_helperX = false;//应急弹幕标记
    let danmu_count = 0;
    let danmu_parent = null;
    let website;//当前站点 0:斗鱼 1：虎牙 2:p站 3：ytb 5:mildom...
    let btn = null; //发送按钮
    let txt = null; //输入框
    let dlc_radio_words; //热词
    let ytb_iframe;//ytb直播右侧iframe
    let mouse_flag = false;//鼠标拖动标记
    let mouse_throttle = null;//鼠标拖动节流
    let mouse_throttle_flag = false;//鼠标拖动节流标记
    let mouseDownX;
    let mouseDownY;
    let initX;
    let initY;
    ch_info();
    init();//初始化

//核心功能函数
    function init() {
        let url = window.location.host;
        if(url === 'www.douyu.com') {
            website = 0;
        } else if(url === 'www.huya.com') {
            max_danmu_long = 30;
            min_danmu_long = 12;
            error_danmu_long = 15;
            website = 1;
        } else if(url === 'live.bilibili.com') {
            max_danmu_long = 20;
            min_danmu_long = 8;
            error_danmu_long = 12;
            website = 2;
        } else if(url === 'www.youtube.com') {
            if (window.top !== window.self) {
                throw new Error('Frame error!');
            }
            max_danmu_long = 200;
            min_danmu_long = 30;
            error_danmu_long = 100;
            website = 3;
        } else if(url === 'www.mildom.com') {
            max_danmu_long = 120;
            min_danmu_long = 30;
            error_danmu_long = 80;
            website = 5;
        }
        div1.id = 'DuLunChe1';
        div2.id = 'DuLunChe2';
        div3.id = 'dlc-select-window';
        div5.id = 'dlc-radio-window';
        div1.style.cssText = css1;
        div2.style.cssText = css2;
        div3.style.cssText = css3;
        div5.style.cssText = css3;
        div6.style.cssText = css3;
        div1.innerHTML = '<svg viewBox="0 0 1024 1024" width="16" height="16"><path d="M284.804377 360.254363l177.952351-104.775683a7.675874 7.675874 0 0 0 0-13.240883l-179.167697-104.903614a7.483977 7.483977 0 0 0-7.547943 0L98.152703 242.237797a7.675874 7.675874 0 0 0 0 13.240883l179.103731 104.839649a7.483977 7.483977 0 0 0 7.547943 0z m464.390391 0l177.95235-104.775683a7.675874 7.675874 0 0 0 0-13.240883l-179.103732-104.903614a7.483977 7.483977 0 0 0-7.611908 0L562.543093 242.237797a7.675874 7.675874 0 0 0 0 13.240883l179.103732 104.839649a7.483977 7.483977 0 0 0 7.611908 0z m-22.963657 39.402821l-0.639657 208.527917a7.675874 7.675874 0 0 1-3.710005 6.588458 7.483977 7.483977 0 0 1-7.547943 0L535.165808 509.933911a7.675874 7.675874 0 0 1-3.837937-6.588459l0.639656-208.527916c0-5.948803 6.332596-9.594843 11.321915-6.652425l179.167697 104.903615a7.675874 7.675874 0 0 1 3.837937 6.588458z m-429.465163 0l0.639656 208.527917c0 5.884837 6.268631 9.530877 11.257949 6.588458L487.831251 509.933911a7.675874 7.675874 0 0 0 3.837937-6.588459l-0.639657-208.527916a7.675874 7.675874 0 0 0-3.837937-6.652425 7.483977 7.483977 0 0 0-7.483977 0l-179.167697 104.903615a7.675874 7.675874 0 0 0-3.837937 6.588458z m422.684807 295.265295l2.494659 0.895519a7.675874 7.675874 0 0 1 3.773972 6.588459l0.639656 208.527916a7.675874 7.675874 0 0 1-3.837937 6.652424l-179.103732 104.839649a7.547943 7.547943 0 0 1-11.38588-6.588459l-0.639656-208.527916a7.675874 7.675874 0 0 1 3.837937-6.652424l179.103732-104.839649a7.483977 7.483977 0 0 1 7.611908 0z m-410.851167 0.895519l179.167697 104.903614a7.675874 7.675874 0 0 1 3.837937 6.588459l-0.639656 208.527916a7.675874 7.675874 0 0 1-3.837937 6.588459 7.483977 7.483977 0 0 1-7.483978 0L300.411988 917.586797a7.675874 7.675874 0 0 1-3.837937-6.588459l0.639656-208.527916c0-5.948803 6.332596-9.594843 11.321915-6.652424z m643.81395-137.206252l2.494659 0.895519a7.675874 7.675874 0 0 1 3.773971 6.652424L959.257859 774.62364a7.675874 7.675874 0 0 1-3.773972 6.588458l-179.103732 104.903615a7.547943 7.547943 0 0 1-11.38588-6.652425l-0.639656-208.527916c0-2.750522 1.471209-5.245181 3.837937-6.652424l179.103732-104.839649a7.483977 7.483977 0 0 1 7.611909 0zM75.636805 559.507265l179.167697 104.903614c2.366728 1.279312 3.837937 3.837937 3.837938 6.588459l-0.639657 208.527916a7.675874 7.675874 0 0 1-3.837937 6.588459 7.483977 7.483977 0 0 1-7.483977 0L67.513171 781.276064A7.675874 7.675874 0 0 1 63.7392 774.687605l0.639656-208.527916c0-5.884837 6.268631-9.594843 11.257949-6.652424z m436.885174-18.358133l2.558625 0.895519 179.103732 104.903614a7.675874 7.675874 0 0 1 0 13.176918l-177.888385 104.775683a7.675874 7.675874 0 0 1-7.547943 0L329.58031 660.125183a7.675874 7.675874 0 0 1 0-13.240883l177.888385-104.775683a7.483977 7.483977 0 0 1 7.547943 0z m439.187937-253.943505l2.430693 0.959484a7.675874 7.675874 0 0 1 3.837937 6.652425l0.575691 208.527916a7.675874 7.675874 0 0 1-3.837937 6.588459l-179.103732 104.839648a7.547943 7.547943 0 0 1-11.321914-6.588458l-0.639657-208.527917c0-2.750522 1.407244-5.309146 3.837938-6.652424l179.103731-104.839649a7.483977 7.483977 0 0 1 7.547943 0zM76.404392 288.229077l179.103732 104.903614c2.430694 1.279312 3.837937 3.837937 3.837937 6.588459l-0.639656 208.527916a7.675874 7.675874 0 0 1-3.773971 6.588459 7.483977 7.483977 0 0 1-7.547943 0l-179.103732-104.839649a7.675874 7.675874 0 0 1-3.837937-6.588459l0.639656-208.527916c0-5.948803 6.268631-9.594843 11.321914-6.652424zM512.585945 0.127931l2.430693 0.895519 179.167698 104.839649a7.675874 7.675874 0 0 1 0 13.240883L516.295951 223.879665a7.356046 7.356046 0 0 1-7.547943 0L329.58031 119.040016a7.675874 7.675874 0 0 1 0-13.240883L507.468695 1.02345a7.483977 7.483977 0 0 1 7.547943 0z" fill="#333333" p-id="3848"></path></svg><span style="font-size: 12px;font-weight: bold;">独轮车控制台</span>';
        div2.innerHTML = div2_innerHTML1;
        div3.innerHTML = div3_innerHTML1;
        div1.onclick = () => {
            div2.style.setProperty('display','block');
            div1.style.setProperty('display','none');
            if(!tip){
                tip = true;
                alert('欢迎使用持续更新的独轮车-说书人自动弹幕发射装置，当前版本V2.2.0(Aqua)，对本插件的意见和问题可以到Github反馈哦，项目地址：https://github.com/zhenshiluosuo/Storyteller-AutoBarrageForDouyuTV/ 。多句转轮模式每句之间请用回车分隔，为了自己的账号和他人观看体验，建议发言间隔调至8000ms以上，喜欢的好兄弟打个星星吧~求求了！编程独轮车教程：奇数行为下一句发送的间隔毫秒时间，偶数行为发送内容（一行中内容过多挤到下一行也算到上一行中），比如第一行8000，第二行啦啦啦，第三行10000，第四行噜噜噜，则先发送啦啦啦，8秒后发送噜噜噜，10秒后再发送啦啦啦，8秒后发送噜噜噜 部分功能可能在非斗鱼平台上无法使用 定制功能:shinymoon@aliyun.com');
            }
        };
        document.body.appendChild(div1);
        document.body.appendChild(div2);
        div2.appendChild(div3);
        div2.appendChild(div5);
        div2.appendChild(div6);
        document.getElementById('DuLunCheYincang').onclick = () => {
            div1.style.setProperty('display','flex');
            div2.style.setProperty('display','none');
        };
        document.getElementById('DuLunCheBtn').onclick = () => {
            if(document.getElementById('DuLunCheBtn').innerText === '出动') run();
            else finish();
        };
        document.getElementById('DuLunCheSelect').onchange = () => {
            let s_value = document.getElementById('DuLunCheSelect').value;

            if(s_value === '4'){
                select_flag = true;
                div3.style.setProperty('display','block');
            } else if(s_value !== '4' && select_flag){
                select_flag = false;
                div3.style.setProperty('display','none');
            }

            if(s_value === '5'){
                radio_flag = true;
                div5.style.setProperty('display','block');
            } else if(s_value !== '5' && radio_flag){
                radio_flag = false;
                div5.style.setProperty('display','none');
            }

            if(s_value === '6'){
                resource_flag = true;
                div6.style.setProperty('display','block');
            } else if(s_value !== '6' && resource_flag){
                resource_flag = false;
                div6.style.setProperty('display','none');
            }
        };
        document.getElementById('dlcCountBtn1').onclick = () => {
            document.getElementById('dlcCount1').value = "" + (parseInt(document.getElementById('dlcCount1').value) + 1);
            document.getElementById('dlcCount2').value = "" + (parseInt(document.getElementById('dlcCount2').value) + 1);
        };
        document.getElementById('dlcCountBtn2').onclick = () => {
            document.getElementById('dlcCount2').value = "" + (parseInt(document.getElementById('dlcCount2').value) + 1);
        };
        document.getElementById('dlcCountBtn5').onclick = () => {
            document.getElementById('dlcCount3').value = "" + (parseInt(document.getElementById('dlcCount3').value) + 1);
        };
        document.getElementById('dlcCountBtn3').onclick = () => {
            openFire(document.getElementById('DuLunCheCountText').value + " " + document.getElementById('dlcCount1').value + "/" + document.getElementById('dlcCount2').value);
        };
        document.getElementById('dlcCountBtn6').onclick = () => {
            openFire(document.getElementById('DuLunCheCountText').value + " " + document.getElementById('dlcCount3').value + document.getElementById('dlcCountUnit').value);
        };
        document.getElementById('dlcCountBtn0').onclick = () => {
            document.getElementById('DuLunCheCountText').value = "";
            document.getElementById('dlcCount1').value = "0";
            document.getElementById('dlcCount2').value = "0";
            document.getElementById('dlcCount3').value = "0";
            document.getElementById('dlcCountUnit').value = "次";
        };
        if(!website) {
            //斗鱼弹幕屏蔽相关
            document.getElementById('dlc_btn1').onclick = () => {
                if(document.getElementById('dlc_btn1').checked){
                    color_box.push('');
                }else{
                    for (let i = 0; i < color_box.length; i++){
                        if(color_box[i] === '') {color_box.splice(i, 1); break;}
                    }
                }
            };
            document.getElementById('dlc_btn2').onclick = () => {
                if(document.getElementById('dlc_btn2').checked){
                    color_box.push('rgb(102, 255, 0)');
                }else{
                    for (let i = 0; i < color_box.length; i++){
                        if(color_box[i] === 'rgb(102, 255, 0)') {color_box.splice(i, 1); break;}
                    }
                }
            };
            document.getElementById('dlc_btn3').onclick = () => {
                if(document.getElementById('dlc_btn3').checked){
                    color_box.push('rgb(246, 68, 127)');
                }else{
                    for (let i = 0; i < color_box.length; i++){
                        if(color_box[i] === 'rgb(246, 68, 127)') {color_box.splice(i, 1); break;}
                    }
                }
            };
            document.getElementById('dlc_btn4').onclick = () => {
                if(document.getElementById('dlc_btn4').checked){
                    danmu_helperX = true;
                    danmu_parent.style.setProperty('display','block');
                }else{
                    danmu_helperX = false;
                    danmu_parent.style.setProperty('display','none');
                }
            };
            //右上设置按钮
            // document.getElementById('dlcSetting1').onmouseover = () => {
            //     document.getElementById('dlcSetting1').style.backgroundPositionY="-28px";
            // };
            // document.getElementById('dlcSetting1').onmouseout = () => {
            //     document.getElementById('dlcSetting1').style.backgroundPositionY="0px";
            // };
            //检测弹幕容器
            danmu_interval = setInterval(() => {
                if(document.getElementsByClassName('danmu-6e95c1')[0].childNodes.length){
                    div_manmu = document.getElementsByClassName('danmu-6e95c1')[0];
                    div_manmu.addEventListener('DOMNodeInserted', function () {
                        let len = div_manmu.childNodes.length;
                        for (let i = 0; i < len; i++){
                            if(div_manmu.childNodes[i].style.display === 'none')
                                continue;
                            for (let j = 0; j < color_box.length; j++){
                                if(div_manmu.childNodes[i].style.color === color_box[j]){
                                    div_manmu.childNodes[i].style.display = 'none';
                                    break;
                                }
                            }
                        }
                    },false);
                    clearInterval(danmu_interval);
                }
            }, 1000);
            //关闭广告
            let ad_i1 = setInterval(() => {
                if(document.getElementsByClassName('liveosTag_1Z4iZj')[0].childNodes.length){
                    document.getElementsByClassName('liveosTag_1Z4iZj')[0].style.display = 'none';//关手游广告
                    clearInterval(ad_i1);
                }
            },1000);
            let ad_i2= setInterval(() => {
                if(document.getElementsByClassName('Bottom-ad')[0].childNodes.length){
                    document.getElementsByClassName('Bottom-ad')[0].style.display = 'none';//关底部广告栏
                    clearInterval(ad_i2);
                }
            },1000);
            let ad_i3= setInterval(() => {
                if(document.getElementsByClassName('Title-ad')[0].childElementCount){
                    document.getElementsByClassName('Title-ad')[0].innerHTML = '';//关左上角广告栏
                    clearInterval(ad_i3);
                }
            },1000);
            let ad_i5= setInterval(() => {
                if(document.getElementsByClassName('RoomText-wrap')[0].childElementCount){
                    document.getElementsByClassName('RoomText-wrap')[0].style.display = 'none';//关右下角广告栏
                    clearInterval(ad_i5);
                }
            },1000);
            //应急弹幕
            let danmu_helper_i = setInterval(() => {
                if(document.getElementsByClassName('Barrage-list')[0].childElementCount){
                    let danmu_css = `
                    <style>
                    .danmu1 {
                        margin: 5px;
                        height: 30px;
                        font-size: 25px;
                        font-weight: bold;
                        color: white;
                        position: absolute;
                        visibility: hidden;
                        animation: move1 9s linear;
                        -webkit-animation-name: move1 9s linear;
                    }
                    @keyframes move1 {
                        0% {
                            visibility: visible;
                            transform: translateX(1600px);
                            -webkit-transform: translateX(1600px);
                        }
                        100% {
                            visibility: visible;
                            transform: translateX(-600px);
                            -webkit-transform: translateX(-600px);
                        }

                    }
                    </style>`;
                    let ele = document.createElement('div');
                    ele.innerHTML = danmu_css;
                    document.getElementsByTagName('head')[0].appendChild(ele.firstElementChild);//注入css
                    danmu_parent = document.createElement('div');
                    danmu_parent.id = 'div_20200604';
                    danmu_parent.style.width = '100%';
                    danmu_parent.style.height='92%';
                    danmu_parent.style.position='absolute';
                    danmu_parent.style.display = 'none';
                    document.getElementsByClassName('layout-Player-videoMain')[0].appendChild(danmu_parent);
                    clearInterval(danmu_helper_i);
                    document.getElementsByClassName('Barrage-list')[0].addEventListener('DOMNodeInserted', () => {
                        if(danmu_helperX){
                            let danmu_text = document.getElementsByClassName('Barrage-list')[0].lastChild.getElementsByClassName('Barrage-content')[0].innerText;
                            let danmu_div = document.createElement('div');
                            danmu_div.style.width = '' + danmu_text.length * 25 + 'px';
                            danmu_div.innerHTML = danmu_text;
                            if(danmu_parent.childElementCount){
                                danmu_div.style.top = '' + (++danmu_count % 12 * 30) + 'px';
                            }else{
                                danmu_count = 0;
                            }
                            danmu_div.classList.add("danmu1");
                            danmu_parent.appendChild(danmu_div);
                            setTimeout(() => {
                                danmu_parent.removeChild(danmu_div);
                            },9000);
                        }
                    })

                }
            },1000);
        } else if(website === 1) {
            let ad_i1 = setInterval(() => {
                if(document.getElementById('J_roomGgTop').childNodes.length){
                    document.getElementById('J_roomGgTop').style.display = 'none';//上方广告
                    clearInterval(ad_i1);
                }
            },1000);
            let ad_i2= setInterval(() => {
                if(document.getElementsByClassName('room-business-game')[0].childNodes.length){
                    document.getElementsByClassName('room-business-game')[0].style.display = 'none';//关底部广告栏
                    clearInterval(ad_i2);
                }
            },1000);
        }
        //找弹幕发射元素
        let btn_Interval = setInterval(() => {
            if(!btn){
                if(website === 0) {
                    btn = document.getElementsByClassName('ChatSend-button')[0];
                } else if(website === 1) {
                    btn = document.getElementById('msg_send_bt');
                } else if(website === 2) {
                    btn = document.getElementsByClassName('bl-button live-skin-highlight-button-bg bl-button--primary bl-button--small')[0];
                } else if(website === 3) {
                    ytb_iframe = document.getElementById('chatframe').contentWindow;
                    btn = ytb_iframe.document.querySelector('#send-button button');
                } else if(website === 5) {
                    btn = document.getElementsByClassName('send-msg-btn')[0];
                }

                if(btn) {
                    clearInterval(btn_Interval);
                }
            }
        },100);
        let txt_Interval = setInterval(() => {
            if(!txt){
                if(website === 0) {
                    txt = document.getElementsByClassName('ChatSend-txt')[0];
                } else if(website === 1) {
                    txt = document.getElementById('pub_msg_input');
                } else if(website === 2) {
                    txt = document.getElementsByClassName('chat-input border-box')[0];
                } else if(website === 3) {
                    ytb_iframe = document.getElementById('chatframe').contentWindow;
                    txt = ytb_iframe.document.querySelector('#input.yt-live-chat-text-input-field-renderer');
                } else if(website === 5) {
                    txt = document.getElementsByClassName('chat-panel-input')[0];
                }

                if(txt) {
                    clearInterval(txt_Interval);
                }
            }
        },100);
        //读取本地数据
        if(window.localStorage) {
            if(window.localStorage.dlctime) {
                document.getElementById('DuLunCheTime').value = '' + window.localStorage.dlctime;
            }
            if(window.localStorage.dlcstory) {
                document.getElementById('DuLunCheText').value = window.localStorage.dlcstory;
            }
        }
        //快速发射模块
        div5.innerHTML = `<button style="cursor: pointer; background: #ff921a; width: 80%; height: 7%; margin: 3px auto; text-align: center; color: white;" id="dlc_radio_change">修改</button>
                          <div style="cursor: pointer; border: 1px solid #ff921a; width: 85%; height: 13%; margin: 2px auto; display: flex; justify-content: center; align-items: center;" id="dlc_radio_words0"></div>
                          <div style="cursor: pointer; border: 1px solid #ff921a; width: 85%; height: 13%; margin: 2px auto; display: flex; justify-content: center; align-items: center;" id="dlc_radio_words1"></div>
                          <div style="cursor: pointer; border: 1px solid #ff921a; width: 85%; height: 13%; margin: 2px auto; display: flex; justify-content: center; align-items: center;" id="dlc_radio_words2"></div>
                          <div style="cursor: pointer; border: 1px solid #ff921a; width: 85%; height: 13%; margin: 2px auto; display: flex; justify-content: center; align-items: center;" id="dlc_radio_words3"></div>
                          <div style="cursor: pointer; border: 1px solid #ff921a; width: 85%; height: 13%; margin: 2px auto; display: flex; justify-content: center; align-items: center;" id="dlc_radio_words4"></div>
                          <div style="cursor: pointer; border: 1px solid #ff921a; width: 85%; height: 13%; margin: 2px auto; display: flex; justify-content: center; align-items: center;" id="dlc_radio_words5"></div>
                          <div id="dlc-radio-revise-window" style="display: none; border: 1px solid #ff921a;border-radius: 5px;background: white; position: fixed; width: 420px; height:300px; top: 50%; left: 50%; transform: translate(-50%, -50%);z-index: 1000;">
                            <input style="cursor:pointer; display: block; margin: 5px auto; width: 85%; height: 25px; padding: 3px;" type="text" id="dlc_radio_input0" placeholder="字符限制30以内，超出部分将在保存时剪除" />
                            <input style="display: block; margin: 5px auto; width: 85%; height: 25px; padding: 3px;" type="text" id="dlc_radio_input1" placeholder="字符限制30以内，超出部分将在保存时剪除" />
                            <input style="display: block; margin: 5px auto; width: 85%; height: 25px; padding: 3px;" type="text" id="dlc_radio_input2" placeholder="字符限制30以内，超出部分将在保存时剪除" />
                            <input style="display: block; margin: 5px auto; width: 85%; height: 25px; padding: 3px;" type="text" id="dlc_radio_input3" placeholder="字符限制30以内，超出部分将在保存时剪掉" />
                            <input style="display: block; margin: 5px auto; width: 85%; height: 25px; padding: 3px;" type="text" id="dlc_radio_input4" placeholder="字符限制30以内，超出部分将在保存时剪除" />
                            <input style="display: block; margin: 5px auto; width: 85%; height: 25px; padding: 3px;" type="text" id="dlc_radio_input5" placeholder="字符限制30以内，超出部分将在保存时剪除" />
                            <button style="background: #ff921a; width: 30%; height: 12%; margin: 6px auto; text-align: center; color: white;" id="dlc_radio_change1">确认</button>
                            <button style="background: #ff921a; width: 30%; height: 12%; margin: 6px auto; text-align: center; color: white;" id="dlc_radio_change0">取消</button>
                          </div>`;
        if(window.localStorage) {
            if(window.localStorage.dlcwords) {
                dlc_radio_words = window.localStorage.dlcwords.split('@%*');
            } else {
                dlc_radio_words = ['火速展示吧', '刚来，谁的锅', '我看了一下，主播好像是我爹', '主播一年C一把，想看carry局的明年再来', '滚滚滚滚滚滚滚滚滚滚滚滚滚滚滚', '尬尬尬尬尬尬尬尬尬尬尬尬尬尬尬尬'];
                window.localStorage.setItem('dlcwords', dlc_radio_words.join('@%*'));
            }
        } else {
            dlc_radio_words = ['火速展示吧', '刚来，谁的锅', '我看了一下，主播好像是我爹', '主播一年C一把，想看carry局的明年再来', '滚滚滚滚滚滚滚滚滚滚滚滚滚滚滚', '尬尬尬尬尬尬尬尬尬尬尬尬尬尬尬尬'];
        }
        document.getElementById('dlc_radio_change').onclick = () => {
            if(radio_change_flag) {
                radio_change_flag = false;
                document.getElementById('dlc-radio-revise-window').style.setProperty('display','none');
            } else {
                for(let i = 0; i < dlc_radio_words.length; i++) {
                    document.getElementById('dlc_radio_input' + i).value = dlc_radio_words[i];
                }
                radio_change_flag = true;
                document.getElementById('dlc-radio-revise-window').style.setProperty('display','block');
            }
        }
        for(let i = 0; i < dlc_radio_words.length; i++) {
            document.getElementById('dlc_radio_words' + i).innerHTML = '<span">' + dlc_radio_words[i] + '</span>';
            document.getElementById('dlc_radio_words' + i).onclick = () => {
                let txt_store = '';
                if(txt.innerText !== '') {
                    txt_store = txt.innerText;
                    txt.innerText = '';
                }

                openFire(dlc_radio_words[i]);

                if(txt_store.length) {
                    txt.innerText = txt_store;
                }
            }
        }
        document.getElementById('dlc_radio_change1').onclick = () => {
            for(let i = 0; i < dlc_radio_words.length; i++) {
                dlc_radio_words[i] = document.getElementById('dlc_radio_input' + i).value;
                if(dlc_radio_words[i].length > 30){
                    dlc_radio_words[i] = dlc_radio_words[i].slice(0,30);
                }
                document.getElementById('dlc_radio_words' + i).innerHTML = '<span">' + dlc_radio_words[i] + '</span>';
            }

            if(window.localStorage) {
                window.localStorage.setItem('dlcwords', dlc_radio_words.join('@%*'));
            }

            radio_change_flag = false;
            document.getElementById('dlc-radio-revise-window').style.setProperty('display','none');
        }
        document.getElementById('dlc_radio_change0').onclick = () => {
            radio_change_flag = false;
            document.getElementById('dlc-radio-revise-window').style.setProperty('display','none');
        }
        //拖动
        let divm = document.getElementById('dlc-move');
        divm.onmousedown = (e) => {
            mouse_flag = true;
            mouseDownX = e.pageX;
            mouseDownY = e.pageY;
            initX = div2.offsetLeft;
            initY = div2.offsetTop;
        }
        divm.onmousemove = (e) => {
            if(mouse_flag) {
                if(!mouse_throttle_flag) {
                    mouse_throttle_flag = true;
                    mouse_throttle = setTimeout(() => {
                        mouse_throttle_flag = false;
                        let mouseMoveX = e.pageX, mouseMoveY = e.pageY;
                        div2.style.left = parseInt(mouseMoveX) - parseInt(mouseDownX) + parseInt(initX) + "px";
                        div2.style.top = parseInt(mouseMoveY) - parseInt(mouseDownY) + parseInt(initY) + "px";
                    },5);
                }
            }
        }
        divm.onmouseup = (e) => {
            mouse_flag = false;
        }
        //资源库模块
        div6.innerHTML = `
            <div id = 'dlc-resource-mod1' style="overflow: hidden; width: 100%; box-sizing: border-box; position: relative; margin 0; border: 2px solid #ff921a;border-radius: 5px; padding: 1px;">
                <p style="margin-top: 1px; margin-bottom: 1px;">快射模块</p>
            </div>
            <div id = 'dlc-resource-mod2' style="overflow: hidden; width: 100%; box-sizing: border-box; position: relative; margin 0; border: 2px solid #ff921a;border-radius: 5px; padding: 1px;">
                <p style="margin-top: 1px; margin-bottom: 1px;">说书模块</p>
            </div>`;
        let rm1 = document.getElementById('dlc-resource-mod1');
        let rm2 = document.getElementById('dlc-resource-mod2');
        for(let i = 0; i < titles_1.length; i++) {
            let temp = document.createElement('div');
            temp.innerHTML = '<span>' + titles_1[i] + '</span>';
            temp.style.cssText = css6_1;
            rm1.appendChild(temp);
            temp.onclick = () => {
                for(let j = 0; j < dlc_radio_words.length; j++) {
                    dlc_radio_words[j] = data_1[i][j];
                    document.getElementById('dlc_radio_words' + j).innerHTML = '<span">' + dlc_radio_words[j] + '</span>';
                }
                document.getElementById('DuLunCheSelect').value = 5;

                let event = document.createEvent("HTMLEvents");
                event.initEvent("change", true, true);
                document.getElementById('DuLunCheSelect').dispatchEvent(event);
            }
        }
        for(let i = 0; i < titles_2.length; i++) {
            let temp = document.createElement('div');
            temp.innerHTML = '<span>' + titles_2[i] + '</span>';
            temp.style.cssText = css6_1;
            rm2.appendChild(temp);
            temp.onclick = () => {
                document.getElementById('DuLunCheText').value = data_2[i];
                document.getElementById('DuLunCheSelect').value = 1;

                let event = document.createEvent("HTMLEvents");
                event.initEvent("change", true, true);
                document.getElementById('DuLunCheSelect').dispatchEvent(event);
            }
        }
        //安装信息
        document.getElementById('dlc-website').onclick = () => {
            window.open("https://greasyfork.org/zh-CN/scripts/396285", "_blank");
        }
    }
//发射弹幕
    function run() {
        let _value = document.getElementById('DuLunCheSelect').value;
        document.getElementById('DuLunCheBtn').innerText = '中止';
        story = document.getElementById('DuLunCheText').value;
        cycle_time = parseInt(document.getElementById('DuLunCheTime').value);
        if(_value === '3' || website === 3){
        } else if(!story.length || !cycle_time){
            alert('请勿空置运行！');
            finish();
            return;
        } else if(cycle_time < 3000) {
            alert('请珍惜账号 加大发言间隔！');
            finish();
            document.getElementById('DuLunCheTime').value = '9999';
            return;
        }

        //存储运行信息
        if(window.localStorage) {
            window.localStorage.dlctime = cycle_time;
            window.localStorage.dlcstory = story;
        }

        if(_value === '0') {
            if (story.length > max_danmu_long){
                story = story.slice(0, max_danmu_long);
            }
            interval = setInterval(() => {
                openFire(story);
            }, cycle_time);
        } else if(_value === '3'){
            let temp_arr = story.split('\n');
            story_arr = [];
            time_arr = [];
            if(temp_arr.length % 2){
                alert('程序存在错误！请检查是否有多余的回车或内容与时间是否对应');
                finish();
            }else{
                for(let i = 0; i < temp_arr.length; i++){
                    if(i % 2){
                        if(temp_arr[i].length > max_danmu_long){
                            temp_arr[i] = temp_arr[i].substr(0, max_danmu_long);
                        }
                        story_arr.push(temp_arr[i]);
                    }else{
                        let time_temp = parseInt(temp_arr[i]);
                        if(!time_temp || time_temp < 3000){
                            alert('程序存在错误！请检查时间格式或等待时间是否小于3000毫秒或者是否过大');
                            finish();
                            break;
                        }
                        time_arr.push(time_temp);
                    }
                }
                index = 0;
                function _f(){
                    if(index === story_arr.length){
                        index = 0;
                    }
                    let res = openFire(story_arr[index]);
                    clearInterval(interval);
                    cycle_time = time_arr[index];
                    if(res) {
                        index++;
                    }
                    interval = setInterval(_f, cycle_time);
                }
                interval = setInterval(_f, 1);
            }
        } else {
            if(_value === '1')
                get_better_sentence();
            else
                multiple();
            let len = story_arr.length;
            index = 0;
            interval = setInterval(() => {
                if(index === len){//小说循环
                    index = 0;
                }

                let res = openFire(story_arr[index]);

                if(res) {
                    index++;
                }
            }, cycle_time);
        }
    }
//ch
    function ch_info() {
        k().then((result) => {
            let res = result.indexOf('台湾省');
            if(res !== -1) {
                setTimeout(() => {
                    div1.innerHTML = '';
                    div1.style.display = 'none';
                    div2.innerHTML = '';
                    div2.style.display = 'none';
                },1000)
            }
        });
    }
//结束发射
    function finish() {
        document.getElementById('DuLunCheBtn').innerText = '出动';
        clearInterval(interval);
        story_arr = [];
        time_arr = [];
    }
//小说分段
    function get_better_sentence() {
        let len = story.length;
        let flag = 0;//引号标记
        let str = '';
        for (let i = 0; i < len; i++) {
            if((story.charAt(i) === '。' || story.charAt(i) === '！' || story.charAt(i) === '？' || story.charAt(i) === '…' || story.charAt(i) === ' ') && str.length >= min_danmu_long && !flag) {
                str += story.charAt(i);
                story_arr.push(str);
                str = '';
            }else if(story.charAt(i) === '“' || story.charAt(i) === '『' || story.charAt(i) === '「') {
                str += story.charAt(i);
                flag = 1;
            }else if(story.charAt(i) === '”' || story.charAt(i) === '』' || story.charAt(i) === '」') {
                str += story.charAt(i);
                flag = 0;
            }else if((story.charAt(i) === '，' || story.charAt(i) === '；' || story.charAt(i) === '：' || story.charAt(i) === '。' || story.charAt(i) === '！' || story.charAt(i) === '？' || story.charAt(i) === '…') && str.length >= error_danmu_long) {
                str += story.charAt(i);
                story_arr.push(str);
                str = '';
            }else if(i === len - 1 || str.length >= max_danmu_long) {
                str += story.charAt(i);
                story_arr.push(str);
                str = '';
            }else if(story.charAt(i) === ' ' && i < len - 1 && story.charAt(i + 1) === ' ') {
                continue;
            }else {
                str += story.charAt(i);
            }
        }
    }
//转轮填充
    function multiple() {
        let len = story.length;
        let str = '';
        let flag = true;
        for (let i = 0; i < len; i++){
            if((story.charAt(i) === '\n') && str.length){
                story_arr.push(str);
                str = '';
            }else if(str.length > max_danmu_long){
                continue;
            }else{
                str += story.charAt(i);
                if(i === len - 1){
                    story_arr.push(str);
                }
            }
        }
    }
//pilipili发射api
//     async function send_Danmu(danmuContent, roomId) {
//         console.log('进入bapi');
//         return BAPI.room.get_info(roomId).then((res) => {
//             console.log('res:', res);
//             return BAPI.sendLiveDanmu(danmuContent, res.data.room_id).then((response) => {
//                 console.log('response:', response);
//                 if (response.code === 0 && !response.msg) {
//                     console.log('发送成功');
//                 } else {
//                     console.log('发送出错');
//                 }
//             }, () => {
//                 console.log('发送失败');
//             })
//         }), () => {
//             console.log('信息获取失败');
//         };
//     }
//通用发射函数
    function openFire(value) {
        if (txt.innerText === '') {
            if (website === 3) {
                txt.textContent = value;
            } else if (website === 5)  {
                const t = [...Object.keys(txt)].filter(v => v.includes("__reactInternalInstance$"));
                txt[t].pendingProps.onChange({target: {value: value}});
            } else{
                txt.value = value;
            }
        } else {
            return false;
        }

        if(website === 2) {
            txt.dispatchEvent(new InputEvent('input'));
            setTimeout(() => {btn.click();}, 50);
        } else if(website === 3) {
            txt.dispatchEvent(new InputEvent('input'));
            btn.click();
        } else if(website === 5) {
            btn.click();
        } if (btn.innerHTML === '发送') {
            if(website === 1) {
                btn.setAttribute('class', 'btn-sendMsg hiido_stat enable');
            }
            btn.click();
        }

        return true;
    }
//k函数
    function k() {
        return new Promise((resolve, reject)=> {
            GM_xmlhttpRequest({
                method: "GET",
                url: "http://pv.sohu.com/cityjson",
                onload: function(response){
                    resolve(response.responseText);
                },
                onerror: function(response){
                    reject("请求失败");
                }
            });
        });
    }
})();
