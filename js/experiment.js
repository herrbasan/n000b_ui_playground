'use strict';
import ut from '../nui/nui_ut.js';
let fb = function() { ut.fb('!ctx_EXP', ...arguments)}

let ex = {};
let easings = { 
	non:function easeLinear (t, b, c, d) { return c * t / d + b; },
	quadIn: function easeInQuad (t, b, c, d) { return c * (t /= d) * t + b;},
	quadOut:function easeOutQuad (t, b, c, d) { return -c * (t /= d) * (t - 2) + b; },
	quadInOut:function easeInOutQuad (t, b, c, d) { if ((t /= d / 2) < 1) return c / 2 * t * t + b; return -c / 2 * ((--t) * (t - 2) - 1) + b;},
	sineIn: function easeInSine (t, b, c, d) { return -c * Math.cos(t / d * (Math.PI / 2)) + c + b; },
	sineOut: function easeOutSine (t, b, c, d) { return c * Math.sin(t / d * (Math.PI / 2)) + b;},
	sineInOut:function easeInOutSine (t, b, c, d) { return -c / 2 * (Math.cos(Math.PI * t / d) - 1) + b;},
	expoIn:function easeInExpo (t, b, c, d) { return (t == 0) ? b : c * Math.pow(2, 10 * (t / d - 1)) + b;},
	expoOut:function easeOutExpo (t, b, c, d) { return (t == d) ? b + c : c * (-Math.pow(2, -10 * t / d) + 1) + b;},
	expoInOut:function easeInOutExpo (t, b, c, d) { if (t == 0) return b; if (t == d) return b + c; if ((t /= d / 2) < 1) return c / 2 * Math.pow(2, 10 * (t - 1)) + b; return c / 2 * (-Math.pow(2, -10 * --t) + 2) + b; },
	circIn:function easeInCirc (t, b, c, d) { return -c * (Math.sqrt(1 - (t /= d) * t) - 1) + b;},
	circOut:function easeOutCirc (t, b, c, d) { return c * Math.sqrt(1 - (t = t / d - 1) * t) + b;},
	circInOut:function easeInOutCirc (t, b, c, d) { if ((t /= d / 2) < 1) return -c / 2 * (Math.sqrt(1 - t * t) - 1) + b; return c / 2 * (Math.sqrt(1 - (t -= 2) * t) + 1) + b;},
	cubicIn:function easeInCubic (t, b, c, d) { return c * (t /= d) * t * t + b;},
	cubicOut:function easeOutCubic (t, b, c, d) { return c * ((t = t / d - 1) * t * t + 1) + b;},
	cubicInOut:function easeInOutCubic (t, b, c, d) { if ((t /= d / 2) < 1) return c / 2 * t * t * t + b; return c / 2 * ((t -= 2) * t * t + 2) + b;},
	quartIn:function easeInQuart (t, b, c, d) { return c * (t /= d) * t * t * t + b;},
	quartOut: function easeOutQuart (t, b, c, d) { return -c * ((t = t / d - 1) * t * t * t - 1) + b;},
	quartInOut: function easeInOutQuart (t, b, c, d) { if ((t /= d / 2) < 1) return c / 2 * t * t * t * t + b; return -c / 2 * ((t -= 2) * t * t * t - 2) + b;},
	quintIn:function easeInQuint (t, b, c, d) { return c * (t /= d) * t * t * t * t + b;},
	quintOut:function easeOutQuint (t, b, c, d) { return c * ((t = t / d - 1) * t * t * t * t + 1) + b;},
	quintInOut:function easeInOutQuint (t, b, c, d) { if ((t /= d / 2) < 1) return c / 2 * t * t * t * t * t + b; return c / 2 * ((t -= 2) * t * t * t * t + 2) + b;},
	elasticIn: function easeInElastic (t, b, c, d) { var s = 1.70158; var p = 0; var a = c; if (t == 0) return b; if ((t /= d) == 1) return b + c; if (!p) p = d * .3; if (a < Math.abs(c)) { a = c; var s = p / 4; } else var s = p / (2 * Math.PI) * Math.asin(c / a); return -(a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b; },
	elasticOut: function easeOutElastic (t, b, c, d) { var s = 1.70158; var p = 0; var a = c; if (t == 0) return b; if ((t /= d) == 1) return b + c; if (!p) p = d * .3; if (a < Math.abs(c)) { a = c; var s = p / 4;} else var s = p / (2 * Math.PI) * Math.asin(c / a); return a * Math.pow(2, -10 * t) * Math.sin((t * d - s) * (2 * Math.PI) / p) + c + b;},
	elasticInOut: function easeInOutElastic (t, b, c, d) { var s = 1.70158; var p = 0; var a = c; if (t == 0) return b; if ((t /= d / 2) == 2) return b + c; if (!p) p = d * (.3 * 1.5); if (a < Math.abs(c)) { a = c; var s = p / 4; } else var s = p / (2 * Math.PI) * Math.asin(c / a); if (t < 1) return -.5 * (a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b; return a * Math.pow(2, -10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p) * .5 + c + b;},
	backIn: function easeInBack (t, b, c, d) { var s = 1.70158; return c * (t /= d) * t * ((s + 1) * t - s) + b; },
	backOut:function easeOutBack (t, b, c, d) { var s = 1.70158; return c * ((t = t / d - 1) * t * ((s + 1) * t + s) + 1) + b; },
	backInOut:function easeInOutBack (t, b, c, d) { var s = 1.70158; if ((t /= d / 2) < 1) return c / 2 * (t * t * (((s *= (1.525)) + 1) * t - s)) + b; return c / 2 * ((t -= 2) * t * (((s *= (1.525)) + 1) * t + s) + 2) + b;}
}

ex.animateJS = function(el, prop){
	el = ut.el(el);
	let id = ut.id();
	el.ani_id = id;
	let duration = prop.duration || 1;
	let delay = prop.delay;
	let ease = easings[prop.ease || 'non'];
	let complete = prop.complete;
	delete prop.duration; delete prop.delay; delete prop.ease; delete prop.complete;
	let fps = window.fps || 60;
	let idx = 0;
	let inc = duration / (fps * duration);
	fb(prop);
	loop();
	function loop(){
		if(el.ani_id != id){
			fb('Animation Overwritten');
			return;
		}
		if(idx > duration){
			fb('Animation Done');
			el.ani_id = null;
			complete();
			return;
		}
		requestAnimationFrame(loop);
		let val = ease(idx, prop.from, prop.to, duration);
		let style_name = prop.setter.split(':')[0].trim();
		let style_prop = prop.setter.split(':')[1].split('_$_').join(val+'px').trim();
		el.style.setProperty(style_name, style_prop);
		idx += inc;
	}
}

ex.estimateFPS = (i) => {
	return new Promise((resolve, reject) => {
		let idx = 0;
		let max = i;
		let start = performance.now();
		let track = [];
		requestAnimationFrame(loop);
		function loop(){
			if(idx == max){ resolve(done(track)); return;}
			idx++;
			let delta = performance.now() - start;
			start += delta;
			track.push(delta);
			requestAnimationFrame(loop);
		}
	})
	
	function done(ar){
		ar.sort(function(a,b) { return a - b;});
		ar = ar.slice(Math.ceil(i*0.2),ar.length-Math.ceil(i*0.2));
		return ar.reduce(function(a, b) { return a + b}) / ar.length;
	}
}

ex.estimateFPS(40).then((r) => {
	window.fps = Math.round(1000 / r);
	fb('Detected refresh rate: ' + window.fps);
});


ex.animate_keyframes = function(el, prop){
	return new Promise((resolve, reject) => {
		el = ut.el(el);
		let id = ut.id();
		let cid = 'ani' + id;
		let css = window.document.styleSheets[0];
		css.insertRule(`@keyframes ${id} { ${prop.keyframes} }`, css.cssRules.length );
		css.insertRule(`.${cid} { animation: ${id} ${prop.duration}s forwards ${prop.ease} }`, css.cssRules.length );
		el.addEventListener('animationend', animationEnd);
		el.classList.add(cid);

		function animationEnd(e){
			let styles = getComputedStyle(el);
			if(prop.keep){
				for(let key in styles){
					for(let i=0; i<prop.keep.length; i++){
						if(key == prop.keep[i]){
							el.style.setProperty(key, styles[key]);
						}
					}
				}
				
			}
			el.removeEventListener('animationend', animationEnd);
			requestAnimationFrame(() => {
				ut.removeClass(el,cid);
				css.deleteRule(ex.getCssRuleIndex(id,css));
				css.deleteRule(ex.getCssRuleIndex('.'+cid,css));
				if(prop.callback) { prop.callback(el) };
				resolve(el);
			})
		}
	})
}

ex.getCssRuleIndex = function(name, sheet){
	let rules = sheet?.cssRules ? sheet.cssRules : window.document.styleSheets[0];
	let idx = -1;
	for(let i=0; i<rules.length; i++){
		if(rules[i].name){
			if(rules[i].name == name){
				idx = i;
				break;
			}
		}
		else {
			if(rules[i].selectorText == name){
				idx = i;
				break;
			}
		}
	}
	return idx;
}

export default ex;