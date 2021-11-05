/*
** FORMAT DATE UTIL
*/

const millisecondsToSeconds		= (milliseconds) => milliseconds / 1000;
const millisecondsToMinutes		= (milliseconds) => millisecondsToSeconds(milliseconds) / 60;
const millisecondsToHours		= (milliseconds) => millisecondsToMinutes(milliseconds) / 60;
const millisecondsToDays		= (milliseconds) => millisecondsToHours(milliseconds) / 24;

const DE = 'de';
// const EN = 'en';
const ES = 'es';
const FR = 'fr';
// const NL = 'nl';

class DateToString {

	constructor(_locale, _short) {
		this.locale = _locale;
		this.short = _short;
	}

	justNow() {
		switch (this.locale) {
			case DE:
				return this.short ? `Now` : `Just now`;
			case FR:
				return this.short ? `Maint.` : `À l'instant`;
			default:
				return this.short ? `Now` : `Just now`;
		}
	}

	minutes(minutes) {
		switch (this.locale) {
			case DE:
				return this.short ? `${minutes} min` : `${minutes} minute${minutes >= 2 ? 's' : ''} ago`;
			case FR:
				return this.short ? `${minutes} min` : `Il y a ${minutes} minute${minutes >= 2 ? 's' : ''}`;
			default:
				return this.short ? `${minutes} min` : `${minutes} minute${minutes >= 2 ? 's' : ''} ago`;
		}
	}

	hours(hours) {
		switch (this.locale) {
			case DE:
				return this.short ? `${hours} h` : `${hours} hour${hours >= 2 ? 's' : ''} ago`;
			case FR:
				return this.short ? `${hours} h` : `Il y a ${hours} heure${hours >= 2 ? 's' : ''}`;
			default:
				return this.short ? `${hours} h` : `${hours} hour${hours >= 2 ? 's' : ''} ago`;
		}
	}

	days(days) {
		switch (this.locale) {
			case DE:
				return this.short ? `${days} day${days >= 2 ? 's' : ''}` : `${days} day${days >= 2 ? 's' : ''} ago`;
			case FR:
				return this.short ? `${days} j` : `Il y a ${days} jour${days >= 2 ? 's' : ''}`;
			default:
				return this.short ? `${days} day${days >= 2 ? 's' : ''}` : `${days} day${days >= 2 ? 's' : ''} ago`;
		}
	}

	month(month) {
		switch (this.locale) {
			case DE:
				return this.short ?
					["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"][month]
					: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"][month];
			case FR:
				return this.short ?
					["jan", "fév", "mar", "avr", "mai", "juin", "juil", "août", "sept", "oct", "nov", "déc"][month]
					: ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"][month];
			default:
				return this.short ?
					["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"][month]
					: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"][month];
		}
	}

	date(day, month, year = null) { //April 22, 1996
		switch (this.locale) {
			case DE:
				return `${this.month(month)} ${day}${year ? `, ${year}` : ''}`;
			case FR:
				return `${day} ${this.month(month)}${year ? ` ${year}` : ''}`;
			default:
				return `${this.month(month)} ${day}${year ? `, ${year}` : ''}`;
		}
	}

}

export default (_date, locale = 'en', short = false) => {
	const date	= new Date(_date);
	const now	= new Date();
	const diff = now - date;

	const dateToString = new DateToString(locale, short);

	let minutes;
	let hours;
	let days;

	let result = dateToString.justNow();
	if ((minutes = millisecondsToMinutes(diff)) >= 1)
		result = dateToString.minutes(Math.floor(minutes));
	if ((hours = millisecondsToHours(diff)) >= 1)
		result = dateToString.hours(Math.floor(hours));
	if ((days = millisecondsToDays(diff)) >= 1)
		result = dateToString.days(Math.floor(days));

	if (days > 7)
		result = dateToString.date(date.getDate(), date.getMonth());

	if (date.getFullYear() !== now.getFullYear())
		result = dateToString.date(date.getDate(), date.getMonth(), date.getFullYear());

	return result;
};
