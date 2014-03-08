(function($) {
	var GosEditor = function(){
		this.init = function(el, buttons){
			this.target = el;

			var $text = $(el),
				h = $text.height();

			h = h<0 ? parseInt($text.attr('rows')) * parseFloat($text.css('line-height')) : h;

			this.options = {};
			var style = '<style>.single{margin-right:3px}.foreColor {position: relative;}.foreColor:hover ul {display: block;}.foreColor ul{display: none;list-style-type: none;position:absolute;z-index:2;top:30px;right:-1px;left:-1px;border:1px solid #adadad;border-top:0;background:#ebebeb;overflow: hidden;padding:0;}.gos-placeholder{color:#999999;position:absolute;left:10px;top:10px;display:none}.empty>.gos-placeholder{display:block}.editor-parent{position:relative}</style>';
			
			this.$editor = $(style+'<div class="gos-editor-container"><div class="editor-toolbar" style="margin-bottom:3px;">' + this.buildToolbarHtml(buttons) + '</div><div class="editor-parent clearfix empty"><div class="form-control gos-editor" contenteditable="true" style="height:'+h.toString()+'px"></div><div class="gos-placeholder"></div></div></div>');

			var thisClas = this;
			this.$editor.find('div.editor-toolbar').on('click', '[data-editor-command]', function(e){
				var $this = $(this);
				thisClas.exec($this.data('editor-command'), $this.data('editor-command-value'));
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
			}).change(function(){
				$text.val($(this).html());
			});
		}

		this.exec = function(action, value){
			this.$editor.find('div.editor').focus();

			if (this.state(action)) {
				document.execCommand(action, false, null);
			} else {
				document.execCommand(action, false, value);
			}
		}

		this.state = function(action) {
			return document.queryCommandState(action) === true;
		}

		this.buildToolbarHtml = function(data){
			var i,k,html = '',htmlDialog='', arr;
			for (i=0; i < data.length; i++) {
				if($.isArray(data[i])){
					html += '<div class="btn-group" style="margin-right:3px;">';
					for (k = 0; k<data[i].length; k++) {
						arr = this.buildButton(data[i][k]);
						html += arr[0];
						htmlDialog += arr[1];
					};
					html += '</div>'
				}else{
					arr = this.buildButton(data[i], true);
					html += arr[0];
					htmlDialog += arr[1];
				}
			};
			return html + htmlDialog;
		}

		this.buildButton = function(item, lonly){
			if(!item)
				return '';

			var html,htmlDialog='',
				single = lonly ? ' single':'',
				cmd = item['cmd'] ? ' data-editor-command="'+item['cmd']+'"' : '',
				val = item['value'] ? ' data-editor-value="'+item['cmd']+'"' : '';

			switch(item['type']){
				case 'foreColor':
					html = '<div data-editor-command-group="foreColor" class="btn btn-default foreColor editor-command-active'+single+'"><i class="fa fa-font"></i> <span class="caret"></span><ul>';
					for (var i = item['dropdown'].length - 1; i >= 0; i--) {
						item['dropdown'][i]
						html += '<li><a  href="#" style="display:block;width:auto;height:16px;margin:3px;background-color:'+item['dropdown'][i]['value']+';" data-editor-command="'+item['dropdown'][i]['cmd']+'" data-editor-command-value="'+item['dropdown'][i]['value']+'"></a></li>'
					};
					html += '</ul></div>'
					break;
				default:
					html = '<a href="#" class="btn btn-default"'+cmd+val+'>'+item['content']+'</a>';
					if(item['dialog']){
						htmlDialog += item['dialog'];
					}
					break;
			}

			return [html, htmlDialog];
		}
	}

	$.fn.gosEditor = function() {
		return this.each(function() {
			var $this = $(this),
				data = $this.data('gos.editor'),
				gos = new GosEditor();

			if (!data) 
				$this.data('gos.editor', (data = gos.init(this, $.fn.gosEditor.defaultButtons)));
		})
	}

	$.fn.gosEditor.Constructor = GosEditor;

	$.fn.gosEditor.defaultButtons = [
		[	
			{cmd: 'bold', content:'<i class="fa fa-bold"></i>'},
			{cmd: 'italic', content:'<i class="fa fa-italic"></i>'}
		],

		[	
			{cmd: 'justifyLeft', content:'<i class="fa fa-align-left"></i>'},
			{cmd: 'justifyCenter', content:'<i class="fa fa-align-center"></i>'},
			{cmd: 'justifyRight', content:'<i class="fa fa-align-right"></i>'}
		],
		
		{type: 'foreColor', content:'Color', dropdown : [
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

		{cmd: 'fullPage', content:'<i class="fa fa-arrows-alt"></i>'}
	];

	return null;
})(jQuery);

