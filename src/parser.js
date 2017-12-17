import {escapeRegExp} from "./utils";

const PLACEHOLDER = '~#$%&~';


export default function (source, template, options={}) {
	const opening = options.opening || '[{';
	const closing = options.closing || '}]';
	const placeholder = options.placeholder || PLACEHOLDER;

	const pattern = `${escapeRegExp(opening)}\\w+${escapeRegExp(closing)}`;
	const regExp = new RegExp(pattern, 'gmi');
	const tags = [];
	const result = [];

	const parts = template.replace(regExp, (tag) => {
		tags.push(tag);
		return placeholder;
	}).split(placeholder);

	parts.reduce((curr, next) => {
		let start = source.indexOf(curr) + curr.length;
		source = source.substring(start);                       //To avoid appearance of next part inside current

		let finish = source.indexOf(next) || source.length;     //Handle template ending
		let value = source.slice(0, finish);
		source = source.substring(finish);                      //Cleanup for the next iteration

		result.push({
			tag: tags.shift(),
			value
		});
		return next;
	});

	return result;
}