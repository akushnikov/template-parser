import chai, {expect} from 'chai';
import chaiString from 'chai-string';
import requireText from 'require-text';


chai.use(chaiString);


const defaultTemplate = requireText('./resources/default/template.html', require);
const defaultSource = requireText('./resources/default/source.html', require);

const tagEndingTemplate = requireText('./resources/tag-ending/template.html', require);
const tagEndingSource = requireText('./resources/tag-ending/source.html', require);

const oneByOneTemplate = requireText('./resources/one-by-one/template.html', require);
const oneByOneSource = requireText('./resources/one-by-one/source.html', require);

import {parser} from "../index";

describe('File Content', () => {
	it('should load template correctly', () => {
		const expectedResult = `<div class="content">
    [{TITLE}]
    <ul class="attributes">
        Attributes:
        <li>Size: [{SIZE}]</li>
        <li>Сolor: [{COLOR}]</li>
    </ul>
    <img src="[{IMAGE1}]" />
    <img src="[{IMAGE2}]" />
</div>`;
		expect(defaultTemplate).to.equalIgnoreSpaces(expectedResult);
	});

	it('should load source correctly', () => {
		const expectedResult = `<div class="content">
    Adidas shoes new for women
    <ul class="attributes">
        Attributes:
        <li>Size: 36</li>
        <li>Сolor: Red</li>
    </ul>
    <img src="http://www.site.com/adidas-busenitz-vulc-skate-shoes-black-running-red.jpg" />
    <img src="http://www.site.com/adidas-busenitz-vulc-skate-shoes-black-running-red2.jpg" />
</div>`;

		expect(defaultSource).to.equalIgnoreSpaces(expectedResult);
	})
});

describe('Parser', () => {
	it('should parse default source correctly', () => {
		const expected = [{
			tag: "[{TITLE}]",
			value: "Adidas shoes new for women"
		}, {
			tag: "[{SIZE}]",
			value: "36"
		}, {
			tag: "[{COLOR}]",
			value: "Red"
		}, {
			tag: "[{IMAGE1}]",
			value: "http://www.site.com/adidas-busenitz-vulc-skate-shoes-black-running-red.jpg"
		}, {
			tag: "[{IMAGE2}]",
			value: "http://www.site.com/adidas-busenitz-vulc-skate-shoes-black-running-red2.jpg"
		}];

		const result = parser(defaultSource, defaultTemplate);

		expect(result).to.deep.equal(expected);
	});

	it('should parse source ending with tag correctly', () => {
		const expected = [{
			tag: "[{TITLE}]",
			value: "Adidas shoes new for women"
		}, {
			tag: "[{SIZE}]",
			value: "36"
		}, {
			tag: "[{COLOR}]",
			value: "Red"
		}, {
			tag: "[{IMAGE1}]",
			value: "http://www.site.com/adidas-busenitz-vulc-skate-shoes-black-running-red.jpg"
		}, {
			tag: "[{IMAGE2}]",
			value: "http://www.site.com/adidas-busenitz-vulc-skate-shoes-black-running-red2.jpg"
		}, {
			tag: '[{FOOTER}]',
			value: '<footer class="footer">I\'m a dummy footer</footer>'
		}];

		const result = parser(tagEndingSource, tagEndingTemplate);

		expect(result).to.deep.equal(expected);
	});

	it('should parse source with to tags one after another', () => {
		const expected = [{
			tag: "[{TITLE}]",
			value: "Adidas shoes new for women"
		}, {
			tag: "[{SIZE}]",
			value: "36"
		}, {
			tag: "[{COLOR}]",
			value: "Red"
		}, {
			tag: "[{IMAGE1}]",
			value: "http://www.site.com/adidas-busenitz-vulc-skate-shoes-black-running-red.jpg"
		}, {
			tag: "[{IMAGE2}]",
			value: "http://www.site.com/adidas-busenitz-vulc-skate-shoes-black-running-red2.jpg"
		}, {
			tag: '[{DUMMY_BLOCK1}]',
			value: 'DUMMY'
		}, {
			tag: '[{DUMMY_BLOCK2}]',
			value: 'BLOCK'
		}];

		const result = parser(oneByOneSource, oneByOneTemplate);

		expect(result).to.deep.equal(expected);
	});
});


