var NinjaTemplate = function(){
	this.replaceUndefinedProperties = true;
	this.nullValue = '';
	this.tagOpen = '{{';
	this.tagEnd = '/';
	this.tagClose = '}}';
	this.tagUndefinedOpen = '{{';
	this.tagUndefinedClose = '}-undefined}';
	this.tagIsArray = '}-isArray}';
	this.methodChar = '#';
	this.tagMatchRe = new RegExp(this.tagOpen +'\\s*(['+ this.tagEnd + this.methodChar +']?)\\s*(.+?)\\s*'+ this.tagClose, 'g');
	this.compiledTemplate = undefined;
};

NinjaTemplate.prototype = {
	compile: function(template){
		var result = {}, tagObject, tagMatch, type, tag, method, isMethod, isEnd, index, lastIndex, prevLastIndex = 0;
		var ref = result;

		if(!template){ return result; }

		while((tagMatch = this.tagMatchRe.exec(template)) !== null){
			type = tagMatch[1];
			tag = tagMatch[2];
			index = tagMatch.index;
			lastIndex = this.tagMatchRe.lastIndex;
			isMethod = type === this.methodChar;
			isEnd = type === this.tagEnd;

			if(isMethod){
				var methodMatch = tag.match(/\s*(\w*)\s*(.*)/i);
				if(methodMatch){
					method = methodMatch[1];
					tag = methodMatch[2];
				}else{
					method = undefined;
					tag = undefined;
				}
			}

			tagObject = {
				raw: tagMatch[0],
				type: type,
				tag: tag,
				index: index,
				lastIndex: lastIndex,
				method: method,
				isMethod: isMethod,
				isEnd: isEnd,
				parent: ref
			};

			if(!ref.children){ ref.children = []; }

			//static text before or after tag
			if(index > prevLastIndex){
				ref.children.push(this.createStaticObject(
					template.substring(prevLastIndex, index),
					prevLastIndex,
					index
				));
				prevLastIndex = index;
			}

			//{{#....}}
			if(isMethod){
				ref.children.push(tagObject);
				ref = tagObject;
				prevLastIndex = lastIndex;
			//{{/...}}
			}else if(isEnd){
				ref.end = tagObject;
				ref = ref.parent;
				prevLastIndex = lastIndex;
			//{{...}}
			}else{
				tagObject.isProperty = true;
				ref.children.push(tagObject);
				prevLastIndex = lastIndex;
			}
		}

		//static after the last tag
		if(prevLastIndex < template.length){
			ref.children.push(this.createStaticObject(
				template.substring(prevLastIndex),
				prevLastIndex,
				template.length));
		}

		this.compiledTemplate = result;
		return result;
	},

	createStaticObject: function(raw, index, lastIndex){
		return {
			raw: raw,
			index: index,
			lastIndex: lastIndex,
			isStatic: true
		};
	},

	render: function(data, compiledTemplate){
		var result = '', tag, propertyValue, method, isMethodTrue;
		compiledTemplate = compiledTemplate || this.compiledTemplate;
		if(!data || !compiledTemplate){ return result; }

		for(var i = 0, len = compiledTemplate.children.length; i < len; i++){
			tag = compiledTemplate.children[i];
			if(tag.isStatic){
				result += tag.raw;
			}else if(tag.isProperty){

				propertyValue = NinjaProperty.value(data, tag.tag);
				if(typeof propertyValue === 'undefined'){
					propertyValue = this.getUndefinedString(tag.tag);
				}else if(propertyValue === null){
					propertyValue = this.nullValue;
				}else if(propertyValue instanceof Array){
					propertyValue = this.getTagIsArrayString(tag.tag);
				}
				result += propertyValue;

			}else if(tag.isMethod){
				if(tag.method === 'if'){
					isMethodTrue = NinjaLogic.compile(tag.tag, data);
					if(isMethodTrue){
						result += this.render(data, tag);
					}
				}else if(tag.method === 'each'){
					var array = NinjaProperty.value(data, tag.tag);
					if(array){
						var counter = 0;
						var arrayItem;
						for(var item in array){
							arrayItem = array[item];
							if(arrayItem){
								arrayItem._key = item;
								arrayItem._index = counter;
								arrayItem._parent = data;
								counter++;
								result += this.render(arrayItem, tag);
							}
						}
					}
				}
			}
		}
		return result;
	},


	getUndefinedString: function(property){
		return this.replaceUndefinedProperties ? this.tagUndefinedOpen + property + this.tagUndefinedClose : '';
	},

	getTagIsArrayString: function(property){
		return this.replaceUndefinedProperties ? this.tagUndefinedOpen + property + this.tagIsArray : '';
	}
};
