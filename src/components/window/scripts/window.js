elation.require(['ui.base', 'ui.button', 'ui.buttonbar', 'ui.input', 'ui.toggle'], function() {
    elation.requireCSS('window');
    elation.extend("window.manager", new function() {
        this.defaultcontainer = {
            tag: 'div', 
            classname: 'windows'
        };

        this.init = function() {
            console.log('WindowManager', this);
            this.windows = [];
            this.windowmap = {};
            this.zIndexStart = 100;
            elation.events.add(null, 'window_focus', this);
        }

        this.handleEvent = function(event) {
            this[event.type](event);
        }

        this.window_focus = function(event) {
            var item = -1;

            for (var i=0; i<this.windows.length; i++) {
                if (!this.windows[i] || !this.windows[i].visible || this.windows[i].args.ontop)
                    continue;

                if (this.windows[i] == event.element) {
                    var item = i;
                } else {
                    this.windows[i].blur();
                }
            }

            if (item >= 0) {
                item = this.windows.splice(item, 1)[0];
                this.windows.push(item);

                for (var i=0; i<this.windows.length; i++) {
                    if (!this.windows[i]) {
                        continue;
                    }

                    if (this.windows[i].name == 'window.modal') {
                        this.windows[i].container.style.zIndex = (this.zIndexStart * 10) + this.windows.length;
                    } else {
                        this.windows[i].container.style.zIndex = this.zIndexStart + i;
                    }
                }
            }
        }

        this.add = function(name, item) {
            if (item.name == 'window.modal')
                item.container.style.zIndex = (this.zIndexStart * 10) + this.windows.length;
            else
                item.container.style.zIndex = this.zIndexStart + this.windows.length;
                
            var index = this.windows.length;

            this.windowmap[name] = index;
            this.windows.push(item);

            return index;
        }

        this.remove = function(name) {
            var item = this.get(name);

            if (!item)
                return;

            // remove component instance
            delete elation.utils.arrayget(elation, item.componentname).obj[item.id];

            var elements = elation.find('[data-elation-component][data-elation-initialized]', item.container);

            for (var i=0, element, component; i<elements.length; i++) {
                element = elements[i];
                component = elation.component.fetch(element);
                if (component) {
                    obj = elation.utils.arrayget(elation, component.componentname).obj;
                    //console.log(i, component.componentname, component.id, typeof obj, obj);
                    delete obj[component.id];
                }
		    }

            if (item.visible)
                item.close();

            if (item.container.parentNode)
                item.container.parentNode.removeChild(item.container);

            this.windows[item.wm_index] = null;

            delete this.windowmap[name];
            delete item;
        }

        this.get = function(name) {
            var index = this.windowmap[name],
                item = this.windows[index];

            return item;
        }

        this.init();
    });

	elation.component.add("window.create", function() {
        this.defaultcontainer = { 
            tag: 'div', 
            classname: 'window' 
        };
		
        this.defaults = {
			content: '',					// (String|Component|HTMLElement)
			classname: false,
			parent: false,				// (Component|Element)
			append: false,				// (Component|Element) append.appendChild(window)
			before: false,				// (Component|Element) append.insertBefore(window, before)
			title: false,					// (String) Window title, requires titlebar, defaults to window name
			titlebar: false,			// (Boolean)
			btnClose: false, 			// (Boolean)
			btnMaximize: false,		// (Boolean)
			btnMinimize: false,		// (Boolean)
			btnResize: false,			// (Boolean)
			rendering: 'center',	// (String) auto, absolute, fixed, center, css
			bounds: false,				// (String|Component|HTMLElement) none, window, object
			resizable: false,			// (Boolean)
			moveable: false, 			// (Boolean)
			ontop: false, 				// (Boolean)
			lightbox: false,			// (Boolean)
			animation: 'slide_up,slide_down',	// (String) slide, sweep, roll, explode, fade, none
			transition: false,		// (String) Overwrite css transition with a js one
			align: 'center',			// (String) top, left, right, bottom, center, auto
			margin: 20,						// (Integer) pixels to pad alignment
			tail: false,					// (Boolean)
			tail_anchor: false,		// (Component|Element) default = parent
			show_callback: false, // (Function) Executes on .show()
			hide_callback: false,	// (Function) Executes on .hide()
			event: 'click'				// (String) If set, <event> on <parent> will .toggle() window
		};

		this.init = function() { 
			var args = this.args, 
				utils = elation.utils,
				isTrue = utils.isTrue, 
				isString = utils.isString;

			elation.html.addclass(
				this.container, 
				this.name.replace(".", "_") + 
				(this.args.windowname ? ' ' + this.args.windowname.replace(".", "_") : '') + 
				(this.args.windowid ? ' ' + this.args.windowid.replace(".", "_") : '') + 
				(typeof this.args.classname == 'string' ? ' ' + this.args.classname : '') +
				(typeof this.id == 'string' ? ' ' + this.id : '')
			);

			if (args.parent)
				this.parent = elation.utils.getContainerElement(args.parent);

			if (args.lightbox)
				this.lightbox = elation.window.options.lightbox({ parent: this });

			if (args.tail)
				this.tail = elation.window.options.tail(null, this.container, this.args);

			if (
				args.title || isTrue(args.btnClose) || isTrue(args.btnMaximize) || 
				isTrue(args.btnMinimize) || isTrue(args.btnResize)
			) {
				args.titlebar = true;
			}

			if (args.titlebar) {
				this.titlebar = elation.window.options.titlebar({ parent: this });
			}
			
			if (args.moveable) {
				this.moveable = elation.ui.moveable(null, this.container, { handle: this.titlebar });
			}
			
			if (args.resizable) {
				this.resizable = elation.window.options.resizable({ parent: this });
			}

			if (args.align != 'none') {
				this.alignment = elation.window.rendering.alignment(null, this.container, this.args);
			}

			this.args.animation = this.args.animation.split(',');

			if (this.args.animation.length == 1) {
				this.args.animation.push(this.args.animation[0]);
			}

			this.rendering = elation.window.rendering[args.rendering](null, this.container, this.args);

			elation.events.add(this.container, 'mousedown', this);
			this.wm_index = elation.window.manager.add(this.id, this);
		}

		this.setContent = function(content) {
			var content = content || this.args.content;

			this.container.innerHTML = '';
			elation.html.setContent(this, this.resizable, true);
			elation.html.setContent(this, this.titlebar, true);
			this.content_container = elation.html.create('div');
			elation.html.setContent(this.content_container, content, true);

			elation.html.addclass(this.content_container, 'window_content');
			this.container.appendChild(this.content_container);
		}

		this.open = function(content) {
			if (this.lightbox) {
				this.lightbox.show();
			}

			this.container.style.visibility = 'hidden';
			this.setContent(content);

			if (this.args.animation) {
				elation.html.addclass(this.container, 'animation_'+this.args.animation[0]);
			}

			(function(self) {
				setTimeout(function() {
					self.show();
		      		self.visible = true;
		     		self.refresh();
					elation.events.fire('window_show', self);
					self.container.style.visibility = 'visible';

					if (self.args.animation) {
						elation.html.removeclass(self.container, 'animation_'+self.args.animation[0]);
					}

          			if (typeof self.args.show_callback == "function") {
						self.args.show_callback();
					}
				}, 100);
			})(this);
		}

		this.close = function() {
			if (this.lightbox)
				this.lightbox.hide();
			
			if (this.args.animation)
				elation.html.addclass(this.container, 'animation_'+this.args.animation[1]);

			(function(self) {
				setTimeout(function(){
                    self.hide();
                    self.visible = false;

                    if (self.args.animation) {
                        elation.html.removeclass(self.container, 'animation_'+self.args.animation[1]);
                    }

                    if (typeof self.args.hide_callback == "function") {
                        self.args.hide_callback();
                    }

                    elation.window.manager.remove(self.id);
                }, 200);
			})(this);

			elation.events.fire('window_hide', this);
		}

		this.focus = function() {
			if (!this.active) {
				this.active = true;
				elation.html.addclass(this.container, 'state_active');
				elation.events.fire({type: 'window_focus', element: this});
			}
		}

		this.blur = function() {
			if (this.active) {
				this.active = false;
				elation.html.removeclass(this.container, 'state_active');
				elation.events.fire({type: 'window_blur', element: this});
			}
		}

		this.mousedown = function(ev) {
			this.focus();
		}

		this.render = function() {
			var dc = elation.html.dimensions(this.container),
                dp = elation.html.dimensions(this.container.parentNode),
                dw = elation.html.dimensions(window);
			
			dc = this.rendering.position(dc, dp, dw);
			
			if (this.alignment)
				dc = this.alignment.position(dc, dp, dw);
			
			elation.html.css(this.container, {
				position: dc.positioning,
				top: dc.y + 'px',
				left: dc.x + 'px'
			});
		}
	}, elation.ui.base);

	elation.component.add("ui.moveable", function() {
		this.init = function() {
			//console.log('ui.moveable',this);
			this.event_container = elation.find('div.desktop', true) || window;

			this.handle = this.args.handle.container || this.container;
			elation.html.addclass(this.container, 'moveable');
			elation.events.add(this.handle, 'mousedown', this);
			elation.events.add(this.handle, 'touchstart', elation.bind(this, this.mousedown));
		}

		this.mousedown = function(ev) {
			this.coords = elation.events.coords(ev);
			this.dimensions = elation.html.dimensions(this.container);
			this.moving = true;

			elation.html.addclass(document.body, 'ui_moving');
			elation.events.add(window, 'mousemove,mouseup', this);
			elation.events.add(window, 'touchmove', elation.bind(this, this.mousemove));
			elation.events.add(window, 'touchend', elation.bind(this, this.mouseup));
			elation.events.fire({ type: 'ui_moveable_start', element: this });
		}

		this.mousemove = function(ev, delta) {
			if (!this.moving)
				return;

			//console.log(ev.type, ev, this);
			var current = elation.events.coords(ev),
				delta = delta || {
					x: current.x - this.coords.x, 
					y: current.y - this.coords.y
				},
				position = {
					x: this.dimensions.x + delta.x,
					y: this.dimensions.y + delta.y
				};

			elation.html.css(this.container, {
				top: position.y+'px',
				left: position.x+'px'
			});

			ev.preventDefault();
		}
		this.mouseup = function(ev) {
			this.moving = false;
			elation.html.removeclass(document.body, 'ui_moving');
			elation.events.fire({ type: 'ui_moveable_end', element: this });
			elation.events.remove(window, 'mousemove,mouseup', this);
			elation.events.remove(window, 'touchmove', elation.bind(this, this.mousemove));
			elation.events.remove(window, 'touchend', elation.bind(this, this.mouseup));
		}
	});

	elation.component.add("window.options.titlebar", function() {
        this.defaultcontainer = { tag: 'div', classname: 'window_titlebar' };
        this.init = function() {
            this.labels = {
                minimize: 'fa-solid fa-window-minimize',
                maximize: 'fa-solid fa-window-maximize',
                restore: 'fa-solid fa-window-restore',
                close: 'fa-solid fa-close'
            };

            var args = this.args.parent.args, 
                create = elation.html.create,
                buttons = {};

            elation.html.addclass(this.args.parent.container, 'hasTitlebar');

            if (elation.utils.isString(args.title))
                this.title_label = create({ tag: 'span', classname: 'window_titlebar_span', append: this, content: args.title });

                for (var key in this.labels) {
                    var button = key[0].toUpperCase() + key.slice(1, key.length);

                    if (elation.utils.isTrue(args['btn'+button]) && key != 'restore') {
                        buttons[key] = {
							label: '',
                            classname: 'window_controls_'+key+' '+this.labels[key],
                            events: { click: elation.bind(this, this[key]) 
                        }
                    };
                }
            }

            this.controls = elation.ui.buttonbar(null, elation.html.create({classname: 'window_controls'}), {
                buttons: buttons,
                append: this
            });

            elation.html.addclass(this.container, 'window_withcontrols');
        }

        this.maximize = function(event) {

        };

        this.minimize = function(event) {

        };

        this.setTitle = function(strTitle) {
            this.title_label.textContent = strTitle;
        };

        this.close = function(event) { 
            this.args.parent.close(); 
        };
	});

	elation.component.add("window.options.tail", function() {
		this.init = function() { 
			switch (this.args.align) {
				case 'left': 	this.alignment = 'right'; break;
				case 'right': this.alignment = 'left'; 	break;
				case 'up': 		this.alignment = 'down'; 	break;
				case 'down': 	this.alignment = 'up'; 		break;
			}

			elation.html.addclass(this.container, 'window_tail window_tail_'+this.alignment);
		}
	});

	elation.component.add("window.options.lightbox", function() {
        this.defaultcontainer = {tag: 'div', classname: 'window_lightbox'};
		this.init = function() { 
			console.log('window.options.lightbox', this);

			if (elation.utils.arrayget(this, 'args.parent.name') == 'window.modal') {
				this.container.style.zIndex = 999;
			} else {
				elation.events.add(this.container, 'click', this);
            }
        }

		this.show = function() {
			document.body.appendChild(this.container);
		}

		this.hide = function() {
			document.body.removeChild(this.container);
		}

		this.click = function(ev) {
			this.args.parent.close();
		}
	});

	elation.component.add("window.options.resizable", function() {
        this.defaultcontainer = {tag: 'div', classname: 'window_resize_container'};
		this.init = function() { 
			this.dim_array = ['x','y','w','h'];
			this.border_size = 15;
			this.corner_size = 25;
            this.dragging = false;
            this.parent = this.args.parent.container;

            elation.html.addclass(this.parent, 'resizable');

            elation.html.css(this.container, {
                top: 0 - this.border_size + 'px',
                left: 0 - this.border_size + 'px',
                right: 0 - this.border_size + 'px',
                bottom: 0 - this.border_size + 'px',
            })

			elation.events.add(this.container, 'mousedown,mouseover,mouseout', this);
            elation.events.add(this.container, 'touchstart', elation.bind(this, this.mousedown));
            elation.events.add(this.container, 'touchmove', elation.bind(this, this.mousemove));
            elation.events.add(this.container, 'touchend', elation.bind(this, this.mouseup));
        }

        this.mousedown = function(ev) {
            this.coords = elation.events.coords(ev);
            this.dimensions = elation.html.dimensions(this.container);
            this.direction = this.getDirection(this.coords);
            this.dragging = true;

            elation.html.addclass(document.body, 'ui_resizing');
            elation.events.add(window, 'mouseup', this);
            elation.events.fire({ type: 'ui_resize_start', element: this });
        }

        this.mousemove = function(ev, delta) {
            var coords = m = elation.events.coords(ev);

            if (this.dragging) {
                var dim = this.dimensions,
                    bsq = this.border_size * 2,
                    delta = {
                        x: coords.x - this.coords.x, 
                        y: coords.y - this.coords.y
                    };

                switch (this.direction) {
                    case 'nw': dim.h -= delta.y; dim.y += delta.y; dim.w -= delta.x; dim.x += delta.x; break;
                    case 'ne': dim.h -= delta.y; dim.y += delta.y; dim.w += delta.x; break;
                    case 'sw': dim.h += delta.y; dim.w -= delta.x; dim.x += delta.x; break;
                    case 'se': dim.w += delta.x; dim.h += delta.y; break;
                    case 'n': dim.h -= delta.y; dim.y += delta.y; break;
                    case 'e': dim.w += delta.x; break;
                    case 'w': dim.w -= delta.x; dim.x += delta.x; break;
                    case 's': dim.h += delta.y; break;
                }

                //console.log('drag', ev.type, direction, dim);

                elation.html.css(this.parent, {
                    top: dim.y + this.border_size + 'px',
                    left: dim.x + this.border_size + 'px',
                    width: dim.w - bsq + 'px',
                    height: dim.h - bsq + 'px'
                });

                this.coords = coords;

                elation.events.fire({
                type: 'window_resize',
                element: this,
                data: dim
                });
                
                ev.preventDefault();
            } else {
                var direction = this.getDirection(m);
                cursor = direction ? direction + '-resize' : '';
                this.container.style.cursor = cursor;
            }
        }

        this.mouseup = function(ev) {
            //console.log('resize', ev.type, this.dragging);
            this.dragging = false;
            this.dimensions = null;
            elation.html.removeclass(document.body, 'ui_resizing');
            elation.events.fire({ type: 'ui_resize_end', element: this });
            //elation.events.remove(window, 'mousemove,mouseup', this);
        }

        this.mouseover = function(ev) {
            if (this.dragging == false) {
                elation.events.add(window, 'mousemove,mouseup', this);
            }
        }

        this.mouseout = function(ev) {
            if (this.dragging == false) {
                this.container.style.cursor = '';
                elation.events.remove(window, 'mousemove,mouseup', this);
            }
        }

        this.getDirection = function(m, d) {
            var bs = this.border_size, cs = this.corner_size,
                d = d || this.dimensions || elation.html.dimensions(this.container),
                dxw = (d.x + d.w), dxy = (d.y + d.h),
                dir = '';

            // calculations to determine if mouse is over corner or side for resizing
            if (m.x > d.x - bs && m.x < d.x + cs && m.y > d.y - bs && m.y < d.y + cs) dir = 'nw';
            else if (m.x > dxw - cs && m.x < dxw + bs && m.y > d.y - bs && m.y < d.y + cs) dir = 'ne';
            else if (m.x > dxw - cs && m.x < dxw + bs && m.y > dxy - cs && m.y < dxy + bs) dir = 'se';
            else if (m.x > d.x - bs && m.x < d.x + cs && m.y > dxy - cs && m.y < dxy + bs) dir = 'sw';
            else if (m.y > d.y - bs && m.y < d.y + cs) dir = 'n';
            else if (m.x > dxw - cs && m.x < dxw + bs) dir = 'e';
            else if (m.x > d.x - bs && m.x < d.x + cs) dir = 'w';
            else if (m.y > dxy - cs && m.y < dxy + bs) dir = 's';

            return dir;
        }
	});

	elation.component.add("window.rendering.absolute", function() {
		this.position = function(dc, dp, dw) {
			if (this.container.offsetParent) {
				var offsetParent = elation.html.dimensions(this.container.offsetParent);

				dp.x = dp.x - offsetParent.x;
				dp.y = dp.y - offsetParent.y;
			}

			dc.positioning = 'absolute';
			dc.y = dp.y;
			dc.x = dp.x;

	        return dc;
		}
    });

	elation.component.add("window.rendering.relative", function() {
		this.init = function() { 
            console.log('window.rendering.relative', this); 
        }
	});

	elation.component.add("window.rendering.fixed", function() {
		this.position = function(dc, dp, dw) {
            var index = elation.window.manager.windows.length;

			dc.positioning = 'fixed';
			dc.y = 50 + (30 * index);
			dc.x = 100 + (30 * index);

	        return dc;
		}
	});

	elation.component.add("window.rendering.center", function() {
		this.position = function(dc, dp, dw) {
			dc.positioning = 'fixed';
			dc.y = dw.h >> 1;
			dc.x = dw.w >> 1;

	        return dc;
		}
	});

	elation.component.add("window.rendering.css", function() {
		this.init = function() { console.log('window.rendering.css', this); }
	});

	elation.component.add("window.rendering.alignment", function() {
		this.position = function(dc, dp, dw) {
			var top = 0, left = 0;

			switch (this.args.align) {
				case 'top':
					top = -dc.h - this.args.margin;
					left = (dp.w >> 1) - (dc.w >> 1);
					break;
				case 'bottom':
					top = dp.h + this.args.margin;
					left = (dp.w >> 1) - (dc.w >> 1);
					break;
				case 'left':
					top = (dp.h >> 1) + -(dc.h >> 1);
					left = -dc.w - this.args.margin;
					break;
				case 'right':
					top = (dp.h >> 1) + -(dc.h >> 1);
					left = dp.w + this.args.margin;
					break;
				default:
					top = -(dc.h >> 1);
					left = -(dc.w >> 1);
			}

			dc.y += top;
			dc.x += left;

            return dc;
		}
	});

	elation.component.add("window.dialog", function() {
		this.defaults = {
			rendering: 'fixed',
			align: 'none',
			btnClose: true,
			lightbox: false,
			moveable: true
		};

		this.init = function() {
            this.super('window.window');
		}
	}, elation.window.create);

	elation.component.add("window.infobox", function() {
		this.defaults = {
			rendering: 'absolute',
			align: 'right',
			moveable: false,
			resizable: false,
			titlebar: false,
			title: false,
			tail: true
		};

		this.init = function() {
            this.super('window.window');
		}
	}, elation.window.create);

	elation.component.add("window.window", function() {
		this.defaults = {
			rendering: 'fixed',
			align: 'none',
			titlebar: true,
			title: 'Window',
			btnClose: true,
			btnMaximize: true,
			btnMinimize: true,
			resizable: true,
			moveable: true
		};

		this.init = function() {
            this.super('window.window');
		}
	}, elation.window.create);

	elation.component.add("window.modal", function() {
		this.defaults = {
			rendering: 'center',
			align: 'center',
			btnClose: false,
			lightbox: true,
			moveable: false,
			ontop: true
		};

		this.init = function() {
            this.super('window.window');
		}
	}, elation.window.create);

	elation.component.add("window.iframe", function() {
		this.defaults = {
            classname: 'application_iframe',
			rendering: 'fixed',
			align: 'none',
			animation: 'slide_up,slide_down',
			titlebar: true,
			title: 'Window',
			btnClose: true,
			btnMaximize: true,
			btnMinimize: true,
			resizable: true,
			moveable: true
		};

		this.init = function() {
            this.iframe = elation.html.create({
                tag: 'IFRAME',
                attr: { src: this.args.content },
                append: this
            });

            this.args.content = this.iframe;

            elation.window.iframe.extendclass.init.call(this);
		}
	}, elation.window.create);
});

// elation.require(['ui.base', 'window.window'], function() {
// 	elation.component.add("ui.example_dialog", function() {
//         this.defaultcontainer = { tag: 'div', classname: 'ui_example_dialog' };

// 		this.init = function() {
// 			var parent = elation.utils.arrayget(this.args, 'parent.container');
// 			var args = elation.utils.arrayget(this.args, 'parent.args');

// 			this.container.innerHTML = 'This is a test';

// 			this.window = elation.window.dialog({
// 				name: args.name,
// 				append: document.body,
// 				parent: parent,
// 				content: this.container,
// 				title: args.name
// 			})
// 		}
// 	}, elation.ui.base);

// 	elation.component.add("ui.example_infobox", function() {
//         this.defaultcontainer = { tag: 'div', classname: 'ui_example_infobox' };

// 		this.init = function() {
// 			var parent = elation.utils.arrayget(this.args, 'parent.container');
// 			var args = elation.utils.arrayget(this.args, 'parent.args');
			
// 			this.container.innerHTML = 'This is a test<br><br>of an infobox!';
// 			this.window = elation.window.infobox({
// 				name: args.name,
// 				content: this.container,
// 				rendering: 'absolute',
// 				append: this.args.parent.picture,
// 				align: 'right'
// 			});
// 		}
//     }, elation.ui.base);

//     elation.component.add("ui.example_window", function() {
//         this.defaultcontainer = { tag: 'div', classname: 'ui_example_infobox' };

//  		this.init = function() {

//  		}
//     }, elation.ui.base);
// });