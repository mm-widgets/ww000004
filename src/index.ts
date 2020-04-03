import on from '@mmstudio/on';

const no = 'mm-000004';

function get_i18n() {
	const lang = navigator.language;
	switch (lang) {
		case 'zh_CN':
		case 'zh_cn':
		case 'zh':
		case 'cn':
			return {
				first: '首页',
				first_desc: '点击跳转到首页',

				prev: '上一页',
				prev_desc: '点击跳转到上一页',

				next: '下一页',
				next_desc: '点击跳转到下一页',

				last: '末页',
				last_desc: '点击跳转至末页',

				goto_after: '页',
				goto_before: '跳转到第:',
				goto_btn: '确定',

				total_after: '条',
				total_before: '共'
			};
		default:
			return {
				first: '<<',
				first_desc: 'Goto first page',

				prev: '<',
				prev_desc: 'Goto previous page',

				next: '>',
				next_desc: 'Goto next page',

				last: '>>',
				last_desc: 'Goto last page',

				goto_after: '',
				goto_before: 'goto:',
				goto_btn: 'OK',

				total_after: '',
				total_before: 'total:'
			};
	}
}

const styles = `
<style>
.${no} ul,
.${no} li {
	margin:0;
	padding:0;
	list-style:none;
	display:inline-block;
}

.${no} a {
	text-decoration:none;
}

.${no} a {
	color:#007BFF;
	padding:5px;
	border:1px solid #ccc;
	border-radius: 4px;
}

.${no} ul li {
	text-align:center;
	color:#000;
	cursor:pointer;
	margin:3px;
}

.${no} a:hover {
	background:#E9ECEF;
}

.${no} input[type="number"] {
	padding-left:5px;
}

.${no} input[type="button"] {
	width:60px;
	height:28px;
	background:#007BFF;
	color:#fff;
	border:1px solid #007BFF;
	border-radius:4px;
	cursor:pointer;
	margin:0 3px;
}

.${no} #current {
	color:#fff;
	background:#007BFF;
	cursor:default;
	border:none;
	border-radius: 4px;
	padding:6px;
}

.${no} .visib {
	visibility:visible;
}

.${no} .visib-non {
	visibility:visible;
	color:#CCCCCC;
	pointer-events:none;
}
</style>
`;

function query2url(query_param: { [key: string]: string; }) {
	const usp = new URLSearchParams();
	for (const k in query_param) {
		usp.append(k, query_param[k]);
	}
	const _url = usp.toString();
	return `${window.location.href.split('?')[0]}?${_url}`;
}

function get_query(url: string) {
	const urlsearchparam = new URLSearchParams(url);
	const query = {} as { [key: string]: string; };
	urlsearchparam.forEach((val, key) => {
		query[key] = val;
	});
	return query;
}

/**
 * 分页
 */
export default class Pagination extends HTMLElement {
	private dom: ShadowRoot;
	public constructor() {
		super();
		this.dom = this.attachShadow({ mode: 'closed' });
	}

	public connectedCallback() {
		const locale = get_i18n();
		const dom = this.dom;
		const key = this.getAttribute('key');
		if (!key) {
			throw new Error('Cound not get attribute [key]');
		}
		const str_size = this.getAttribute('size');
		if (!str_size) {
			throw new Error('Cound not get attribute [size]');
		}
		const size = parseInt(str_size, 10);
		const str_total = this.getAttribute('total');
		if (!str_total) {
			throw new Error('Cound not get attribute [total]');
		}
		const total = parseInt(str_total, 10);
		const show_first = get_boolean_attribute(this, 'show-first');
		const show_last = get_boolean_attribute(this, 'show-last');
		const show_goto = get_boolean_attribute(this, 'show-goto');
		const show_total = get_boolean_attribute(this, 'show-total');
		const show_first_last_no = get_boolean_attribute(this, 'show-first-last-no');
		const max_btn_num = parseInt(this.getAttribute('max-btn-num') || '0', 10) - 1;

		const query = get_query(location.search.substr(1));

		const page_no = parseInt(query[key] || '1', 10);

		const l = Math.ceil(total / size);		// 最大页数

		const first = (() => {			// 首页
			if (!show_first) {
				return '';
			}
			const flag = page_no >= 2;
			const cls = flag ? 'visib' : 'visib-non';
			const url = flag ? query2url({ ...query, [key]: '1' }) : 'javascript:void(0);';
			return `<a href="${url}" class="${cls}" title="${locale.first_desc}">${locale.first}</a>`;

		})();

		const prev = (() => {			// 上一页
			const flag = page_no >= 2;
			const cls = flag ? 'visib' : 'visib-non';
			const url = flag ? query2url({ ...query, [key]: String(page_no - 1) }) : 'javascript:void(0);';
			return `<a href="${url}" class="${cls}" title="${locale.prev_desc}">${locale.prev}</a>`;
		})();

		const c = (() => {
			if (max_btn_num < 0) {
				return '';
			}
			const [b, a] = (() => {
				const p_no = l - page_no;
				const s_size1 = (max_btn_num + 1) / 2;
				const s_size2 = Math.ceil((max_btn_num + 1) / 2);

				if (show_first_last_no && p_no >= s_size1 && page_no >= s_size2 && (max_btn_num + 1) < l) {
					let max_btn = max_btn_num - 2;
					if (max_btn < 0) {
						max_btn = 0;
					}
					const _b = Math.floor(max_btn / 2);	// before
					const _a = max_btn - _b;				// after
					return [_b, _a];
				} else if (show_first_last_no && p_no >= s_size1 && page_no < s_size2 && (max_btn_num + 1) < l) {
					let max_btn = max_btn_num - 1;
					if (max_btn < 0) {
						max_btn = 0;
					}
					if (page_no === 1) {
						const _b = 0;					// before
						const _a = max_btn;				// after
						return [_b, _a];
					} else if (page_no === 2) {
						const _b = 1;	// before
						const _a = max_btn - 1;				// after
						return [_b, _a];
					}
					const _b = Math.floor(max_btn / 2);	// before
					const _a = max_btn - _b;				// after
					return [_b, _a];

				} else if (show_first_last_no && page_no >= s_size2 && p_no < s_size1 && (max_btn_num + 1) < l) {
					if (page_no === l) {
						let max_btn = max_btn_num - 1;
						if (max_btn < 0) {
							max_btn = 0;
						}
						const _b = max_btn;					// before
						const _a = 0;				// after
						return [_b, _a];
					} else if (page_no === (l - 1)) {
						let max_btn = max_btn_num - 1;
						if (max_btn < 0) {
							max_btn = 0;
						}
						const _b = max_btn - 1;					// before
						const _a = 1;				// after
						return [_b, _a];
					}
					let max_btn = max_btn_num - 1;
					if (max_btn < 0) {
						max_btn = 0;
					}
					const _c = Math.floor(max_btn / 2);
					const _b = _c;					// before
					const _a = max_btn - _c;				// after
					return [_b, _a];

				} else if ((max_btn_num + 1) >= l) {
					const _b = max_btn_num;	// before
					const _a = max_btn_num;				// after
					return [_b, _a];
				}
				// 当前页码与结束页码差值
				const r = l - page_no;
				// 获取中间数值
				const _b = Math.floor(max_btn_num / 2);
				// 如果当前页码处于显示按钮区域内
				if (_b < page_no && _b < r) {
					// 如果中间数值大于当前页码，则当前页码为开始数
					const _a = max_btn_num - _b;				// after
					return [_b, _a];
				} else if (_b >= page_no) {
					// 当前页码在显示按钮中间值左侧，即当前页码偏向开始
					const _a = max_btn_num - page_no + 1;				// after
					return [page_no, _a];
				}
				// 当前页码与总页数差值小于显示按钮中间值，即当前页码偏向结束
				const _a = max_btn_num - r;				// before
				return [(r > -1) ? _a : max_btn_num, (r > -1) ? r : 0];


			})();
			const btns = new Array<number>(b);
			btns.fill(0);
			const atns = new Array<number>(a);
			atns.fill(0);
			const tmp = { ...query };	// clone

			const bbtns = btns.map((_v, i) => {		// 当前页之前的页码按钮值集合
				return page_no - i - 1;
			}).reverse().filter((v) => {
				return v > 0;
			});
			const abtns = atns.map((_v, i) => {		// 当前页之后的页码按钮值集合
				return page_no + i + 1;
			}).filter((v) => {
				return v <= l;
			});

			const sb = bbtns.reduce((pre, cur) => {
				tmp[key] = cur.toString();
				const url = query2url(tmp);
				return `${pre}<li><a href="${url}">${cur}</a></li>`;
			}, '');
			const sa = abtns.reduce((pre, cur) => {
				tmp[key] = cur.toString();
				const url = query2url(tmp);
				return `${pre}<li><a href="${url}">${cur}</a></li>`;
			}, '');
			return `<ul>${sb}<li><a id="current" href="javascript:void(0);">${page_no}</a></li>${sa}</ul>`;
		})();

		const next = (() => {			// 下一页
			const cls = page_no < l ? 'visib' : 'visib-non';
			const url = query2url({ ...query, [key]: String(page_no + 1) });
			return `<a href="${url}" class="${cls}" title="${locale.next_desc}">${locale.next}</a>`;
		})();

		const last = (() => {			// 末页
			if (!show_last) {
				return '';
			}
			const cls = page_no < l ? 'visib' : 'visib-non';
			const url = query2url({ ...query, [key]: l.toString() });
			return `<a href="${url}" class="${cls}" title="${locale.last_desc}">${locale.last}</a>`;

		})();

		const goto = (() => {		 // 页数input输入框
			if (!show_goto || page_no >= total) {
				return '';
			}
			return `<span>${locale.goto_before}</span><input id='goto' type="number" min=1 max=${l} value=${page_no} /><span>${locale.goto_after}</span><input id='gotobtn' type="button" value=${locale.goto_btn} />`;

		})();

		const detail = (() => {		// 共多少条
			if (show_total) {
				return `<span>${locale.total_before}${total}${locale.total_after}</span>`;
			}
			return '';

		})();

		const p_last = (() => {
			const p_no = l - page_no;
			const s_size = (max_btn_num + 1) / 2;
			if (show_first_last_no && p_no >= s_size && (max_btn_num + 1) > 1 && (max_btn_num + 1) < l) {
				const cls = page_no < l ? 'visib' : 'visib-non';
				const url = query2url({ ...query, [key]: l.toString() });
				return `
				<a class="${cls}" >...</a>
				<a href="${url}" class="${cls}" title="${locale.last_desc}">${l}</a>`;
			}
			return '';

		})();

		const p_first = (() => {
			const s_size = Math.ceil((max_btn_num + 1) / 2);
			if (show_first_last_no && page_no >= s_size && (max_btn_num + 1) > 1 && (max_btn_num + 1) < l) {
				const flag = page_no >= 2;
				const cls = flag ? 'visib' : 'visib-non';
				const url = flag ? query2url({ ...query, [key]: '1' }) : 'javascript:void(0);';
				return `
				<a href="${url}" class="${cls}" title="${locale.first_desc}">${1}</a>
				<a class="${cls}">...</a>
				`;
			}
			return '';

		})();

		this.dom.innerHTML = `
			${styles}
			<div class="${no}">
				${first}
				${prev}
				${p_first}
				${c}
				${p_last}
				${next}
				${last}
				${goto}
				${detail}
			</div>
		`;
		const goto_page = dom.querySelector('#goto') as HTMLInputElement;
		const goto_btn = dom.querySelector('#gotobtn') as HTMLButtonElement;
		if (goto_btn && goto_page) {
			on(goto_btn, 'click', () => {
				const v = parseInt(goto_page.value, 10);
				query[key] = v.toString();
				const url = query2url(query);
				window.location.href = url;
			});
			on(goto_page, 'keydown', (e) => {
				if ((e as KeyboardEvent).keyCode === 13) {
					const v = parseInt(goto_page.value, 10);
					query[key] = v.toString();
					const url = query2url(query);
					window.location.href = url;
				}
			});
		}
	}
}

if (!window.customElements.get(no)) {
	window.customElements.define(no, Pagination);
}

function get_boolean_attribute(node: HTMLElement, attribute: string) {
	if (node.hasAttribute(attribute)) {
		const value = node.getAttribute(attribute);
		if (value) {
			return value.toLocaleLowerCase() !== 'false';
		}
		return true;

	}
	return false;

}
