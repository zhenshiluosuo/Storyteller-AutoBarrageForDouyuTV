var div1 = document.createElement('div');//默认悬浮窗
var div2 = document.createElement('div');//控制台
var css1 = 'background: #1A59B7;color:#ffffff;overflow: hidden;z-index: 998;position: fixed;padding:5px;text-align:center;width: 75px;height: 22px;border-bottom-left-radius: 4px;border-bottom-right-radius: 4px;border-top-left-radius: 4px;border-top-right-radius: 4px;right: 10px;top: 30%;'
var css2 = 'background: #e5e4e4;color:#ffffff;overflow: hidden;z-index: 999;position: fixed;padding:5px;text-align:center;width: 150px;height: 275px;border-color: #FFFFFF;border: 3px;border-bottom-left-radius: 4px;border-bottom-right-radius: 4px;border-top-left-radius: 4px;border-top-right-radius: 4px;right: 10px;top: 30%;display: none;';
div1.style.cssText = css1;
div2.style.cssText = css2;
div1.innerHTML = '独轮车控制台';
div2.innerHTML = '<select id="DuLunCheSelect"><option value="0">单句模式</option><option value="1">说书模式</option></select><textarea id="DuLunCheText" rows="10" cols="20" placeholder="输入内容"></textarea><div  style="margin: 0 auto;"><input type="text" placeholder="间隔时间(ms) 建议六千以上" id="DuLunCheTime"/><button id="DuLunCheBtn" style="background-color: #FFFFFF;">出动！</button><br><button id="DuLunCheYincang" style="background-color: #FFFFFF;">隐藏控制台</button></div>';
div1.id = 'DuLunChe';
div1.id = 'DuLunChe1';
div1.onclick = () => {div2.style.setProperty('display','block');}
document.body.appendChild(div1);
document.body.appendChild(div2);
document.getElementById('DuLunCheYincang').onclick = () => {div2.style.setProperty('display','none');}
document.getElementById('DuLunCheBtn').onclick = () => {run();}
var max_danmu_long = 43;//每句长度
var mode = 1;//工作方式：0只发送单句模式 1说书模式 2 混合模式（发送数次小说后发送一次设定的句子）
var num = 10;//小说num句后，发送一次设定的句子
var cycle_time = 12306;//弹幕周期，单位毫秒 建议设定至6000毫秒以上 有系统屏蔽风险
var min_danmu_long = 20;//最小弹幕长度
var error_danmu_long = 30;//出错弹幕长度
var story;//小说内容
var story_arr = [];
var index = 0;//小说分段
let interval;//定时器
var w = [];
var x = 0;
var num = 0;
function init() {

}
function run() {
    document.getElementById('DuLunCheBtn').value = '中止';
    story = document.getElementById('DuLunCheText').value;
    console.log(story);
    cycle_time = parseInt(document.getElementById('DuLunCheTime').value);
    for(var i = 0; i < story.length; i++){
        num++;
        if((num >= 20 && story.slice(i, i+1) === '。') || (num >= 35 && story.slice(i, i+1) === '，') || num === 43 || i === story.length - 1){
            w.push(story.slice(x, i+1));
            x = i + 1;
            num = 0;
        }
    }
    x = 0;
    interval = window.setInterval(()=>{
        document.getElementsByClassName('ChatSend-txt')[0].value = w[x++];
        document.getElementsByClassName('ChatSend-button')[0].click();
        if(x === w.length) x = 0;
    }, cycle_time);
}
function finish() {

}