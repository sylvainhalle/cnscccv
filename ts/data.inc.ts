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

const SECTIONS = {
	personal: {
    path: "personal",
    container: "personal",
    empty: empty_Personal,
    title: (e: any) => `Personal Information`,
    fields: [
      ["first", "First name"],
      ["last", "Last name"],
      ["email", "E-mail"]
    ]
  },
  education: {
    path: "education",
    container: "education",
    empty: empty_EducationEntry,
    title: (e: any) => `${e.school} (${e.degree})`,
    fields: [
      ["school", "Institution"],
      ["degree", "Degree"],
      ["start", "Start"],
      ["end", "End"]
    ]
  },
  publications: {
    path: "publications",
    container: "publications",
    empty: empty_Publications,
    title: (e: any) => `Publications`,
    fields: [
      ["journals", "Journal Papers"],
      ["conferences", "Conference Papers"]
    ]
  },
  journals: {
    path: "publications.journals",
    container: "journals",
    empty: empty_JournalArticle,
    title: (e: any) => `${e.title}`,
    fields: [
      ["title", "Title"],
      ["author", "Degree"],
      ["start", "Start"],
      ["end", "End"]
    ]
  },
  
};
// :mode=javascript:tabSize=2:tabIndent=2: