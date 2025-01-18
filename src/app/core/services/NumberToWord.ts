export class NumberToWord {

    _currency: string = ""; //Naira
    _decimalCurrency: string = ""; //Kobo

    set currency(currencyName: string) {
        this._currency = currencyName;
    }

    get currency(): string {
        return this._currency;
    }

    set decimalCurrency(currencyName: string) {
        this._decimalCurrency = currencyName;
    }

    get decimalCurrency(): string {
        return this._decimalCurrency;
    }

    th = ['', 'Thousand', 'Million', 'Billion', 'Trillion'];
    dg = ['Zero', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
    tn = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
    tw = ['Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

    toWords(amount: any): string {
        amount = amount.toString();
        var atemp = amount.split(".");
        var s = atemp[0].split(",").join("");
        s = s.toString(); s = s.replace(/[\, ]/g, '');
        if (s != parseFloat(s)) return 'not a number';
        var x = s.indexOf('.');
        if (x == -1) x = s.length;
        if (x > 15) return 'too big';
        var n = s.split('');
        var str = '';
        var sk = 0;
        for (var i = 0; i < x; i++) {
            if ((x - i) % 3 == 2) {
                if (n[i] == '1') {
                    str += this.tn[Number(n[i + 1])] + ' ';
                    i++;
                    sk = 1;
                }
                else if (n[i] != 0) {
                    str += this.tw[n[i] - 2] + ' ';
                    sk = 1;
                }
            }
            else if (n[i] != 0) {
                str += this.dg[n[i]] + ' ';
                if ((x - i) % 3 == 0) {
                    str += 'Hundred ';
                }
                sk = 1;
            }
            if ((x - i) % 3 == 1) {
                if (sk) {
                    str += this.th[(x - i - 1) / 3] + ' ';
                }
                sk = 0;
            }
        }
        if (x != s.length) {
            var y = s.length;
            str += 'point ';
            for (let i = x + 1; i < y; i++) {
                str += this.dg[n[i]] + ' ';
            }
        }

        let words = str.replace(/\s+/g, ' ');
        if (words.length > 0) {
            words += this.currency;
        }

        let decimalWords = "";
        if (atemp[1]) {
            decimalWords = this.toWords(atemp[1]).replace(this.currency, this.decimalCurrency);
        }

        return decimalWords.length > 0 ? words + " and " + decimalWords : words;
    }


    public static getAmountInWords(amount: any, currency?: string, decimalCurrency?: string): string {
        let n = new NumberToWord();
        if (currency) {
            n.currency = currency;
        }
        if (decimalCurrency) {
            n.decimalCurrency = decimalCurrency;
        }
        return n.toWords(amount);
    }

    /**
    * Format bytes as human-readable text.
    *
    * @param bytes Number of bytes.
    * @param si True to use metric (SI) units, aka powers of 1000. False to use 
    *           binary (IEC), aka powers of 1024.
    * @param dp Number of decimal places to display.
    *
    * @return Formatted string.
    */
    public static humanFileSize(bytes: number, si:boolean = false, dp:number = 1) {
        const thresh = si ? 1000 : 1024;
        if (Math.abs(bytes) < thresh) {
            return bytes + ' B';
        }

        const units = si
            ? ['kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
            : ['KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB'];
        let u = -1;
        const r = 10 ** dp;

        do {
            bytes /= thresh;
            ++u;
        } while (Math.round(Math.abs(bytes) * r) / r >= thresh && u < units.length - 1);
        return bytes.toFixed(dp) + ' ' + units[u];
    }


}
