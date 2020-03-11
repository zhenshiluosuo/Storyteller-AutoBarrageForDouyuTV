//v3.0版 = 插件v0.1.0版 2020.3.11后不再更新3.0版

let tip = false;
let div1 = document.createElement('div');//默认悬浮窗
let div2 = document.createElement('div');//控制台
let css1 = 'background: #1A59B7;color:#ffffff;overflow: hidden;z-index: 998;position: fixed;padding:5px;text-align:center;width: 85px;height: 22px;border-radius: 5px;right: 10px;top: 30%;'
let css2 = 'background: #FFFFFF;color:#ffffff;overflow: hidden;z-index: 999;position: fixed;padding:5px;text-align:center;width: 155px;height: 370px;box-sizing: content-box;border: 1px solid #ff921a;border-radius: 5px;right: 10px;top: 30%;display: none;';
let max_danmu_long = 43;//弹幕字数限制
const min_danmu_long = 20;//最小弹幕长度
const error_danmu_long = 30;//防止无法断句弹幕长度
let cycle_time;//弹幕周期，单位毫秒 建议设定至6000毫秒以上 过低有系统屏蔽风险
let story;//textarea内容
let story_arr = [];//story分段
let time_arr = [];//时间记录
let index;//小说分段
let interval;//小说定时器
let danmu_interval;//等待弹幕div加载定时器
let color_box = [];//禁止的弹幕颜色
let div_manmu;//网页弹幕div

init();//初始化

//核心功能函数
function init() {
    div1.id = 'DuLunChe';
    div1.id = 'DuLunChe1';
    div1.style.cssText = css1;
    div2.style.cssText = css2;
    div1.innerHTML = '独轮车控制台';
    div2.innerHTML = '<select id="DuLunCheSelect"><option value="0">单句模式</option><option value="1">说书模式</option><option value="2">多句转轮</option><option value="3">编程模式</option></select><textarea id="DuLunCheText" rows="10" cols="20" placeholder="输入内容" style="margin: 2px;overflow: scroll;overflow-wrap: normal;"></textarea><div  style="margin: 0 auto;"><input type="text" placeholder="间隔时间(ms) 建议六千以上" style="width: 145px;margin: 1px;" id="DuLunCheTime"/><div><button id="DuLunCheBtn" style="display: inline-block; background: #f70; color: #FFFFFF; width: 70px; height: 35px; margin: 2px;">出动</button><button id="DuLunCheYincang" style="display: inline-block; background: #f70; color: #FFFFFF; width:70px; height: 35px; margin: 2px;">隐藏控制台</button></div></div><div style="font-size: 75%;float: left;color: #777;">屏蔽白字黑奴：<input type="checkbox" id="dlc_btn1" value="0" /><br>屏蔽绿字色友：<input type="checkbox" id="dlc_btn2" value="1" /><br>屏蔽粉字男同：<input type="checkbox" id="dlc_btn3" value="2" /><br><span style:"display: block;">屏蔽主播狗叫：功能开发中</span></div>';
    div1.onclick = () => {
        div2.style.setProperty('display','block');
        if(!tip){
            tip = true;
            alert('欢迎使用说书人自动弹幕发射装置V3.0，本插件由斗鱼用户重载操作符和祖冲之丶丶基于祖冲之丶丶版制作，项目地址：https://github.com/zhenshiluosuo/Storyteller-AutoBarrageForDouyuTV/ 多句转轮模式每句之间请用回车分隔，斗鱼字数限制43，为了自己的账号和他人观看体验，建议发言间隔调至8000以上，喜欢的好兄弟打个星星吧~求求了！！！注：编程独轮车教程：奇数行为下一句发送的间隔毫秒时间，偶数行为发送内容，比如第一行8000，第二行啦啦啦，第三行10000，第四行噜噜噜，则先发送啦啦啦，8秒后发送噜噜噜，10秒后再发送啦啦啦，8秒后发送噜噜噜，依此类推');
        }
    };
    document.body.appendChild(div1);
    document.body.appendChild(div2);
    document.getElementById('DuLunCheYincang').onclick = () => {
        div2.style.setProperty('display','none');
    };
    document.getElementById('DuLunCheBtn').onclick = () => {
        if(document.getElementById('DuLunCheBtn').innerText === '出动') run();
        else finish();
    };
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
}
//发射弹幕
function run() {
    let btn = document.getElementsByClassName('ChatSend-button')[0];
    let txt = document.getElementsByClassName('ChatSend-txt')[0];
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
    if(_value === '0') {
        if (story.length > max_danmu_long){
            story = story.slice(0,max_danmu_long + 1);
        }
        interval = setInterval(() => {
            if(txt.value === ''){//输入框中有内容时等待用户发送完成后再继续
                txt.value = story;
                if (btn.innerHTML === '发送') {
                    btn.click();
                }
            }
        }, cycle_time);
    } else if(_value === '3'){
        let temp_arr = story.split('\n');
        if(temp_arr.length % 2){
            alert('程序存在错误！请检查是否有多余的回车或内容与时间是否对应');
            finish();
        }else{
            for(let i = 0; i < temp_arr.length; i++){
                if(i % 2){
                    if(temp_arr[i].length > 43){
                        temp_arr[i] = temp_arr[i].substr(0,43);
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
                if(txt.value === ''){//输入框中有内容时等待用户发送完成后再继续
                    txt.value = story_arr[index];
                    if (btn.innerHTML === '发送') {
                        btn.click();
                        clearInterval(interval);
                        cycle_time = time_arr[index++];
                        interval = setInterval(_f, cycle_time);
                    }
                }
            }
            interval = setInterval(_f, 100);
        }
    } else {
        if(_value === '1')
            get_better_sentence();
        else
            multiple();
        let len = story_arr.length;
        index = 0;
        interval = setInterval(() => {
            if(txt.value === ''){//输入框中有内容时等待用户发送完成后再继续
                if(index === len){//小说循环
                    index = 0;
                }
                txt.value = story_arr[index++];
                if (btn.innerHTML === '发送') {
                    btn.click();
                }
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
        }else if(str.length >= max_danmu_long || i === len - 1) {
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
        }else if(str.length > 43){
            continue;
        }else{
            str += story.charAt(i);
            if(i === len - 1){
                story_arr.push(str);
            }
        }
    }
}