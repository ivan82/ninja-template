# ninja-template
Searches and replaces json object properties.
{{json property}}

Within the each loop there are reserved json properties:
_key
_index
_parent


# Requieres
ninja-property.js
ninja-logic.js

# Example
```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Template</title>
</head>
<body>

<script src="ninja-property.js"></script>
<script src="ninja-logic.js"></script>
<script src="ninja-template.js"></script>

<script id="counties-list-item-template" type="text/x-template">
{{#each counties}}
	<option value="{{code}}">{{name}}</option>
{{/each}}
</script>



<script id="object-list-item-template" type="text/x-template">
{{#each objects}}
<!--object-->
<div id="object-list-item-{{id}}" class="object-list-item row" onclick="getObject('{{id}}');">
	<div class="col-lg-3 col-image">
		<div class="isIcons">
			{{#if isUpcomingSale == '1'}}<div class="isUpcomingSale">Kommande försäljning</div>{{/if}}
			{{#if isNewProduction == '1'}}<div class="isNewProduction">Nyproduktion</div>{{/if}}
			{{#if hasBiddingStarted == '1'}}<div class="hasBiddingStarted">Budgivning pågår</div>{{/if}}
		</div>
		<div class="image">{{#if image}}<img src="../images/objects/{{id}}/tmb_{{image}}" alt="{{address}} - Image" />{{/if}}</div>
	</div>
	<div class="col-lg-9">
		<div class="row">
			<div class="col-lg-5">
				<div class="city list-header">{{city}}</div>
				<div class="address">{{address}}</div>
				<div class="zipCode">{{zipCode}}</div>
			</div>
			<div class="col-lg-4">
				<div class="price list-header">
				{{#if priceOld}}
					{{#if isPriceRaised == '1'}}<i class="fa fa-level-up isPriceRaised"></i>{{/if}}
					{{#if isPriceLowered == '1'}}<i class="fa fa-level-down isPriceLowered"></i>{{/if}}
					{{price}} {{currency}} <del>{{priceOld}} {{currency}}</del>
				{{/if}}
				{{#if price && !priceOld}}{{price}} {{currency}}{{/if}}
				</div>
			</div>
		</div>
		{{#if descriptionShort}}
		<div class="row">
			<div class="col-lg-12">
				<div class="descriptionShort">
				{{#if type == '0'}}<i class="fa fa-home icon-villa"></i>{{/if}}
				{{#if type == '1'}}<i class="fa fa-th-list icon-row-house"></i>{{/if}}
				{{#if type == '2'}}<i class="fa fa-building icon-bostadsratt"></i>{{/if}}
				&nbsp;{{descriptionShort}}
				</div>
			</div>
		</div>
		{{/if}}

	</div>
</div>
<!--//object-->
{{/each}}
</script>






<div id="counties"></div>
<div id="objects-container"></div>


<script>
var ninjaTemplate = new NinjaTemplate();

var objectListItemTemplateHtml = document.getElementById('object-list-item-template').innerHTML;
var objectListItemTemplate = ninjaTemplate.compile(objectListItemTemplateHtml);

var countyTemplateHtml = document.getElementById('counties-list-item-template').innerHTML
var countyTemplate = ninjaTemplate.compile(countyTemplateHtml);


var countriesObject = [{'name': 'Sweden'}, {'name': 'Norway'}];

var objectsObject = [{
    isUpcomingSale: 1,
    isNewProduction: 1,
    image: 'test.jpg',
    address: 'test address',
    city: 'Gothenburg',
    zipCode: '1234',
    priceOld: 5000,
    price: 3000,
    isPriceLowered: 1,
    currency: 'SEK',
    descriptionShort: 'description short',
    type: 2
},{
    isUpcomingSale: 0,
    isNewProduction: 1,
    image: 'test2.jpg',
    address: 'test2 address',
    city: 'Stockholm',
    zipCode: '3423',
    priceOld: 3000,
    price: 5000,
    isPriceRaised: 1,
    currency: 'SEK',
    descriptionShort: 'description short',
    type: 1
}];

document.getElementById('counties').innerHTML = ninjaTemplate.render({'counties': countriesObject}, countyTemplate);
document.getElementById('objects-container').innerHTML = ninjaTemplate.render({'objects': objectsObject}, objectListItemTemplate);

</script>
</body>
</html>
```
