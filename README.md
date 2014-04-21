gos.editor
==========

gos.editor is a bootstrap3 html5 wysiwyg editor

![](https://raw.githubusercontent.com/jiorry/gos.js.editor/master/gos.editor.png)

#### useage
```js
$('.editor').gosEditor({autoHeight:true, toolbarPosition:'bottom'});
```

```js
$.fn.gosEditor.defaultOptions = {
	//btnClass: you can get larger button when you remove gos-btn-sm class.
	btnClass : 'btn btn-default gos-btn-sm',
	//toolbarPosition: you can set toolbar in bottom.
	toolbarPosition: 'top',						
	maxWidth : 780,
	//class: addtional html class for gos.editor
	class : '',
	tabindex : 10,
	//autoHeight: editor will auto grow when text input
	autoHeight : false
}
```