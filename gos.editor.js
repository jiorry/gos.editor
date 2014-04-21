(function($) {
	var GosEditor = function(){
		this.init = function(el, buttons, options){
			this.target = el;
			this.options = options;
			this.textMode = 'rich';

			var $text = $(el),
				h = $text.height();
			if(this.options.autoHeight){
				h = -1;
			}else{
				h = h<0 ? parseInt($text.attr('rows')) * parseFloat($text.css('line-height')) : h;
			}
			var style = '<style>.btn.gos-btn-sm{padding: 2px 10px;}.gos-editor-container{position:relative;}.gos-editor-container.toolbar-bottom{margin-bottom:20px;}.gos-editor-container.menu-bottom .dropdown ul{border-top-style:solid;border-bottom-style:none;top:auto;bottom:12px;}.gos-editor-container.toolbar-bottom .editor-toolbar{z-index:10;margin-bottom: 3px;position: absolute;bottom: -27px;}.gos-editor-container.fullPage{position: fixed;background-color: #FFFFFF;height: 100%;width: 100%;z-index:90;left: 0;top:0;padding: 20px;}.gos-editor-container.fullPage>.editor-toolbar, .gos-editor-container.fullPage>.editor-parent{max-width:'+options.maxWidth+'px;margin-left:auto;margin-right:auto}.gos-editor-container.fullPage>.editor-parent{height: 100%;padding-bottom: 100px;}.gos-editor{overflow: auto;}.single{margin-right:3px}.dropdown {position: relative;}.dropdown:hover ul {display: block;}.dropdown ul{display: none;list-style-type: none;position:absolute;z-index:2;top:20px;right:-1px;left:-1px;border:1px solid #adadad;border-top-style:none;background:#ebebeb;overflow: hidden;padding:0;}.dropdown li:first-child{margin-top:5px;}.dropdown li a{color:inherit}.gos-placeholder{color:#999999;position:absolute;left:10px;top:10px;display:none}.empty>.gos-placeholder{display:block}.editor-parent{position:relative}</style>';

			var toolbarPosition = '';
			if(this.options.toolbarPosition=='bottom'){
				toolbarPosition = ' toolbar-bottom'
			}
			this.$editor = $('<div class="gos-editor-container'+toolbarPosition+' '+this.options.class+'">'+style+'<div class="editor-parent clearfix empty"><div tabindex="'+this.options.tabindex+'" class="form-control gos-editor context" contenteditable="true" style="'+(h>0 ? ("height:"+h.toString()+"px"): '')+'"></div><div class="gos-placeholder"></div></div></div>');

			this.$editor.prepend(this.buildToolbar(buttons));

			var thisClas = this;
			this.$editor.find('div.editor-toolbar').on('click', 'a[data-command]', function(e){
				var $this = $(this),
					ctype = $this.data('command-type');

				switch(ctype){
					case 'onClick':
						var option;
						if($this.data('drowdown-item')){
							option = $this.closest('div.dropdown').data('option')
						}else{
							option = $this.data('option');
						}
						if(option.onClick){
							option.onClick.call(this, thisClas.$editor, thisClas)
						}
						break;
					default:
						thisClas.exec($this.data('command'), $this.data('command-value'));
						break;
				}

			})
			
			$text.addClass('hidden').after(this.$editor)
			this.$editor.find('div.gos-placeholder').text($text.attr('placeholder'));

			this.$editor.find('div[contenteditable]').focusin(function(){
				$(this).parent().removeClass('empty');
			}).focusout(function() {
				if($(this).text()==='')
					$(this).parent().addClass('empty');
				else
					$(this).parent().removeClass('empty');

				$text.val($(this).html());
			}).keypress(function(){
				
			});
		}

		this.copyToTextArea = function(){
			this.$editor.prev().html(this.$editor.find('div[contenteditable]').html());
		}

		this.exec = function(action, value){
			if($.fn.gosEditor.safeActions.indexOf(action)===-1)
				return;
			
			if (this.state(action)) {
				document.execCommand(action, false, null);
			} else {
				document.execCommand(action, false, value);
			}
		}

		this.state = function(action) {
			return document.queryCommandState(action) === true;
		}

		this.buildToolbar = function(data){
			var i,k,$group = '', $toolbar = $('<div class="editor-toolbar" style="margin-bottom:3px;"></div>'), arr;
			for (i=0; i < data.length; i++) {
				if($.isArray(data[i])){
					$group = $('<div class="btn-group" style="margin-right:3px;"></div>');
					for (k = 0; k<data[i].length; k++) {
						$group.append(this.buildButton(data[i][k]));
					};
					$toolbar.append($group);

				}else{
					$toolbar.append(this.buildButton(data[i], true));
				}
			};
			return $toolbar;
		}

		this.buildButton = function(item, lonly){
			if(!item)
				return '';

			var html,$node,btnClass=this.options.btnClass,
				cmd = item['cmd'] ? ' data-command="'+item['cmd']+'"' : '',
				val = item['value'] ? ' data-command-value="'+String(item['value'])+'"' : '',
				single = lonly ? ' single':'',
				tagclass = item['class'] ? ' '+item['class'] : '',
				ctype = 'command', drowdownItem;

			if(item.dialog)
				ctype = 'dialog';
			else if(item.onClick)
				ctype = 'onClick';

			switch(item.type){
				case 'dropdown':
					html = '<div data-command-group="'+item.cmd+'" class="'+btnClass+tagclass+' dropdown command-active'+single+'"'+(item.value?' data-value="'+item.value+'"': '')+'><span class="content">'+item.content+'</span> <span class="caret"></span><ul>';

					for (var i = item['dropdown'].length - 1; i >= 0; i--) {
						drowdownItem = item['dropdown'][i];
						tagclass = drowdownItem['class'] ? ' class="'+drowdownItem['class']+'" ' : '';
						switch(item.cmd){
							case 'foreColor':
								html += '<li><a href="#"'+tagclass+' style="display:block;width:auto;height:16px;margin:3px;background-color:'+drowdownItem['value']+';" data-command="'+drowdownItem['cmd']+'" data-command-value="'+drowdownItem['value']+'" data-command-type="'+ctype+'"></a></li>'
								break;
							default:
								html += '<li><a href="#"'+tagclass+' style="margin-bottom:3px;" data-command="'+drowdownItem['cmd']+'" data-command-value="'+drowdownItem['value']+'" data-command-type="'+ctype+'" data-drowdown-item="true">'+drowdownItem['content']+'</a></li>'
								break;
						}
					};
					html += '</ul></div>'
					$node = $(html);

					break;
				default:
					html = '<a href="#" class="'+btnClass+single+tagclass+'"'+cmd+val+' data-command-type="'+ctype+'">'+item['content']+'</a>';

					$node = $(html);
					break;
			}

			if(ctype!== 'command')
				$node.data('option', item);

			return $node;
		}
	}

	$.fn.gosEditor = function(options, buttons) {
		return this.each(function() {
			var $this = $(this),
				data = $this.data('gos.editor'),
				gos = new GosEditor();

			buttons = buttons || $.fn.gosEditor.defaultButtons;
			options = $.extend($.fn.gosEditor.defaultOptions, options);
			if (!data) 
				$this.data('gos.editor', (data = gos.init(this, buttons, options)));
		})
	}

	$.fn.gosEditor.Constructor = GosEditor;

	$.fn.gosEditor.safeActions = ['bold', 'italic', 'underline', 'strikethrough', 'insertunorderedlist', 'insertorderedlist', 'blockquote', 'pre', 'foreColor'];

	$.fn.gosEditor.defaultOptions = {
		btnClass : 'btn btn-default gos-btn-sm',
		toolbarPosition: 'top',
		maxWidth : 780,
		class : '',
		tabindex : 10,
		autoHeight : false
	}

	$.fn.gosEditor.defaultButtons = [
		{cmd: 'mode', value:1, content:'Rich Text', type:'dropdown', 
			dropdown : [
				{cmd: 'mode', value: 1, content: 'Rich Text', class : 'hidden'},
				{cmd: 'mode', value: 0, content: 'MarkDown '}
			],
			onClick : function($editor, clas){
				var $this = $(this),
					$parent = $this.closest('div.dropdown')
				if(parseInt($this.data('command-value'))===1){
					$parent.data('command-value', 1)
					$parent.siblings().show();
					clas.textMode = 1;
				}else{
					$parent.data('command-value', '0')
					$parent.siblings().hide().siblings('a.btn[data-command=fullPage]').show();
					clas.textMode = 0;
				}
				$parent.find('span.content').text($this.text())
				$parent.find('.hidden').removeClass('hidden');
				$this.addClass('hidden');
			}
		},
		[	
			{cmd: 'bold', content:'<i class="fa fa-bold"></i>'},
			{cmd: 'italic', content:'<i class="fa fa-italic"></i>'}
		],

		[	
			{cmd: 'justifyLeft', content:'<i class="fa fa-align-left"></i>'},
			{cmd: 'justifyCenter', content:'<i class="fa fa-align-center"></i>'},
			{cmd: 'justifyRight', content:'<i class="fa fa-align-right"></i>'}
		],
		
		{cmd: 'foreColor', content:'<i class="fa fa-font"></i>', type:'dropdown', dropdown : [
			{cmd: 'foreColor', value: 'black', content: '<span class="background-color:black">color</span>'}, 
			{cmd: 'foreColor', value: 'silver', content: '<span class="background-color:silver">color</span>'}, 
			{cmd: 'foreColor', value: 'gray', content: '<span class="background-color:gray">color</span>'}, 
			{cmd: 'foreColor', value: 'purple', content: '<span class="background-color:purple">color</span>'}, 
			{cmd: 'foreColor', value: 'fuchsia', content: '<span class="background-color:fuchsia">color</span>'}, 
			{cmd: 'foreColor', value: 'darkOrchid', content: '<span class="background-color:darkOrchid">color</span>'}, 
			{cmd: 'foreColor', value: 'olive', content: '<span class="background-color:olive">color</span>'}, 
			{cmd: 'foreColor', value: 'coral', content: '<span class="background-color:coral">color</span>'}, 
			{cmd: 'foreColor', value: 'maroon', content: '<span class="background-color:maroon">color</span>'}, 
			{cmd: 'foreColor', value: 'crimson', content: '<span class="background-color:crimson">color</span>'}, 
			{cmd: 'foreColor', value: 'navy', content: '<span class="background-color:navy">color</span>'}, 
			{cmd: 'foreColor', value: 'darkGreen', content: '<span class="background-color:darkGreen">color</span>'}, 
			{cmd: 'foreColor', value: 'teal', content: '<span class="background-color:teal">color</span>'}, 
			{cmd: 'foreColor', value: 'dodgerBlue', content: '<span class="background-color:dodgerBlue">color</span>'}, 
			{cmd: 'foreColor', value: 'slateBlue', content: '<span class="background-color:slateBlue">color</span>'}, 
			{cmd: 'foreColor', value: 'steelBlue', content: '<span class="background-color:steelBlue">color</span>'}
		]},
		
		[	
			{cmd: 'insertUnorderedList', content:'<i class="fa fa-list"></i>'},
			{cmd: 'insertOrderedList', content:'<i class="fa fa-list-ol"></i>'}
		],

		[	
			{cmd: 'createLink', content:'<i class="fa fa-link"></i>'},
			{cmd: 'insertImage', content:'<i class="fa fa-picture-o"></i>'}
		],

		{cmd: 'fullPage', value: 1, content:'<i class="fa fa-arrows-alt"></i>', onClick : function($editor, clas){
			var $this = $(this);
			if(parseInt($this.data('command-value'))===1){
				$editor.addClass('fullPage');
				$editor.removeClass('toolbar-bottom');

				$this.data('command-value', '0');
				$editor.find('div.gos-editor').css('height', '100%');
			}else{
				$editor.removeClass('fullPage')
				if(clas.options.toolbarPosition && clas.options.toolbarPosition=='bottom'){
					$editor.addClass('toolbar-bottom');
				}
				$this.data('command-value', '1');
				
				if(clas.options.autoHeight){
					$editor.find('div.gos-editor').css('height', 'autho');
				}else{
					var $text = $editor.prev(),
						h = $text.height();
					h = h<0 ? parseInt($text.attr('rows')) * parseFloat($text.css('line-height')) : h;
					$editor.find('div.gos-editor').css('height', h.toString()+'px');
				}
			}
		}}
	];

	return null;
})(jQuery);

