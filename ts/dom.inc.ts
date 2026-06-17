/*****************************************************************************
 * The Canadian not-so-common-CV
 * (C) 2026  Sylvain Hallé
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 * 
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 * 
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 *****************************************************************************/
 
function has_class(e: HTMLElement, c: string)
{
		var list = e.classList as DOMTokenList;
		return list.contains(c);
}

function add_class(e: HTMLElement, c: string)
{
		var list = e.classList as DOMTokenList;
		list.add(c);
}
// :mode=javascript:tabSize=2:tabIndent=2: