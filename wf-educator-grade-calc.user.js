// ==UserScript==
// @name         Educator Calc
// @namespace    x
// @version      1.0.0
// @description  Calculate the average grade from an Educator webpage.
// @author       Zeus_Junior
// @match        https://educator.windesheim.nl/studyprogress*
// @grant        none
// ==/UserScript==

function getGradeFromText(text) {
	text = text.toLowerCase();
	const wordGrades = {
		'uitmuntend': 10.0,
		'zeer goed': 9.0,
		'goed': 8.0,
		'ruim voldoende': 7.0,
		'voldoende': 6.0,
		'onvoldoende': 5.0
	};

	if (text == 'voldaan' || text == 'niet voldaan' || text == 'n.v.t.') {
		return null;
	}

	return wordGrades[text];
}

function calculateAverage() {
	const gradeContainers = $('.exam-unit.exam-unit__grade');
	if (!gradeContainers) {
		alert('Could not find any grades');
		return;
	}

	const grades = [];
	gradeContainers.each((index) => {
		// $(this) did not work
		const grade = $(gradeContainers[index]).find('span.grade');
		const gradeNr = grade.clone().children().remove().end().text().trim();
		const title = $(gradeContainers[index]).find('a.btn-link').text();
		const attempts = $(gradeContainers[index]).find('badge badge-attempts').text().trim();

		if (grade && gradeNr != '-') {
			const gradeLocked = grade.find('i.fa.fa-lock') ? 'locked' : 'not locked';
			grades.push(gradeNr);

			// console.log(`${gradeNr} ${gradeLocked} ${attempts} ${title}`);
		}
	});

	const fixedGrades = [];
	grades.forEach((gr) => {
		let tempGrade = parseFloat(gr);
		if (isNaN(tempGrade)) {
			tempGrade = getGradeFromText(gr);
		}
		if (tempGrade != null) {
			fixedGrades.push(tempGrade);
		}
	});

	const avg = fixedGrades.reduce((a, b) => a + b, 0);

	alert('Your average grade is: ' + (avg/fixedGrades.length).toFixed(2));
}

(function() {
	'use strict';

	$('.resultsCollapseLink').after('<button type="button" id="calcAverageBtn" class="btn btn-default btn-secondary">Average grade</button>');
	$('#calcAverageBtn').click(() => {
		calculateAverage();
	});
})();
