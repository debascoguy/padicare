
export class DateUtils {

    static twoDigits(d: number) {
        if (0 <= d && d < 10) return "0" + d.toString();
        if (-10 < d && d < 0) return "-0" + (-1 * d).toString();
        return d.toString();
    }

    static now() {
        return DateUtils.getTimeStamp();
    }

    /**
     * @utility
     */
    static getTimeStamp(): Date {
        if (!Date.now) {
            Date.now = function () { return new Date().getTime(); }
        }
        return new Date(Date.now());
    }

    static getSqlTimeStamp() {
        return DateUtils.toMysqlFormat(DateUtils.getTimeStamp());
    }

    static getSqlTimeStamp2() {
        return DateUtils.getTimeStamp().toISOString().slice(0, 19).replace('T', ' ');
    }

    static getSqlDateTime(date: Date) {
        return DateUtils.toMysqlFormat(date);
    }

    static toMysqlFormat(date: Date) {
        return date.getUTCFullYear() + "-"
            + DateUtils.twoDigits(1 + date.getUTCMonth())
            + "-" + DateUtils.twoDigits(date.getUTCDate())
            + " " + DateUtils.twoDigits(date.getUTCHours())
            + ":" + DateUtils.twoDigits(date.getUTCMinutes())
            + ":" + DateUtils.twoDigits(date.getUTCSeconds());
    };

    static get(time: any): string {
        let datetime = +new Date(time);
        let timestamp = +DateUtils.getTimeStamp();
        var seconds = Math.floor((timestamp - datetime) / 1000);

        var interval = seconds / 31536000;

        if (interval > 1) {
            let t = Math.floor(interval);
            return (t > 1) ? t + " year(s) ago" : t + " year ago";
        }
        interval = seconds / 2592000;
        if (interval > 1) {
            let t = Math.floor(interval);
            return (t > 1) ? t + " month(s) ago" : t + " month ago";
        }
        interval = seconds / 86400;
        if (interval > 1) {
            let t = Math.floor(interval);
            return (t > 1) ? t + " day(s) ago" : t + " day ago";
        }
        interval = seconds / 3600;
        if (interval > 1) {
            let t = Math.floor(interval);
            return (t > 1) ? t + " hour(s) ago" : t + " hour ago";
        }
        interval = seconds / 60;
        if (interval > 1) {
            let t = Math.floor(interval);
            return (t > 1) ? t + " minute(s) ago" : t + " minute ago";
        }
        if (seconds < 30) {
            return "now";
        }
        return Math.floor(seconds) + " seconds";
    }

    static formatAMPM(date: any) {
        if (date instanceof String) {
            date = DateUtils.stringToDate(date);
        }
        else {
            date = new Date(date);
        }
        var hours = date.getHours();
        var minutes = date.getMinutes();
        var ampm = hours >= 12 ? 'pm' : 'am';
        hours = hours % 12;
        hours = hours ? hours : 12; // the hour '0' should be '12'
        let minutes_ = minutes < 10 ? '0' + minutes : minutes;
        var strTime = hours + ':' + minutes_ + ' ' + ampm;
        return strTime;
    }

    static stringToDate(date: String) {
        let t = date.split(/[- :]/);
        return new Date(Date.UTC(
            <number><unknown>t[0],
            <number><unknown>t[1] - 1,
            <number><unknown>t[2],
            <number><unknown>t[3],
            <number><unknown>t[4],
            <number><unknown>t[5]
        ));
    }

    static formatAmPmFromDateString(date: any) {
        if (date instanceof String) {
            date = DateUtils.stringToDate(date);
        }
        else {
            date = new Date(date);
        }
        return DateUtils.formatAmPm(date);
    }

    static formatJsAMPM(date: any) {
        date = new Date(date);
        return date.toLocaleString('en-US', { hour: 'numeric', hour12: true })
    }

    static sameDay(first: Date, second: Date) {
        return first.getFullYear() === second.getFullYear() &&
            first.getMonth() === second.getMonth() &&
            first.getDate() === second.getDate();
    }

    static sameDayAndHour(first: Date, second: Date) {
        return first.getFullYear() === second.getFullYear() &&
            first.getMonth() === second.getMonth() &&
            first.getDate() === second.getDate() &&
            first.getHours() == second.getHours();
    }

    static sameDayAndHourAndMinute(first: Date, second: Date) {
        return first.getFullYear() === second.getFullYear() &&
            first.getMonth() === second.getMonth() &&
            first.getDate() === second.getDate() &&
            first.getHours() == second.getHours() &&
            first.getMinutes() == second.getMinutes();
    }

    static isDaysAgo(first: Date, days: number = 0) {
        let date = DateUtils.getTimeStamp();
        let daysAgoDate = new Date(date.setDate(date.getDate() - days));
        return first.getFullYear() === daysAgoDate.getFullYear() &&
            first.getMonth() === daysAgoDate.getMonth() &&
            first.getDate() === daysAgoDate.getDate();
    }

    static isYesterday(date: Date) {
        return DateUtils.isDaysAgo(date, 1);
    }

    static formatAmPm(date: Date) {
        if (DateUtils.sameDay(DateUtils.getTimeStamp(), new Date(date))) {
            return DateUtils.formatAMPM(date) + ", Today";
        }
        else if (DateUtils.isYesterday(new Date(date))) {
            return DateUtils.formatAMPM(date) + ", Yesterday";
        }
        else if (DateUtils.isDaysAgo(new Date(date), 2)) {
            return DateUtils.formatAMPM(date) + ", 2 Days Ago";
        }
        // let days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
        let months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        let d = new Date(date);
        return months[d.getMonth()] + ' ' + d.getDay() + ', ' + d.getFullYear() + ' | ' + DateUtils.formatAMPM(date);
    }

}