/**
 * LivePress fullscreen editor.
 * Left: schema-driven field panel. Right: live iframe of the real frontend.
 * Every input streams over postMessage (aux-edit); Save persists via REST.
 */
/* global LIVEPRESS, wp */
(function () {
	"use strict";
	var B = LIVEPRESS;
	var values = JSON.parse( JSON.stringify( B.values ) );
	var dirty = false;
	var frame = null;

	/* ---------- tiny DOM helper ---------- */
	function el( tag, attrs, children ) {
		var node = document.createElement( tag );
		attrs = attrs || {};
		Object.keys( attrs ).forEach( function ( k ) {
			if ( k === "class" ) { node.className = attrs[ k ]; }
			else if ( k === "text" ) { node.textContent = attrs[ k ]; }
			else if ( k.slice( 0, 2 ) === "on" ) { node.addEventListener( k.slice( 2 ), attrs[ k ] ); }
			else { node.setAttribute( k, attrs[ k ] ); }
		} );
		( children || [] ).forEach( function ( c ) { if ( c ) { node.appendChild( c ); } } );
		return node;
	}

	/* ---------- live bridge ---------- */
	function fieldDef( key ) {
		for ( var i = 0; i < B.schema.sections.length; i++ ) {
			var fs = B.schema.sections[ i ].fields;
			for ( var j = 0; j < fs.length; j++ ) {
				if ( fs[ j ].key === key ) { return fs[ j ]; }
			}
		}
		return null;
	}
	function broadcast( key ) {
		var def = fieldDef( key );
		if ( ! def || ! frame || ! frame.contentWindow ) { return; }
		var v = values[ key ];
		var value = v;
		if ( def.kind === "lines" ) {
			value = String( v || "" ).split( "\n" ).map( function ( s ) { return s.trim(); } ).filter( Boolean );
		}
		try {
			frame.contentWindow.postMessage( { type: "aux-edit", path: def.path, value: value }, B.frontend );
		} catch ( e ) { /* frame not ready */ }
	}
	function broadcastAll() {
		B.schema.sections.forEach( function ( s ) {
			s.fields.forEach( function ( f ) { broadcast( f.key ); } );
		} );
	}

	function setValue( key, v ) {
		values[ key ] = v;
		dirty = true;
		document.getElementById( "lp-save" ).classList.add( "is-dirty" );
		broadcast( key );
	}

	/* ---------- field renderers ---------- */
	function inputFor( key, def ) {
		if ( def.kind === "textarea" || def.kind === "lines" ) {
			var ta = el( "textarea", { class: "lp-input", rows: def.kind === "lines" ? 5 : 3 } );
			ta.value = values[ key ] || "";
			ta.addEventListener( "input", function () { setValue( key, ta.value ); } );
			return ta;
		}
		var input = el( "input", { class: "lp-input", type: "text" } );
		input.value = values[ key ] || "";
		input.addEventListener( "input", function () { setValue( key, input.value ); } );
		return input;
	}

	function mediaButton( assign ) {
		return el( "button", {
			class: "lp-media-btn", type: "button", title: "Choose from Media Library",
			text: "🖼",
			onclick: function () {
				var picker = wp.media( { title: "Choose image", multiple: false, library: { type: "image" } } );
				picker.on( "select", function () {
					var att = picker.state().get( "selection" ).first().toJSON();
					assign( att.url );
				} );
				picker.open();
			},
		} );
	}

	function repeaterRow( key, def, row, idx, rerender ) {
		var handle = el( "span", { class: "lp-drag", text: "⋮⋮", draggable: "true", title: "Drag to reorder" } );
		handle.addEventListener( "dragstart", function ( e ) {
			e.dataTransfer.setData( "text/plain", String( idx ) );
			e.dataTransfer.effectAllowed = "move";
		} );

		var body = el( "div", { class: "lp-row-fields" } );
		def.subs.forEach( function ( sub ) {
			var wrapCls = "lp-subfield" + ( sub.kind === "textarea" ? " wide" : "" );
			var field;
			if ( sub.kind === "textarea" ) {
				field = el( "textarea", { class: "lp-input", rows: 2 } );
			} else {
				field = el( "input", { class: "lp-input", type: "text" } );
			}
			field.value = row[ sub.key ] || "";
			field.addEventListener( "input", function () {
				row[ sub.key ] = field.value;
				setValue( key, values[ key ] );
			} );
			var inner = [ el( "label", { class: "lp-sublabel", text: sub.label } ), field ];
			if ( sub.kind === "image" ) {
				var pair = el( "div", { class: "lp-media-pair" }, [ field, mediaButton( function ( url ) {
					field.value = url;
					row[ sub.key ] = url;
					setValue( key, values[ key ] );
				} ) ] );
				inner = [ el( "label", { class: "lp-sublabel", text: sub.label } ), pair ];
			}
			body.appendChild( el( "div", { class: wrapCls }, inner ) );
		} );

		var remove = el( "button", {
			class: "lp-row-del", type: "button", text: "✕", title: "Remove row",
			onclick: function () {
				values[ key ].splice( idx, 1 );
				setValue( key, values[ key ] );
				rerender();
			},
		} );

		var rowEl = el( "div", { class: "lp-row", "data-idx": String( idx ) }, [ handle, body, remove ] );
		rowEl.addEventListener( "dragover", function ( e ) { e.preventDefault(); rowEl.classList.add( "drop" ); } );
		rowEl.addEventListener( "dragleave", function () { rowEl.classList.remove( "drop" ); } );
		rowEl.addEventListener( "drop", function ( e ) {
			e.preventDefault();
			rowEl.classList.remove( "drop" );
			var from = parseInt( e.dataTransfer.getData( "text/plain" ), 10 );
			if ( isNaN( from ) || from === idx ) { return; }
			var moved = values[ key ].splice( from, 1 )[ 0 ];
			values[ key ].splice( idx, 0, moved );
			setValue( key, values[ key ] );
			rerender();
		} );
		return rowEl;
	}

	function repeaterFor( key, def ) {
		var box = el( "div", { class: "lp-repeater" } );
		function rerender() {
			box.innerHTML = "";
			( values[ key ] || [] ).forEach( function ( row, idx ) {
				box.appendChild( repeaterRow( key, def, row, idx, rerender ) );
			} );
			box.appendChild( el( "button", {
				class: "lp-row-add", type: "button", text: "+ Add row",
				onclick: function () {
					var blank = {};
					def.subs.forEach( function ( sub ) { blank[ sub.key ] = ""; } );
					values[ key ] = values[ key ] || [];
					values[ key ].push( blank );
					setValue( key, values[ key ] );
					rerender();
				},
			} ) );
		}
		rerender();
		return box;
	}

	/* ---------- sections panel ---------- */
	function buildPanel() {
		var panel = el( "div", { class: "lp-sections" } );
		B.schema.sections.forEach( function ( section, i ) {
			var fields = el( "div", { class: "lp-fields" } );
			section.fields.forEach( function ( def ) {
				fields.appendChild( el( "div", { class: "lp-field" }, [
					el( "label", { class: "lp-label", text: def.label } ),
					def.kind === "repeater" ? repeaterFor( def.key, def ) : inputFor( def.key, def ),
				] ) );
			} );
			var head = el( "button", { class: "lp-sec-head", type: "button" }, [
				el( "span", { text: section.label } ),
				el( "span", { class: "lp-caret", text: "▾" } ),
			] );
			var sec = el( "div", { class: "lp-section" + ( i === 0 ? " open" : "" ) }, [ head, fields ] );
			head.addEventListener( "click", function () { sec.classList.toggle( "open" ); } );
			panel.appendChild( sec );
		} );
		return panel;
	}

	/* ---------- save ---------- */
	function save() {
		var btn = document.getElementById( "lp-save" );
		btn.textContent = "Saving…";
		var meta = {};
		B.schema.sections.forEach( function ( s ) {
			s.fields.forEach( function ( f ) {
				meta[ f.key ] = f.kind === "repeater"
					? JSON.stringify( values[ f.key ] || [] )
					: String( values[ f.key ] == null ? "" : values[ f.key ] );
			} );
		} );
		wp.apiFetch( { path: "/wp/v2/" + B.restBase + "/" + B.postId, method: "POST", data: { meta: meta } } )
			.then( function () {
				dirty = false;
				btn.classList.remove( "is-dirty" );
				btn.textContent = "Saved ✓";
				setTimeout( function () { btn.textContent = "Save"; }, 1600 );
			} )
			.catch( function ( err ) {
				btn.textContent = "Save failed";
				console.error( "LivePress save failed", err );
				setTimeout( function () { btn.textContent = "Save"; }, 2500 );
			} );
	}

	/* ---------- boot ---------- */
	function boot() {
		var root = document.getElementById( "livepress-root" );
		frame = el( "iframe", { class: "lp-frame", src: B.frontend + B.path + ( B.path.indexOf( "?" ) === -1 ? "?edit=1" : "&edit=1" ) } );

		root.appendChild( el( "div", { class: "lp-app" }, [
			el( "div", { class: "lp-panel" }, [
				el( "div", { class: "lp-topbar" }, [
					el( "a", { class: "lp-back", href: B.backUrl, text: "←" } ),
					el( "div", { class: "lp-title" }, [
						el( "strong", { text: B.title } ),
						el( "span", { class: "lp-sub", text: "livepress · " + B.path } ),
					] ),
					el( "button", { id: "lp-save", class: "lp-save", type: "button", text: "Save", onclick: save } ),
				] ),
				buildPanel(),
			] ),
			el( "div", { class: "lp-preview" }, [ frame ] ),
		] ) );

		// Re-sync current (possibly unsaved) values whenever the page (re)loads.
		window.addEventListener( "message", function ( e ) {
			if ( e.data && e.data.type === "aux-edit-ready" ) { broadcastAll(); }
		} );
		window.addEventListener( "beforeunload", function ( e ) {
			if ( dirty ) { e.preventDefault(); e.returnValue = ""; }
		} );
	}

	if ( document.readyState === "loading" ) {
		document.addEventListener( "DOMContentLoaded", boot );
	} else {
		boot();
	}
})();
