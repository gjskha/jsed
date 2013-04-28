/* jsed is a lightweight alternative to fckeditor and the like. This has been
tested on IE, FF 3.x (linux), and Opera 11 (linux). I don't know how it will
work on anything else. */

/* Translate bbcode into HTML in the preview pane */
function preview_page(e1,e2) {
    var caret = get_caret(e1);
    var edits = document.getElementById(e1);
    var preview = document.getElementById(e2);
    preview.innerHTML = edits.value;
    /* manage URLS */
    preview.innerHTML = preview.innerHTML.replace(/\[url\](.+?)\[\/url]/gi,'<a href="$1">$1</a>');
    preview.innerHTML = preview.innerHTML.replace(/\[url\=([^\]]+)](.+?)\[\/url]/gi,'<a href="$1">$2</a>');
    /* manage images */
    preview.innerHTML = preview.innerHTML.replace(/\[img](.+?)\[\/img]/gi, '<img src=$1 />'); /* TODO: img h,w limit */
    /* manage font sizes -- TODO editor button */
    preview.innerHTML = preview.innerHTML.replace(/\[size=([1-9][0-9]+?)](.+?)\[\/size]/gi,'<span style="font-size: $1">$2</span>');
    /* manage strong tags */
    preview.innerHTML = preview.innerHTML.replace(/\[b\](.+?)\[\/b]/gi,'<strong>$1</strong>');
    /* manage emphasize tags */
    preview.innerHTML = preview.innerHTML.replace(/\[i\](.+?)\[\/i]/gi,'<i>$1</i>');
    /* manage code blocks -- see jsed.css */
    preview.innerHTML = preview.innerHTML.replace(/\[code\](.+?)\[\/code]/gi,'<div class="code"><code>$1</code></div>');
    /* manage quote blocks -- see jsed.css */
    preview.innerHTML = preview.innerHTML.replace( /\[quote\](.+?)\[\/quote]/gi, '<div class="quote">$1</div>');
    /* table stuff -- I'm still thinking about this */
    /* preview.innerHTML = preview.innerHTML.replace( /\[table\](.+?)\[\/table]/gi, '<table>$1</table>' );
    preview.innerHTML = preview.innerHTML.replace( /\[tr\](.+?)\[\/tr]/gi, '<tr>$1</tr>' );
    preview.innerHTML = preview.innerHTML.replace( /\[td\](.+?)\[\/td]/gi, '<td>$1</td>' ); */
    /* list stuff */
    preview.innerHTML = preview.innerHTML.replace(/\[ol\]/gi,'<ol>');
    preview.innerHTML = preview.innerHTML.replace(/\[ul\]/gi,'<ul>');
    preview.innerHTML = preview.innerHTML.replace(/\[\/ol]/gi,'</ol>');
    preview.innerHTML = preview.innerHTML.replace(/\[\/ul]/gi,'</ul>');
    preview.innerHTML = preview.innerHTML.replace(/\[\*\]/gi,'<li>');
    /* convert linebreaks */
    preview.innerHTML = preview.innerHTML.replace( /(?:\r\n|\n|\r)/g, '<br />' );
    set_caret(edits,caret);
}   

function set_caret(obj,caret) {
    if(obj.setSelectionRange) {
        obj.focus();
        obj.setSelectionRange(caret,caret);
    } else if (obj.createTextRange) {
        var range = obj.createTextRange();
        range.collapse(true);
        range.moveEnd('character', caret);
        range.moveStart('character', caret);
        range.select();
    }
}

function get_caret(obj) {
    var ctrl = document.getElementById(obj);
    var CaretPos = 0;
    /* IE */
    if (document.selection) {
        ctrl.focus();
        var Sel = document.selection.createRange();
        var SelLength = document.selection.createRange().text.length;
        Sel.moveStart ('character', -ctrl.value.length);
        CaretPos = Sel.text.length - SelLength;
    } else if (ctrl.selectionStart || ctrl.selectionStart == '0') {
        CaretPos = ctrl.selectionStart;
    }
    return (CaretPos);
}

/* render the editor buttons on top of the textarea */
function toolbar(obj) {
    document.write("<div class=\"toolbar\">");
    /* strong */
    document.write("<button class=\"btn_bold\" type=\"button\" name=\"btnBold\" title=\"Bold\" onClick=\"tagify('[b]','[/b]','" + obj + "')\">Bold</button>");
    /* emphasized */
    document.write("<button class=\"btn_italic\" type=\"button\" name=\"btnItalic\" title=\"Italic\" onClick=\"tagify('[i]','[/i]','" + obj + "')\">Italic</button>");
    /* quotation */
    document.write("<button class=\"btn_quote\" type=\"button\" name=\"btnQuote\" title=\"Quote\" onClick=\"tagify('[quote]','[/quote]','" + obj + "')\">Quote</button>");
    /* URL */
    document.write("<button class=\"btn_link\" type=\"button\" name=\"btnLink\" title=\"Insert URL Link\" onClick=\"urlify('" + obj + "')\">URL</button>");
    /* image */
    document.write("<button class=\"btn_img\" type=\"button\" name=\"btnPicture\" title=\"Insert Image\" onClick=\"imagify('" + obj + "')\">Image</button>");
    /* ordered list */
    document.write("<button class=\"btn_ol\" type=\"button\" name=\"btnList\" title=\"Ordered List\" onClick=\"listify('[ol]','[/ol]','" + obj + "')\">OL</button>");
    /* unordered list */
    document.write("<button class=\"btn_ul\" type=\"button\" name=\"btnList\" title=\"Unordered List\" onClick=\"listify('[ul]','[/ul]','" + obj + "')\">UL</button>");
    /* table */
    document.write("<button class=\"btn_table\" type=\"button\" name=\"btnTable\" title=\"Inserts a table\" onClick=\"tagify('[table][br][tr][td]','[/td][/tr][/table]','" + obj + "')\">Table</button>");
    /* code */
    document.write("<button class=\"btn_code\" type=\"button\" name=\"btnCode\" title=\"Code\" onClick=\"tagify('[code]','[/code]','" + obj + "')\"><tt>Code</tt></button>");
    document.write("</div>");
}

/* functionality for image button */
function imagify(obj) {
    textarea = document.getElementById(obj);
    var url = prompt('Enter URL of the image:','http://');
    var scrollTop = textarea.scrollTop;
    var scrollLeft = textarea.scrollLeft;
    if (url) {
        if (document.selection) {
            textarea.focus();
            var sel = document.selection.createRange();
            sel.text = '[img]' + url + '[/img]';
        } else {
            var len = textarea.value.length;
            var start = textarea.selectionStart;
            var end = textarea.selectionEnd;
            var sel = textarea.value.substring(start, end);
            var rep = '[img]' + url + '[/img]';
            textarea.value =  textarea.value.substring(0,start) + rep + textarea.value.substring(end,len);
            textarea.scrollTop = scrollTop;
            textarea.scrollLeft = scrollLeft;
        }
    }
}

/* functionality for URL button */
function urlify(obj) {
    textarea = document.getElementById(obj);
    var url = prompt('Enter the URL:','http://');
    var scrollTop = textarea.scrollTop;
    var scrollLeft = textarea.scrollLeft;
    if (url) {
        if (document.selection) {
            textarea.focus();
            var sel = document.selection.createRange();
            if (sel.text=="") {
                sel.text = '[url]'  + url + '[/url]';
            } else {
                sel.text = '[url=' + url + ']' + sel.text + '[/url]';
            }			
        } else {
            var len = textarea.value.length;
            var start = textarea.selectionStart;
            var end = textarea.selectionEnd;
            var sel = textarea.value.substring(start, end);
            if(sel==""){
                var rep = '[url]' + url + '[/url]';
            } else {
                var rep = '[url=' + url + ']' + sel + '[/url]';
            }
            textarea.value =  textarea.value.substring(0,start) + rep + textarea.value.substring(end,len);
            textarea.scrollTop = scrollTop;
            textarea.scrollLeft = scrollLeft;
        }
    }
}

/* functionality for adding general bbcode tags */
function tagify(tag1,tag2,obj) {
    textarea = document.getElementById(obj);
    /* IE */
    if (document.selection) {
        textarea.focus();
        var sel = document.selection.createRange();
        sel.text = tag1 + sel.text + tag2;
    } else {
        var len = textarea.value.length;
        var start = textarea.selectionStart;
        var end = textarea.selectionEnd;
        var scrollTop = textarea.scrollTop;
        var scrollLeft = textarea.scrollLeft;
        var sel = textarea.value.substring(start, end);
        var rep = tag1 + sel + tag2;
        textarea.value =  textarea.value.substring(0,start) + rep + textarea.value.substring(end,len);
        textarea.scrollTop = scrollTop;
        textarea.scrollLeft = scrollLeft;
    }
}

/* functionality for lists */
function listify(tag1,tag2,obj){
    textarea = document.getElementById(obj);
    /* IE */
    if (document.selection) {
        textarea.focus();
        var sel = document.selection.createRange();
        var list = sel.text.split('\n');
        for(i=0;i<list.length;i++) {
            list[i] = '[*]' + list[i];
        }
        sel.text = tag1 + '\n' + list.join("\n") + '\n' + tag2;
    } else {
        var len = textarea.value.length;
        var start = textarea.selectionStart;
        var end = textarea.selectionEnd;
        var i;
        var scrollTop = textarea.scrollTop;
        var scrollLeft = textarea.scrollLeft;
        var sel = textarea.value.substring(start, end);
        var list = sel.split('\n');
        for(i=0;i<list.length;i++) {
            list[i] = '[*]' + list[i];
        }
        var rep = tag1 + '\n' + list.join("\n") + '\n' +tag2;
        textarea.value =  textarea.value.substring(0,start) + rep + textarea.value.substring(end,len);
        textarea.scrollTop = scrollTop;
        textarea.scrollLeft = scrollLeft;
    }
}
