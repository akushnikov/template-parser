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

	let temp = source;

	parts.reduce((curr, next) => {
		let start = temp.indexOf(curr) + curr.length;
		temp = temp.substring(start);                       //To avoid appearance of next part inside current

		let finish = temp.indexOf(next) || temp.length;     //Handle template ending
		let value = temp.slice(0, finish);
		temp = temp.substring(finish);                      //Cleanup for the next iteration

		result.push({
			tag: tags.shift(),
			value
		});
		return next;
	});

	return result;
}