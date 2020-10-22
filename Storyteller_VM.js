// ==UserScript==
// @icon          https://www.douyu.com/favicon.ico
// @name          独轮车-说书人自动弹幕发射器
// @namespace     https://greasyfork.org/scripts/396285
// @author        软中居士
// @description   适配斗鱼/虎牙/b站/ytb直播平台的自动弹幕发射器 抽象独轮车 说书人 Github:https://github.com/zhenshiluosuo/Storyteller-AutoBarrageForDouyuTV
// @match         *://www.douyu.com/*
// @match         *://www.huya.com/*
// @match         *://live.bilibili.com/*
// @match         *://www.youtube.com/*
// @version       1.0.1
// @license       MIT
// @grant         unsafeWindow
// @grant         GM_xmlhttpRequest
// @grant         GM_getResourceText
// @grant         GM_notification
// ==/UserScript==
(function () {
    'use strict';

    let tip = false;
    let div1 = document.createElement('div');//默认悬浮窗
    let div2 = document.createElement('div');//控制台
    let div3 = document.createElement('div');//计数器
    let div5 = document.createElement('div');//设置
    let css1 = 'background: #1A59B7;color:#ffffff;overflow: hidden;z-index: 996;position: fixed;padding:5px;text-align:center;width: 85px;height: 22px;border-radius: 5px;right: 10px;top: 30%;'
    let css2 = 'background: #FFFFFF;color:#ffffff;overflow: hidden;z-index: 997;position: fixed;padding:5px;text-align:center;width: 155px;height: 370px;box-sizing: content-box;border: 1px solid #ff921a;border-radius: 5px;right: 10px;top: 30%;display: none;';
    let css3 = 'background: #FFFFFF;color:#000000;overflow: hidden;z-index: 999;position:absolute;text-align:center;width: 100%;height: 100%;box-sizing: border-box;border: 1px solid #ff921a;border-radius: 5px;top: 7%;right: 1px;display: none;';
    let css5 = 'background: #FFFFFF;color:#000000;overflow: hidden;z-index: 999;position:absolute;text-align:center;width: 100%;height: 100%;box-sizing: border-box;border: 1px solid #ff921a;border-radius: 5px;top: 7%;right: 1px;display: none;';
    let div2_innerHTML1 = '<div><select style="display:inline-block;position:relative;" id="DuLunCheSelect"><option value="0">单句模式</option><option value="1">说书模式</option><option value="2">多句转轮</option><option value="3">编程模式</option><option value="4">计数器</option><option value="5">快速发射</option></select><div id="dlcSetting1" style="display:inline-block;position:relative;width:19px;height: 19px;background-image: url(https://shark2.douyucdn.cn/front-publish/live-master/assets/images/guessHeadIcon_new_3e70beb.png);background-position: -158px 0px;cursor: pointer;float:right;margin-right: 5px;""></div></div><textarea id="DuLunCheText" rows="10" cols="20" placeholder="输入需要发射的内容到这里哦☆发射前请斟酌内容是否符合斗鱼的弹幕规范☆最重要的是！大伙不爱看烂活！⚠pilipili直播弹幕功能暂时有些问题，下个版本修复" style="margin: 2px;overflow: scroll;overflow-wrap: normal;"></textarea><div  style="margin: 0 auto;"><input type="text" placeholder="间隔时间(ms) 建议六千以上" style="width: 145px;margin: 1px;" id="DuLunCheTime"/><div><button id="DuLunCheBtn" style="display: inline-block; background: #f70; color: #FFFFFF; width: 70px; height: 35px; margin: 2px;">出动</button><button id="DuLunCheYincang" style="display: inline-block; background: #f70; color: #FFFFFF; width:70px; height: 35px; margin: 2px;">隐藏</button></div></div><div style="font-size: 75%;float: left;color: #777;">屏蔽白字黑奴：<input type="checkbox" id="dlc_btn1" value="0" /><br>屏蔽绿字色友：<input type="checkbox" id="dlc_btn2" value="1" /><br>屏蔽粉字男同：<input type="checkbox" id="dlc_btn3" value="2" /><br>临时应急弹幕：<input type="checkbox" id="dlc_btn4" value="2" /></div>';
    let div3_innerHTML1 = '<textarea id="DuLunCheCountText" rows="6" cols="19" placeholder="输入计数内容,如：“本局豹女Q命中次数：”" style="margin: 0 auto;overflow: scroll;overflow-wrap: normal;"></textarea><div><h5 style="margin: 5px;">计数方式1</h5><div><input type="text" value="0" id="dlcCount1" style="width:40%;"/>&nbsp/&nbsp<input value="0" type="text" id="dlcCount2" style="width:40%;"/></div><div style="margin-top:5px;"><button id="dlcCountBtn1" style="height: 20px;width:40%;font-size:50%;background: #f70; color: #FFFFFF;">增加双值</button>&nbsp&nbsp&nbsp<button id="dlcCountBtn2" style="height: 20px;width:40%;font-size:50%;background: #f70; color: #FFFFFF;">增加分母</button><div style="margin: 2px;"><button id="dlcCountBtn3" style="width:50%;font-size:50%;background: #f70; color: #FFFFFF;height: 20px;">发送</button></div></div></div><div><h5 style="margin: 5px;">计数方式2</h5><div><input type="text" value="0" id="dlcCount3" style="width:35%;"/>&nbsp单位:<input value="次" type="text" id="dlcCountUnit" style="width:30%;"/></div><div style="margin-top:5px;"><button id="dlcCountBtn5" style="height: 20px;width:45%;font-size:50%;background: #f70; color: #FFFFFF;">增加值</button>&nbsp&nbsp&nbsp<button id="dlcCountBtn6" style="height: 20px;width:45%;font-size:50%;background: #f70; color: #FFFFFF;">发送</button></div><div style="margin: 5px;"><button id="dlcCountBtn0" style="width:50%;font-size:50%;background: #f70; color: #FFFFFF;height: 20px;">重置数据</button></div>';
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
    let danmu_helperX = false;//应急弹幕标记
    let danmu_count = 0;
    let danmu_parent = null;
    let website;//当前站点 0:斗鱼 1：虎牙 2:p站 3：ytb...
    let btn = null; //发送按钮
    let txt = null; //输入框
    let dlc_radio_words; //热词
    let ytb_iframe;//ytb直播右侧iframe
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
            error_danmu_long = 180;
            website = 3;
        }
        div1.id = 'DuLunChe1';
        div2.id = 'DuLunChe2';
        div3.id = 'dlc-select-window';
        div5.id = 'dlc-radio-window';
        div1.style.cssText = css1;
        div2.style.cssText = css2;
        div3.style.cssText = css3;
        div5.style.cssText = css5;
        div1.innerHTML = '独轮车控制台';
        div2.innerHTML = div2_innerHTML1;
        div3.innerHTML = div3_innerHTML1;
        div1.onclick = () => {
            div2.style.setProperty('display','block');
            if(!tip){
                tip = true;
                alert('欢迎使用持续更新的独轮车-说书人自动弹幕发射装置，对本插件的意见和问题可以到Github反馈哦，项目地址：https://github.com/zhenshiluosuo/Storyteller-AutoBarrageForDouyuTV/ ，NGA用户可以私信：飞天小协警 。多句转轮模式每句之间请用回车分隔，斗鱼字数限制43，为了自己的账号和他人观看体验，建议发言间隔调至8000以上，喜欢的好兄弟打个星星吧~求求了！！！注：编程独轮车教程：奇数行为下一句发送的间隔毫秒时间，偶数行为发送内容，比如第一行8000，第二行啦啦啦，第三行10000，第四行噜噜噜，则先发送啦啦啦，8秒后发送噜噜噜，10秒后再发送啦啦啦，8秒后发送噜噜噜，依此类推 注：部分功能可能在非斗鱼平台上无法使用 定制功能:shinymoon@aliyun.com');
            }
        };
        document.body.appendChild(div1);
        document.body.appendChild(div2);
        div2.appendChild(div3);
        div2.appendChild(div5);
        document.getElementById('DuLunCheYincang').onclick = () => {
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
            if(txt === ''){//输入框中有内容时等待用户发送完成后再继续
            }
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
            document.getElementById('dlcSetting1').onmouseover = () => {
                document.getElementById('dlcSetting1').style.backgroundPositionY="-28px";
            };
            document.getElementById('dlcSetting1').onmouseout = () => {
                document.getElementById('dlcSetting1').style.backgroundPositionY="0px";
            };
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
                    btn = ytb_iframe.document.querySelector('#send-button button'); // 输入框
                    console.log('btn:', btn);
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
                    txt = ytb_iframe.document.querySelector('#input.yt-live-chat-text-input-field-renderer'); // 输入框
                    console.log('txt:', txt);
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
        //加载热词模块
        div5.innerHTML = `<button style="background: #ff921a; width: 80%; height: 7%; margin: 3px auto; text-align: center; color: white;" id="dlc_radio_change">修改</button>
                          <div style="cursor: pointer; border: 1px solid #ff921a; width: 85%; height: 13%; margin: 1px auto; display: flex; justify-content: center; align-items: center;" id="dlc_radio_words0"></div>
                          <div style="cursor: pointer; border: 1px solid #ff921a; width: 85%; height: 13%; margin: 1px auto; display: flex; justify-content: center; align-items: center;" id="dlc_radio_words1"></div>
                          <div style="cursor: pointer; border: 1px solid #ff921a; width: 85%; height: 13%; margin: 1px auto; display: flex; justify-content: center; align-items: center;" id="dlc_radio_words2"></div>
                          <div style="cursor: pointer; border: 1px solid #ff921a; width: 85%; height: 13%; margin: 1px auto; display: flex; justify-content: center; align-items: center;" id="dlc_radio_words3"></div>
                          <div style="cursor: pointer; border: 1px solid #ff921a; width: 85%; height: 13%; margin: 1px auto; display: flex; justify-content: center; align-items: center;" id="dlc_radio_words4"></div>
                          <div style="cursor: pointer; border: 1px solid #ff921a; width: 85%; height: 13%; margin: 1px auto; display: flex; justify-content: center; align-items: center;" id="dlc_radio_words5"></div>
                          <div id="dlc-radio-revise-window" style="display: none; border: 1px solid #ff921a;border-radius: 5px;background: white; position: fixed; width: 420px; height:300px; top: 50%; left: 50%; transform: translate(-50%, -50%);z-index: 1000;">
                            <input style="cursor:pointer; display: block; margin: 5px auto; width: 85%; height: 25px; padding: 3px;" type="text" id="dlc_radio_input0" placeholder="字符限制30以内，超出部分将在保存时剪掉" />
                            <input style="display: block; margin: 5px auto; width: 85%; height: 25px; padding: 3px;" type="text" id="dlc_radio_input1" placeholder="字符限制30以内，超出部分将在保存时剪掉" />
                            <input style="display: block; margin: 5px auto; width: 85%; height: 25px; padding: 3px;" type="text" id="dlc_radio_input2" placeholder="字符限制30以内，超出部分将在保存时剪掉" />
                            <input style="display: block; margin: 5px auto; width: 85%; height: 25px; padding: 3px;" type="text" id="dlc_radio_input3" placeholder="字符限制30以内，超出部分将在保存时剪掉" />
                            <input style="display: block; margin: 5px auto; width: 85%; height: 25px; padding: 3px;" type="text" id="dlc_radio_input4" placeholder="字符限制30以内，超出部分将在保存时剪掉" />
                            <input style="display: block; margin: 5px auto; width: 85%; height: 25px; padding: 3px;" type="text" id="dlc_radio_input5" placeholder="字符限制30以内，超出部分将在保存时剪掉" />
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
    }
//发射弹幕
    function run() {
        let _value = document.getElementById('DuLunCheSelect').value;
        document.getElementById('DuLunCheBtn').innerText = '中止';
        story = document.getElementById('DuLunCheText').value;
        cycle_time = parseInt(document.getElementById('DuLunCheTime').value);
        if(_value === '3'){
        }else if(!story.length || !cycle_time){
            alert('请勿空置运行！');
            finish();
            return;
        }else if(cycle_time <= 2999) {
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
        if(txt.innerText === '') {
            if(website === 3) {
                txt.textContent = value;
            } else {
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
        } else if (btn.innerHTML === '发送') {
            if(website === 1) {
                btn.setAttribute('class', 'btn-sendMsg hiido_stat enable');
            }
            btn.click();
        }

        return true;
    }
})();
