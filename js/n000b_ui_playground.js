'use strict';

import ut from "../nui/nui_ut.js";
import gallery from "../nui/nui_gallery.js";
import nui from "../nui/nui.js";
import nui_app from "../nui/nui_app.js";


import ex from './experiment.js';
import contextMenu  from '../nui/nui_context_menu.js';
import superSelect from '../nui/nui_select.js';
import generate from '../nui/nui_generate_data.js';
import superList from "../nui/nui_list.js";


import global_audio from '../nui/nui_audio_context.js';
import audioVisualizer from "../nui/nui_audio_visualizer.js";
import mediaPlayer from "../nui/nui_media_player.js";
import cms_page_editor from '../nui/nui_cms_page_editor.js';

let nuip = {};
let g = {};

window.nuip = nuip;
window.ut = ut;
window.ex = ex;

let fb = function() { ut.fb('!ctx_MAIN', ...arguments)}
document.addEventListener("DOMContentLoaded", (e) => { fb('DOMContentLoaded'); nuip.init(); });
document.fonts.ready.then(() => { fb('Fonts Ready'); });

nuip.init = function(){
	fb('Playground Init')

	//testSomething();
	g.content = ut.el('.nui-content');
	var scrollBarWidth = ut.el('#content').offsetWidth - ut.el('#content').clientWidth;
	nui.initWindow(window,1024);

	let topbar_options = {
		items: [
			{
				name:"Toggle Dark/Light",
				icon:ut.icon('brightness'),
				fnc: () => document.body.classList.toggle('dark')
			},
			{
				name:"Random Color",
				icon:ut.icon('invert_colors'),
				fnc: nuip.changeColor
			},
			{
				name:"Video Background",
				icon:ut.icon('play'),
				fnc: nuip.playVideo
			}
		]
	}

	g.topbar = nui.renderTopBar(topbar_options);
	
	let nav_options = {
		fnc: nav,
		nav: [
			{ 
				name:'Content & Windows', 
				id:'content',
				icon:ut.icon('wysiwyg'),
				sub: [
					{
						name:'Containers',
						id:'containers',
						icon: ut.icon('arrow')
					},
					{
						name:'Page Layout',
						id:'page',
						icon: ut.icon('arrow')
					}
				]
			},
			{ 
				name:'Interaction',
				id:'interaction',
				icon:ut.icon('edit_note'),
				sub: [
					{
						name:'Alerts & Overlays',
						id:'alerts',
						icon: ut.icon('arrow')
					},
					{
						name:'Input Fields',
						id:'inputs',
						icon: ut.icon('arrow')
					},
					{
						name:'CMS Blocks',
						id:'cms',
						icon: ut.icon('arrow')
					}
				]
			},
			{ 
				name:'Media Elements', 
				id:'media',
				icon:ut.icon('play'),
				special: {
					name:'Edit Buckets',
					icon:ut.icon('settings'),
					fnc:() => { nui.alert('Nothing', 'Just something to happen when you hit that special button :)')}
				},
				sub: [
					{
						name:'Media Players',
						id:'players',
						icon: ut.icon('arrow')
					},
					{
						name:'SuperSlide',
						id:'superslide',
						icon: ut.icon('arrow')
					}
				]
			},
			{ 
				name:'SuperList',
				id:'lists',
				icon:ut.icon('article'),
				sub: [
					{
						name:'Super List',
						id:'superlist',
						icon: ut.icon('arrow')
					},
					{
						name:'Super Log',
						id:'superlog',
						icon: ut.icon('arrow')
					}
				]
			},
			{ 
				name:'Misc',
				id:'misc',
				icon:ut.icon('layers'),
				sub: [
					{
						name:'Generators',
						id:'generators',
						icon: ut.icon('arrow')
					},
					{
						name:'HTML5 Element Test',
						id:'html5',
						icon: ut.icon('arrow')
					},
					{
						name:'Experiments',
						id:'experiments',
						icon: ut.icon('arrow')
					},
					{
						name:'NUI Icons',
						id:'icons',
						icon: ut.icon('arrow')
					}
				]
			}
		]
	}
	g.sidebar = nui.renderNav(nav_options);

	let context_menu_settings = [
		{title:'Some Item', fnc:(t, e) => { nui.alert('Well done!', 'You picked: ' + e.currentTarget.title)}},
		{seperator:true},
		{title:'Another Item', fnc:(t, e) => { nui.alert('Well done!', 'You picked: ' + e.currentTarget.title)}},
		{title:'Second to last Item', fnc:(t, e) => { nui.alert('Well done!', 'You picked: ' + e.currentTarget.title)}},
		{seperator:true},
		{title:'Last Item', fnc:(t, e) => { nui.alert('Well done!', 'You picked: ' + e.currentTarget.title)}}
	]
	
	let cm = contextMenu(ut.el('#contextMenuDemo'), context_menu_settings)

	window.addEventListener("hashchange", hashChange, false);
	setTimeout(appStart, 50);
}

function appStart(){
	if(ut.locationHash().page == undefined){
		window.location.hash = 'page=content&id=containers';
	}
	else {
		go(ut.locationHash());
	}
	nui.animate_away('#main_loader','ani-fade-out');
	g.content.style.display = null;
	nui.lazyFade();
}


function nav(obj){
	let page = obj.pid;
	let sub = obj.sid;
	sub = sub ? '&id=' + sub : '';
	window.location.hash = 'page=' + page + sub;
}

function hashChange(e){
	go(ut.locationHash());
}

function hideAllPages(){
	ut.els('.nui-page').forEach(item => {
		item.addClass('nui-hide');
	})
	ut.els('main').forEach(item => {
		item.addClass('nui-hide');
	})
}

function go(obj){
	hideAllPages();
	let id = '#page_' + obj.page;
	if(obj.id) { id += '_' + obj.id};
	
	if(obj.page == 'interaction' && obj.id == 'alerts'){
		init_page_alerts(ut.el(id));
	}
	if(obj.page == 'interaction' && obj.id == 'inputs'){
		init_page_inputs();
	}
	if(obj.page == 'interaction' && obj.id == 'cms'){
		init_page_cms();
	}
	if(obj.page == 'lists' && obj.id == 'superlog'){
		init_page_superlog();
	}
	if(obj.page == 'lists' && obj.id == 'superlist'){
		init_page_superlist();
	}
	if(obj.page == 'media' && obj.id == 'superslide'){
		//init_page_superslide();
		init_gallery();
	}
	if(obj.page == 'media' && obj.id == 'players'){
		init_page_players();
	}
	if(obj.page == 'misc' && obj.id == 'html5'){
		init_page_html5();
	}
	if(obj.page == 'misc' && obj.id == 'experiments'){
		init_page_experiments();
	}
	if(obj.page == 'misc' && obj.id == 'icons'){
		init_page_icons();
	}

	if(!ut.el(id)){
		ut.el('#notfound').removeClass('nui-hide');
		return;
	}
	ut.removeClass(id, 'nui-hide');
	nui.isMenu = false;
	//nui.checkWindow();
	if(g.sidebar){ g.sidebar.setActive(obj.page, obj.id)}
	g.content.scrollTop = 0;
}

function init_page_alerts(target){
	if(!g.page_alerts){
		g.page_alerts = target;
		nui.dropZone('Drop Files Here', target.el('#dropzone'), console.log)
	}
}

function init_page_inputs(target){
	if(g.page_inputs){ return; }
	fb('Init Page Inputs')
	target = target ? target : document.body;
	g.page_inputs = target;
	let test = ut.createElement('div', {inner:'Create new...'});

	let ss = superSelect(target.el('#select_new'), {searchable:true, animation:false, noresult:test, noresult_fnc:(e) => {
			nui.prompt('Create new', [{label:'Name', id:'name', value:ss.search_input.value}], (action, value, cb) => { 
				fb(action, value);
				if(action == 'ok'){
					fb(ss);
					let item = ut.createElement('option', {attributes:{selected:true, value:value.name}, inner:value.name});
					ss.prepend(item);
				} 
				cb()
			})
			e.currentTarget.closest('.superSelect').select.pulldownHide();
		}
	});
	
	superSelect(target.el('#select_new2'), {animation: true, searchable:true})
	superSelect(target.el('#select_new3'), {animation:true})
	superSelect(target.el('#select_new4'), {animation:true, searchable:true})
	superSelect(target.el('#select_new5'), {animation:true})
	nui.setupInput(target.el('#testInput'), function(obj){ fb(obj)});
	nui.setupInput(target.el('#radios'), function(obj){ fb(obj)});
	nui.setupInput(target.el('#checkers'), function(obj){ fb(obj)});
}

async function init_page_cms(){
	if(!g.page_rich){
		let target = ut.el('#page_interaction_cms article');
		let templates = [
			{
				type: "media",
				label: "Media",
				data: ""
			},
			{
				type: "text",
				label: "Text",
				data: ""
			},
			{
				type: "input",
				label: "Input",
				data: ""
			},
			{
				type: "richtext",
				label: "Richtext",
				data: ""
			},
			{
				label: "Two Columns",
				type: "columns",
				columns:[[],[]]
			},
			{
				type: "richtext",
				label: "Richtext - Lorem",
				data: "!lorem"
			},
			{
				label: "Two Columns - Lorem",
				type: "columns",
				columns:[
					[
						{
							type: "richtext",
							label: "Richtext",
							data: "!lorem"
						}
					],
					[
						{
							type: "richtext",
							label: "Richtext",
							data: "!lorem"
						}
					]
				]
			},
			{
				label: "Three Columns - Lorem",
				type: "columns",
				columns:[
					[
						{
							type: "richtext",
							label: "Richtext",
							data: "!lorem"
						}
					],
					[
						{
							type: "richtext",
							label: "Richtext",
							data: "!lorem"
						}
					],
					[
						{
							type: "richtext",
							label: "Richtext",
							data: "!lorem"
						}
					]
				]
			},
		]

		let editor_page_props = {
			sections: [
				{
					"name":"header",
					"type":"fixed",
					"label":"Header",
					"groups": [
						{
							"type": "vars",
							"label": "Variables",
							"data": [
								{"type":"input", "label":"Company", "data":"Audi AG"},
								{"type":"input", "label":"Street", "data":""},
								{"type":"input", "label":"City", "data":""},
								{"type":"select", "label":"City", "data":[
									{"name":"Some Stuff", "value":1},
									{"name":"More Things", "value":2},
									{"name":"Another", "value":3},
									{"name":"Longish Name", "value":4},
									{"name":"Pointlessly superlong name", "value":5, "selected":true},
								]},
							]
						},
						{
							"label": "Cover",
							"type": "media",
							"data": "!lorem"
						}
					]
				},
				{
					"name": "section",
					"label": "Section",
					"groups": [
						{
							"label": "Cover",
							"type": "media",
							"data": "!lorem"
						},
						{
							"label": "Header",
							"type": "richtext",
							"data": "!lorem Header"
						},
						{
							"label": "Columns",
							"type": "columns",
							"columns":[
								[
									{
										"label": "Cover",
										"type": "media",
										"data": "!lorem"
									},
									{
										"type": "richtext",
										"label": "Text",
										"data": "!lorem Col_0_0",
									}
								],
								[
									{
										"type": "richtext",
										"label": "Text",
										"data": "!lorem Col_1_0",
									},
									{
										"label": "Cover",
										"type": "media",
										"data": "!lorem"
									}
								]
							]
						},
						{
							"type": "richtext",
							"label": "Footer",
							"data": "!lorem Footer",
						}
					]
				}
			]
		}
		
		g.page_rich = cms_page_editor(editor_page_props, templates, cms_demo_mediabrowser, cms_demo_mediaurl);
		ut.createElement('button', {inner:'Log Data', target:target, events:{click:(e) => {console.log(g.page_rich.prop)}}})
		target.appendChild(g.page_rich);

		function cms_demo_mediaurl(data, size){
			if(size == 'thumb'){
				return `./slide/webp_thumb/${data._id}.webp`;
			}
			else {
				return `./slide/webp_full_hd/${data._id}.webp`;
			}
		}
	}
	
}

function init_page_players(){
	if(g.players) { return;}
	g.players = ut.el('#page_media_players section article');
	let html = ut.htmlObject(/*html*/`
		<div>
			<h1>Video Player</h1>
			<video controls="">
				<source src="videos/Morocco.mp4">
			</video>
			<h1 style="margin-top:3rem">Audio Player</h1>
			<audio controls="">
				<source src="audio/Spacer.mp3">
			</audio>
			<h1 style="margin-top:3rem">Audio Player Inline</h1>
			<audio controls="">
				<source src="audio/Bullshift.mp3">
			</audio>
		</div>
	`)
	mediaPlayer({media:html.el('video'), pause_other_players:true})
	mediaPlayer({media:html.els('audio')[0], pause_other_players:true})
	mediaPlayer({media:html.els('audio')[1], pause_other_players:true})
	g.players.appendChild(html);
	fb('Init Page Players')
}

function init_gallery(){
	if(g.gallery) { return; }
	let prop = {
		settings: { target:ut.el('#image_slide'), verbose:false, gap:0, show_bubbles:true, show_info:false, show_arrows:true, show_fullscreen:true },
		media: [
			{name:'First', url:'./slide/webp_full_hd/040.webp'},
			{name:'Second', url:'./slide/webp_full_hd/041.webp'},
			{name:'Third', url:'./slide/webp_full_hd/042.webp'},
			{name:'Fourth', url:'./slide/webp_full_hd/043.webp'},
			{name:'Fifth', url:'./slide/webp_full_hd/044.webp'},
			{name:'Video', url:'./videos/Morocco.mp4'},
			{name:'Last', url:'./slide/webp_full_hd/050.webp'},
		]
	}
	g.gallery = gallery(prop);
}

function init_page_superslide(){
	if(g.superSlide) { return;}
	fb('Init Page Superslide')
	let slider_data = [];
	for(let i=0; i<6; i++){
		slider_data.push({name:i, type:'image', url:nuip.randomImage('webp_full_hd')})
	}
	slider_data.push({name:'video', type:'video', url:'videos/Morocco.mp4'})
	superSlide.slideInit(ut.el('#image_slide'), slider_data);
	g.superSlide = true;
}


function init_page_superlog(){
	if(nuip.scroller){ nuip.scroller.reset(); return; }
	fb('Init Page SuperLog')
	let data = [];
	for(var i=0; i<100; i++){
		let item = {name:'Dummy Event | ' + generate.name(), date:generate.date(), idx:i}
		data.push(item);
	}

	let options = {
		id:'nui-superlog',
		target:ut.el('#page_lists_superlog .nui-superlist'),
		data:data,
		render:ss_log_item,
		logmode: true,
		/*events:(e) => { nuip.log(e?.target?.id + ' | ' + e.type + ' ' + e.value)},*/
	}
	nuip.scroller = superList(options);
	
	dummyEvent();

	function dummyEvent(){
		nuip.log('Random Event | ' + generate.name())
		setTimeout(dummyEvent, (Math.random()*1000)+100)
	}

	function ss_log_item(item){
		let html = ut.htmlObject(`
			<div id="item_${item.idx}" class="superlist-log-item" style>
				<div>${item.idx}</div>
				<div>${item.name}</div>
				<div>${ut.formatDate(item.date).full}</div>
			</div>
		`)
		return html;
	}
}

nuip.log = function(data){
	if(nuip.scroller){
		nuip.scroller.options.data.push({name:data, date:Date.now(), idx:nuip.scroller.options.data.length})
		nuip.scroller.appendData();
	}
}

function init_page_superlist(){
	if(nuip.ss_list1){ return; }
	fb('Init Page Superlist')
	let data = [];
	for(let i=0; i<50000; i++){
		let item = {};
		item.idx = i;
		item.image = ut.lz(Math.ceil(Math.random()*360),3);
		item.name = generate.name();
		item.c_date = generate.date();
		item.m_date = generate.date();
		data.push(item);
	}


	let options = {
		id:'nui-superlist',
		verbose:true,
		/*events:(e) => { nuip.log(e?.target?.id + ' | ' + e.type + ' ' + e.value)},*/
		target:ut.el('#page_lists_superlist .nui-superlist'),
		data:data,
		render:ss_list_item,
		sort_default:2,
		sort:[
			{label:'Index', prop:'idx', numeric:true},
			{label:'Name', prop:'name'},
			{label:'Creation Date', prop:'c_date', numeric:true},
			{label:'Modification Date', prop:'m_date', numeric:true}
		],
		search: [
			{prop:'name'},
			{prop:'idx'}
		],
		footer: {
			buttons_left: [
				{type:'reset', label:'Delete', fnc:(e) => { fb(e)}},
				{type:'outline', label:'Clear', fnc:killList}
			],
			buttons_right: [
				{type:'', label:'Add', fnc:add}
			]
		}
	}

	function killList(){
		fb('Kill')
		nuip.ss_list1.cleanUp();
		options = null;
		nuip.ss_list1 = null;
		delete nuip.ss_list1;
	}

	function add(e){
		console.log(nuip.ss_list1.getSelection(true));
	}

	nuip.ss_list1 = superList(options);
	
	function ss_list_item(item){
		let html = ut.htmlObject( /*html*/ `
			<div class="superlist-list-item" style>
				<div>${ut.lz(item.idx,3)}</div>
				<div><img src="" style="opacity:0"></div>
				<div>${item.name}</div>
				<div>
					<div>${ut.formatDate(item.c_date).full}</div>
					<div>${ut.formatDate(item.m_date).full}</div>
				</div>
			</div>
		`)
		
		html.addEventListener('dblclick', (e) => { 
			nui.lightbox({type:'image', url:`slide/webp_full_hd/${data[e.target.oidx].image}.webp`})
		});

		html.img_el = html.el('img');
		html.update_delay = 100;
		html.update = () => {
			html.img_el.src = `slide/webp_thumb/${item.image}.webp`; 
			html.img_el.addEventListener('load', loaded)
		}
		function loaded(){
			html.img_el.removeEventListener('load', loaded)
			html.img_el.style.opacity = null;
			html.update = null;
		}
		return html;
	}
}

function init_page_html5(){
	if(g.page_html) { return;}
	g.page_html = ut.el('#page_misc_html5');
	fetch('html_tag_test.html')
	.then((res) => res.text())
	.then(text => { 
		let html = document.createRange().createContextualFragment(text).querySelectorAll('section');
		for(let i=0; i<html.length; i++){
			g.page_html.appendChild(html[i]);
		}
		upgradeElements(g.page_html);
	})
}

function init_page_experiments(){
	if(g.page_experiments) { return; }
	g.page_experiments = ut.el('#page_misc_experiments section article');
	let html = ut.htmlObject(/*html*/`
		<div>
			<div class="nui-card">
				<div class="nui-headline">Animation Experiments</div>
				<div class="nui-button-container">
					<label style="margin-right: auto;">Experimental things</label>
					<button>Animate This</button>
					<button>Animate Card</button>
					<button>Transition</button>
					<button>Chained Transition</button>
				</div>
			</div>
			<div class="nui-card" style="">
				<div class="nui-headline">Floating (buttonsize)</div>
				<div class="nui-button-container">
					
					
					<div class="nui-input"><input placeholder="Type here"></div>
					<select data-upgrade="true">
						<option>Mom</option>
						<option>Dad</option>
						<option>Cat</option>
						<option>Dog that doesn't fit at all</option>
					</select>
					<button>Short</button>
					<button type="outline">A Bit Longer</button>
				</div>
			</div>
			<h1>Audio Player</h1>
			<div class="nuip-audioplayers">
				<div id="viz" class="nui-card">
					<div class="left"></div>
					<div class="right"></div>
				</div>
				
				
				
			</div>
			<h1>Streaming</h1>
			<div id="streaming_audio"></div>
			
		</div>
	`)

	g.page_experiments.appendChild(html);
	superSelect(html.el('select'));
	let btns = html.els('button');
	btns[0].addEventListener('click', (e) => {
		ex.animate_keyframes(e.currentTarget, {
			callback:(el) => { fb('Animation Done') },
			duration:1,
			ease: 'ease-in-out',
			keep: ['transform', 'opacity'],
			keyframes:`
				0%  { }
				50% { transform: translate(-6em,0); opacity:1 }
				100% { transform: translate(0,0); opacity:0.7 }`
		})
	});

	btns[1].addEventListener('click', (e) => {
		ex.animate_keyframes(e.currentTarget.closest('.nui-card'), {
			callback:(el) => { fb('Animation Done') },
			duration:1,
			ease: 'ease-in-out',
			keyframes:`
				0%  { transform: scale(1) } 
				50% { transform: scale(0.8); opacity:0.5 }
				100% { transform: scale(1)}`
				
		})
	})

	btns[2].addEventListener('click', (e) => {
		nui.animate_transition(e.currentTarget.closest('.nui-card'), {
			callback:(el) => { fb('Animation Done') },
			duration:0.5,
			ease: 'ease-in-out',
			transition_back: true,
			remove: true,
			from: { transform: 'scale(1)', opacity:1},
			to:{ transform: 'scale(0.8)', opacity:0.5}
		})
	})

	btns[3].addEventListener('click', async (e) => {
		let el = e.currentTarget;
		await nui.animate_transition(el, { duration: 0.5, ease: 'ease-in-out', to: { transform: 'scaleX(-1)'} })
		await nui.animate_transition(el, { duration: 1, ease: 'ease-in-out', to: { transform: 'scaleX(-1) rotate(180deg)'} })
		await nui.animate_transition(el, { duration: 0.5, ease: 'ease-in-out', to: { transform: 'scaleX(-1) rotate(0deg)'} })
		await nui.animate_transition(el, { remove:true, duration: 1, ease: 'ease-in-out', to: { transform: 'scaleX(1) rotate(0deg)'} })
	});

	
	let target = html.el('.nuip-audioplayers');

	fb();
	target.appendChild(mediaPlayer({url:'audio/Anew.m4a', type:'audio', pause_other_players:true}));
	target.appendChild(mediaPlayer({url:'audio/Bär.m4a', type:'audio', pause_other_players:true}));
	target.appendChild(mediaPlayer({url:'audio/Evenless.m4a', type:'audio', pause_other_players:true}));
	target.appendChild(mediaPlayer({url:'audio/Fac.m4a', type:'audio', pause_other_players:true}));
	target.appendChild(mediaPlayer({url:'audio/Kgroove.m4a', type:'audio', pause_other_players:true}));
	target.appendChild(mediaPlayer({url:'audio/Knock.m4a', type:'audio', pause_other_players:true}));
	target.appendChild(mediaPlayer({url:'audio/Notquite.m4a', type:'audio', pause_other_players:true}));
	target.appendChild(mediaPlayer({url:'audio/Rattle.m4a', type:'audio', pause_other_players:true}));
	target.appendChild(mediaPlayer({url:'audio/Rejam.m4a', type:'audio', pause_other_players:true}));
	target.appendChild(mediaPlayer({url:'audio/Stringy_thingy.m4a', type:'audio', pause_other_players:true}));
	target.appendChild(mediaPlayer({url:'audio/Tick_n_tock.m4a', type:'audio', pause_other_players:true}));
	target.appendChild(mediaPlayer({url:'audio/WeWriWa.m4a', type:'audio', pause_other_players:true}));
	target.appendChild(mediaPlayer({url:'audio/Widex.m4a', type:'audio', pause_other_players:true}));
	target.appendChild(mediaPlayer({url:'audio/Wummels.m4a', type:'audio', pause_other_players:true}));
	html.el('#streaming_audio').appendChild(mediaPlayer({url:'http://ice1.somafm.com/defcon-256-mp3', type:'audio', classes:'inline', streaming:true, pause_other_players:true}))

	audioVisualizer(global_audio.analyzer, html.el('#viz .left'), {type:'spec'});
	audioVisualizer(global_audio.analyzer, html.el('#viz .right'), {type:'osc'});

	
}

function init_page_icons(){
	if(g.page_icons) { return;}
	g.page_icons = ut.htmlObject(/*html*/`<main id="page_misc_icons"><section><article><div class="nuip-icon-list"></div></article></section></main>`);
	let content = g.page_icons.el('.nuip-icon-list');
	
	for(let key in ut.icon_shapes){
		let html = ut.htmlObject(/*html*/`
			<div class="item">
				<div class="icon">${ut.icon(key, true)}</div>
				<div class="name">${key}</div>
			</div>
		`)
		content.appendChild(html);
	}
	g.content.appendChild(g.page_icons);
}


nuip.randomImage = function(res){
	let img = ut.lz(Math.ceil(Math.random()*360),3);
	return `slide/${res||'webp_thumb'}/${img}.webp`
}



nuip.toggleButtonProgress = function(e){
	let t = e.currentTarget;
	t.addClass('progress');
	setTimeout(()=>{t.removeClass('progress')}, 3000);
}

nuip.loaderShow = function(e){
	let loader = nui.loaderShow(null, 'Load things ...');
	loader.addEventListener('click', loader.kill)
}

nuip.modal_page = function() {
	let prop = {
		header_title:'Modal Page',
		callback: closeMe,
		content: fakeData(),
		buttons: {
			left: [{type:'outline', name:"Cancel", action:'btn_cancel'}],
			right: [{type:'reset', name:"Do Something", action:'btn_something'}, {type:'', name:"OK", action:'btn_ok'}]
		},
		maxWidth: '50em'
	}
	let modal = nui.modal_page(prop);

	function closeMe(e){
		if(e.type == 'btn_something'){
			e.target.addClass('progress');
			setTimeout(modal.close, 1000);
		}
		else {
			modal.close();
		}
		
	}
}

nuip.window = function() {
	let prop = {
		header_title:'Window',
		callback: closeMe,
		content: fakeData(),
		buttons: {
			left: [{type:'outline', name:"Cancel", action:'btn_cancel'}],
			right: [{type:'reset', name:"Do Something", action:'btn_something'}, {type:'', name:"OK", action:'btn_ok'}]
		},
		maxWidth: '50em'
	}
	let modal = nui.window(prop);

	function closeMe(e){
		if(e.type == 'btn_something'){
			e.target.addClass('progress');
			setTimeout(modal.close, 1000);
		}
		else {
			modal.close();
		}
		
	}
}

let fakeData = function(){
	return generate.text({
		sentences_per_paragraps:{num:2, random:false},
		paragraphs:{num:10, random:false},
		randomize_words:false,
		html:{
			headlines: true,
			subheadlines: true,
			tags: true,
			lists: true,
			tables: true,
			quotes: true
		}
	})
}

nuip.changeColor = function (e) {
	if (!e.shiftKey) {
		var c = [nuip.randomColor(), nuip.randomColor(), nuip.randomColor()]
		ut.setCssVar("--color-highlight", ut.cssColorString(c));
		ut.setCssVar("--media-bar-proz-playing", ut.cssColorString(c));
		c.push(0.5);
		ut.setCssVar("--color-highlight-dim", ut.cssColorString(c));
		
	}
	else {
		ut.setCssVar('--color-highlight', nui.css_vars['--color-highlight'].value);
		ut.setCssVar('--color-highlight-dim', nui.css_vars['--color-highlight-dim'].value);
		ut.setCssVar("--media-bar-proz-playing", nui.css_vars['--color-highlight'].value);
	}
}

nuip.randomColor = function () {
	return Math.ceil(Math.random() * 255);
}

nuip.playVideo = function (e) {
	let vid = ut.el('#bgvideo');
	let vid_path = 'videos/'
	let vids = [
		'Christmas Falling Snow - free video background seamless loop.mp4',
		'Driving on a Road at night Seamless Loop 3 - by SamarStock.mp4',
		'Flowing Water - HD Stock Footage Background Loop.mp4',
		'FREE ANIMATED BACKGROUND LOOP.mp4',
		'Lines - 12918.mp4',
		'Loop Tunnel - Blender and Animation Nodes.mp4',
		'loop.mp4',
		'Simple Snow Flurry - HD Background Loop.mp4',
		'Spinning Light Wall - HD Motion Graphics Background Loop.mp4',
		'Synthwave City Animation Loop - Creative Commons.mp4',
		'The River (Loop Animation).mp4',
		'Wormhole - 21225.mp4'
	]
	vid.src = '';
	vid.load();
	if(!e.shiftKey){
		let url = vid_path + vids[Math.floor(Math.random()*vids.length)];
		fb(url);
		vid.muted = true;
		vid.src = url;
		vid.load();
		vid.play();
	}
}




nuip.generateText = function(){
	let target = ut.el('#page_misc_generators #gen_text');
	target.scrollTop = 0;
	let sentences = parseInt(ut.el('#gen-text-sentences').value);
	let paragraphs = parseInt(ut.el('#gen-text-paragraphs').value);
	let sentences_random = ut.el('#gen-text-rand1').checked;
	let paragraphs_random = ut.el('#gen-text-rand2').checked;
	let words_random = ut.el('#gen-text-rand3').checked;
	let html_props = {
		headlines: ut.el('#gen-html-h1').checked,
		subheadlines: ut.el('#gen-html-h2').checked,
		tags: ut.el('#gen-html-tags').checked,
		lists: ut.el('#gen-html-lists').checked,
		tables: ut.el('#gen-html-tables').checked,
		quotes: ut.el('#gen-html-quotes').checked,
	}
	if(sentences > 100) { sentences = 100; ut.el('#gen-text-sentences').value = 100}
	if(paragraphs > 100) { paragraphs = 100; ut.el('#gen-text-paragraphs').value = 100}
	target.innerHTML = generate.text({
		sentences_per_paragraps:{num:sentences, random:sentences_random},
		paragraphs:{num:paragraphs, random:paragraphs_random},
		randomize_words:words_random,
		html:html_props
	})
}

nuip.copyGenTextToClipboard = async function(html=false){
	let target = ut.el('#page_misc_generators #gen_text');
	if(html){
		await navigator.clipboard.writeText(target.innerHTML)
	}
	else {
		await navigator.clipboard.writeText(target.innerText)
	}
}


function upgradeElements(target=window.document){
	let els = target.els('input, textarea');
	for(let i=0; i<els.length; i++){
		let item = els[i];
		let type = item.getAttribute('type');
		if(type == null || findOne(type,'text,url,password,tel,email,search,number,date,month,week,datetime,datetime-local')){
			if(!item.parentNode.classList.value.includes('nui-input')){
				let label = item.parentNode.querySelector('label');
				let el = ut.createElement('div', {classes:'nui-input'});
				item.parentNode.insertBefore(el, item);
				el.appendChild(label);
				el.appendChild(item);
				//fb('Input Upgraded:', {label:label.innerText, id:item.id});
			}
		}
		if(type == 'checkbox'){
			if(!item.parentNode.classList.value.includes('nui-checkbox')){
					let label = item.closest('label');
					let el = ut.createElement('div', {classes:'nui-checkbox'});
					label.parentNode.insertBefore(el, label);
					el.appendChild(item);
					el.appendChild(label)
			}
		}
		if(type == 'radio'){
			if(!item.parentNode.classList.value.includes('nui-radio')){
					let label = item.closest('label');
					let el = ut.createElement('div', {classes:'nui-radio'});
					label.parentNode.insertBefore(el, label);
					el.appendChild(item);
					el.appendChild(label)
			}
		}
	}

	els = target.els('select');
	fb(els)
	for(let i=0; i<els.length; i++){
		let settings = {};
		if(els[i].dataset.upgrade_settings) { settings = JSON.parse(els[i].dataset.upgrade_settings)}
		superSelect(els[i], settings);
	}

	els = target.els('audio');
	for(let i=0; i<els.length; i++){
			mediaPlayer({media:els[i], classes:'inline', pause_other_players:true});
	}

	els = target.els('video');
	for(let i=0; i<els.length; i++){
		mediaPlayer({media:els[i], classes:'inline', pause_other_players:true});
	}

	function findOne(seek, ar){
		if(!Array.isArray(ar)) { ar = ar.split(',') }
		for(let i=0; i<ar.length; i++){
			if(ar[i] == seek){
				return true;
			}
		}
		return false;
	}
}

nuip.fileDialog = function(){
	nui.openFileDialog('.png', (e) => { fb(e)})
}


function testSomething(){
	let data = [];
	for(let i=0; i<10; i++){
		let item = 
		{ lev1:
			{ lev2:
				{ lev3:
					{ lev4: 
						{ lev5: 
							{ lev6: 
								{ lev7: 
									{ lev8: 
										{ lev9: 
											{ lev10: 
												i
											}
										}
									}
								}
							}
						}
					}
				}
			}
		}
		data.push(item);
	}
	let bench = performance.now();
	let out = [];
	for(let i=0; i<data.length; i++){
		ut.deep_set(data[i], 'lev1.lev2.lev3.lev4.lev5.lev6.lev7.lev8.lev9.lev10', 100)

	}
	fb(ut.deep_value(data[0], 'lev1.lev2.lev3.lev4.lev5.lev6.lev7.lev8.lev9.lev10'));
	fb(performance.now() - bench);
}
if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
	for (let key in nui) {
		module.exports[key] = nui[key];
	}
}
else {
	window.nui = nui;
}


/* CMS Blocks Demo MediaBrowser 
######################################################################### */



function cms_demo_mediabrowser(cb){

    let modal_prop = {
		header_title:'Insert Block',
		callback: closeMe,
        close_outside:true,
        relative:false,
		content: /*html*/ `<div class="media_superlist" style="position:relative; width:100%; height:100%"></div>`,
		maxWidth: '60rem',
	}

    
    let modal = nui.modal_page(modal_prop);
    modal.el('.body').style.padding = 0;
   
    let data = [];
	for(let i=1; i<361; i++){
		let item = {};
		item.idx = i;
		item.image = ut.lz(i,3);
		item.name = ut.lz(i,3);
		item.c_date = generate.date();
		item.m_date = generate.date();
		data.push(item);
	}

	let options = {
		id:'nui-superlist',
		verbose:false,
		events:console.log,
		target:modal.el('.media_superlist'),
        single:false,
		data:data,
		render:ss_list_item,
		sort_default:2,
		sort:[
			{label:'Index', prop:'idx', numeric:true},
			{label:'Name', prop:'name'},
			{label:'Creation Date', prop:'c_date', numeric:true},
			{label:'Modification Date', prop:'m_date', numeric:true}
		],
		search: [
			{prop:'name'},
			{prop:'idx'}
		],
		footer: {
			buttons_left: [
				{type:'reset', label:'Delete', fnc:(e) => { fb(e)}},
				{type:'outline', label:'Clear', fnc:killList}
			],
			buttons_right: [
				{type:'', label:'Add', fnc:add}
			]
		}
	}

	

	let ss = superList(options);

	
    function killList(){
		fb('Kill')
		nuip.ss_list1.cleanUp();
		options = null;
		nuip.ss_list1 = null;
		delete nuip.ss_list1;
	}

	function add(e){
		let selection = ss.getSelection(true);
		console.log(selection);
		let out = [];
		for(let i=0; i<selection.length; i++){
			out.push({_id:selection[i].data.image})
		}
        if(cb) { cb(out)}
        closeMe();
	}

	function ss_list_item(item){
		let html = ut.htmlObject( /*html*/ `
			<div class="superlist-list-item" style>
				<div>${ut.lz(item.idx,3)}</div>
				<div><img src="" style="opacity:0"></div>
				<div>${item.name}</div>
				<div>
					<div>${ut.formatDate(item.c_date).full}</div>
					<div>${ut.formatDate(item.m_date).full}</div>
				</div>
			</div>
		`)
		
		html.addEventListener('dblclick', (e) => { 
			nui.lightbox({type:'image', url:`slide/webp_full_hd/${data[e.target.oidx].image}.webp`})
		});

		html.img_el = html.el('img');
		html.update_delay = 100;
		html.update = () => {
			html.img_el.src = `slide/webp_thumb/${item.image}.webp`; 
			html.img_el.addEventListener('load', loaded)
		}
		function loaded(){
			html.img_el.removeEventListener('load', loaded)
			html.img_el.style.opacity = null;
			html.update = null;
		}
		return html;
	}

    function closeMe(e){
		modal.close();
        ss.cleanUp();
		options = null;
	}
    
}