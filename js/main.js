class Converter {
    constructor(amount, from, to) {
        this.amount = amount;
        this.from = from;
        this.to = to;
    }

    //Validate
    validate() {
        let msg = 'This field is required!';
        console.log(this.amount);
        if (!this.amount) {
            this.output(msg, 'err-amount');
            return;
        } else if (!this.from ) {
            this.output(msg, 'err-from');
            return;
        }else if(!this.to) {
            this.output(msg, 'err-to');
            return;
        }else{
            let msg = '';
            console.log('good', this.amount);
            this.output(msg, 'err-amount');
            this.output(msg, 'err-from');
            this.output(msg, 'err-to');
            this.convert();
            }

    }

     //get element
     getElement = id => document.getElementById(id);

    //Output
    output(msg, id) {
        let display = this.getElement(id);
        display.innerText = msg;
    }

    //encode
    encodeUri() {
        let fromCurrency = encodeURIComponent(this.from);
        let toCurrency = encodeURIComponent(this.to);
        return `${fromCurrency}_${toCurrency}`;
    }

    //Sort JSON response in alphabetical order
    sortRes(array, key) {
        return array.sort(function (a, b) {
            const x = a[key];
            const y = b[key];
            return ((x < y) ? -1 : ((x > y) ? 1 : 0));
        });
    }

    //api request for currencies
    async getCurrencies() {
        let parentFrom = this.getElement('from');
        let parentTo = this.getElement('to');
        let currStream = await fetch(`https://free.currconv.com/api/v7/currencies?apiKey=16ef1ff68cbc6fe7bdae`);
        let currencies = await currStream.json();

        let sortedCurrs = this.sortRes(Object.values(currencies.results), 'currencyName');
        for (const currency of sortedCurrs) {
            this.appendOptns(parentFrom, parentTo, currency);

        }
    }

    //Shorten Select options
    truncateOptns(txt) {
        if (txt.length > 25) {
            return txt.slice(0, 25) + '...';
        } else {
            return txt;
        }

    }   

    //Append currency options
    appendOptns(parentFrom, parentTo, content) {
        const childNodeFrom = document.createElement('option');
        const childNodeTo = document.createElement('option');

        childNodeFrom.innerHTML = this.truncateOptns(content.currencyName);
        childNodeTo.innerHTML = this.truncateOptns(content.currencyName);

        parentFrom.append(childNodeFrom);
        parentTo.append(childNodeTo);

        childNodeFrom.setAttribute('value', content.id);
        childNodeTo.setAttribute('value', content.id);
    }

    //api request for rate
    getRate = async () => {
        try{
        let currStream = await fetch(`https://free.currconv.com/api/v7/convert?q=${this.encodeUri()}&compact=ultra&apiKey=16ef1ff68cbc6fe7bdae`);
        let rate = await currStream.json();
        return rate;
        }catch(e){
            console.log(e);
        }
    }

    //convert
    convert() {
        this.getRate().then(res => {
            let rate = Object.values(res)[0];
            let display = this.getElement('display');
            let result = rate * this.amount;
            display.innerText = `Exchanges to ${result.toFixed(2)}`;
            
        }).catch(err => console.log(err));
    
        }
       
    

    
}