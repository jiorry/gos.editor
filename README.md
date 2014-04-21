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
	btnClass : 'btn btn-default gos-btn-sm', 	//you can get larger button when without gos-btn-sm class.
	toolbarPosition: 'top',						
	maxWidth : 780,
	class : '',
	tabindex : 10,
	autoHeight : false			//editor will auto grow when text input
}
```