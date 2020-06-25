(function (doc, win, undefined) {

	//同时定义了3个对象, 根元素, 事件名, 匿名函数
	var docEl = doc.documentElement,
		resizeEvt = 'orientationchange' in win ? 'orientationchange' : 'resize',
		recalc = function () {
			//核心代码
			//(1) 获取文档的宽度
			var clientWidth = docEl.clientWidth;
			//(2) 如果文档宽度获取失败, 直接返回
			if (clientWidth === undefined) return;
			//(3) 根据当前窗口的大小设置html元素的font-size的值
			//750是常用值，设计师给了多少宽度的设计图，这个值就是多少。
			//这时整个屏幕的宽度是7.5rem，750宽度时，1rem为100px
			docEl.style.fontSize = 100 * (clientWidth / 750) + 'px';
		};
	if (doc.addEventListener === undefined) return;
	win.addEventListener(resizeEvt, recalc, false);
	doc.addEventListener('DOMContentLoaded', recalc, false)
})(document, window);